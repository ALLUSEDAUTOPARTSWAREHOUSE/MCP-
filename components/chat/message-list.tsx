'use client';

import { useEffect, useRef } from 'react';
import { Message } from '@/lib/chat-storage';
import { ChatMessage } from './message';

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

export function MessageList({ messages, isLoading = false }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="h-full flex items-center justify-center text-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Start a Conversation
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-md">
              Ask me anything about your needs. I&apos;m here to help!
            </p>
          </div>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="flex gap-3 mb-4">
              <div className="max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
}
