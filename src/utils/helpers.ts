export function getSourceIcon(domain: string): string {
  if (domain.includes("apple")) return "🍎";
  if (domain.includes("linkedin")) return "💼";
  if (domain.includes("twitter") || domain.includes("x.com")) return "𝕏";
  if (domain.includes("github")) return "⚡";
  if (domain.includes("reddit")) return "📱";
  if (domain.includes("youtube")) return "📺";
  if (domain.includes("wikipedia")) return "📚";
  return "🌐";
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export function formatTimestamp(timestamp: Date): string {
  return timestamp.toLocaleTimeString();
}
