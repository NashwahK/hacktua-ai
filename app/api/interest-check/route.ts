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
    const body = await req.json();
    const {
      email,
      willing_conversation,
      bothering_you,
      consent,
      detectedKeyword, // This is an array
      ...dynamicResponses
    } = body;

    // Validate required fields
    if (typeof willing_conversation !== "boolean" || typeof consent !== "boolean") {
      return NextResponse.json({ success: false, message: "Invalid input" }, { status: 400 });
    }

    // Convert detectedKeyword array to comma-separated string
    const keywordString = Array.isArray(detectedKeyword) && detectedKeyword.length > 0 
      ? detectedKeyword.join(", ") 
      : null;

    // Insert into Supabase
    const { error: dbError } = await supabase
      .from("interest_check_responses")
      .insert({
        email,
        willing_conversation,
        bothering_you,
        consent,
        detected_keyword: keywordString,
        responses: dynamicResponses, // Store all keyword-specific responses as JSONB
        created_at: new Date().toISOString(),
      });

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      return NextResponse.json({ success: false, message: "Database error" }, { status: 500 });
    }

    // Build dynamic HTML for email based on responses
    let dynamicQuestionsHtml = "";
    if (Array.isArray(detectedKeyword) && detectedKeyword.length > 0) {
      dynamicQuestionsHtml = `
        <h3>Detected Issues: ${detectedKeyword.map(k => k.toUpperCase()).join(", ")}</h3>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 10px 0;">
      `;
      
      for (const [key, value] of Object.entries(dynamicResponses)) {
        const formattedKey = key
          .replace(/_/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase());
        const formattedValue = typeof value === 'boolean' 
          ? (value ? 'Yes' : 'No') 
          : value || 'N/A';
        
        dynamicQuestionsHtml += `
          <p><strong>${formattedKey}:</strong> ${formattedValue}</p>
        `;
      }
      
      dynamicQuestionsHtml += `</div>`;
    }

    // Send email notification
    await resend.emails.send({
      from: "Hacktua <onboarding@resend.dev>",
      to: "hacktua.ai@gmail.com",
      subject: `New Interest Check: ${Array.isArray(detectedKeyword) && detectedKeyword.length > 0 ? detectedKeyword.map(k => k.toUpperCase()).join(", ") : 'General'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #336699;">Interest Check Response</h2>
          
          <div style="background: #EBF5FF; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Email:</strong> ${email || "N/A"}</p>
            <p><strong>Willing to have conversation:</strong> ${willing_conversation ? 'Yes' : 'No'}</p>
            <p><strong>What's bothering them:</strong> ${bothering_you || "N/A"}</p>
          </div>

          ${dynamicQuestionsHtml}

          <div style="background: #C5DCF1; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Consent to store & relay:</strong> ${consent ? 'Yes' : 'No'}</p>
          </div>

          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            Submitted at: ${new Date().toLocaleString()}
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: String(error) }, { status: 500 });
  }
}