"use client";
export default function E({reset}:{reset:()=>void}){return <div className="mx-auto max-w-xl px-5 py-20"><h1 className="text-2xl font-extrabold">Something went wrong</h1><p className="mt-3 text-muted">Please try again. If it keeps happening, contact us.</p><button onClick={reset} className="btn mt-6">Try again</button></div>}
