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
        "flex w-full",
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
        "max-w-[90%] rounded-2xl border px-4 py-3 text-sm leading-relaxed md:max-w-[82%]",
        from === "user"
          ? "rounded-br-md border-primary/25 bg-primary/10"
          : "rounded-bl-md bg-background",
        className,
      )}
      {...props}
    />
  )
}
