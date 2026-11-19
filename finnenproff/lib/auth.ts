import {createServerClient} from "@supabase/ssr"; import {cookies} from "next/headers"; import {redirect} from "next/navigation";
export function userClient(){const c=cookies();return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,{cookies:{getAll:()=>c.getAll(),setAll:(l:{name:string;value:string;options?:any}[])=>{try{l.forEach(({name,value,options})=>c.set(name,value,options))}catch{}}}})}
// Called by every admin page AND every admin server action. Never rely on middleware alone.
export async function requireAdmin(){const {data:{user}}=await userClient().auth.getUser();if(!user||user.app_metadata?.role!=="admin")redirect("/login");return user}
// Company accounts: Supabase users with app_metadata {role:"company", company_id}. app_metadata can only be set server-side.
export async function requireCompany(){const {data:{user}}=await userClient().auth.getUser();const cid=user?.app_metadata?.company_id;
 if(!user||user.app_metadata?.role!=="company"||!cid)redirect("/login");return {user,companyId:String(cid)}}
// Any signed-in user (customers sign in by emailed link; the email is verified by Supabase).
export async function requireUser(){const {data:{user}}=await userClient().auth.getUser();if(!user?.email)redirect("/login");return user}
