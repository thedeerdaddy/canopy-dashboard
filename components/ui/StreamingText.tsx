"use client";

import { useEffect, useRef, useState } from "react";

interface StreamingTextProps {
  stream: ReadableStream | null;
  onComplete?: (text: string) => void;
  className?: string;
  placeholder?: string;
}

export function StreamingText({ stream, onComplete, className, placeholder }: StreamingTextProps) {
  const [text, setText] = useState("");
  const [streaming, setStreaming] = useState(false);
  const fullText = useRef("");

  useEffect(() => {
    if (!stream) return;

    fullText.current = "";
    setText("");
    setStreaming(true);

    const reader = stream.getReader();
    const decoder = new TextDecoder();

    async function read() {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;
              try {
                const parsed = JSON.parse(data);
                if (parsed.type === "content_block_delta" && parsed.delta?.text) {
                  fullText.current += parsed.delta.text;
                  setText(fullText.current);
                }
              } catch {}
            }
          }
        }
      } finally {
        setStreaming(false);
        onComplete?.(fullText.current);
      }
    }

    read();
  }, [stream]);

  if (!text && !streaming) {
    return <p className={`text-gray-400 italic ${className}`}>{placeholder || "Waiting..."}</p>;
  }

  return (
    <div className={className}>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">{text}</p>
      {streaming && (
        <span className="inline-block w-0.5 h-4 bg-purple-500 animate-pulse ml-0.5 align-middle" />
      )}
    </div>
  );
}
