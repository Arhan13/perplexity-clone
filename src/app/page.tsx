"use client";

import { SearchInterface } from "@/components/search-interface";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            AI Search Assistant
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Get comprehensive answers with real-time web search and AI analysis
          </p>
        </div>

        {/* Search Interface */}
        <SearchInterface />
      </div>
    </div>
  );
}
