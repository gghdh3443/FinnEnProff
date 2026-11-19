import {NextResponse} from "next/server"; import {contactSchema} from "@/lib/schemas"; import {adminClient,backendConfigured} from "@/lib/supabase"; import {notifyAdmin} from "@/lib/email"; import {limited,ipOf} from "@/lib/ratelimit";
export async function POST(req:Request){
 if(await limited("ct:"+ipOf(req),3))return NextResponse.json({error:"Too many messages. Try again later."},{status:429});
 const p=contactSchema.safeParse(await req.json().catch(()=>null));if(!p.success)return NextResponse.json({error:"Please check the form."},{status:400});
 if(p.data.website)return NextResponse.json({ok:true});
 if(!backendConfigured())return NextResponse.json({error:"The service is not configured yet. Your message was not saved."},{status:503});
 const {error}=await adminClient().from("messages").insert({name:p.data.name,email:p.data.email,message:p.data.message});
 if(!error)await notifyAdmin("New contact message",`${p.data.name} <${p.data.email}>:\n\n${p.data.message}`);
 return error?NextResponse.json({error:"Could not send. Try again later."},{status:500}):NextResponse.json({ok:true});}
