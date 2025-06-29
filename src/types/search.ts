export interface SearchResult {
  title: string;
  url: string;
  content: string;
  domain: string;
}

export interface SearchStep {
  id: string;
  title: string;
  status: "pending" | "active" | "completed";
  description?: string;
  sources?: SearchResult[];
  details?: {
    duration?: number;
    sourcesFound?: number;
    responseLength?: number;
    startTime?: number;
    endTime?: number;
  };
}

export interface Message {
  id: string;
  query: string;
  results: SearchResult[];
  aiResponse: string;
  searchSteps: SearchStep[];
  timestamp: Date;
}

export interface SearchState {
  currentQuery: string;
  isSearching: boolean;
  searchStatus: string;
  currentResults: SearchResult[];
  currentAiResponse: string;
  isStreaming: boolean;
  progress: number;
  messages: Message[];
  activeTab: "perplexity" | "sources" | "steps";
  searchSteps: SearchStep[];
}

export type TabType = "perplexity" | "sources" | "steps";
