"use client";
import {useState,useRef,useEffect} from "react"; import {requestSchema} from "@/lib/schemas"; import {CATEGORIES} from "@/lib/services";
const steps=["Service","Details","Location","Timing","Contact","Consent"];
const fields:string[][]=[["service"],["description"],["postalCode","city"],["timing"],["name","email","phone"],["consentShare"]];
export default function RequestForm({initialService,initialCity}:{initialService:string;initialCity:string}){
const [i,setI]=useState(0); const [d,setD]=useState<any>({service:initialService,city:/^\d/.test(initialCity)?"":initialCity,postalCode:/^\d{4}$/.test(initialCity)?initialCity:"",consentShare:false,consentMarketing:false});
const [errs,setErrs]=useState<Record<string,string>>({}); const [state,setState]=useState<"idle"|"sending"|"done"|"fail">("idle"); const [msg,setMsg]=useState("");const [tok,setTok]=useState("");
const set=(k:string,v:any)=>setD((p:any)=>({...p,[k]:v}));
const hr=useRef<HTMLParagraphElement>(null);useEffect(()=>{if(i>0)hr.current?.focus()},[i]);
const check=()=>{const r=requestSchema.safeParse(d);const e:Record<string,string>={};
 if(!r.success)r.error.issues.forEach(x=>{const k=String(x.path[0]);if(fields[i].includes(k)&&!e[k])e[k]=x.message});setErrs(e);return !Object.keys(e).length};
const next=()=>{if(check())setI(i+1)};
async function submit(){ if(!check())return; setState("sending");
 try{const r=await fetch("/api/requests",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(d)});const j=await r.json();
  if(r.ok){setTok(j.token??"");setState("done")}else{setMsg(j.error??"Something went wrong.");setState("fail")}}catch{setMsg("Network error. Check your connection and try again.");setState("fail")}}
if(state==="done")return <div role="status" className="mt-8 rounded-lg border border-green bg-white p-6"><h2 className="text-xl font-extrabold">Request received</h2>
<p className="mt-2 text-muted">We'll review it and, where a participating company covers your service and area, share your request with them so they can contact you. We can't promise a match in every area.</p>{tok&&<p className="mt-3"><a className="font-semibold underline" href={`/status/${tok}`}>Track your request</a> <span className="text-muted">(bookmark this link; anyone with it can see the status)</span></p>}</div>;
const F=({k,label,children}:{k:string;label:string;children:React.ReactNode})=><div className="mt-5"><label className="label" htmlFor={k}>{label}</label>{children}{errs[k]&&<p className="err" role="alert">{errs[k]}</p>}</div>;
const inp=(k:string,label:string,type="text")=><F k={k} label={label}><input id={k} type={type} className="input" value={d[k]??""} onChange={e=>set(k,e.target.value)}/></F>;
return <form className="mt-8" noValidate onSubmit={e=>{e.preventDefault();if(i<5)next();else submit()}}><p ref={hr} tabIndex={-1} className="text-sm font-semibold text-muted">Step {i+1} of {steps.length}: {steps[i]}</p>
<div className="mt-2 h-1 rounded bg-line"><div className="h-1 rounded bg-green transition-all" style={{width:`${(i+1)/steps.length*100}%`}}/></div>
{i===0&&<F k="service" label="What service do you need?"><select id="service" className="input" value={d.service} onChange={e=>set("service",e.target.value)}><option value="">Choose a service</option>
{Object.entries(CATEGORIES).map(([c,l])=><optgroup key={c} label={c}>{l.map(s=><option key={s}>{s}</option>)}</optgroup>)}</select></F>}
{i===1&&<F k="description" label="Describe the job"><textarea id="description" rows={6} className="input" value={d.description??""} onChange={e=>set("description",e.target.value)}/></F>}
{i===2&&<>{inp("postalCode","Postal code")}{inp("city","City")}{inp("address","Address (optional)")}</>}
{i===3&&<F k="timing" label="When do you need help?"><select id="timing" className="input" value={d.timing??""} onChange={e=>set("timing",e.target.value)}><option value="">Choose</option><option value="asap">As soon as possible</option><option value="week">Within a week</option><option value="month">Within a month</option><option value="flexible">Flexible</option></select></F>}
{i===4&&<>{inp("name","Name")}{inp("email","Email","email")}{inp("phone","Phone number","tel")}</>}
{i===5&&<div className="mt-5 space-y-4"><label className="flex gap-3"><input type="checkbox" className="mt-1 h-5 w-5" checked={d.consentShare} onChange={e=>set("consentShare",e.target.checked)}/><span>I agree that FinnEnProff may share my request and contact details with a selected service provider so they can contact me. <span className="text-muted">(Required)</span></span></label>
{errs.consentShare&&<p className="err" role="alert">{errs.consentShare}</p>}
<label className="flex gap-3"><input type="checkbox" className="mt-1 h-5 w-5" checked={d.consentMarketing} onChange={e=>set("consentMarketing",e.target.checked)}/><span>I'd like to receive occasional news from FinnEnProff. <span className="text-muted">(Optional)</span></span></label>
<input tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" value={d.website??""} onChange={e=>set("website",e.target.value)}/>
{state==="fail"&&<p className="err" role="alert">{msg}</p>}</div>}
<div className="mt-8 flex gap-3">{i>0&&<button type="button" onClick={()=>setI(i-1)} className="rounded-md border border-line bg-white px-5 py-3 font-semibold">Back</button>}
{i<5?<button type="button" className="btn" onClick={next}>Continue</button>:<button type="button" className="btn" disabled={state==="sending"} onClick={submit}>{state==="sending"?"Sending…":"Send request"}</button>}</div></form>}
