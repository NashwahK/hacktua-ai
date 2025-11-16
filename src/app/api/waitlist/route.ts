import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "don't leave me aloone :/" },
        { status: 400 }
      );
    }
    const { error: dbError } = await supabase
      .from("waitlist")
      .insert({ email });

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      return NextResponse.json(
        { success: false, message: "Database error" },
        { status: 500 }
      );
    }
    await resend.emails.send({
      from: "Hacktua <onboarding@resend.dev>",
      to: "hacktua.ai@gmail.com",
      subject: "New Waitlist Signup",
      html: `<p>its <strong>${email}</strong> in da hooouuuseee</p>`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: String(error) },
      { status: 500 }
    );
  }
}
