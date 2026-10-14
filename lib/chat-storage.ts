export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = 'chat_sessions';
const CURRENT_CHAT_KEY = 'current_chat_id';

export const chatStorage = {
  // Get all chat sessions
  getAllChats: (): ChatSession[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  // Get a specific chat session
  getChat: (chatId: string): ChatSession | null => {
    if (typeof window === 'undefined') return null;
    const chats = chatStorage.getAllChats();
    return chats.find(chat => chat.id === chatId) || null;
  },

  // Save or update a chat session
  saveChat: (chat: ChatSession): void => {
    if (typeof window === 'undefined') return;
    const chats = chatStorage.getAllChats();
    const existingIndex = chats.findIndex(c => c.id === chat.id);
    
    if (existingIndex >= 0) {
      chats[existingIndex] = chat;
    } else {
      chats.unshift(chat); // Add new chat to beginning
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
    localStorage.setItem(CURRENT_CHAT_KEY, chat.id);
  },

  // Create a new chat session
  createChat: (title: string = 'New Chat'): ChatSession => {
    const now = Date.now();
    const chat: ChatSession = {
      id: `chat_${now}`,
      title,
      messages: [],
      createdAt: now,
      updatedAt: now,
    };
    chatStorage.saveChat(chat);
    return chat;
  },

  // Add a message to a chat
  addMessage: (chatId: string, message: Omit<Message, 'id' | 'timestamp'>): ChatSession | null => {
    if (typeof window === 'undefined') return null;
    const chat = chatStorage.getChat(chatId);
    if (chat) {
      const fullMessage: Message = {
        id: `msg_${Date.now()}`,
        timestamp: Date.now(),
        ...message,
      };
      chat.messages.push(fullMessage);
      chat.updatedAt = Date.now();
      chatStorage.saveChat(chat);
      return chat;
    }
    return null;
  },

  // Delete a chat session
  deleteChat: (chatId: string): void => {
    if (typeof window === 'undefined') return;
    const chats = chatStorage.getAllChats();
    const filtered = chats.filter(chat => chat.id !== chatId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    
    const currentId = localStorage.getItem(CURRENT_CHAT_KEY);
    if (currentId === chatId) {
      localStorage.removeItem(CURRENT_CHAT_KEY);
    }
  },

  // Delete all chats
  clearAllChats: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(CURRENT_CHAT_KEY);
  },

  // Get current chat ID
  getCurrentChatId: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(CURRENT_CHAT_KEY);
  },

  // Set current chat ID
  setCurrentChatId: (chatId: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CURRENT_CHAT_KEY, chatId);
  },

  // Search chats
  searchChats: (query: string): ChatSession[] => {
    const chats = chatStorage.getAllChats();
    const lowerQuery = query.toLowerCase();
    return chats.filter(chat => 
      chat.title.toLowerCase().includes(lowerQuery) ||
      chat.messages.some(msg => msg.content.toLowerCase().includes(lowerQuery))
    );
  },

  // Export chats as JSON
  exportAsJSON: (): string => {
    const chats = chatStorage.getAllChats();
    return JSON.stringify(chats, null, 2);
  },

  // Export chats as Markdown
  exportAsMarkdown: (): string => {
    const chats = chatStorage.getAllChats();
    let markdown = '# Chat History\n\n';
    
    chats.forEach(chat => {
      markdown += `## ${chat.title}\n`;
      markdown += `*Created: ${new Date(chat.createdAt).toLocaleString()}*\n\n`;
      
      chat.messages.forEach(msg => {
        const role = msg.role === 'user' ? '👤 You' : '🤖 Assistant';
        markdown += `**${role}:** ${msg.content}\n\n`;
      });
      
      markdown += '---\n\n';
    });
    
    return markdown;
  },

  // Import chats from JSON
  importFromJSON: (jsonData: string): void => {
    if (typeof window === 'undefined') return;
    try {
      const chats = JSON.parse(jsonData);
      if (Array.isArray(chats)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
      }
    } catch (error) {
      console.error('Failed to import chats:', error);
    }
  },
};
