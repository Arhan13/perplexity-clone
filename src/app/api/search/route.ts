import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // Perform Tavily search
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.TAVILY_API_KEY}`,
      },
      body: JSON.stringify({
        query,
        search_depth: "advanced",
        max_results: 15,
        include_raw_content: true,
        include_answer: false,
        topic: "general",
      }),
    });

    if (!response.ok) {
      throw new Error(`Tavily API error: ${response.status}`);
    }

    const searchData = await response.json();

    // Transform results to our format
    const results = searchData.results.map((result: any, index: number) => ({
      title: result.title || `Result ${index + 1}`,
      url: result.url,
      content: result.raw_content || result.content || "",
      domain: new URL(result.url).hostname,
      snippet: result.content?.substring(0, 200) || "",
    }));

    return NextResponse.json({
      results,
      query,
      totalResults: results.length,
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Failed to perform search" },
      { status: 500 }
    );
  }
}
