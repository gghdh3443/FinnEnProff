"use client";
import {useState} from "react"; import {contactSchema} from "@/lib/schemas";
export default function ContactForm(){const [d,setD]=useState<any>({});const [e,setE]=useState<Record<string,string>>({});const [s,setS]=useState("idle");const [m,setM]=useState("");
async function go(ev:React.FormEvent){ev.preventDefault();const r=contactSchema.safeParse(d);if(!r.success){const x:Record<string,string>={};r.error.issues.forEach(i=>{const k=String(i.path[0]);if(!x[k])x[k]=i.message});setE(x);return}
 setE({});setS("sending");const res=await fetch("/api/contact",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(d)}).catch(()=>null);
 if(res?.ok)setS("done");else{setM((await res?.json().catch(()=>null))?.error??"Network error. Try again.");setS("fail")}}
if(s==="done")return <p role="status" className="mt-6 rounded-lg border border-green bg-white p-5">Message sent. We'll reply by email.</p>;
const f=(k:string,l:string,t="text",ta=false)=><div className="mt-4"><label className="label" htmlFor={k}>{l}</label>{ta?<textarea id={k} rows={5} className="input" onChange={x=>setD({...d,[k]:x.target.value})}/>:<input id={k} type={t} className="input" onChange={x=>setD({...d,[k]:x.target.value})}/>}{e[k]&&<p className="err" role="alert">{e[k]}</p>}</div>;
return <form onSubmit={go} noValidate>{f("name","Name")}{f("email","Email","email")}{f("message","Message","text",true)}<input tabIndex={-1} aria-hidden="true" autoComplete="off" className="hidden" onChange={x=>setD({...d,website:x.target.value})}/>{s==="fail"&&<p className="err" role="alert">{m}</p>}<button className="btn mt-6" disabled={s==="sending"}>{s==="sending"?"Sending…":"Send message"}</button></form>}
