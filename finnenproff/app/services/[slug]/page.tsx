import Link from "next/link"; import {notFound} from "next/navigation"; import {ALL_SERVICES,bySlug,slug,categoryOf} from "@/lib/services";
export const generateStaticParams=()=>ALL_SERVICES.map(s=>({slug:slug(s)}));
export const generateMetadata=({params}:{params:{slug:string}})=>{const s=bySlug(params.slug);return {title:s?`Request ${s.toLowerCase()} – FinnEnProff`:"Service",description:s?`Describe your ${s.toLowerCase()} job and we'll help connect you with a suitable company.`:undefined}};
export default function Page({params}:{params:{slug:string}}){const s=bySlug(params.slug);if(!s)notFound();
return <div className="mx-auto max-w-2xl px-5 py-14"><p className="text-sm text-muted">{categoryOf(s)}</p><h1 className="mt-1 text-4xl font-extrabold">Need help with {s.toLowerCase()}?</h1>
<p className="mt-4 text-muted">Describe the job and tell us where you are. We'll review your request and, where a participating company covers this service and your area, share it with them with your permission.</p>
<Link href={`/request?service=${encodeURIComponent(s)}`} className="btn mt-6">Describe your job</Link>
<h2 className="mt-12 text-xl font-bold">Include in your request</h2><ul className="mt-3 list-disc space-y-1 pl-5 text-muted"><li>What needs doing and roughly how big the job is</li><li>Where it is, and any access details</li><li>When you'd like it done</li><li>Anything that matters to you, such as materials or a budget</li></ul>
<p className="mt-10 text-sm text-muted">Availability varies by area. FinnEnProff is an intermediary and does not perform the work.</p></div>}
