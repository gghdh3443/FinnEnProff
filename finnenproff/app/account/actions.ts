"use server";
import {redirect} from "next/navigation"; import {adminClient} from "@/lib/supabase"; import {requireUser,userClient} from "@/lib/auth";
// Self-service privacy deletion. Requests with an invoice are kept for bookkeeping but stripped of personal details.
export async function deleteMyData(f:FormData){const user=await requireUser();if(String(f.get("confirm"))!=="DELETE")return;const db=adminClient();const email=user.email!.toLowerCase();
 const {data:cs}=await db.from("customers").select("id").eq("email",email);
 for(const c of cs??[]){const {data:rs}=await db.from("requests").select("id").eq("customer_id",c.id);
  for(const r of rs??[]){const {count}=await db.from("invoices").select("id",{count:"exact",head:true}).eq("request_id",r.id);
   if(count)await db.from("requests").update({description:"[removed at customer's request]",address:null}).eq("id",r.id);else await db.from("requests").delete().eq("id",r.id)}
  const {count:left}=await db.from("requests").select("id",{count:"exact",head:true}).eq("customer_id",c.id);
  if(!left)await db.from("customers").delete().eq("id",c.id);else await db.from("customers").update({name:"Deleted user",email:`deleted-${c.id}@invalid.local`,phone:""}).eq("id",c.id)}
 await userClient().auth.signOut();redirect("/")}
