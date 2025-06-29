"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Message, TabType } from "../types/search";
import { preprocessCitations } from "../utils/citations";
import { SourceCard } from "./source-card";

interface HistoricalMessageProps {
  message: Message;
}

export function HistoricalMessage({ message }: HistoricalMessageProps) {
  const [activeTab, setActiveTab] = useState<TabType>("perplexity");

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 max-w-4xl w-full">
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-700 px-6">
        <button
          onClick={() => setActiveTab("perplexity")}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "perplexity"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300"
          }`}
        >
          🔮 Perplexity Clone
        </button>
        <button
          onClick={() => setActiveTab("sources")}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "sources"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300"
          }`}
        >
          🌐 Sources • {message.results.length}
        </button>
        <button
          onClick={() => setActiveTab("images")}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "images"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300"
          }`}
        >
          🖼️ Images • {message.images.length}
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {/* Perplexity Tab */}
        {activeTab === "perplexity" && (
          <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:text-slate-900 dark:prose-headings:text-slate-100 prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-strong:text-slate-900 dark:prose-strong:text-slate-100">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // Handle citation links
                a: ({ href, children, ...props }) => {
                  if (href?.startsWith("citation-")) {
                    const sourceIndex = parseInt(href.replace("citation-", ""));
                    const handleCitationClick = (e: React.MouseEvent) => {
                      e.preventDefault();
                      if (message.results[sourceIndex]?.url) {
                        window.open(
                          message.results[sourceIndex].url,
                          "_blank",
                          "noopener,noreferrer"
                        );
                      }
                    };

                    return (
                      <button
                        onClick={handleCitationClick}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 mx-0.5 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors cursor-pointer"
                        title={`Open source: ${
                          message.results[sourceIndex]?.title ||
                          `Source ${sourceIndex + 1}`
                        }`}
                      >
                        {children}
                      </button>
                    );
                  }

                  return (
                    <a
                      href={href}
                      {...props}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      {children}
                    </a>
                  );
                },
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
                p: ({ children }) => (
                  <p className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="mb-4 space-y-1">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="mb-4 space-y-1">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className="text-slate-700 dark:text-slate-300">
                    {children}
                  </li>
                ),
              }}
            >
              {preprocessCitations(message.aiResponse, message.results)}
            </ReactMarkdown>
          </div>
        )}

        {/* Sources Tab */}
        {activeTab === "sources" && (
          <div className="space-y-2">
            {message.results.map((result, index) => (
              <SourceCard key={index} result={result} index={index} compact />
            ))}
          </div>
        )}

        {/* Images Tab */}
        {activeTab === "images" && (
          <div className="space-y-4">
            {message.images.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {message.images.map((image, index) => (
                  <div key={index} className="group cursor-pointer">
                    <div className="aspect-square bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden">
                      <img
                        src={image.url}
                        alt={image.description || `Search image ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        onClick={() => window.open(image.url, "_blank")}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src =
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIxIDEzVjE5QzIxIDIwLjEgMjAuMSAyMSAxOSAyMUg1QzMuOSAyMSAzIDIwLjEgMyAxOVY1QzMgMy45IDMuOSAzIDUgM0gxM0wxNSA1SDE5QzIwLjEgNSAyMSA1LjkgMjEgN1YxM1oiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8Y2lyY2xlIGN4PSI5IiBjeT0iOSIgcj0iMiIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik0yMSAxNUwxNiAxMEw1IDIxIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cg==";
                        }}
                      />
                    </div>
                    {image.description && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">
                        {image.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-500 dark:text-slate-400">
                  No images found for this search.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
