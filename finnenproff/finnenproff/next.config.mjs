const sb=process.env.NEXT_PUBLIC_SUPABASE_URL??"";
const csp=`default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' ${sb}; frame-ancestors 'none'; base-uri 'self'; form-action 'self'`;
const headers=[["X-Content-Type-Options","nosniff"],["X-Frame-Options","DENY"],["Referrer-Policy","strict-origin-when-cross-origin"],["Permissions-Policy","camera=(), microphone=(), geolocation=()"],["Strict-Transport-Security","max-age=63072000; includeSubDomains"],["Content-Security-Policy-Report-Only",csp]].map(([key,value])=>({key,value}));
export default {poweredByHeader:false,images:{unoptimized:true},async headers(){return [{source:"/:path*",headers}]}};
