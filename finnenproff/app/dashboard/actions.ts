"use server";
import {revalidatePath} from "next/cache"; import {adminClient} from "@/lib/supabase"; import {requireCompany} from "@/lib/auth"; import {notifyAdmin} from "@/lib/email";
export async function respond(f:FormData){const {user,companyId}=await requireCompany();const id=String(f.get("id")),dec=String(f.get("decision"));if(!["accepted","declined"].includes(dec))return;
 const db=adminClient();const {data:r}=await db.from("requests").select("id,service,company_id,shared_at,company_response").eq("id",id).single();
 if(!r||r.company_id!==companyId||!r.shared_at||r.company_response)return; // only your own, shared, unanswered requests
 const {data:c}=await db.from("companies").select("name,status,price_per_request_nok").eq("id",companyId).single();if(c?.status!=="active")return;
 const ev=(kind:string,detail:string)=>db.from("request_events").insert({request_id:id,kind,detail,actor:`${c.name} (${user.email})`});const now=new Date().toISOString();
 if(dec==="accepted"){await db.from("requests").update({company_response:"accepted",company_responded_at:now,status:"contacted"}).eq("id",id).eq("company_id",companyId);
  const price=c.price_per_request_nok;if(price)await db.from("invoices").insert({company_id:companyId,request_id:id,amount_nok:price}); // unique index prevents duplicates
  await ev("accepted",price?`Accepted. Invoice NOK ${price} created`:"Accepted. No price set, record the invoice manually")}
 else{await db.from("requests").update({company_id:null,shared_at:null,status:"reviewing"}).eq("id",id).eq("company_id",companyId);await ev("declined","Declined by company. Needs reassignment")}
 await notifyAdmin(`${c.name} ${dec} a request (${r.service})`,"See the admin dashboard.");revalidatePath("/dashboard")}
export async function updateProfile(f:FormData){const {companyId}=await requireCompany();const t=(k:string,n:number)=>String(f.get(k)??"").trim().slice(0,n);
 await adminClient().from("companies").update({phone:t("phone",30),coverage:t("coverage",300),description:t("description",1500)}).eq("id",companyId);revalidatePath("/dashboard")}
