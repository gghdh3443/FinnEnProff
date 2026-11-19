export function Mark({size=32}:{size?:number}){return(
<svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="7" fill="#10243A"/>
<circle cx="14" cy="14" r="7" fill="none" stroke="#fff" strokeWidth="2.4"/><path d="M19.5 19.5 25 25" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"/>
<circle cx="11" cy="14" r="2" fill="#16A36A"/><circle cx="17" cy="14" r="2" fill="#16A36A"/><path d="M11 14h6" stroke="#16A36A" strokeWidth="1.6"/></svg>)}
export function Logo(){return <span className="flex items-center gap-2 text-lg font-extrabold text-navy"><Mark/>Finn<span className="text-green">En</span>Proff</span>}
