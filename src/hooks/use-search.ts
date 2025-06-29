"use client";

import { useState } from "react";
import {
  SearchState,
  SearchStep,
  SearchResult,
  Message,
  DomainOption,
  SearchImage,
} from "../types/search";

export const DOMAIN_OPTIONS: DomainOption[] = [
  {
    id: "all",
    name: "All Web",
    domains: [],
    description: "Search across the entire web",
    icon: "🌐",
  },
  {
    id: "reddit",
    name: "Reddit",
    domains: ["reddit.com"],
    description: "Search Reddit discussions and communities",
    icon: "🟠",
  },
  {
    id: "news",
    name: "News Sites",
    domains: ["cnn.com", "bbc.com", "reuters.com", "apnews.com", "npr.org"],
    description: "Search major news publications",
    icon: "📰",
  },
  {
    id: "academic",
    name: "Academic",
    domains: [
      "scholar.google.com",
      "arxiv.org",
      "pubmed.ncbi.nlm.nih.gov",
      "jstor.org",
    ],
    description: "Search academic papers and research",
    icon: "🎓",
  },
  {
    id: "tech",
    name: "Tech Sites",
    domains: [
      "stackoverflow.com",
      "github.com",
      "techcrunch.com",
      "arstechnica.com",
      "wired.com",
    ],
    description: "Search technology-focused websites",
    icon: "💻",
  },
];

const initialState: SearchState = {
  currentQuery: "",
  isSearching: false,
  searchStatus: "",
  currentResults: [],
  currentImages: [],
  currentAiResponse: "",
  isStreaming: false,
  progress: 0,
  messages: [],
  activeTab: "perplexity",
  searchSteps: [],
  selectedDomain: DOMAIN_OPTIONS[0], // Default to "All Web"
};

