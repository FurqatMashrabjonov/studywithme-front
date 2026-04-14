import React from 'react';
import { GalleryVerticalEnd, FileText, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface NoteListProps {
  notes: any[];
  isLoading: boolean;
  onSelectNote: (note: any) => void;
  onDeleteNote: (noteId: number) => void;
}

export const NoteList: React.FC<NoteListProps> = ({ notes, isLoading, onSelectNote, onDeleteNote }) => {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl border bg-background px-3 py-3">
            <Skeleton className="h-10 w-10 rounded-md shrink-0" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-[80%]" />
              <Skeleton className="h-3 w-[40%]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {notes.map((note) => (
        <div 
          key={note.id} 
          className="group flex items-center gap-3 rounded-xl border bg-background px-3 py-3 hover:bg-muted/40 cursor-pointer transition-colors" 
          onClick={() => onSelectNote(note)}
        >
          {note.type === 'flashcard' ? (
              <GalleryVerticalEnd className="h-5 w-5 text-muted-foreground shrink-0" />
          ) : (
              <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium leading-none">{note.title || note.name || 'Nomsiz qayd'}</p>
            <p className="text-xs text-muted-foreground mt-1.5">{note.created_at_formatted || 'Yaqinda'}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger onClick={(e) => { e.stopPropagation(); }}>
                <div className="h-8 w-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <MoreVertical className="h-4 w-4" />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onSelectNote(note)}>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Nomini o'zgartirish
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onClick={(e) => {
                  e.stopPropagation();
                  onDeleteNote(note.id);
              }}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  O'chirish
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
    </div>
  );
};
