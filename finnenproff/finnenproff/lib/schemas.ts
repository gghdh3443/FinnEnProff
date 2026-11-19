import { z } from "zod";
import { ALL_SERVICES } from "./services";
export const requestSchema = z.object({
 service: z.string().refine(s=>ALL_SERVICES.includes(s),"Choose a service from the list"),
 description: z.string().trim().min(20,"Describe the job in at least 20 characters").max(2000),
 postalCode: z.string().regex(/^\d{4}$/,"Enter a 4-digit Norwegian postal code"),
 city: z.string().trim().min(2,"Enter your city"),
 address: z.string().trim().max(200).optional(),
 timing: z.enum(["asap","week","month","flexible"],{errorMap:()=>({message:"Choose when you need help"})}),
 name: z.string().trim().min(2,"Enter your name"),
 email: z.string().trim().email("Enter a valid email address"),
 phone: z.string().trim().regex(/^(\+47|0047)?[\s\d]{8,12}$/,"Enter a valid phone number"),
 consentShare: z.literal(true,{errorMap:()=>({message:"You must agree to share your request to continue"})}),
 consentMarketing: z.boolean().default(false),
 website: z.string().max(0).optional(), // honeypot
});
export const companySchema = z.object({
 name: z.string().trim().min(2,"Enter the company name"),
 kind: z.enum(["company","individual"]).default("company"),
 orgNumber: z.string().optional(),
 contact: z.string().trim().min(2,"Enter a contact person"),
 email: z.string().trim().email("Enter a valid email address"),
 phone: z.string().trim().min(8,"Enter a valid phone number"),
 websiteUrl: z.string().trim().url("Enter a full URL, e.g. https://example.no").optional().or(z.literal("")),
 services: z.array(z.string()).min(1,"Select at least one service"),
 coverage: z.string().trim().min(2,"Tell us where you work, e.g. postal codes or municipalities"),
 description: z.string().trim().min(20,"Write at least 20 characters").max(1500),
 interests: z.string().trim().max(1000).optional(),
 website: z.string().max(0).optional(),
}).superRefine((d,c)=>{if(d.kind==="company"&&!/^\d{9}$/.test(d.orgNumber??""))c.addIssue({code:"custom",path:["orgNumber"],message:"Organization number has 9 digits"})});
export const contactSchema=z.object({name:z.string().trim().min(2,"Enter your name"),email:z.string().trim().email("Enter a valid email address"),message:z.string().trim().min(10,"Write at least 10 characters").max(3000),website:z.string().max(0).optional()});
