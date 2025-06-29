import { SearchResult } from "../types/search";

export const preprocessCitations = (text: string, results: SearchResult[]) => {
  return text.replace(/\[(\d+)\]/g, (match, num) => {
    const index = parseInt(num) - 1;
    if (index >= 0 && index < results.length) {
      return `[${num}](citation-${index})`;
    }
    return match;
  });
};
