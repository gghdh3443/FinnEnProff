import {NextResponse,type NextRequest} from "next/server"; import {createServerClient} from "@supabase/ssr";
export async function middleware(req:NextRequest){
 const res=NextResponse.next(); const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 if(!url||!key)return NextResponse.rewrite(new URL("/admin/setup",req.url));
 const sb=createServerClient(url,key,{cookies:{getAll:()=>req.cookies.getAll(),setAll:(c:{name:string;value:string;options?:any}[])=>c.forEach(({name,value,options})=>res.cookies.set(name,value,options))}});
 const {data:{user}}=await sb.auth.getUser();
 if(!user||user.app_metadata?.role!=="admin")return NextResponse.redirect(new URL("/",req.url));
 return res;}
export const config={matcher:["/admin/((?!setup).*)","/admin"]};
