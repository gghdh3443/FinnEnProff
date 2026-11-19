import {siteUrl} from "@/lib/site";
import {ALL_SERVICES,slug} from "@/lib/services";
const base=siteUrl();
export default function sitemap(){return [...["","/services","/request","/for-companies","/for-workers","/about","/contact"].map(p=>({url:base+p})),...ALL_SERVICES.map(s=>({url:`${base}/services/${slug(s)}`}))]}
