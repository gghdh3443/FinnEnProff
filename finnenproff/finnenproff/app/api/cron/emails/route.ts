import {NextResponse} from "next/server"; import {processOutbox} from "@/lib/email"; import {backendConfigured} from "@/lib/supabase";
export const dynamic="force-dynamic";
export async function GET(req:Request){const s=process.env.CRON_SECRET;
 if(!s||req.headers.get("authorization")!==`Bearer ${s}`)return NextResponse.json({error:"unauthorized"},{status:401});
 if(!backendConfigured())return NextResponse.json({error:"not configured"},{status:503});return NextResponse.json(await processOutbox())}
