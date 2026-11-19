import {NextResponse} from "next/server"; import {adminClient,backendConfigured} from "@/lib/supabase";
export const dynamic="force-dynamic";
export async function GET(){ // Point an uptime monitor here. Returns 503 if the database is unreachable.
 if(!backendConfigured())return NextResponse.json({ok:false,db:"not configured"},{status:503});
 const {error}=await adminClient().from("companies").select("id").limit(1);
 return NextResponse.json({ok:!error,db:error?"error":"ok"},{status:error?503:200});}
