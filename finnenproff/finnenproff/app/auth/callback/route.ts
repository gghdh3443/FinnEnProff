import {NextResponse} from "next/server"; import {userClient} from "@/lib/auth";
export async function GET(req:Request){const u=new URL(req.url);const code=u.searchParams.get("code");const sb=userClient();
 if(code)await sb.auth.exchangeCodeForSession(code);const {data:{user}}=await sb.auth.getUser();
 const to=user?.app_metadata?.role==="admin"?"/admin":user?.app_metadata?.role==="company"?"/dashboard":"/account";
 return NextResponse.redirect(new URL(to,u.origin))}
