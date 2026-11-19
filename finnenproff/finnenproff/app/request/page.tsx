import RequestForm from "./RequestForm";
export const metadata={title:"Find help – FinnEnProff"};
export default function Page({searchParams}:{searchParams:{service?:string;city?:string}}){
return <div className="mx-auto max-w-2xl px-5 py-14"><h1 className="text-3xl font-extrabold">Describe your job</h1>
<p className="mt-2 text-muted">Takes about two minutes. You choose what to share.</p><aside className="mt-6 rounded-md border border-line bg-white p-4 text-sm text-muted"><p className="font-semibold text-ink">What happens next</p><p className="mt-1">We review your request. If a participating company covers your service and area, we share it with them so they can contact you. We cannot promise a match in every area.</p></aside><RequestForm initialService={searchParams.service??""} initialCity={searchParams.city??""}/></div>}
