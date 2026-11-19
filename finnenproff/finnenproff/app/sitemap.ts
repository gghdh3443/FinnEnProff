import {ALL_SERVICES,slug} from "@/lib/services";
const base=process.env.NEXT_PUBLIC_SITE_URL??"https://example.no";
export default function sitemap(){return [...["","/services","/request","/for-companies","/for-workers","/about","/contact"].map(p=>({url:base+p})),...ALL_SERVICES.map(s=>({url:`${base}/services/${slug(s)}`}))]}
