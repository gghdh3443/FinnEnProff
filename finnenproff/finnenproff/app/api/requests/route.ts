import {NextResponse} from "next/server"; import {requestSchema} from "@/lib/schemas"; import {adminClient,backendConfigured} from "@/lib/supabase"; import {categoryOf} from "@/lib/services"; import {limited,ipOf} from "@/lib/ratelimit"; import {sendEmail,notifyAdmin} from "@/lib/email"; import {CONSENT_VERSION} from "@/lib/constants";
export async function POST(req:Request){
 if(await limited("req:"+ipOf(req)))return NextResponse.json({error:"Too many requests. Wait a minute and try again."},{status:429});
 const p=requestSchema.safeParse(await req.json().catch(()=>null));
 if(!p.success)return NextResponse.json({error:"Please check your details and try again."},{status:400});
 if(p.data.website)return NextResponse.json({ok:true});
 if(!backendConfigured())return NextResponse.json({error:"The service is not configured yet. Your request was not saved."},{status:503});
 const d=p.data;
 // One atomic database call: customer + request + history. Nothing is half-saved.
 const {data:res,error}=await adminClient().rpc("submit_request",{p:{name:d.name,email:d.email,phone:d.phone.replace(/\s/g,""),marketing:d.consentMarketing,service:d.service,category:categoryOf(d.service)??null,description:d.description,postal:d.postalCode,city:d.city,address:d.address??"",timing:d.timing,consent_version:CONSENT_VERSION}});
 const rid=(res as any)?.id,token=(res as any)?.token;
 if(error||!rid)return NextResponse.json({error:"Could not save your request. Try again later."},{status:500});
 await Promise.all([sendEmail(d.email,"We received your request – FinnEnProff",`Hi ${d.name},\n\nWe have received your request for ${d.service} in ${d.city}. We will review it and, where a participating company covers your service and area, share it with them so they can contact you. We cannot guarantee a match.\n\nTrack your request: ${process.env.NEXT_PUBLIC_SITE_URL??""}/status/${token}\n\nReference: ${String(rid).slice(0,8)}\n\nFinnEnProff`),notifyAdmin(`New request: ${d.service} (${d.city})`,`Request ${String(rid).slice(0,8)}. Open the admin dashboard.`)]);
 return NextResponse.json({ok:true,token});}
