"use client";

import MarkdownRenderer from "@/components/markdown/MarkdownRenderer";

interface MessageContentProps {
  content: string;
}

export function MessageContent({ content }: MessageContentProps) {
  return <MarkdownRenderer content={content} />;
}
