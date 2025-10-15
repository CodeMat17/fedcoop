import { ContactFormEmail } from "@/emails/contact-form-email";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    console.log("📧 Contact form submission received");
    const body = await request.json();
    const { name, email, primaryCooperative, subject, message } = body;
    console.log("Form data:", { name, email, primaryCooperative, subject });

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!name?.trim() || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Name must be at least 2 characters" },
        { status: 400 }
      );
    }

    if (!primaryCooperative?.trim() || primaryCooperative.trim().length < 2) {
      return NextResponse.json(
        { error: "Primary Co-operative must be at least 2 characters" },
        { status: 400 }
      );
    }

    if (!subject?.trim() || subject.trim().length < 3) {
      return NextResponse.json(
        { error: "Subject must be at least 3 characters" },
        { status: 400 }
      );
    }

    if (!message?.trim() || message.trim().length < 10) {
      return NextResponse.json(
        { error: "Message must be at least 10 characters" },
        { status: 400 }
      );
    }

    // Send email using Resend
    console.log("📤 Sending email via Resend...");
    const { data, error } = await resend.emails.send({
      from: "FEDCOOP <noreply@fedcoop.org>",
      to: ["email@fedcoop.org"],
      replyTo: email,
      subject: `Website Contact: ${subject}`,
      text: `Name: ${name.trim()}\nEmail: ${email.trim()}\nPrimary Co-operative: ${primaryCooperative.trim()}\nSubject: ${subject.trim()}\n\nMessage:\n${message.trim()}`,
      react: ContactFormEmail({
        name: name.trim(),
        email: email.trim(),
        primaryCooperative: primaryCooperative.trim(),
        subject: subject.trim(),
        message: message.trim(),
      }),
    });

    if (error) {
      console.error("❌ Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send email. Please try again." },
        { status: 500 }
      );
    }

    console.log("✅ Email sent successfully! Message ID:", data?.id);
    return NextResponse.json({
      success: true,
      messageId: data?.id,
    });
  } catch (error) {
    console.error("Error sending contact email:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
