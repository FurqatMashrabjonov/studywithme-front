"use client"

import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

type MessageFrom = "user" | "assistant"

type MessageProps = ComponentProps<"div"> & {
  from: MessageFrom
}

export const Message = ({ from, className, ...props }: MessageProps) => {
  return (
    <div
      className={cn(
        "flex w-full mb-6",
        from === "user" ? "justify-end" : "justify-start",
        className,
      )}
      data-from={from}
      {...props}
    />
  )
}

type MessageContentProps = ComponentProps<"div"> & {
  from?: MessageFrom
}

export const MessageContent = ({ from = "assistant", className, ...props }: MessageContentProps) => {
  return (
    <div
      className={cn(
        "text-[15px] leading-relaxed relative",
        from === "user" 
          ? "bg-secondary text-secondary-foreground px-5 py-3.5 rounded-3xl rounded-tr-sm max-w-[85%] md:max-w-[75%]" 
          : "bg-background border shadow-sm rounded-2xl p-5 md:p-6 w-full max-w-full",
        className,
      )}
      {...props}
    />
  )
}
