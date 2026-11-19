"use client";
import {useState} from "react"; import {companySchema} from "@/lib/schemas"; import {ALL_SERVICES} from "@/lib/services";
export default function CompanyForm({kind="company"}:{kind?:"company"|"individual"}){
const [d,setD]=useState<any>({services:[],kind}); const [e,setE]=useState<Record<string,string>>({}); const [s,setS]=useState("idle"); const [m,setM]=useState("");
const set=(k:string,v:any)=>setD((p:any)=>({...p,[k]:v}));
async function go(ev:React.FormEvent){ev.preventDefault();const r=companySchema.safeParse(d);
 if(!r.success){const x:Record<string,string>={};r.error.issues.forEach(i=>{const k=String(i.path[0]);if(!x[k])x[k]=i.message});setE(x);return}
 setE({});setS("sending");const res=await fetch("/api/companies",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(d)}).catch(()=>null);
 if(res?.ok)setS("done");else{setM((await res?.json().catch(()=>null))?.error??"Network error. Try again.");setS("fail")}}
if(s==="done")return <p role="status" className="mt-4 rounded-lg border border-green bg-white p-5">Thanks. Your registration is pending manual review. Approval is not guaranteed.</p>;
const T=(k:string,l:string,t="text")=><div className="mt-4"><label className="label" htmlFor={k}>{l}</label><input id={k} type={t} className="input" onChange={x=>set(k,x.target.value)}/>{e[k]&&<p className="err" role="alert">{e[k]}</p>}</div>;
const A=(k:string,l:string)=><div className="mt-4"><label className="label" htmlFor={k}>{l}</label><textarea id={k} rows={3} className="input" onChange={x=>set(k,x.target.value)}/>{e[k]&&<p className="err" role="alert">{e[k]}</p>}</div>;
return <form onSubmit={go} noValidate className="mt-2">{T("name",kind==="company"?"Company name":"Your full name")}{kind==="company"&&T("orgNumber","Organization number")}{T("contact","Contact person")}{T("email","Email","email")}{T("phone","Phone","tel")}{T("websiteUrl","Website (optional)")}
<fieldset className="mt-4"><legend className="label">Services offered</legend><div className="grid max-h-56 gap-1 overflow-auto rounded-md border border-line bg-white p-3 sm:grid-cols-2">{ALL_SERVICES.map(v=><label key={v} className="flex gap-2 text-sm"><input type="checkbox" onChange={x=>set("services",x.target.checked?[...d.services,v]:d.services.filter((y:string)=>y!==v))}/>{v}</label>)}</div>{e.services&&<p className="err" role="alert">{e.services}</p>}</fieldset>
{A("coverage","Geographical coverage")}{A("description","Short company description")}{A("interests","What requests are you interested in? (optional)")}
<input tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" onChange={x=>set("website",x.target.value)}/>
{s==="fail"&&<p className="err" role="alert">{m}</p>}<button className="btn mt-6" disabled={s==="sending"}>{s==="sending"?"Sending…":"Submit registration"}</button></form>}
