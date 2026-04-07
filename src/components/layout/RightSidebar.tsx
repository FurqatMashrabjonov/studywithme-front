"use client";

import React, { useEffect, useState } from 'react';
import { BrainCircuit, ChevronRight, FileText, BarChart3, Presentation, Sparkles, Video, Trash2, ArrowLeft, MoreVertical, Edit2 } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { useNotes } from '@/hooks/useNotes';
import { useStore } from '@/store/useStore';
import { toast } from 'sonner';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const studioActions = [
  { id: 'audio', icon: Sparkles, label: 'Audio tahlil', color: 'bg-blue-100 text-blue-700' },
  { id: 'slide', icon: Presentation, label: 'Prezentatsiya', color: 'bg-amber-100 text-amber-700' },
  { id: 'video', icon: Video, label: 'Video sharh', color: 'bg-emerald-100 text-emerald-700' },
  { id: 'mind', icon: BrainCircuit, label: 'Aqliy xarita', color: 'bg-fuchsia-100 text-fuchsia-700' },
  { id: 'report', icon: BarChart3, label: 'Hisobot', color: 'bg-sky-100 text-sky-700' },
  { id: 'cards', icon: FileText, label: 'Kartochkalar', color: 'bg-rose-100 text-rose-700' },
];

type EditableNote = {
  id: number;
  name?: string;
  title?: string;
  content?: string;
  created_at_formatted?: string;
};

interface RightSidebarProps {
  onToggle?: () => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({ onToggle }) => {
  const { notes, currentNotebook } = useStore();
  const { fetchNotes, createNote, updateNote, deleteNote } = useNotes();
  const [activeNote, setActiveNote] = useState<EditableNote | null>(null);

  useEffect(() => {
    if (currentNotebook) {
      fetchNotes();
    }
  }, [currentNotebook, fetchNotes]);

  const handleAddNote = async () => {
    try {
      const newNote = await createNote();
      toast.success('Eslatma yaratildi');
      setActiveNote(newNote);
    } catch {
      toast.error('Eslatma yaratishda xatolik yuz berdi');
    }
  };

  const handleDeleteNote = async (noteId: number) => {
    if (!confirm('Eslatmani o\'chirmoqchimisiz?')) return;
    try {
      await deleteNote(noteId);
      toast.success('Eslatma o\'chirildi');
      if (activeNote?.id === noteId) setActiveNote(null);
    } catch {
      toast.error('Eslatmani o\'chirishda xatolik');
    }
  };

  const handleSaveContent = async (content: string) => {
    if (!activeNote) return;
    try {
      await updateNote(activeNote.id, activeNote.name || activeNote.title, content);
      setActiveNote(prev => prev ? { ...prev, content } : null);
    } catch {
      toast.error('Saqlashda xatolik');
    }
  };

  if (activeNote) {
    return (
      <aside className="flex h-full w-full min-h-0 flex-col bg-background">
        <div className="flex items-center gap-2 border-b px-4 py-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setActiveNote(null)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="flex-1 text-sm font-semibold truncate">Eslatmani tahrirlash</h2>
        </div>
        <div className="flex-1 p-4">
           <input 
             className="w-full text-lg font-bold outline-none mb-4"
             value={activeNote.name || activeNote.title || ''}
             onChange={(e) => setActiveNote({...activeNote, name: e.target.value})}
             onBlur={() => updateNote(activeNote.id, activeNote.name || activeNote.title, activeNote.content)}
           />
           <textarea 
             className="w-full h-[calc(100%-60px)] resize-none outline-none text-sm text-muted-foreground"
             placeholder="Eslatma mazmunini kiriting (markdown)..."
             value={activeNote.content || ''}
             onChange={(e) => handleSaveContent(e.target.value)}
           />
        </div>
      </aside>
    );
  }

  return (
    <aside className="flex h-full w-full min-h-0 flex-col bg-muted/30">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h2 className="text-base font-semibold">Studiya</h2>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onToggle} title="O'ng panelni yopish">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="min-h-0 flex-1 px-3 py-3">
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

        <div className="my-4 border-t" />

        <div className="space-y-2">
          {notes.map((note) => (
            <div 
              key={note.id} 
              className="group flex items-center gap-3 rounded-xl border bg-background px-3 py-3 hover:bg-muted/40 cursor-pointer transition-colors" 
              onClick={() => setActiveNote(note)}
            >
              <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium leading-none">{note.title || note.name || 'Nomsiz eslatma'}</p>
                <p className="text-xs text-muted-foreground mt-1.5">{note.created_at_formatted || 'Yaqinda'}</p>
              </div>
              <DropdownMenu>
              <DropdownMenuTrigger onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setActiveNote(note)}>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Nomini o'zgartirish
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive" onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNote(note.id);
                  }}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      O'chirish
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="border-t p-3">
        <Button variant="outline" className="h-10 w-full justify-center gap-2 rounded-xl bg-background hover:bg-muted" onClick={handleAddNote}>
          Eslatma qo'shish
        </Button>
      </div>
    </aside>
  );
};
