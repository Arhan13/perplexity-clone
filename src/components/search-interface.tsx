"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useRef } from "react";
import { Loader2, Send } from "lucide-react";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import { useSearch } from "../hooks/use-search";
import { preprocessCitations } from "../utils/citations";
import { HistoricalMessage } from "./historical-message";
import { SearchStep } from "./search-step";
import { SourceCard } from "./source-card";

export function SearchInterface() {
  const { state, handleSearch, updateQuery, setActiveTab } = useSearch();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  const hasActiveSearch =
    state.isSearching || state.isStreaming || state.currentResults.length > 0;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Main content area */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 pt-8 pb-32">
        {state.messages.length === 0 && !hasActiveSearch ? (
          /* Welcome Screen */
          <div className="flex flex-col items-center justify-center flex-1 text-center space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
                What would you like to search?
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl">
                Ask any question and get comprehensive answers with sources from
                across the web.
              </p>
            </div>
          </div>
        ) : (
          /* Conversation Area */
          <div className="space-y-8">
            {/* Historical Messages */}
            {state.messages.map((message) => (
              <div key={message.id} className="space-y-4">
                {/* User Query */}
                <div className="flex justify-end">
                  <div className="bg-blue-600 text-white rounded-2xl px-4 py-2 max-w-2xl">
                    <p className="text-sm">{message.query}</p>
                  </div>
                </div>

                {/* AI Response with Tabs */}
                <div className="flex justify-start">
                  <HistoricalMessage message={message} />
                </div>
              </div>
            ))}

            {/* Current Search in Progress */}
            {hasActiveSearch && (
              <div className="space-y-4">
                {/* Current User Query - Only show if search has been submitted */}
                {(state.isSearching ||
                  state.isStreaming ||
                  state.currentResults.length > 0) &&
                  state.currentQuery && (
                    <div className="flex justify-end">
                      <div className="bg-blue-600 text-white rounded-2xl px-4 py-2 max-w-2xl">
                        <p className="text-sm">{state.currentQuery}</p>
                      </div>
                    </div>
                  )}

                {/* Current Search Results */}
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 max-w-4xl w-full">
                    {/* Tab Navigation */}
                    <div className="flex border-b border-slate-200 dark:border-slate-700 px-6">
                      <button
                        onClick={() => setActiveTab("perplexity")}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                          state.activeTab === "perplexity"
                            ? "border-blue-600 text-blue-600 dark:text-blue-400"
                            : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300"
                        }`}
                      >
                        🔮 Perplexity
                      </button>
                      <button
                        onClick={() => setActiveTab("sources")}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                          state.activeTab === "sources"
                            ? "border-blue-600 text-blue-600 dark:text-blue-400"
                            : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300"
                        }`}
                      >
                        🌐 Sources • {state.currentResults.length}
                      </button>
                      <button
                        onClick={() => setActiveTab("steps")}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                          state.activeTab === "steps"
                            ? "border-blue-600 text-blue-600 dark:text-blue-400"
                            : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300"
                        }`}
                      >
                        ⚡ Steps
                      </button>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                      {/* Perplexity Tab */}
                      {state.activeTab === "perplexity" && (
                        <div className="space-y-4">
                          {/* Show steps during search */}
                          {(state.isSearching || state.isStreaming) && (
                            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 space-y-4">
                              <div className="space-y-6">
                                {state.searchSteps.map((step, index) => (
                                  <SearchStep
                                    key={step.id}
                                    step={step}
                                    isLast={
                                      index === state.searchSteps.length - 1
                                    }
                                  />
                                ))}
                              </div>

                              {state.progress > 0 && (
                                <div className="space-y-2">
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">
                                      {state.searchStatus}
                                    </span>
                                    <span className="text-xs text-slate-500 dark:text-slate-500">
                                      {state.progress}%
                                    </span>
                                  </div>
                                  <Progress
                                    value={state.progress}
                                    className="w-full"
                                  />
                                </div>
                              )}
                            </div>
                          )}

                          {/* AI Response */}
                          {state.currentAiResponse && (
                            <>
                              {(state.isSearching || state.isStreaming) && (
                                <Separator />
                              )}
                              <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:text-slate-900 dark:prose-headings:text-slate-100 prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-strong:text-slate-900 dark:prose-strong:text-slate-100">
                                <ReactMarkdown
                                  remarkPlugins={[remarkGfm]}
                                  components={{
                                    // Handle citation links
                                    a: ({ href, children, ...props }) => {
                                      if (href?.startsWith("citation-")) {
                                        const sourceIndex = parseInt(
                                          href.replace("citation-", "")
                                        );
                                        const handleCitationClick = (
                                          e: React.MouseEvent
                                        ) => {
                                          e.preventDefault();
                                          if (
                                            state.currentResults[sourceIndex]
                                              ?.url
                                          ) {
                                            window.open(
                                              state.currentResults[sourceIndex]
                                                .url,
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
                                              state.currentResults[sourceIndex]
                                                ?.title ||
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
                                      <ul className="mb-4 space-y-1">
                                        {children}
                                      </ul>
                                    ),
                                    ol: ({ children }) => (
                                      <ol className="mb-4 space-y-1">
                                        {children}
                                      </ol>
                                    ),
                                    li: ({ children }) => (
                                      <li className="text-slate-700 dark:text-slate-300">
                                        {children}
                                      </li>
                                    ),
                                  }}
                                >
                                  {preprocessCitations(
                                    state.currentAiResponse,
                                    state.currentResults
                                  )}
                                </ReactMarkdown>
                              </div>
                            </>
                          )}
                        </div>
                      )}

                      {/* Sources Tab */}
                      {state.activeTab === "sources" && (
                        <div className="space-y-2">
                          {state.currentResults.length > 0 ? (
                            state.currentResults.map((result, index) => (
                              <SourceCard
                                key={index}
                                result={result}
                                index={index}
                                compact
                              />
                            ))
                          ) : (
                            <p className="text-slate-500 dark:text-slate-400 text-center py-8">
                              Sources will appear here once the search is
                              complete.
                            </p>
                          )}
                        </div>
                      )}

                      {/* Steps Tab */}
                      {state.activeTab === "steps" && (
                        <div className="space-y-6">
                          {state.searchSteps.length > 0 ? (
                            state.searchSteps.map((step, index) => (
                              <SearchStep
                                key={step.id}
                                step={step}
                                isLast={index === state.searchSteps.length - 1}
                              />
                            ))
                          ) : (
                            <p className="text-slate-500 dark:text-slate-400 text-center py-8">
                              Search steps will appear here during the search
                              process.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Fixed Search Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={state.currentQuery}
              onChange={(e) => updateQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              className="w-full min-h-[60px] max-h-32 px-4 py-3 pr-12 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={1}
              style={{
                height: "auto",
                minHeight: "60px",
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = Math.min(target.scrollHeight, 128) + "px";
              }}
              disabled={state.isSearching || state.isStreaming}
            />
            <button
              onClick={handleSearch}
              disabled={
                !state.currentQuery.trim() ||
                state.isSearching ||
                state.isStreaming
              }
              className="absolute right-2 bottom-2 p-2 text-blue-600 hover:text-blue-700 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
            >
              {state.isSearching || state.isStreaming ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
