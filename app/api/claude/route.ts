import { NextRequest, NextResponse } from "next/server";

/**
 * Secure server-side proxy for all Anthropic Claude API calls.
 * The ANTHROPIC_API_KEY lives only in Vercel environment variables.
 * It is NEVER sent to the browser.
 */
export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not configured on server." },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { stream = false } = body;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1500,
        ...body,
      }),
    });

    // Streaming response
    if (stream && response.body) {
      return new NextResponse(response.body, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    // Non-streaming response
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Claude proxy error:", err);
    return NextResponse.json(
      { error: "Proxy request failed" },
      { status: 500 }
    );
  }
}
