'use client';

import { Message } from '@/lib/chat-storage';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface MessageProps {
  message: Message;
}

/** Renders a subset of markdown: **bold**, [text](url), and newlines. */
function MarkdownContent({ text, isUser }: { text: string; isUser: boolean }) {
  const linkClass = isUser
    ? 'underline text-blue-200 hover:text-white'
    : 'underline text-blue-600 dark:text-blue-400 hover:opacity-80';

  const lines = text.split('\n');

  const renderLine = (line: string, key: number) => {
    // Split on **bold** and [text](url) tokens
    const parts = line.split(/(\*\*\[[^\]]+\]\([^)]+\)\*\*|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
    return (
      <span key={key}>
        {parts.map((part, i) => {
          // Bold link: **[text](url)**
          const boldLink = part.match(/^\*\*\[([^\]]+)\]\(([^)]+)\)\*\*$/);
          if (boldLink)
            return (
              <a key={i} href={boldLink[2]} target="_blank" rel="noopener noreferrer" className={linkClass}>
                <strong>{boldLink[1]}</strong>
              </a>
            );
          // Bold: **text**
          const boldMatch = part.match(/^\*\*([^*]+)\*\*$/);
          if (boldMatch) return <strong key={i}>{boldMatch[1]}</strong>;
          // Link: [text](url)
          const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
          if (linkMatch)
            return (
              <a key={i} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" className={linkClass}>
                {linkMatch[1]}
              </a>
            );
          return <span key={i}>{part}</span>;
        })}
      </span>
    );
  };

  return (
    <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
      {lines.map((line, i) => (
        <span key={i}>
          {renderLine(line, i)}
          {i < lines.length - 1 && <br />}
        </span>
      ))}
    </p>
  );
}

export function ChatMessage({ message }: MessageProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 mb-4 animate-in fade-in ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg group relative ${
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
        }`}
      >
        <MarkdownContent text={message.content} isUser={isUser} />
        
        {!isUser && (
          <button
            onClick={copyToClipboard}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-300 dark:hover:bg-gray-600 rounded"
            title="Copy message"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        )}
        
        <span className="text-xs opacity-70 block mt-1">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </div>
  );
}
