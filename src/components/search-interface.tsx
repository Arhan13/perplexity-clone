"use client";

import { useState, useRef } from "react";
import { Loader2, Globe, FileText, Send } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Component to handle citations in text
const CitationText = ({
  children,
  results,
}: {
  children: string;
  results: SearchResult[];
}) => {
  const citationPattern = /\[(\d+)\]/g;

  const parts = children.split(citationPattern);
  const elements = [];

  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 0) {
      // Regular text
      if (parts[i]) {
        elements.push(parts[i]);
      }
    } else {
      // Citation number
      const sourceIndex = parseInt(parts[i]) - 1;
      const handleCitationClick = () => {
        if (results[sourceIndex]?.url) {
          window.open(
            results[sourceIndex].url,
            "_blank",
            "noopener,noreferrer"
          );

          // Brief highlight effect
          const sourceElement = document.querySelector(
            `[data-source-index="${sourceIndex}"]`
          );
          if (sourceElement) {
            sourceElement.classList.add(
              "ring-2",
              "ring-blue-500",
              "ring-opacity-50"
            );
            setTimeout(() => {
              sourceElement.classList.remove(
                "ring-2",
                "ring-blue-500",
                "ring-opacity-50"
              );
            }, 1000);
          }
        }
      };

      elements.push(
        <button
          key={`citation-${i}`}
          onClick={handleCitationClick}
          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 mx-0.5 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors cursor-pointer"
          title={`Open source: ${
            results[sourceIndex]?.title || `Source ${sourceIndex + 1}`
          }`}
        >
          [{parts[i]}]
        </button>
      );
    }
  }

  return <>{elements}</>;
};

interface SearchResult {
  title: string;
  url: string;
  content: string;
  domain: string;
}

interface SearchState {
  query: string;
  isSearching: boolean;
  searchStatus: string;
  results: SearchResult[];
  aiResponse: string;
  isStreaming: boolean;
  progress: number;
}

export function SearchInterface() {
  const [state, setState] = useState<SearchState>({
    query: "",
    isSearching: false,
    searchStatus: "",
    results: [],
    aiResponse: "",
    isStreaming: false,
    progress: 0,
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSearch = async () => {
    if (!state.query.trim() || state.isSearching) return;

    setState((prev) => ({
      ...prev,
      isSearching: true,
      searchStatus: "Initializing search...",
      results: [],
      aiResponse: "",
      progress: 10,
    }));

    try {
      // Step 1: Perform Tavily search
      setState((prev) => ({
        ...prev,
        searchStatus: "Searching the web...",
        progress: 30,
      }));

      const searchResponse = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: state.query }),
      });

      if (!searchResponse.ok) throw new Error("Search failed");

      const searchData = await searchResponse.json();

      setState((prev) => ({
        ...prev,
        results: searchData.results,
        searchStatus: "Analyzing sources...",
        progress: 60,
      }));

      // Step 2: Stream AI response
      setState((prev) => ({
        ...prev,
        searchStatus: "Generating AI response...",
        progress: 80,
        isStreaming: true,
      }));

      const aiResponse = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: state.query,
          sources: searchData.results,
        }),
      });

      if (!aiResponse.ok) throw new Error("AI response failed");

      const reader = aiResponse.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let aiResponseText = "";
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");

          // Keep the last incomplete line in buffer
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.trim() === "") continue;

            console.log("Received line:", line); // Debug log

            // Handle AI SDK streaming format
            if (line.startsWith("0:")) {
              try {
                // Format: 0:"text content"
                const content = JSON.parse(line.slice(2));
                console.log("Parsed content:", content); // Debug log
                if (typeof content === "string") {
                  aiResponseText += content;
                  setState((prev) => ({ ...prev, aiResponse: aiResponseText }));
                }
              } catch (e) {
                console.log("Error parsing 0: line:", e); // Debug log
              }
            } else if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                console.log("Parsed data:", data); // Debug log
                if (data.content) {
                  aiResponseText += data.content;
                  setState((prev) => ({ ...prev, aiResponse: aiResponseText }));
                }
              } catch (e) {
                console.log("Error parsing data line:", e); // Debug log
              }
            }
          }
        }
      }

      setState((prev) => ({
        ...prev,
        isSearching: false,
        isStreaming: false,
        searchStatus: "Complete",
        progress: 100,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isSearching: false,
        isStreaming: false,
        searchStatus: `Error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        progress: 0,
      }));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Search Input */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={state.query}
              onChange={(e) =>
                setState((prev) => ({ ...prev, query: e.target.value }))
              }
              onKeyDown={handleKeyDown}
              placeholder="Ask anything... (Press Enter to search)"
              className="w-full resize-none border-0 bg-transparent text-lg placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none min-h-[60px] max-h-[200px]"
              rows={2}
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={!state.query.trim() || state.isSearching}
            className="flex items-center justify-center w-12 h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
          >
            {state.isSearching ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Live Status & Progress */}
      {state.isSearching && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center gap-3 mb-3">
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {state.searchStatus}
            </span>
          </div>
          <Progress value={state.progress} className="h-2" />
        </div>
      )}

      {/* Search Results */}
      {state.results.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
              Sources ({state.results.length})
            </h3>
          </div>
          <div className="grid gap-3">
            {state.results.map((result, index) => (
              <a
                key={index}
                data-source-index={index}
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200"
              >
                <Avatar className="w-8 h-8 shrink-0">
                  <AvatarFallback className="text-xs bg-slate-100 dark:bg-slate-700">
                    {index + 1}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-slate-900 dark:text-slate-100 line-clamp-1">
                    {result.title}
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-400 mb-1">
                    {result.domain}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                    {result.content.substring(0, 150)}...
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* AI Response */}
      {(state.aiResponse || state.isStreaming) && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
              AI Response
            </h3>
            {state.isStreaming && (
              <Loader2 className="w-4 h-4 animate-spin text-blue-600 ml-auto" />
            )}
          </div>
          <Separator className="mb-4" />
          <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:text-slate-900 dark:prose-headings:text-slate-100 prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-strong:text-slate-900 dark:prose-strong:text-slate-100">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // Style headers
                h1: ({ children }) => (
                  <h1 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-xl font-semibold mb-3 text-slate-900 dark:text-slate-100">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-slate-100">
                    {children}
                  </h3>
                ),
                // Style paragraphs with citation detection
                p: ({ children }) => (
                  <p className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">
                    {typeof children === "string" ? (
                      <CitationText results={state.results}>
                        {children}
                      </CitationText>
                    ) : (
                      children
                    )}
                  </p>
                ),
                // Style lists
                ul: ({ children }) => (
                  <ul className="mb-4 space-y-1">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="mb-4 space-y-1">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className="text-slate-700 dark:text-slate-300">
                    {typeof children === "string" ? (
                      <CitationText results={state.results}>
                        {children}
                      </CitationText>
                    ) : (
                      children
                    )}
                  </li>
                ),
                // Handle text nodes that contain citations
                text: ({ children }) => {
                  if (typeof children === "string") {
                    return (
                      <CitationText results={state.results}>
                        {children}
                      </CitationText>
                    );
                  }
                  return <>{children}</>;
                },
              }}
            >
              {state.aiResponse}
            </ReactMarkdown>
            {state.isStreaming && (
              <span className="inline-block w-2 h-5 bg-blue-600 animate-pulse ml-1" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
