"use client";
import {useState} from "react"; import {createBrowserClient} from "@supabase/ssr";
const sb=()=>createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
export default function Login(){const [err,setErr]=useState("");const [busy,setBusy]=useState(false);const [sent,setSent]=useState("");
const link=(kind:"customer"|"company")=>async(ev:React.FormEvent<HTMLFormElement>)=>{ev.preventDefault();setBusy(true);const f=new FormData(ev.currentTarget);
 await sb().auth.signInWithOtp({email:String(f.get("email")),options:{shouldCreateUser:kind==="customer",emailRedirectTo:location.origin+"/auth/callback"}});setSent(kind);setBusy(false)}; // same message whether or not an account exists
async function admin(ev:React.FormEvent<HTMLFormElement>){ev.preventDefault();setBusy(true);setErr("");const f=new FormData(ev.currentTarget);
 const {error}=await sb().auth.signInWithPassword({email:String(f.get("email")),password:String(f.get("password"))});
 if(error){setErr("Wrong email or password.");setBusy(false);return}location.href="/auth/callback"}
const L=(kind:"customer"|"company",title:string,help:string)=><section><h2 className="text-2xl font-extrabold">{title}</h2><p className="mt-2 text-sm text-muted">{help}</p>
 {sent===kind?<p role="status" className="mt-4 rounded-md border border-green bg-white p-3 text-sm">If this address can sign in, a link is on its way.</p>:
 <form onSubmit={link(kind)} className="mt-4"><label className="label" htmlFor={kind+"e"}>Email</label><input id={kind+"e"} name="email" type="email" required className="input"/><button className="btn mt-4 w-full" disabled={busy}>Email me a link</button></form>}</section>;
return <div className="mx-auto grid max-w-5xl gap-10 px-5 py-16 md:grid-cols-3">
{L("customer","Customer","See your requests and their status. No password needed.")}
{L("company","Company or professional","For approved providers. We email you a one-time link.")}
<section><h2 className="text-2xl font-extrabold">Admin</h2><form onSubmit={admin} className="mt-4"><label className="label" htmlFor="ae">Email</label><input id="ae" name="email" type="email" required className="input"/><label className="label mt-4" htmlFor="ap">Password</label><input id="ap" name="password" type="password" required className="input"/>
{err&&<p className="err" role="alert">{err}</p>}<button className="btn mt-4 w-full" disabled={busy}>Sign in</button></form></section></div>}
