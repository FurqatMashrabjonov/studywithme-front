"use client";

import React, { useMemo, useState } from 'react';
import {Search, Plus, Globe, Zap, PanelLeft} from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { Skeleton } from "@/components/ui/skeleton";
import { SourceList } from './left-sidebar/SourceList';

const fakeSources = [
  { id: 1, name: 'FastAPI arxitekturasi bo\'yicha maqola', type: 'Maqola' },
  { id: 2, name: 'SQLAlchemy amaliy qo\'llanma', type: 'Hujjat' },
  { id: 3, name: 'Dependency Injection izohi', type: 'Maqola' },
  { id: 4, name: 'Production best practices', type: 'Hisobot' },
  { id: 5, name: 'Async va background tasks', type: 'Maqola' },
  { id: 6, name: 'Migration strategiyasi', type: 'Hujjat' },
];

interface LeftSidebarProps {
  onToggle?: () => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({ onToggle }) => {
  const { isLoading } = useStore();
  const [query, setQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([1, 2]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return fakeSources;
    return fakeSources.filter((s) => s.name.toLowerCase().includes(q));
  }, [query]);

  const toggle = (id: number) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  return (
    <aside className="flex h-full w-full min-h-0 flex-col bg-background/50">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h2 className="text-base font-semibold">Manbalar</h2>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onToggle}
          title="Chap panelni yopish"
        >
          <PanelLeft className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-3 px-4 py-3">
        <Button className="h-10 w-full justify-center gap-2 rounded-xl" variant="outline">
          <Plus className="h-4 w-4" />
          Manba qo'shish
        </Button>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Manbalardan qidiring"
            className="h-10 w-full rounded-xl border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 rounded-lg">
            <Globe className="h-3.5 w-3.5" />
            Internet
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 rounded-lg">
            <Zap className="h-3.5 w-3.5" />
            Tez qidiruv
          </Button>
        </div>
      </div>

      <div className="px-4 pb-2 text-xs font-medium text-muted-foreground">
        {isLoading ? <Skeleton className="h-3 w-32" /> : `Tanlangan manbalar: ${selectedIds.length}`}
      </div>

      <ScrollArea className="min-h-0 flex-1 px-3 pb-3">
        <SourceList 
          sources={filtered} 
          selectedIds={selectedIds} 
          isLoading={isLoading} 
          onToggle={toggle} 
        />
      </ScrollArea>
    </aside>
  );
};
