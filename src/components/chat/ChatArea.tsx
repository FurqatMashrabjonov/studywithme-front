"use client";

import React, { useEffect } from 'react';
import { ChatInput } from './ChatInput';
import { ThumbsUp, ThumbsDown, Copy, Bookmark, Sparkles, MessageSquare, MoreVertical } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useStore } from '@/store/useStore';
import { useChat } from '@/hooks/useChat';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from '@/components/ai/conversation';
import { Message, MessageContent } from '@/components/ai/message';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const ChatArea: React.FC = () => {
  const { chatHistory, currentNotebook, isLoading, setChatHistory } = useStore();
  const { fetchHistory } = useChat();

  useEffect(() => {
    if (currentNotebook) {
      fetchHistory();
    }
  }, [currentNotebook, fetchHistory]);

  const suggestions = [
    'Summarize all uploaded sources',
    'What are the key topics discussed?',
    'Create a study plan from this material',
    'Find conflicts between these sources'
  ];

  const clearChat = () => {
    setChatHistory([]);
    toast.success('Chat cleared');
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <div className="sticky top-0 z-10 border-b bg-background/90 px-4 py-2 backdrop-blur ">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <p className="text-sm font-semibold">Chat</p>
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-md p-2 hover:bg-muted">
              <MoreVertical className="h-4 w-4 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={clearChat}
              >
                Clear chat
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Conversation className="min-h-0 flex-1 px-4 md:px-8">
        <ConversationContent className="mx-auto w-full max-w-3xl py-8">
          {(!chatHistory || chatHistory.length === 0) && !isLoading ? (
            <ConversationEmptyState
              icon={<Sparkles className="size-6" />}
              title="No messages yet"
              description="Start a conversation to see messages here"
            >
              <div className="flex flex-col items-center justify-center text-center space-y-8 pt-12">
                <div className="h-16 w-16 rounded-3xl bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-foreground">No messages yet</h3>
                  <p className="mx-auto max-w-md text-muted-foreground leading-relaxed">
                    Start a conversation to see messages here
                  </p>
                </div>

                <div className="mt-8 grid w-full max-w-2xl grid-cols-1 gap-3 md:grid-cols-2">
                  {suggestions.map((s, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      className="h-auto rounded-2xl bg-background px-6 py-4 justify-start text-left group shadow-sm transition-all hover:bg-muted"
                    >
                      <div className="flex items-start gap-4">
                        <MessageSquare className="mt-0.5 h-5 w-5 text-primary/50 transition-colors group-hover:text-primary" />
                        <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground">{s}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </ConversationEmptyState>
          ) : (
            <>
              {chatHistory?.map((message, index) => {
                const from = message.role === 'user' ? 'user' : 'assistant';
                return (
                  <Message from={from} key={index} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <MessageContent from={from} className={from === 'assistant' ? 'space-y-4 shadow-sm' : ''}>
                      {from === 'user' ? (
                        <p className="text-[15px] font-medium leading-relaxed text-foreground">{message.message}</p>
                      ) : (
                        <>
                          <div className="mb-2 flex items-center gap-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary">
                              <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Study with me</span>
                          </div>

                          <div className="prose prose-sm max-w-none space-y-4 text-foreground/80 leading-relaxed">
                            <ReactMarkdown>{message.message}</ReactMarkdown>
                          </div>

                          <div className="mt-4 flex items-center justify-between border-t pt-4">
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="sm" className="h-8 rounded-full px-3 text-xs text-muted-foreground hover:text-foreground gap-1.5">
                                <Bookmark className="h-3.5 w-3.5" />
                                Save to notes
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground">
                                <Copy className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground">
                                <ThumbsUp className="h-3.5 w-3.5" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground">
                                <ThumbsDown className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        </>
                      )}
                    </MessageContent>
                  </Message>
                );
              })}

              {isLoading && (
                <Message from="assistant" className="animate-pulse">
                  <MessageContent from="assistant" className="w-[260px] space-y-2">
                    <div className="h-2 w-48 rounded-full bg-muted" />
                    <div className="h-2 w-32 rounded-full bg-muted" />
                  </MessageContent>
                </Message>
              )}
            </>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="px-4 md:px-8 pb-6 pt-2 bg-gradient-to-t from-background via-background to-transparent">
        <ChatInput />
        <p className="text-[10px] text-center text-muted-foreground mt-4 font-medium tracking-wide">
           AI can make mistakes. Always verify important information.
        </p>
      </div>
    </div>
  );
};
