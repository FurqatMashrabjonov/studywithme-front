"use client";

import React, { useEffect, useState } from 'react';
import { PanelRight } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { useNotes } from '@/hooks/useNotes';
import { useStore } from '@/store/useStore';
import { toast } from 'sonner';
import { FlashcardPlayer } from '../chat/FlashcardPlayer';
import { Skeleton } from "@/components/ui/skeleton";
import { StudioActions } from './right-sidebar/StudioActions';
import { NoteList } from './right-sidebar/NoteList';
import { NoteEditor } from './right-sidebar/NoteEditor';

type EditableNote = {
  id: number;
  name?: string;
  title?: string;
  content?: string;
  type?: 'note' | 'flashcard';
  created_at_formatted?: string;
};

interface RightSidebarProps {
  onToggle?: () => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({ onToggle }) => {
  const { notes, currentNotebook, isLoading } = useStore();
  const { fetchNotes, createNote, updateNote, deleteNote, fetchNote, fetchFlashcard } = useNotes();
  const [activeNote, setActiveNote] = useState<EditableNote | null>(null);
  const [activeContent, setActiveContent] = useState('');
  const [activeCards, setActiveCards] = useState<any[]>([]);
  const [isNoteLoading, setIsNoteLoading] = useState(false);

  useEffect(() => {
    if (currentNotebook) fetchNotes();
  }, [currentNotebook, fetchNotes]);

  useEffect(() => {
    if (activeNote && activeNote.id) {
      if (activeNote.type === 'flashcard' && activeCards.length === 0) {
        setIsNoteLoading(true);
        fetchFlashcard(activeNote.id).then(data => {
           if (data && data.cards) {
               setActiveNote(prev => prev ? {...prev, title: data.title} : null);
               setActiveCards(data.cards);
           }
           setIsNoteLoading(false);
        });
      } else if (activeNote.type !== 'flashcard' && activeNote.content === undefined) {
        setIsNoteLoading(true);
        fetchNote(activeNote.id).then(fullNote => {
          if (fullNote) {
              setActiveNote(fullNote);
              setActiveContent(fullNote.content || '');
          }
          setIsNoteLoading(false);
        });
      }
    }
  }, [activeNote?.id, activeNote?.type, fetchNote, fetchFlashcard]);

  useEffect(() => {
    if (!activeNote || activeNote.type === 'flashcard') return;
    
    const handler = setTimeout(() => {
      if (activeContent !== activeNote.content) {
        updateNote(activeNote.id, activeNote.name || activeNote.title, activeContent);
      }
    }, 2000);

    return () => clearTimeout(handler);
  }, [activeContent, activeNote, updateNote]);

  const handleAddNote = async () => {
    try {
      const newNote = await createNote();
      if (newNote) {
        toast.success('Qayd yaratildi');
        setActiveNote(newNote);
        setActiveContent(newNote.content || '');
      }
    } catch (error) {
      toast.error('Qayd yaratishda xatolik yuz berdi');
    }
  };

  const handleDeleteNote = async (noteId: number) => {
    if (!confirm('Qaydni o\'chirmoqchimisiz?')) return;
    try {
      await deleteNote(noteId);
      toast.success('Qayd o\'chirildi');
      if (activeNote?.id === noteId) {
        setActiveNote(null);
        setActiveContent('');
      }
    } catch {
      toast.error('Qaydni o\'chirishda xatolik');
    }
  };

  if (activeNote) {
    if (activeNote.type === 'flashcard') {
        return (
            <aside className="flex h-full w-full min-h-0 flex-col bg-background">
                {isNoteLoading ? (
                    <div className="flex-1 flex flex-col p-4 gap-4">
                        <div className="flex items-center gap-2 border-b pb-3">
                           <Skeleton className="h-8 w-8 rounded-md" />
                           <Skeleton className="h-5 w-[150px]" />
                        </div>
                        <div className="flex-1 flex items-center justify-center">
                            <Skeleton className="w-full max-w-md aspect-[4/5] rounded-[32px]" />
                        </div>
                        <div className="flex items-center gap-4 w-full max-w-md mx-auto justify-between px-2 pb-4">
                           <Skeleton className="h-12 w-12 rounded-full" />
                           <Skeleton className="h-12 w-32 rounded-full" />
                           <Skeleton className="h-12 w-12 rounded-full" />
                        </div>
                    </div>
                ) : (
                    <FlashcardPlayer 
                        title={activeNote.title || activeNote.name || 'Flashcard'} 
                        cards={activeCards} 
                        onBack={() => setActiveNote(null)} 
                        onDelete={() => handleDeleteNote(activeNote.id)}
                    />
                )}
            </aside>
        );
    }

    return (
      <NoteEditor
        activeNote={activeNote}
        activeContent={activeContent}
        isNoteLoading={isNoteLoading}
        setActiveNote={setActiveNote}
        setActiveContent={setActiveContent}
        updateNote={updateNote}
      />
    );
  }

  return (
    <aside className="flex h-full w-full min-h-0 flex-col bg-background/50">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h2 className="text-base font-semibold">Studiya</h2>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onToggle} title="O'ng panelni yopish">
          <PanelRight className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="min-h-0 flex-1 px-3 py-3">
        <StudioActions />

        <div className="my-4 border-t" />

        <NoteList 
          notes={notes} 
          isLoading={isLoading} 
          onSelectNote={setActiveNote} 
          onDeleteNote={handleDeleteNote} 
        />
      </ScrollArea>

      <div className="border-t p-3">
        <Button variant="outline" className="h-10 w-full justify-center gap-2 rounded-xl bg-background hover:bg-muted" onClick={handleAddNote}>
          Qayd qo'shish
        </Button>
      </div>
    </aside>
  );
};
