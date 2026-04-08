"use client";

import React, { useEffect, useState } from 'react';
import { LeftSidebar } from './LeftSidebar';
import { RightSidebar } from './RightSidebar';
import { ChatArea } from '../chat/ChatArea';
import { useNotebooks } from '@/hooks/useNotebooks';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import {ChevronLeft, Share2, Settings, PanelLeft, PanelRight} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export const MainLayout: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchNotebooks, updateNotebook } = useNotebooks();
  const { currentNotebook, user, notebooks, setCurrentNotebook } = useStore();
  const [isEditingNotebookName, setIsEditingNotebookName] = useState(false);
  const [notebookNameDraft, setNotebookNameDraft] = useState('');
  const [isLeftOpen, setIsLeftOpen] = useState(true);
  const [isRightOpen, setIsRightOpen] = useState(true);

  useEffect(() => {
    if (notebooks.length === 0) {
      fetchNotebooks();
    } else if (id) {
      const nb = notebooks.find(n => (n.uid || n.notebook_uid) === id);
      if (nb) setCurrentNotebook(nb);
    }
  }, [id, notebooks, fetchNotebooks, setCurrentNotebook]);

  useEffect(() => {
    setNotebookNameDraft(currentNotebook?.name || '');
  }, [currentNotebook?.name]);

  const saveNotebookName = async () => {
    const uid = currentNotebook?.uid || currentNotebook?.notebook_uid;
    const nextName = notebookNameDraft.trim();

    setIsEditingNotebookName(false);

    if (!uid || !nextName || nextName === currentNotebook?.name) {
      setNotebookNameDraft(currentNotebook?.name || '');
      return;
    }

    try {
      await updateNotebook(uid, nextName);
    } catch {
      setNotebookNameDraft(currentNotebook?.name || '');
    }
  };

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background text-foreground">
      <header className="h-14 shrink-0 bg-slate-200 px-4 backdrop-blur">
        <div className="mx-auto flex h-full w-full items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="rounded-full"
              title="Bosh sahifa"
            >
              <ChevronLeft className="h-5 w-5 text-muted-foreground" />
            </Button>
            {isEditingNotebookName ? (
              <input
                autoFocus
                className="h-8 w-[260px] max-w-[42vw] rounded-md border bg-background px-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-ring"
                value={notebookNameDraft}
                onChange={(e) => setNotebookNameDraft(e.target.value)}
                onBlur={saveNotebookName}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveNotebookName();
                  if (e.key === 'Escape') {
                    setNotebookNameDraft(currentNotebook?.name || '');
                    setIsEditingNotebookName(false);
                  }
                }}
              />
            ) : (
              <h1
                className="max-w-[260px] cursor-text truncate text-sm font-semibold"
                onClick={() => {
                  if (!currentNotebook) return;
                  setNotebookNameDraft(currentNotebook.name || '');
                  setIsEditingNotebookName(true);
                }}
              >
                {currentNotebook?.name || 'Yuklanmoqda...'}
              </h1>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Share2 className="h-4 w-4 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Settings className="h-4 w-4 text-muted-foreground" />
            </Button>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {user?.name?.[0] || 'F'}
            </div>
          </div>
        </div>
      </header>

      <div className="min-h-0 flex-1 p-2 bg-slate-200">
        <ResizablePanelGroup orientation="horizontal" className="h-full w-full gap-2" id="main-layout-group">
        {isLeftOpen ? (
          <>
            <ResizablePanel defaultSize="28%" minSize="20%" maxSize="40%" id="left-sidebar-panel">
              <div className="h-full w-full min-h-0 min-w-0 overflow-hidden rounded-2xl border bg-background">
                <LeftSidebar onToggle={() => setIsLeftOpen(false)} />
              </div>
            </ResizablePanel>
            <ResizableHandle />
          </>
        ) : (
          <div className="flex h-full w-11 items-start justify-center border-r rounded-xl bg-background pt-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsLeftOpen(true)}
            >
              <PanelRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Main Content - Chat */}
        <ResizablePanel defaultSize="44%" minSize="30%" id="chat-content-panel">
          <main className="relative flex h-full w-full min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl border bg-background">
            <div className="relative min-h-0 flex-1 overflow-hidden">
              <ChatArea />
            </div>
          </main>
        </ResizablePanel>

        {isRightOpen ? (
          <>
            <ResizableHandle />
            <ResizablePanel defaultSize="28%" minSize="20%" maxSize="40%" id="right-sidebar-panel">
              <div className="h-full w-full min-h-0 min-w-0 overflow-hidden rounded-2xl border bg-background">
                <RightSidebar onToggle={() => setIsRightOpen(false)} />
              </div>
            </ResizablePanel>
          </>
        ) : (
          <div className="flex h-full w-11 items-start justify-center border-l bg-background rounded-xl pt-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsRightOpen(true)}
            >
              <PanelLeft className="h-4 w-4" />
            </Button>
          </div>
        )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
};
