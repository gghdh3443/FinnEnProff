import ContactForm from "./ContactForm";
export const metadata={title:"Contact – FinnEnProff"};
export default function C(){return <div className="mx-auto max-w-xl px-5 py-14"><h1 className="text-4xl font-extrabold">Contact</h1><p className="mt-3 text-muted">Questions about a request or about joining as a company? Write to us.</p><ContactForm/>
<p className="mt-10 text-sm text-muted">Email and company details: [placeholder, add before launch]. See also the <a className="underline" href="/for-companies#faq">company FAQ</a>.</p></div>}
