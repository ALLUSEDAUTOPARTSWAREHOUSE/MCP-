import { Metadata } from 'next';
import { ChatHistory } from '@/components/chat/chat-history';

export const metadata: Metadata = {
  title: 'Chat History | ART LLC',
  description: 'View and manage your chat history',
};

export default function HistoryPage() {
  return <ChatHistory />;
}
