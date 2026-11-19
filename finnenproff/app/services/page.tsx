import Link from "next/link"; import {CATEGORIES,slug} from "@/lib/services";
export const metadata={title:"All services – FinnEnProff"};
export default function Services(){return(<div className="mx-auto max-w-6xl px-5 py-14">
<h1 className="text-4xl font-extrabold">All services</h1>
<p className="mt-3 max-w-2xl text-muted">Availability depends on which participating companies cover your area. Submit a request and we'll tell you what happens next.</p>
{Object.entries(CATEGORIES).map(([c,list])=><section key={c} id={c} className="mt-10"><h2 className="text-xl font-bold">{c}</h2>
<ul className="mt-3 flex flex-wrap gap-2">{list.map(s=><li key={s}><Link className="block rounded-md border border-line bg-white px-3 py-2 text-sm hover:border-green" href={`/services/${slug(s)}`}>{s}</Link></li>)}</ul></section>)}</div>)}
