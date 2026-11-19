import {NextResponse} from "next/server"; import {companySchema} from "@/lib/schemas"; import {limited,ipOf} from "@/lib/ratelimit"; import {notifyAdmin} from "@/lib/email"; import {adminClient,backendConfigured} from "@/lib/supabase";
export async function POST(req:Request){
 if(await limited("co:"+ipOf(req)))return NextResponse.json({error:"Too many attempts. Wait a minute."},{status:429});
 const p=companySchema.safeParse(await req.json().catch(()=>null));
 if(!p.success)return NextResponse.json({error:"Please check the form and try again."},{status:400});
 if(p.data.website)return NextResponse.json({ok:true});
 if(!backendConfigured())return NextResponse.json({error:"The service is not configured yet. Your registration was not saved."},{status:503});
 const d=p.data; const {error}=await adminClient().from("companies").insert({name:d.name,org_number:d.kind==="company"?d.orgNumber:null,kind:d.kind,contact_name:d.contact,email:d.email,phone:d.phone,website_url:d.websiteUrl||null,services:d.services,coverage:d.coverage,description:d.description,interests:d.interests??null,status:"pending"});
 if(error)return NextResponse.json({error:error.code==="23505"?"This organization number is already registered.":"Could not save. Try again later."},{status:500});
 await notifyAdmin("New company registration: "+d.name,"Review it in the admin dashboard.");
 return NextResponse.json({ok:true});}
