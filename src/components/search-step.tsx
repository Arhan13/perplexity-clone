import { SearchStep as SearchStepType } from "../types/search";
import { getSourceIcon, formatDuration } from "../utils/helpers";

interface SearchStepProps {
  step: SearchStepType;
  isLast?: boolean;
}

export function SearchStep({ step, isLast = false }: SearchStepProps) {
  const getStatusColor = (status: SearchStepType["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "active":
        return "bg-blue-500";
      default:
        return "bg-slate-300 dark:bg-slate-600";
    }
  };

  const getStatusTextColor = (status: SearchStepType["status"]) => {
    switch (status) {
      case "completed":
        return "text-green-700 dark:text-green-400";
      case "active":
        return "text-blue-700 dark:text-blue-400";
      default:
        return "text-slate-500 dark:text-slate-400";
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div
          className={`w-3 h-3 rounded-full ${getStatusColor(
            step.status
          )} relative`}
        >
          {step.status === "active" && (
            <div className="absolute inset-0 w-3 h-3 rounded-full bg-blue-400 animate-ping" />
          )}
        </div>
        <div className="flex-1 flex items-center justify-between">
          <span
            className={`text-sm font-medium ${getStatusTextColor(step.status)}`}
          >
            {step.title}
          </span>
          {step.details?.duration && step.status === "completed" && (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {formatDuration(step.details.duration)}
            </span>
          )}
        </div>
      </div>

      {/* Step Description */}
      {step.description && (
        <div className="ml-6 text-sm text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span>🔍</span>
            <span className="font-mono text-xs">{step.description}</span>
          </div>
        </div>
      )}

      {/* Enhanced Details for Completed Steps */}
      {step.status === "completed" && step.details && (
        <div className="ml-6 space-y-2">
          {/* Search Results Summary */}
          {step.id === "1" && step.details.sourcesFound && (
            <div className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <span>📊</span>
                <span className="font-medium">Search Results</span>
              </div>
              <div className="space-y-1">
                <div>
                  • Found {step.details.sourcesFound} high-quality sources
                </div>
                <div>• Search depth: Advanced</div>
                <div>• Query processed successfully</div>
              </div>
            </div>
          )}

          {/* Source Processing Summary */}
          {step.id === "2" && step.sources && (
            <div className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <span>📚</span>
                <span className="font-medium">Source Analysis</span>
              </div>
              <div className="space-y-1 mb-3">
                <div>• Analyzed {step.sources.length} sources</div>
                <div>• Content extracted and ranked</div>
                <div>• Prepared for AI synthesis</div>
              </div>

              {/* Top Sources Preview */}
              <div className="space-y-1">
                <div className="font-medium text-slate-700 dark:text-slate-300">
                  Top Sources:
                </div>
                {step.sources.slice(0, 3).map((source, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs">
                      {getSourceIcon(source.domain)}
                    </div>
                    <span className="truncate flex-1">
                      {source.title} - {source.domain}
                    </span>
                  </div>
                ))}
                {step.sources.length > 3 && (
                  <div className="text-slate-500 dark:text-slate-400 ml-6">
                    +{step.sources.length - 3} more sources
                  </div>
                )}
              </div>
            </div>
          )}

          {/* AI Generation Summary */}
          {step.id === "3" && step.details.responseLength && (
            <div className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <span>🤖</span>
                <span className="font-medium">AI Response Generation</span>
              </div>
              <div className="space-y-1">
                <div>
                  • Response length: {step.details.responseLength} characters
                </div>
                <div>• Model: GPT-4o with streaming</div>
                <div>• Citations automatically linked</div>
                <div>• Content formatted with markdown</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Progress indicator line for non-last steps */}
      {!isLast && (
        <div className="ml-1.5 w-0.5 h-4 bg-slate-200 dark:bg-slate-700" />
      )}
    </div>
  );
}
