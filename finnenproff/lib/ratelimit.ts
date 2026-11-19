import {adminClient,backendConfigured} from "./supabase";
// Shared limiter in Postgres (works across all serverless instances). Falls back to per-instance memory if the DB is unavailable.
const mem=new Map<string,number[]>();
export function memLimited(key:string,max=5,windowMs=60_000){const now=Date.now();const a=(mem.get(key)??[]).filter(t=>now-t<windowMs);a.push(now);mem.set(key,a);return a.length>max}
export async function limited(key:string,max=5,windowMs=60_000){
 if(backendConfigured()){try{const {data,error}=await adminClient().rpc("hit_rate_limit",{p_key:key,p_max:max,p_window:Math.ceil(windowMs/1000)});if(!error&&typeof data==="boolean")return data}catch{}}
 return memLimited(key,max,windowMs)}
export const ipOf=(req:Request)=>req.headers.get("x-forwarded-for")?.split(",")[0].trim()??"unknown";
