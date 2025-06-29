import { NextRequest, NextResponse } from "next/server";

interface TavilySearchPayload {
  query: string;
  search_depth: "basic" | "advanced";
  max_results: number;
  include_raw_content: boolean;
  include_answer: boolean;
  include_images: boolean;
  include_image_descriptions: boolean;
  topic: "general" | "news";
  include_domains?: string[];
}

interface TavilySearchResult {
  title: string;
  url: string;
  content?: string;
  raw_content?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { query, domains } = await request.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // Build Tavily search payload
    const searchPayload: TavilySearchPayload = {
      query,
      search_depth: "advanced",
      max_results: 15,
      include_raw_content: true,
      include_answer: false,
      include_images: true,
      include_image_descriptions: true,
      topic: "general",
    };

    // Add domain filtering if specified
    if (domains && domains.length > 0) {
      searchPayload.include_domains = domains;
    }

    // Perform Tavily search
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.TAVILY_API_KEY}`,
      },
      body: JSON.stringify(searchPayload),
    });

    if (!response.ok) {
      throw new Error(`Tavily API error: ${response.status}`);
    }

    const searchData = await response.json();

    // Transform results to our format
    const results = searchData.results.map(
      (result: TavilySearchResult, index: number) => ({
        title: result.title || `Result ${index + 1}`,
        url: result.url,
        content: result.raw_content || result.content || "",
        domain: new URL(result.url).hostname,
        snippet: result.content?.substring(0, 200) || "",
      })
    );

    return NextResponse.json({
      results,
      images: searchData.images || [],
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
