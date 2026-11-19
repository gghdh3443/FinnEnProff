import Link from "next/link"; import {adminClient} from "@/lib/supabase"; import {requireUser} from "@/lib/auth"; import {STATUS_LABEL} from "@/lib/constants"; import {deleteMyData} from "./actions";
export const dynamic="force-dynamic"; export const metadata={title:"My requests",robots:{index:false}};
export default async function Account(){
 const user=await requireUser();const db=adminClient();const email=user.email!.toLowerCase();
 const {data:cs}=await db.from("customers").select("id").eq("email",email);const ids=(cs??[]).map(c=>c.id);
 const {data:rs}=ids.length?await db.from("requests").select("id,service,city,status,created_at,public_token").in("customer_id",ids).order("created_at",{ascending:false}).limit(100):{data:[] as any[]};
 return <div className="mx-auto max-w-2xl px-5 py-12"><div className="flex items-start justify-between gap-4"><div><h1 className="text-3xl font-extrabold">My requests</h1><p className="text-sm text-muted">{user.email}</p></div>
 <form action="/auth/signout" method="post"><button className="rounded-md border border-line px-4 py-2 font-semibold">Sign out</button></form></div>
 <div className="mt-6 divide-y divide-line rounded-md border border-line bg-white">{!rs?.length&&<p className="p-4 text-muted">No requests found for this email address. <Link className="underline" href="/request">Describe a job</Link>.</p>}
 {rs?.map((r:any)=><Link key={r.id} href={`/status/${r.public_token}`} className="flex flex-wrap gap-x-4 p-4 hover:bg-paper"><span className="font-semibold">{r.service}</span><span className="text-muted">{r.city} · {r.created_at.slice(0,10)}</span><span className="ml-auto text-sm font-semibold">{STATUS_LABEL[r.status]??r.status}</span></Link>)}</div>
 <Link href="/request" className="btn mt-6">New request</Link>
 <h2 className="mt-12 text-xl font-bold">Delete my data</h2><p className="mt-1 text-sm text-muted">Removes your requests and contact details from FinnEnProff. Details already sent to a company cannot be recalled by us. Requests tied to an invoice are kept without personal details.</p>
 <form action={deleteMyData} className="mt-3 flex items-end gap-2"><div><label className="label text-xs" htmlFor="cf">Type DELETE to confirm</label><input id="cf" name="confirm" required pattern="DELETE" className="input !w-40"/></div><button className="rounded-md border border-red-300 px-4 py-3 font-semibold text-red-700">Delete my data</button></form></div>}
