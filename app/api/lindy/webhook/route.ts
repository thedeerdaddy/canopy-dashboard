import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

/**
 * Receives inbound events from Lindy automation workflows.
 * Verifies HMAC-SHA256 signature using LINDY_WEBHOOK_SECRET.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.LINDY_WEBHOOK_SECRET;
  const signature = req.headers.get("x-lindy-signature");

  const body = await req.text();

  // Verify signature if secret is configured
  if (secret && signature) {
    const expected = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    if (signature !== expected) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  const event = JSON.parse(body);
  console.log("Lindy webhook received:", event.event, event);

  // Handle different event types
  switch (event.event) {
    case "run.started":
      // TODO: Update automation_runs table in Supabase
      break;
    case "run.completed":
      // TODO: Update run record with stages, set status to awaiting_approval
      break;
    case "run.error":
      // TODO: Log error, notify Michelle
      break;
    case "run.sent":
      // TODO: Mark run as sent, update sent_at timestamp
      break;
    default:
      console.log("Unhandled Lindy event:", event.event);
  }

  return NextResponse.json({ received: true });
}
