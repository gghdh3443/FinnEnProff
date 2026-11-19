import {adminClient,backendConfigured} from "./supabase";
// Returns null on success, otherwise an error string.
async function deliver(to:string,subject:string,text:string):Promise<string|null>{
 const k=process.env.RESEND_API_KEY,from=process.env.EMAIL_FROM;if(!k||!from)return "not-configured";
 try{const r=await fetch("https://api.resend.com/emails",{method:"POST",headers:{Authorization:`Bearer ${k}`,"Content-Type":"application/json"},body:JSON.stringify({from,to,subject,text})});return r.ok?null:`HTTP ${r.status}`}catch{return "network"}}
// true = sent, or failed and queued for automatic retry. false = email not configured / no recipient.
export async function sendEmail(to:string,subject:string,text:string){
 if(!to)return false;const err=await deliver(to,subject,text);if(!err)return true;if(err==="not-configured")return false;
 if(!backendConfigured())return false;
 await adminClient().from("email_outbox").insert({to_email:to,subject,body:text,attempts:1,last_error:err,next_attempt_at:new Date(Date.now()+5*60_000).toISOString()});return true}
export const notifyAdmin=(s:string,t:string)=>sendEmail(process.env.ADMIN_EMAIL??"",s,t);
// Called by /api/cron/emails. Backoff grows with each attempt; gives up after 5.
export async function processOutbox(){const db=adminClient();
 const {data}=await db.from("email_outbox").select("id,to_email,subject,body,attempts").eq("status","pending").lte("next_attempt_at",new Date().toISOString()).limit(50);let sent=0;
 for(const m of data??[]){const err=await deliver(m.to_email,m.subject,m.body);const n=m.attempts+1;
  if(!err){sent++;await db.from("email_outbox").update({status:"sent",attempts:n,last_error:null}).eq("id",m.id)}
  else await db.from("email_outbox").update({attempts:n,last_error:err,status:n>=5?"failed":"pending",next_attempt_at:new Date(Date.now()+n*n*5*60_000).toISOString()}).eq("id",m.id)}
 return {processed:data?.length??0,sent}}
