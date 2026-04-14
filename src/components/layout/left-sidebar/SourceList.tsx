import React from 'react';
import { FileText, Check } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

interface SourceListProps {
  sources: any[];
  selectedIds: number[];
  isLoading: boolean;
  onToggle: (id: number) => void;
}

export const SourceList: React.FC<SourceListProps> = ({ sources, selectedIds, isLoading, onToggle }) => {
  if (isLoading) {
    return (
      <div className="space-y-1.5">
         {Array.from({ length: 4 }).map((_, i) => (
           <div key={i} className="flex w-full items-center gap-3 rounded-xl border bg-background px-3 py-2.5 text-left">
              <Skeleton className="h-5 w-5 rounded shrink-0" />
              <Skeleton className="h-4 w-4 rounded-full shrink-0" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-[90%]" />
                <Skeleton className="h-3 w-[50%]" />
              </div>
           </div>
         ))}
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {sources.map((source) => {
        const checked = selectedIds.includes(source.id);
        return (
          <button
            key={source.id}
            onClick={() => onToggle(source.id)}
            className="flex w-full items-center gap-3 rounded-xl border bg-background px-3 py-2.5 text-left hover:bg-muted/40"
          >
            <div className={`flex h-5 w-5 items-center justify-center rounded border ${checked ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border'}`}>
              {checked ? <Check className="h-3.5 w-3.5" /> : null}
            </div>
            <FileText className="h-4 w-4 text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{source.name}</p>
              <p className="text-xs text-muted-foreground">{source.type}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
};
