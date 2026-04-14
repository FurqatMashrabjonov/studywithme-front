import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from "@/components/ui/skeleton";
import { MarkdownEditor } from '@/components/ui/markdown-editor';

interface NoteEditorProps {
  activeNote: any;
  activeContent: string;
  isNoteLoading: boolean;
  setActiveNote: (note: any) => void;
  setActiveContent: (content: string) => void;
  updateNote: (id: number, title: string, content: string) => void;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({ 
    activeNote, 
    activeContent, 
    isNoteLoading, 
    setActiveNote, 
    setActiveContent, 
    updateNote 
}) => {
  return (
    <aside className="flex h-full w-full min-h-0 flex-col bg-background">
      <div className="flex items-center gap-2 border-b px-4 py-3">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setActiveNote(null)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="flex-1 text-sm font-semibold truncate">Qaydni tahrirlash</h2>
      </div>
      <div className="flex-1 p-4 flex flex-col min-h-0">
         {isNoteLoading ? (
             <div className="space-y-4">
                 <Skeleton className="h-8 w-3/4 mb-4" />
                 <Skeleton className="h-4 w-full" />
                 <Skeleton className="h-4 w-[90%]" />
                 <Skeleton className="h-4 w-full" />
                 <Skeleton className="h-4 w-[85%]" />
                 <Skeleton className="h-4 w-full" />
                 <Skeleton className="h-4 w-[60%]" />
             </div>
         ) : (
             <>
                 <input 
                   className="w-full text-lg font-bold outline-none mb-4"
                   value={activeNote.name || activeNote.title || ''}
                   onChange={(e) => setActiveNote({...activeNote, name: e.target.value})}
                   onBlur={() => updateNote(activeNote.id, activeNote.name || activeNote.title, activeContent)}
                 />
                 <MarkdownEditor
                   value={activeContent}
                   onChange={(content) => setActiveContent(content)}
                 />
             </>
         )}
      </div>
    </aside>
  );
};
