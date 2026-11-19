import {ALL_SERVICES} from "@/lib/services"; import {updateCompany,createCompany} from "./actions";
function Fields({c}:{c?:any}){return <><div className="grid gap-3 md:grid-cols-2">
 <div><label className="label">Name</label><input name="name" required defaultValue={c?.name} className="input"/></div>
 {!c&&<div><label className="label">Organization number (9 digits)</label><input name="org_number" required pattern="\d{9}" className="input"/></div>}
 <div><label className="label">Email</label><input name="email" type="email" defaultValue={c?.email} className="input"/></div>
 <div><label className="label">Phone</label><input name="phone" defaultValue={c?.phone} className="input"/></div>
 <div><label className="label">Coverage</label><input name="coverage" defaultValue={c?.coverage} className="input"/></div>
 <div><label className="label">Postal code prefixes covered (e.g. 70, 7600)</label><input name="prefixes" defaultValue={c?.coverage_prefixes?.join(", ")} className="input"/></div>
 <div><label className="label">Price per accepted request (NOK)</label><input name="price" type="number" min="0" defaultValue={c?.price_per_request_nok??""} className="input"/></div></div>
 <fieldset className="mt-3"><legend className="label">Services</legend><div className="grid max-h-48 gap-1 overflow-auto rounded-md border border-line p-3 sm:grid-cols-3">{ALL_SERVICES.map(s=><label key={s} className="flex gap-2 text-sm"><input type="checkbox" name="services" value={s} defaultChecked={c?.services?.includes(s)}/>{s}</label>)}</div></fieldset></>}
export function CompanyEditor({c}:{c:any}){return <details className="mt-3 w-full"><summary className="cursor-pointer text-sm font-semibold text-green">Edit company</summary><form action={updateCompany} className="mt-3"><input type="hidden" name="id" value={c.id}/><Fields c={c}/><button className="btn mt-3">Save company</button></form></details>}
export function NewCompany(){return <details className="mt-3 rounded-md border border-line bg-white p-4"><summary className="cursor-pointer font-semibold text-green">Add a company manually</summary><form action={createCompany} className="mt-3"><Fields/><button className="btn mt-3">Add company</button></form></details>}
