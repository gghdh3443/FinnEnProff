export const CATEGORIES: Record<string,string[]> = {
"Home & renovation":["Painting","Carpentry","Plumbing","Electrical work","Roofing","Flooring","Renovation","Bathroom renovation","Window installation"],
"Transport & moving":["House moving","Furniture transportation","Delivery","Waste removal","Storage"],
"Cleaning":["House cleaning","Office cleaning","Window cleaning","Deep cleaning","End-of-tenancy cleaning"],
"Vehicles":["Car repair","Car detailing","Car washing","Tire services","Vehicle transportation"],
"Outdoor services":["Gardening","Landscaping","Snow clearing","Tree maintenance","Pressure washing"],
"Technology":["Computer repair","IT support","Website development","Technical consulting"],
"Events":["Photography","Catering","Event planning","Entertainment"],
"Business services":["Marketing","Graphic design","Accounting services","Administrative support"],
"Personal services":["Tutoring","Pet care","Personal assistance"]};
export const ALL_SERVICES = Object.values(CATEGORIES).flat();
export const categoryOf = (s:string)=>Object.keys(CATEGORIES).find(c=>CATEGORIES[c].includes(s));
export const slug=(s:string)=>s.toLowerCase().replace(/&/g,"and").replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
export const bySlug=(x:string)=>ALL_SERVICES.find(s=>slug(s)===x);
