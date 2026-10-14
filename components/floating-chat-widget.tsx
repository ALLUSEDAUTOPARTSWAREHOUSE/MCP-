'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Trash2, Download, History } from 'lucide-react';
import { ChatSession, Message, chatStorage } from '@/lib/chat-storage';
import Link from 'next/link';

export function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentChat, setCurrentChat] = useState<ChatSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      initializeChat();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeChat = () => {
    const currentId = chatStorage.getCurrentChatId();
    if (currentId) {
      const chat = chatStorage.getChat(currentId);
      if (chat) {
        setCurrentChat(chat);
        return;
      }
    }
    createNewChat();
  };

  const createNewChat = () => {
    const newChat = chatStorage.createChat();
    setCurrentChat(newChat);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userMessage.trim() || !currentChat || isLoading) return;

    const userMsg = userMessage.trim();
    setUserMessage('');
    setIsLoading(true);

    try {
      const updatedChat = chatStorage.addMessage(currentChat.id, {
        role: 'user',
        content: userMsg,
      });
      if (!updatedChat) {
        setIsLoading(false);
        return;
      }
      setCurrentChat(updatedChat);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedChat.messages,
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader');

      let assistantMessage = '';
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('0:')) {
            const content = line.slice(2);
            assistantMessage += content;

            const chatWithAI = chatStorage.addMessage(currentChat.id, {
              role: 'assistant',
              content: assistantMessage,
            });
            setCurrentChat(chatWithAI);
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (currentChat && confirm('Clear this chat?')) {
      chatStorage.deleteChat(currentChat.id);
      createNewChat();
    }
  };

  if (!currentChat) return null;

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center pointer-events-auto"
        aria-label="Open chat"
        style={{ pointerEvents: 'auto' }}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>

      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-96 h-[600px] rounded-lg shadow-2xl bg-background border border-border/50 backdrop-blur-sm flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300 pointer-events-auto" style={{ pointerEvents: 'auto' }}>
          {/* Header */}
          <div className="bg-gradient-to-r from-primary/20 to-primary/10 border-b border-border/30 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              <div>
                <h3 className="font-semibold text-sm">AUAPW AI Assistant</h3>
                <p className="text-xs text-muted-foreground">Auto parts expert</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                className="p-2 hover:bg-background/80 rounded-md transition-colors"
                title="Clear chat"
              >
                <Trash2 className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/50">
            {currentChat.messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center gap-3">
                <MessageCircle className="w-8 h-8 text-muted-foreground/40" />
                <div>
                  <p className="text-sm font-medium">Welcome to AUAPW!</p>
                  <p className="text-xs text-muted-foreground">Ask me about OEM auto parts, availability, or pricing</p>
                </div>
              </div>
            ) : (
              <>
                {currentChat.messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground rounded-br-none'
                          : 'bg-muted text-foreground rounded-bl-none'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted text-foreground px-4 py-2 rounded-lg rounded-bl-none">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce animation-delay-100" />
                        <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce animation-delay-200" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSendMessage}
            className="border-t border-border/30 p-4 bg-background flex gap-2"
          >
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder="Ask about auto parts..."
              className="flex-1 bg-muted border border-border/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !userMessage.trim()}
              className="bg-primary text-primary-foreground rounded-lg px-3 py-2 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Footer Links */}
          <div className="border-t border-border/30 px-4 py-2 bg-background/50 flex gap-2 justify-center text-xs">
            <Link
              href="/chat"
              className="text-primary hover:underline"
              onClick={() => setIsOpen(false)}
            >
              Full Chat
            </Link>
            <span className="text-border/50">•</span>
            <Link
              href="/chat/history"
              className="text-primary hover:underline"
              onClick={() => setIsOpen(false)}
            >
              History
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
