import {notFound} from "next/navigation";
const pages:Record<string,{t:string;b:string[];draft?:boolean}>={
about:{t:"About FinnEnProff",b:["Finding the right professional should be simple. FinnEnProff exists to make it easier for people and businesses to connect.","We start in Norway, with the ambition to grow beyond it. FinnEnProff is an intermediary: we do not perform the services, employ providers or guarantee their work."]},
contact:{t:"Contact",b:["Email: [placeholder – add before launch]","Company details: [placeholder – add before launch]","Contact form: not yet connected to a backend. Use email until configured."]},
privacy:{t:"Privacy policy",draft:true,b:["Describe what personal data is collected (name, email, phone, address, request text), why, legal basis, retention, sharing with selected providers, and user rights under GDPR."]},
terms:{t:"Terms of service",draft:true,b:["Describe the intermediary role, user responsibilities, provider responsibilities, fees and liability limits."]},
cookies:{t:"Cookie policy",draft:true,b:["List cookies in use once analytics or marketing cookies are added. The MVP sets no tracking cookies."]},
"company-info":{t:"Company information",draft:true,b:["Legal name, organization number, address and contact: [placeholders – add before launch]."]}};
export default function P({params}:{params:{slug:string}}){const p=pages[params.slug];if(!p)notFound();
return <div className="mx-auto max-w-2xl px-5 py-14"><h1 className="text-4xl font-extrabold">{p.t}</h1>
{p.draft&&<p className="mt-4 rounded-md border border-amber-400 bg-amber-50 p-3 text-sm">Draft. Requires legal review before launch.</p>}
{p.b.map(x=><p key={x} className="mt-4 text-muted">{x}</p>)}</div>}