export function useSearch() {
  const [state, setState] = useState<SearchState>(initialState);

  const initializeSearchSteps = (query: string): SearchStep[] => {
    const startTime = Date.now();
    return [
      {
        id: "1",
        title: "Searching the web",
        status: "active",
        description: query,
        details: { startTime },
      },
      {
        id: "2",
        title: "Reading sources",
        status: "pending",
        details: { startTime },
      },
      {
        id: "3",
        title: "Generating response",
        status: "pending",
        details: { startTime },
      },
    ];
  };

  const updateSearchStep = (
    stepId: string,
    updates: Partial<SearchStep>,
    additionalDetails?: Record<string, number | string>
  ) => {
    setState((prev) => ({
      ...prev,
      searchSteps: prev.searchSteps.map((step) =>
        step.id === stepId
          ? {
              ...step,
              ...updates,
              details: {
                ...step.details,
                ...additionalDetails,
                endTime:
                  updates.status === "completed"
                    ? Date.now()
                    : step.details?.endTime,
                duration:
                  updates.status === "completed" && step.details?.startTime
                    ? Date.now() - step.details.startTime
                    : step.details?.duration,
              },
            }
          : step
      ),
    }));
  };

  const handleSearch = async () => {
    if (!state.currentQuery.trim() || state.isSearching) return;

    const searchSteps = initializeSearchSteps(state.currentQuery);
    let searchData: { results: SearchResult[]; images?: SearchImage[] } = {
      results: [],
    };

    // Clear previous state and initialize new search
    setState((prev) => ({
      ...prev,
      isSearching: true,
      searchStatus: "Searching the web...",
      currentResults: [],
      currentImages: [],
      currentAiResponse: "",
      searchSteps: [],
      progress: 10,
      activeTab: "perplexity",
    }));

    // Update with new search steps
    setState((prev) => ({
      ...prev,
      searchSteps,
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
        body: JSON.stringify({
          query: state.currentQuery,
          domains:
            state.selectedDomain.domains.length > 0
              ? state.selectedDomain.domains
              : undefined,
        }),
      });

      if (!searchResponse.ok) throw new Error("Search failed");

      searchData = await searchResponse.json();

      // Update step 1 as completed and step 2 as active
      updateSearchStep(
        "1",
        { status: "completed" },
        {
          sourcesFound: searchData.results.length,
        }
      );

      updateSearchStep("2", {
        status: "active",
        sources: searchData.results,
        description: `${searchData.results.length} sources found`,
      });

      setState((prev) => ({
        ...prev,
        currentResults: searchData.results,
        currentImages: searchData.images || [],
        searchStatus: "Reading sources...",
        progress: 60,
      }));

      // Step 2: Stream AI response
      updateSearchStep("2", { status: "completed" });
      updateSearchStep("3", { status: "active" });

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
          query: state.currentQuery,
          sources: searchData.results,
          messages: state.messages,
        }),
      });

      if (!aiResponse.ok) throw new Error("AI response failed");

      const reader = aiResponse.body?.getReader();
      const decoder = new TextDecoder();
      let aiResponseText = "";

      if (reader) {
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.trim() === "") continue;

            if (line.startsWith("0:")) {
              try {
                const content = JSON.parse(line.slice(2));
                if (typeof content === "string") {
                  aiResponseText += content;
                  setState((prev) => ({
                    ...prev,
                    currentAiResponse: aiResponseText,
                  }));
                }
              } catch (e) {
                console.log("Error parsing 0: line:", e);
              }
            } else if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.content) {
                  aiResponseText += data.content;
                  setState((prev) => ({
                    ...prev,
                    currentAiResponse: aiResponseText,
                  }));
                }
              } catch (e) {
                console.log("Error parsing data line:", e);
              }
            }
          }
        }
      }

      // Create properly completed steps with all details
      const endTime = Date.now();
      const completedSteps = state.searchSteps.map((step, idx) => {
        const duration = step.details?.startTime
          ? endTime - step.details.startTime
          : 0;

        // Build complete step details based on step type
        const stepDetails = {
          ...step.details,
          endTime,
          duration,
          status: "completed" as const,
          // Add step-specific details
          ...(idx === 0 && { sourcesFound: searchData.results.length }),
          ...(idx === 1 && { sourcesFound: searchData.results.length }),
          ...(idx === 2 && { responseLength: aiResponseText.length }),
        };

        return {
          ...step,
          status: "completed" as const,
          details: stepDetails,
          // Ensure sources are included for step 2
          ...(idx === 1 && { sources: searchData.results }),
        };
      });

      const newMessage: Message = {
        id: Date.now().toString(),
        query: state.currentQuery,
        results: searchData.results,
        images: searchData.images || [],
        aiResponse: aiResponseText,
        searchSteps: completedSteps,
        selectedDomain: state.selectedDomain,
        timestamp: new Date(),
      };

      setState((prev) => ({
        ...prev,
        isSearching: false,
        isStreaming: false,
        searchStatus: "Complete",
        progress: 100,
        messages: [...prev.messages, newMessage],
        activeTab: "perplexity",
        currentQuery: "",
        // Clear current search state to prevent duplicate display
        currentResults: [],
        currentImages: [],
        currentAiResponse: "",
        searchSteps: [],
      }));

      // Auto-focus the input
      setTimeout(() => {
        const textarea = document.querySelector("textarea");
        if (textarea) textarea.focus();
      }, 100);
    } catch (error) {
      console.error("Search error:", error);
      setState((prev) => ({
        ...prev,
        isSearching: false,
        isStreaming: false,
        searchStatus: "Error occurred",
        progress: 0,
      }));
    }
  };

  const updateQuery = (query: string) => {
    setState((prev) => ({ ...prev, currentQuery: query }));
  };

  const setActiveTab = (tab: SearchState["activeTab"]) => {
    setState((prev) => ({ ...prev, activeTab: tab }));
  };

  const updateSelectedDomain = (domain: DomainOption) => {
    setState((prev) => ({ ...prev, selectedDomain: domain }));
  };

  return {
    state,
    handleSearch,
    updateQuery,
    setActiveTab,
    updateSelectedDomain,
  };
}
