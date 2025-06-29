import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

interface Source {
  title: string;
  url: string;
  content: string;
  domain: string;
}

interface Message {
  query: string;
  aiResponse: string;
}

export async function POST(request: Request) {
  try {
    const {
      query,
      sources,
      messages = [],
    }: {
      query: string;
      sources: Source[];
      messages?: Message[];
    } = await request.json();

    if (!query || !sources) {
      return Response.json(
        { error: "Query and sources are required" },
        { status: 400 }
      );
    }

    console.log("Starting AI response generation...");
    console.log("Query:", query);
    console.log("Number of sources:", sources.length);
    console.log("Previous messages:", messages.length);

    // Build context from previous conversation
    let conversationContext = "";
    if (messages.length > 0) {
      conversationContext =
        "Previous conversation:\n" +
        messages
          .slice(-3)
          .map(
            (msg: Message) =>
              `Q: ${msg.query}\nA: ${msg.aiResponse.substring(0, 200)}...`
          )
          .join("\n\n") +
        "\n\nCurrent question:";
    }

    // Create a comprehensive prompt for the AI
    const prompt = `${
      conversationContext ? conversationContext + " " : ""
    }${query}

Based on the following search results, provide a comprehensive and accurate response. Use citations in the format [1], [2], etc. to reference the sources. Make sure to:

1. Answer the question directly and thoroughly
2. Include relevant details from the sources
3. Use proper citations [1], [2], etc. throughout your response
4. Structure your response with clear sections if appropriate
5. Be conversational and engaging
${
  conversationContext
    ? "6. Build upon the previous conversation context when relevant"
    : ""
}

Sources:
${sources
  .map(
    (source: Source, index: number) =>
      `[${index + 1}] ${source.title} - ${
        source.domain
      }\n${source.content.substring(0, 500)}...\n`
  )
  .join("\n")}

Please provide a detailed response with proper citations:`;

    console.log("Streaming response started");

    // Stream response from OpenAI
    const result = streamText({
      model: openai("gpt-4o"),
      prompt,
      temperature: 0.7,
      maxTokens: 2000,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error in chat API:", error);
    return Response.json(
      { error: "Failed to generate AI response" },
      { status: 500 }
    );
  }
}
