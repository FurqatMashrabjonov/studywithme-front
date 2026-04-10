"use client";

import React, { useEffect } from 'react';
import { ChatInput } from './ChatInput';
import { Sparkles, Search, Cog, Loader2, MoreVertical, MessageSquare, Bookmark, ThumbsUp, ThumbsDown, Copy } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useStore } from '@/store/useStore';
import { useChat } from '@/hooks/useChat';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
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
import {
  ChainOfThought,
  ChainOfThoughtHeader,
  ChainOfThoughtContent,
  ChainOfThoughtStep,
} from '@/components/ai/chain-of-thought';

const LoadingIcon = ({ className, ...props }: any) => <Loader2 className={cn("animate-spin", className)} {...props} />;

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
                        <p className="font-medium whitespace-pre-wrap">{message.message}</p>
                      ) : (
                        <div className="flex flex-col w-full">
                          {/* Chain of Thought (Fikrlash) */}
                          {message.steps && message.steps.length > 0 && (
                            <ChainOfThought defaultOpen={message.steps.some(s => s.finished === false)} className="mb-4 bg-muted/30 p-3 rounded-xl border border-muted/50">
                              <ChainOfThoughtHeader>Fikrlash jarayoni</ChainOfThoughtHeader>
                              <ChainOfThoughtContent>
                                {message.steps.map((step, sIdx) => (
                                  <ChainOfThoughtStep
                                    key={sIdx}
                                    label={step.text}
                                    icon={step.finished === false ? LoadingIcon : (step.type.includes('search') || step.type.includes('web') ? Search : Cog)}
                                    status={step.finished === false ? "active" : "complete"}
                                  />
                                ))}
                              </ChainOfThoughtContent>
                            </ChainOfThought>
                          )}

                          {/* Main Text Content */}
                          <div className="prose prose-sm md:prose-base max-w-none text-foreground/90 leading-loose">
                            <ReactMarkdown>{message.message}</ReactMarkdown>
                          </div>
                        </div>
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
