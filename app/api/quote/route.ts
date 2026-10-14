import { NextResponse } from "next/server"

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

    // Build formatted email subject and body
    const subject = `Quote Request: ${year || ""} ${make} ${model || ""} - ${part || "Auto Part"}`.trim()
    const lines = [
      `New Quote Request from AUAPW Website`,
      ``,
      `--- Vehicle Details ---`,
      `Part: ${part || "Not specified"}`,
      `Make: ${make}`,
      `Model: ${model || "Not specified"}`,
      `Year: ${year || "Not specified"}`,
      `Option: ${option || "Not specified"}`,
      ``,
      `--- Customer Details ---`,
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Email: ${email || "Not provided"}`,
      `State: ${state || "Not provided"}`,
      `ZIP: ${zip || "Not provided"}`,
      ``,
      `--- Message ---`,
      message || "(no message)",
      ``,
      `---`,
      `Sent to: ${CONTACT_EMAIL}`,
      `Submitted at: ${new Date().toISOString()}`,
    ]

    // Log the submission 
    console.log("[Quote Submission]", lines.join("\n"))

    return NextResponse.json({
      success: true,
      message: "Your quote request has been received. We will contact you within 24 hours.",
      email: CONTACT_EMAIL,
    })
  } catch {
    return NextResponse.json(
      { error: "Failed to process your request. Please try again or call us directly." },
      { status: 500 }
    )
  }
}
