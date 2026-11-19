import {adminClient} from "@/lib/supabase"; import {markPaid} from "./actions";
export default async function Finance(){
 const db=adminClient(); const [{data:fs},{data}]=await Promise.all([db.from("finance_summary").select("*").single(),
  db.from("invoices").select("id,amount_nok,status,created_at,companies(name),requests(service)").order("created_at",{ascending:false}).limit(50)]);
 const inv=(data??[]) as any[]; const nok=(v:any)=>`NOK ${Number(v??0).toLocaleString("nb-NO")}`;
 const stats=[["Outstanding",nok(fs?.outstanding)],["Paid this month",nok(fs?.paid_month)],["Invoiced this month",nok(fs?.invoiced_month)],["Accepted requests",String(fs?.accepted??0)]];
 return <section><h2 className="mt-10 text-xl font-bold">Finance</h2>
 <dl className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">{stats.map(([l,v])=><div key={l} className="border-t-2 border-green pt-2"><dt className="text-sm text-muted">{l}</dt><dd className="text-2xl font-extrabold">{v}</dd></div>)}</dl>
 <p className="mt-2 text-xs text-muted">Totals cover all invoices. Tracking figures only, not accounting records. Showing the latest 50 invoices.</p>
 <div className="mt-4 divide-y divide-line rounded-md border border-line bg-white">{!inv.length&&<p className="p-4 text-muted">No invoices yet. Record an accepted request from a request's details.</p>}
 {inv.map(i=><div key={i.id} className="flex flex-wrap items-center gap-3 p-3 text-sm"><span className="font-semibold">{i.companies?.name}</span><span className="text-muted">{i.requests?.service} · {i.created_at.slice(0,10)}</span><span className="ml-auto">{nok(i.amount_nok)}</span><span className="rounded bg-paper px-2 font-semibold">{i.status}</span>
  {i.status==="outstanding"&&<form action={markPaid}><input type="hidden" name="id" value={i.id}/><button className="rounded-md border border-line px-3 py-1 font-semibold">Mark paid</button></form>}</div>)}</div></section>}
