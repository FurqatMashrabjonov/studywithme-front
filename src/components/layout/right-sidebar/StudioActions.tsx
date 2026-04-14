import React from 'react';
import { ChevronRight, BrainCircuit, BarChart3, Presentation, Sparkles, Video, FileText } from 'lucide-react';

const studioActions = [
  { id: 'audio', icon: Sparkles, label: 'Audio tahlil', color: 'bg-blue-100 text-blue-700' },
  { id: 'slide', icon: Presentation, label: 'Prezentatsiya', color: 'bg-amber-100 text-amber-700' },
  { id: 'video', icon: Video, label: 'Video sharh', color: 'bg-emerald-100 text-emerald-700' },
  { id: 'mind', icon: BrainCircuit, label: 'Aqliy xarita', color: 'bg-fuchsia-100 text-fuchsia-700' },
  { id: 'report', icon: BarChart3, label: 'Hisobot', color: 'bg-sky-100 text-sky-700' },
  { id: 'cards', icon: FileText, label: 'Kartochkalar', color: 'bg-rose-100 text-rose-700' },
];

export const StudioActions: React.FC = () => {
  return (
    <div className="grid grid-cols-2 gap-2">
      {studioActions.map((item) => {
        const Icon = item.icon;
        return (
          <button key={item.id} className="flex items-center justify-between rounded-xl border bg-background px-3 py-2.5 text-left hover:bg-muted/40">
            <div className="flex items-center gap-2">
              <div className={`flex h-7 w-7 items-center justify-center rounded-md ${item.color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <span className="text-xs font-medium leading-tight">{item.label}</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        );
      })}
    </div>
  );
};
