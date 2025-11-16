import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const {
      email,
      willing_conversation,
      bothering_you,
      affecting_daily_life,
      better_or_worse,
      consent,
    } = await req.json();

    if (typeof willing_conversation !== "boolean" || typeof consent !== "boolean") {
      return NextResponse.json({ success: false, message: "Invalid input" }, { status: 400 });
    }
    const { error: dbError } = await supabase
      .from("interest_check_responses")
      .insert({
        email,
        willing_conversation,
        bothering_you,
        affecting_daily_life,
        better_or_worse,
        consent,
      });

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      return NextResponse.json({ success: false, message: "Database error" }, { status: 500 });
    }

    await resend.emails.send({
      from: "Hacktua <onboarding@resend.dev>",
      to: "hacktua.ai@gmail.com",
      subject: "New Interest Check Submission",
      html: `
        <h2>Interest Check Response</h2>
        <p><strong>Email:</strong> ${email || "N/A"}</p>
        <p><strong>Willing Conversation:</strong> ${willing_conversation}</p>
        <p><strong>Bothering you:</strong> ${bothering_you}</p>
        <p><strong>Affecting daily life:</strong> ${affecting_daily_life}</p>
        <p><strong>Better/Worse:</strong> ${better_or_worse}</p>
        <p><strong>Consent:</strong> ${consent}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: String(error) }, { status: 500 });
  }
}
