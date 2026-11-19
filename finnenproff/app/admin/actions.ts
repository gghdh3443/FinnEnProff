"use server";
import {revalidatePath} from "next/cache"; import {adminClient} from "@/lib/supabase"; import {requireAdmin} from "@/lib/auth"; import {STATUSES} from "@/lib/constants";
const log=(db:ReturnType<typeof adminClient>,id:string,kind:string,detail:string,by:string)=>db.from("request_events").insert({request_id:id,kind,detail,actor:by});
export async function setStatus(f:FormData){const u=await requireAdmin();const id=String(f.get("id")),s=String(f.get("status"));if(!(STATUSES as readonly string[]).includes(s))return;
 const db=adminClient();await db.from("requests").update({status:s}).eq("id",id);await log(db,id,"status",s,u.email??u.id);revalidatePath("/admin")}
export async function assignCompany(f:FormData){const u=await requireAdmin();const id=String(f.get("id")),cid=String(f.get("company_id"));if(!cid)return;
 const db=adminClient();const {data:c}=await db.from("companies").select("name,status").eq("id",cid).single();if(c?.status!=="active")return;
 await db.from("requests").update({company_id:cid,status:"assigned"}).eq("id",id);await log(db,id,"assigned",c.name,u.email??u.id);revalidatePath("/admin")}
export async function addNote(f:FormData){const u=await requireAdmin();const n=String(f.get("note")).trim().slice(0,2000);if(!n)return;
 await log(adminClient(),String(f.get("id")),"note",n,u.email??u.id);revalidatePath("/admin")}
export async function setCompanyStatus(f:FormData){await requireAdmin();const s=String(f.get("status"));if(!["active","inactive","rejected"].includes(s))return;
 await adminClient().from("companies").update({status:s}).eq("id",String(f.get("id")));revalidatePath("/admin")}
import {sendEmail} from "@/lib/email"; import {parsePrefixes} from "@/lib/coverage"; import {ALL_SERVICES} from "@/lib/services";
const who=(u:{email?:string|null;id:string})=>u.email??u.id;
export async function shareWithCompany(f:FormData){const u=await requireAdmin();const id=String(f.get("id"));const db=adminClient();
 const {data:r}=await db.from("requests").select("id,service,description,postal_code,city,address,timing,share_consent_at,company_id,customers(name,email,phone),companies(name,email,status)").eq("id",id).single<any>();
 if(!r||!r.share_consent_at||!r.company_id||r.companies?.status!=="active"||!r.companies?.email)return; // consent + active company required
 const ok=await sendEmail(r.companies.email,`New customer request: ${r.service} in ${r.city}`,`A customer asked to be contacted about ${r.service}.\n\n${r.description}\n\nLocation: ${r.address?r.address+", ":""}${r.postal_code} ${r.city}\nTiming: ${r.timing}\n\nName: ${r.customers.name}\nEmail: ${r.customers.email}\nPhone: ${r.customers.phone}\n\nThe customer agreed to share these details with you. Please contact them directly. FinnEnProff is an intermediary and does not guarantee the work.`);
 if(ok){await db.from("requests").update({shared_at:new Date().toISOString(),status:"awaiting_company"}).eq("id",id);await log(db,id,"shared",`Sent or queued for retry: ${r.companies.name}`,who(u))}
 else await log(db,id,"share_failed","Email not sent. Check RESEND_API_KEY and EMAIL_FROM.",who(u));
 revalidatePath("/admin")}
export async function createInvoice(f:FormData){const u=await requireAdmin();const id=String(f.get("id")),amt=Number(f.get("amount"));if(!(amt>0))return;const db=adminClient();
 const {data:r}=await db.from("requests").select("company_id").eq("id",id).single();if(!r?.company_id)return;
 await db.from("invoices").insert({company_id:r.company_id,request_id:id,amount_nok:amt});await log(db,id,"invoice",`NOK ${amt} recorded`,who(u));revalidatePath("/admin")}
export async function markPaid(f:FormData){await requireAdmin();await adminClient().from("invoices").update({status:"paid"}).eq("id",String(f.get("id")));revalidatePath("/admin")}
function companyFields(f:FormData){const services=f.getAll("services").map(String).filter(s=>ALL_SERVICES.includes(s));const price=f.get("price")?Number(f.get("price")):null;
 return {name:String(f.get("name")).trim(),email:String(f.get("email")).trim(),phone:String(f.get("phone")).trim(),coverage:String(f.get("coverage")).trim(),services,price_per_request_nok:price&&price>0?price:null,coverage_prefixes:parsePrefixes(String(f.get("prefixes")??""))}}
export async function updateCompany(f:FormData){await requireAdmin();const c=companyFields(f);if(!c.name||!c.services.length)return;await adminClient().from("companies").update(c).eq("id",String(f.get("id")));revalidatePath("/admin")}
export async function createCompany(f:FormData){await requireAdmin();const c=companyFields(f),org=String(f.get("org_number")).trim();if(!c.name||!c.services.length||!/^\d{9}$/.test(org))return;
 await adminClient().from("companies").insert({...c,org_number:org,status:"active"});revalidatePath("/admin")}
export async function deleteRequestData(f:FormData){await requireAdmin();if(String(f.get("confirm"))!=="DELETE")return;const db=adminClient();const id=String(f.get("id"));
 const {data:r}=await db.from("requests").select("customer_id").eq("id",id).single();if(!r)return;
 const {count}=await db.from("invoices").select("id",{count:"exact",head:true}).eq("request_id",id);if(count)return; // invoiced requests are kept for bookkeeping
 await db.from("requests").delete().eq("id",id);
 const {count:left}=await db.from("requests").select("id",{count:"exact",head:true}).eq("customer_id",r.customer_id);if(!left)await db.from("customers").delete().eq("id",r.customer_id);
 revalidatePath("/admin")}
export async function createCompanyLogin(f:FormData){await requireAdmin();const id=String(f.get("id"));const db=adminClient();
 const {data:c}=await db.from("companies").select("email,status").eq("id",id).single();if(!c?.email||c.status!=="active")return;
 await db.auth.admin.createUser({email:c.email,email_confirm:true,app_metadata:{role:"company",company_id:id}}); // errors if the user already exists; harmless
 revalidatePath("/admin")}
