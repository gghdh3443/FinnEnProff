import {NextResponse} from "next/server"; import {userClient} from "@/lib/auth";
export async function POST(req:Request){await userClient().auth.signOut();return NextResponse.redirect(new URL("/",req.url),303)}
