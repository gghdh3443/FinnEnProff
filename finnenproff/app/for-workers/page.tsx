import CompanyForm from "../for-companies/CompanyForm";
export const metadata={title:"Offer your services – FinnEnProff"};
export default function Page(){return(<>
<section className="bg-navy text-white"><div className="mx-auto max-w-6xl px-5 py-16"><h1 className="max-w-2xl text-4xl font-extrabold md:text-5xl">Looking for jobs? Offer your services.</h1>
<p className="mt-4 max-w-xl text-white/80">Register as an independent professional. When a customer's request fits your services and area, we can send it to you.</p><a href="#register" className="btn mt-6">Register</a></div></section>
<div className="mx-auto max-w-3xl px-5 py-14">
<h2 className="text-2xl font-extrabold">How it works</h2><ol className="mt-4 list-decimal space-y-2 pl-5 text-muted"><li>Register with your services and where you work.</li><li>We review your registration manually before approving it.</li><li>Once approved, you get a sign-in link to your dashboard.</li><li>Matching requests are sent to you with the customer's consent. You accept or decline each one.</li><li>You pay for accepted requests as agreed.</li></ol>
<h2 className="mt-10 text-2xl font-bold">Good to know</h2><ul className="mt-3 list-disc space-y-2 pl-5 text-muted"><li>There is no public job board. Customers agree to share their request only with a provider we select, so you cannot browse requests.</li><li>Approval is not a guarantee of work or a verification of your qualifications.</li><li>Depending on the service, you may need to be registered as a business or hold certifications. That is your responsibility. If unsure, ask the relevant authority.</li></ul>
<h2 id="register" className="mt-14 text-2xl font-extrabold">Register</h2><CompanyForm kind="individual"/></div></>)}
