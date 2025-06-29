import { NextRequest, NextResponse } from "next/server";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export async function POST(request: NextRequest) {
  try {
    const { query, sources } = await request.json();

    if (!query || !sources) {
      return new Response("Query and sources are required", { status: 400 });
    }

    // Prepare sources for the prompt
    interface Source {
      title: string;
      url: string;
      content: string;
    }

    const sourcesText = (sources as Source[])
      .map(
        (source, index) =>
          `[${index + 1}] ${source.title}\nURL: ${
            source.url
          }\nContent: ${source.content.substring(0, 1000)}...\n`
      )
      .join("\n");

    const prompt = `You are an AI assistant that provides comprehensive, well-researched answers based on web search results. Your task is to analyze the provided sources and create a detailed response to the user's query.

User Query: "${query}"

Available Sources:
${sourcesText}

Instructions:
1. Provide a comprehensive answer based on the sources provided
2. Use inline citations in the format [1], [2], etc. to reference specific sources
3. Include multiple citations when information comes from different sources
4. Structure your response with clear markdown headers (### for sections)
5. Be factual and accurate, only using information from the sources
6. If sources conflict, mention the different perspectives
7. Make sure to cite sources throughout your response, not just at the end
8. Use markdown formatting for better readability (headers, lists, bold text)
9. Aim for a detailed response that thoroughly addresses the query

Please provide your response:`;

    console.log("Starting AI response generation...");
    console.log("Query:", query);
    console.log("Number of sources:", sources.length);

    // Check if we want to use streaming or not
    const useStreaming = true; // Set to false for debugging

    if (useStreaming) {
      const result = await streamText({
        model: openai("gpt-4o"),
        prompt,
        temperature: 0.7,
        maxTokens: 2000,
      });

      console.log("Streaming response started");
      return result.toDataStreamResponse();
    } else {
      // Fallback non-streaming version for debugging
      const { generateText } = await import("ai");

      const result = await generateText({
        model: openai("gpt-4o"),
        prompt,
        temperature: 0.7,
        maxTokens: 2000,
      });

      console.log("Non-streaming response generated");
      return NextResponse.json({ content: result.text });
    }
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("Failed to generate response", { status: 500 });
  }
}
