import { Metadata } from 'next';
import { ChatContainer } from '@/components/chat/chat-container';

export const metadata: Metadata = {
  title: 'Chat | AUAPW LLC',
  description: 'Chat with our AUAPW AI assistant about used auto parts, pricing, and availability.',
};

interface ChatPageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function ChatPage({ searchParams }: ChatPageProps) {
  const { id } = await searchParams;
  return <ChatContainer initialChatId={id} />;
}
