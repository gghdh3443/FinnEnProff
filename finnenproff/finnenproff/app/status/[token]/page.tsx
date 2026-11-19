import {notFound} from "next/navigation"; import {adminClient,backendConfigured} from "@/lib/supabase";
export const dynamic="force-dynamic"; export const metadata={title:"Request status",robots:{index:false,follow:false}};
import {STATUS_LABEL as LABEL} from "@/lib/constants";
export default async function S({params}:{params:{token:string}}){
 if(!/^[0-9a-f-]{36}$/i.test(params.token)||!backendConfigured())notFound();
 const {data:r}=await adminClient().from("requests").select("service,city,status,created_at").eq("public_token",params.token).single();if(!r)notFound();
 return <div className="mx-auto max-w-xl px-5 py-14"><h1 className="text-3xl font-extrabold">Your request</h1><p className="mt-2 text-muted">{r.service} in {r.city} · sent {r.created_at.slice(0,10)}</p>
 <p className="mt-6 rounded-lg border border-green bg-white p-5 text-lg font-semibold" role="status">{LABEL[r.status]??r.status}</p>
 <p className="mt-4 text-sm text-muted">We only show the status here. A company contacts you directly if one accepts. Questions? Use the contact page.</p></div>}
