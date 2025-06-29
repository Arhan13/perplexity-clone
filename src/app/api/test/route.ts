import { NextResponse } from "next/server";

export async function GET() {
  const tavilyKey = process.env.TAVILY_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  return NextResponse.json({
    tavily: tavilyKey ? `Configured (${tavilyKey.slice(0, 8)}...)` : "Missing",
    openai: openaiKey ? `Configured (${openaiKey.slice(0, 8)}...)` : "Missing",
    timestamp: new Date().toISOString(),
  });
}
