"use client";

import { useMemo } from 'react';
import "easymde/dist/easymde.min.css";
import SimpleMDE from 'react-simplemde-editor';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const MarkdownEditor = ({ value, onChange, placeholder }: MarkdownEditorProps) => {
  const options = useMemo(() => ({
    autofocus: true,
    spellChecker: false,
    placeholder: placeholder || "Qayd mazmunini kiriting...",
    status: false,
    toolbar: ["bold", "italic", "heading", "|", "quote", "unordered-list", "ordered-list", "|", "link", "preview"] as any,
  }), [placeholder]);

  return (
    <div className="markdown-editor-wrapper">
      <SimpleMDE value={value} onChange={onChange} options={options} />
    </div>
  );
};

