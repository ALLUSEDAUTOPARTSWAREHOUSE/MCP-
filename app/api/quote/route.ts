import { NextResponse } from "next/server"
import { Resend } from "resend"

const CONTACT_EMAIL = "aupworld@gmail.com"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { part, make, model, year, option, name, phone, email, state, zip, message } = body

    if (!make || !name || !phone) {
      return NextResponse.json(
        { error: "Make, name, and phone are required." },
        { status: 400 }
      )
    }

    const subject = `Quote Request: ${year || ""} ${make} ${model || ""} - ${part || "Auto Part"}`
      .replace(/\s+/g, " ")
      .trim()

    const text = [
      "New Quote Request — AUAPW LLC Website",
      "",
      "--- Vehicle Details ---",
      `Part:    ${part || "Not specified"}`,
      `Make:    ${make}`,
      `Model:   ${model || "Not specified"}`,
      `Year:    ${year || "Not specified"}`,
      `Option:  ${option || "Not specified"}`,
      "",
      "--- Customer Details ---",
      `Name:    ${name}`,
      `Phone:   ${phone}`,
      `Email:   ${email || "Not provided"}`,
      `State:   ${state || "Not provided"}`,
      `ZIP:     ${zip || "Not provided"}`,
      "",
      "--- Message ---",
      message || "(no additional details)",
      "",
      `Submitted at: ${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })} ET`,
    ].join("\n")

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0f1117; color: #ffffff; padding: 20px; border-radius: 8px 8px 0 0;">
          <h2 style="margin: 0;">New Quote Request</h2>
          <p style="margin: 4px 0 0; color: #f59e0b; font-weight: bold;">AUAPW LLC — All Used Auto Parts Warehouse</p>
        </div>
        <div style="border: 1px solid #e5e7eb; border-top: none; padding: 20px; border-radius: 0 0 8px 8px;">
          <h3 style="color: #0f1117; border-bottom: 2px solid #f59e0b; padding-bottom: 6px;">Vehicle Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 6px 0; color: #6b7280; width: 110px;">Part</td><td style="padding: 6px 0; font-weight: bold;">${part || "Not specified"}</td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280;">Make</td><td style="padding: 6px 0; font-weight: bold;">${make}</td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280;">Model</td><td style="padding: 6px 0; font-weight: bold;">${model || "Not specified"}</td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280;">Year</td><td style="padding: 6px 0; font-weight: bold;">${year || "Not specified"}</td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280;">Option</td><td style="padding: 6px 0; font-weight: bold;">${option || "Not specified"}</td></tr>
          </table>
          <h3 style="color: #0f1117; border-bottom: 2px solid #f59e0b; padding-bottom: 6px; margin-top: 20px;">Customer Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 6px 0; color: #6b7280; width: 110px;">Name</td><td style="padding: 6px 0; font-weight: bold;">${name}</td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280;">Phone</td><td style="padding: 6px 0; font-weight: bold;"><a href="tel:${phone}">${phone}</a></td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280;">Email</td><td style="padding: 6px 0; font-weight: bold;">${email ? `<a href="mailto:${email}">${email}</a>` : "Not provided"}</td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280;">State</td><td style="padding: 6px 0; font-weight: bold;">${state || "Not provided"}</td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280;">ZIP</td><td style="padding: 6px 0; font-weight: bold;">${zip || "Not provided"}</td></tr>
          </table>
          <h3 style="color: #0f1117; border-bottom: 2px solid #f59e0b; padding-bottom: 6px; margin-top: 20px;">Message</h3>
          <p style="color: #374151;">${message || "(no additional details)"}</p>
        </div>
      </div>
    `

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.error("[Quote] RESEND_API_KEY is not set — cannot send email")
      return NextResponse.json(
        { error: "Email service is not configured. Please call us at (888) 818-5001." },
        { status: 500 }
      )
    }

    const resend = new Resend(apiKey)
    const { error: sendError } = await resend.emails.send({
      from: "AUAPW Quotes <onboarding@resend.dev>",
      to: [CONTACT_EMAIL],
      replyTo: email || undefined,
      subject,
      text,
      html,
    })

    if (sendError) {
      console.error("[Quote] Resend error:", sendError)
      return NextResponse.json(
        { error: "Failed to send your request. Please try again or call us at (888) 818-5001." },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Your quote request has been sent. We will contact you within 24 hours.",
    })
  } catch {
    return NextResponse.json(
      { error: "Failed to process your request. Please try again or call us directly." },
      { status: 500 }
    )
  }
}
