import CompanyForm from "./CompanyForm";
export const metadata={title:"For companies – FinnEnProff"};
const faq=[["Do I get every request?","No. You only receive requests that match your selected services, your coverage area and any agreement we make."],["What does it cost?","The first model is payment per accepted customer request. Prices are agreed with you before you receive requests. Subscriptions and premium visibility may follow."],["Is my company verified?","Registering does not mean verification. Every registration is reviewed manually by FinnEnProff before approval."]];
export default function Page(){return(<>
<section className="bg-navy text-white"><div className="mx-auto max-w-6xl px-5 py-16"><h1 className="max-w-2xl text-4xl font-extrabold md:text-5xl">Get more customers. Grow your business.</h1>
<p className="mt-4 max-w-xl text-white/80">FinnEnProff helps service companies connect with people actively looking for their services.</p><a href="#register" className="btn mt-6">Register your company</a></div></section>
<div className="mx-auto max-w-3xl px-5 py-14">
<h2 className="text-2xl font-extrabold">How it works</h2><ol className="mt-4 list-decimal space-y-2 pl-5 text-muted"><li>Register and tell us your services and coverage.</li><li>We review and approve your registration.</li><li>Matching customer requests are sent to you.</li><li>You pay for accepted requests as agreed.</li></ol>
<h2 className="mt-12 text-2xl font-extrabold">Pricing</h2><p className="mt-2 text-muted">Pricing is agreed individually during the launch phase. No automatic payments are made through this site.</p>
<h2 className="mt-12 text-2xl font-extrabold">Questions</h2>{faq.map(([q,a])=><details key={q} className="mt-3 border-b border-line pb-3"><summary className="cursor-pointer font-semibold">{q}</summary><p className="mt-2 text-muted">{a}</p></details>)}
<h2 id="register" className="mt-14 text-2xl font-extrabold">Register your company</h2><CompanyForm/></div></>)}
