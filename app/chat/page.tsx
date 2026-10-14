import { Metadata } from 'next';
import { ChatContainer } from '@/components/chat/chat-container';

export const metadata: Metadata = {
  title: 'Chat | ART LLC',
  description: 'Chat with our AI assistant about automotive parts and services',
};

interface ChatPageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function ChatPage({ searchParams }: ChatPageProps) {
  const { id } = await searchParams;
  return <ChatContainer initialChatId={id} />;
}
