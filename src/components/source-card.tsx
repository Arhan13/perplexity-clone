import { Avatar, AvatarFallback } from "./ui/avatar";
import { SearchResult } from "../types/search";
import Image from "next/image";

interface SourceCardProps {
  result: SearchResult;
  index: number;
  compact?: boolean;
}

export function SourceCard({
  result,
  index,
  compact = false,
}: SourceCardProps) {
  // Extract domain for favicon
  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=16`;
    } catch {
      return null;
    }
  };

  const faviconUrl = getFaviconUrl(result.url);

  return (
    <a
      href={result.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex gap-2 p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 ${
        compact ? "min-h-[56px]" : "p-3 gap-3"
      }`}
    >
      {/* Index/Favicon */}
      <div className="flex items-center shrink-0">
        {faviconUrl ? (
          <div className="relative">
            <Avatar className="w-5 h-5">
              <AvatarFallback className="text-[10px] bg-slate-100 dark:bg-slate-700">
                {index + 1}
              </AvatarFallback>
            </Avatar>
            <Image
              width={20}
              height={20}
              src={faviconUrl}
              alt={`${result.domain} favicon`}
              className="absolute inset-0 w-5 h-5 rounded-full object-cover"
              onError={(e) => {
                // Hide favicon if it fails to load
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        ) : (
          <Avatar className="w-5 h-5">
            <AvatarFallback className="text-[10px] bg-slate-100 dark:bg-slate-700">
              {index + 1}
            </AvatarFallback>
          </Avatar>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="font-medium text-xs text-slate-900 dark:text-slate-100 line-clamp-2 leading-tight mb-1">
          {result.title}
        </div>
        <div className="text-[10px] text-blue-600 dark:text-blue-400 mb-1 truncate">
          {result.domain}
        </div>
        {!compact && (
          <div className="text-[10px] text-slate-600 dark:text-slate-400 line-clamp-1">
            {result.content.substring(0, 120)}...
          </div>
        )}
      </div>
    </a>
  );
}
