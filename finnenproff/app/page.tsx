import Link from "next/link"; import {ALL_SERVICES,CATEGORIES} from "@/lib/services";
export default function Home(){
const popular=["Painting","House cleaning","Plumbing","House moving","Gardening","Website development"];
return(<>
<section className="bg-navy text-white"><div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
<h1 className="max-w-3xl text-4xl font-extrabold leading-tight md:text-6xl">What do you need help with?</h1>
<p className="mt-5 max-w-xl text-lg text-white/80">Find the right professional for your next project. Tell us what you need, and we'll help connect you with a suitable company.</p>
<form action="/request" className="mt-8 grid max-w-3xl gap-3 rounded-lg bg-white p-3 text-ink md:grid-cols-[2fr_1fr_auto]">
<div><label htmlFor="service" className="sr-only">Service</label><input id="service" name="service" list="svc" placeholder="e.g. Painting" className="input" autoComplete="off"/>
<datalist id="svc">{ALL_SERVICES.map(s=><option key={s} value={s}/>)}</datalist></div>
<div><label htmlFor="city" className="sr-only">Location</label><input id="city" name="city" placeholder="City or postal code" className="input"/></div>
<button className="btn">Find help</button></form>
<p className="mt-5 flex flex-wrap gap-2 text-sm">{popular.map(p=><Link key={p} href={`/request?service=${encodeURIComponent(p)}`} className="rounded-full border border-white/30 px-3 py-1 hover:bg-white/10">{p}</Link>)}</p>
</div></section>
<section aria-label="How we handle requests" className="border-b border-line bg-white"><ul className="mx-auto grid max-w-6xl gap-2 px-5 py-4 text-sm font-semibold md:grid-cols-3"><li>Shared only with your consent</li><li>Every request is reviewed by a person</li><li>You choose what to share</li></ul></section>
<section className="mx-auto max-w-6xl px-5 py-16"><h2 className="text-2xl font-extrabold">How it works</h2>
<ol className="mt-6 grid gap-8 md:grid-cols-3">
{[["Describe the job","Choose a service and tell us what you need, where, and when."],["We review your request","Your request is checked and matched against companies that cover your service and area."],["A company contacts you","With your permission, your details are shared with the selected company so they can get in touch."]].map(([t,d],i)=>
<li key={t} className="border-t-2 border-green pt-4"><p className="text-sm font-semibold text-muted">Step {i+1}</p><h3 className="mt-1 text-lg font-bold">{t}</h3><p className="mt-2 text-muted">{d}</p></li>)}</ol></section>
<section className="mx-auto max-w-6xl px-5"><h2 className="text-2xl font-extrabold">Browse by category</h2>
<ul className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">{Object.keys(CATEGORIES).map(c=><li key={c} className="border-b border-line pb-3"><Link href={`/services#${encodeURIComponent(c)}`} className="font-semibold hover:text-green">{c}</Link><span className="ml-2 text-sm text-muted">{CATEGORIES[c].length} services</span></li>)}</ul></section>
<section className="mx-auto mt-16 max-w-6xl px-5"><div className="rounded-lg border border-line bg-white p-6 md:flex md:items-center md:justify-between">
<div><h2 className="text-xl font-extrabold">Your details stay with you until you agree</h2><p className="mt-1 max-w-2xl text-muted">We only share your request with a company you have consented to share it with. Availability depends on which participating companies cover your area.</p></div>
<Link href="/request" className="btn mt-4 md:mt-0">Describe your job</Link></div></section>
</>)}
