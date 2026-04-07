"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Paperclip, Mic, Globe, ChevronDown } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';

export const ChatInput: React.FC = () => {
  const [value, setValue] = useState('');
  const [model, setModel] = useState('GPT-4o');
  const { sendMessage } = useChat();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [value]);

  const handleSend = async () => {
    if (!value.trim()) return;
    const msg = value;
    setValue('');
    try {
      await sendMessage(msg);
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
      setValue(msg);
    }
  };

  return (
    <div className="relative max-w-3xl mx-auto w-full group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-primary/10 rounded-[28px] blur opacity-0 group-focus-within:opacity-100 transition duration-1000"></div>
      
      <div className="relative bg-background border rounded-[26px] p-2 shadow-sm focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all">
        <div className="flex flex-col">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type your message..."
            className="w-full bg-transparent border-none focus:ring-0 text-[15px] text-foreground placeholder:text-muted-foreground resize-none min-h-[44px] max-h-[200px] py-3 px-4 leading-relaxed focus:outline-none"
            rows={1}
          />
          
          <div className="flex items-center justify-between mt-1 px-2 pb-1">
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground">
                <Paperclip className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground">
                <Mic className="w-4 h-4" />
              </Button>
              <div className="h-4 w-px bg-border mx-1"></div>
              <Button variant="ghost" className="h-8 px-3 rounded-full text-[11px] font-medium text-muted-foreground hover:text-foreground uppercase tracking-wider gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                 Qidiruv
              </Button>
              
              <div className="h-4 w-px bg-border mx-1"></div>
              
              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex h-8 px-3 items-center justify-center gap-1.5 rounded-full text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-accent border border-transparent hover:border-border transition-colors outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                    {model}
                    <ChevronDown className="w-3 h-3" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-40">
                  <DropdownMenuItem onClick={() => setModel('GPT-4o')} className="cursor-pointer">GPT-4o</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setModel('Claude 3.5')} className="cursor-pointer">Claude 3.5</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setModel('Gemini 2.0')} className="cursor-pointer">Gemini 2.0</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mr-1">
                0 sources
              </span>
              <button 
                onClick={handleSend}
                disabled={!value.trim()}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                  value.trim() 
                  ? 'bg-primary text-primary-foreground scale-100 shadow-md hover:opacity-90' 
                  : 'bg-muted text-muted-foreground scale-95 cursor-not-allowed'
                }`}
              >
                <ArrowUp className={`w-5 h-5 transition-transform duration-300 ${value.trim() ? 'translate-y-0' : 'translate-y-0.5'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
