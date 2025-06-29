export interface SearchResult {
  title: string;
  url: string;
  content: string;
  domain: string;
}

export interface DomainOption {
  id: string;
  name: string;
  domains: string[];
  description: string;
  icon: string;
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
  selectedDomain: DomainOption;
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
  activeTab: "perplexity" | "sources";
  searchSteps: SearchStep[];
  selectedDomain: DomainOption;
}

export type TabType = "perplexity" | "sources";
