import "./globals.css"; import Link from "next/link"; import {Logo} from "@/components/Logo"; import type {Metadata} from "next";
export const metadata:Metadata={metadataBase:new URL(process.env.NEXT_PUBLIC_SITE_URL??"https://example.no"),title:{default:"FinnEnProff – Én plass. Alle tjenester.",template:"%s"},description:"Tell us what you need help with and we'll help connect you with a suitable company.",icons:{icon:"/icon.svg"}};
const nav=[["/services","All services"],["/for-companies","For companies"],["/for-workers","Offer your services"],["/about","About"],["/contact","Contact"],["/login","Sign in"]];
export default function Root({children}:{children:React.ReactNode}){return(
<html lang="en"><body>
<a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:bg-white focus:p-3">Skip to content</a>
<header className="relative border-b border-line bg-white"><div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
<Link href="/" aria-label="FinnEnProff home"><Logo/></Link>
<nav className="hidden items-center gap-6 text-sm font-semibold md:flex">{nav.map(([h,l])=><Link key={h} href={h} className="hover:text-green">{l}</Link>)}<Link href="/request" className="btn !py-2">Find help</Link></nav>
<details className="md:hidden"><summary className="cursor-pointer list-none rounded-md border border-line px-3 py-2 text-sm font-semibold">Menu</summary>
<nav className="absolute inset-x-0 top-full z-20 grid gap-1 border-b border-line bg-white p-5 text-base font-semibold">{nav.map(([h,l])=><Link key={h} href={h} className="py-2">{l}</Link>)}<Link href="/request" className="btn mt-2">Find help</Link></nav></details></div></header>
<main id="main">{children}</main>
<footer className="mt-24 bg-navy text-white"><div className="mx-auto max-w-6xl px-5 py-10 text-sm">
<p className="font-extrabold">FinnEnProff</p><p className="mt-1 text-white/70">Én plass. Alle tjenester. · One place. Every service.</p>
<p className="mt-3 max-w-2xl text-white/70">FinnEnProff is an intermediary. We do not perform the services, employ providers or guarantee their work.</p>
<p className="mt-4 flex flex-wrap gap-4"><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/cookies">Cookies</Link><Link href="/company-info">Company information</Link></p></div></footer>
</body></html>)}
