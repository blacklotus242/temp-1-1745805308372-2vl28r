import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export const ChatContext = createContext();

export function ChatProvider({ children }) {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [chats, setChats] = useState([]);
  const [prompts, setPrompts] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [selectedChats, setSelectedChats] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadChatsAndPrompts();
    }
  }, [user]);

  const loadChatsAndPrompts = async () => {
    try {
      // Load prompts
      const { data: promptsData, error: promptsError } = await supabase
        .from('chat_prompts')
        .select('*')
        .order('created_at', { ascending: false });

      if (promptsError) throw promptsError;
      setPrompts(promptsData || []);

      // Load chat sessions with their latest message
      const { data: chatsData, error: chatsError } = await supabase
        .from('chat_sessions')
        .select(`
          *,
          prompt:chat_prompts(*),
          messages:chat_messages(*)
        `)
        .order('updated_at', { ascending: false });

      if (chatsError) throw chatsError;
      setChats(chatsData || []);

      // Set active chat to the most recent one if none is selected
      if (chatsData?.length > 0 && !activeChat) {
        setActiveChat(chatsData[0]);
      }
    } catch (error) {
      console.error('Error loading chats and prompts:', error.message);
      addNotification('Failed to load chats', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const createNewChat = async (promptId = null) => {
    try {
      // Only validate promptId if it's not null
      if (promptId !== null && typeof promptId !== 'string') {
        throw new Error('Invalid promptId format');
      }

      let prompt = null;
      if (promptId) {
        const { data: promptData, error: promptError } = await supabase
          .from('chat_prompts')
          .select('*')
          .eq('id', promptId)
          .single();

        if (promptError) throw promptError;
        prompt = promptData;
      }

      const { data: chat, error } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: user.id,
          prompt_id: promptId,
          title: 'New Chat'
        })
        .select()
        .single();

      if (error) throw error;

      if (prompt?.instructions) {
        await supabase
          .from('chat_messages')
          .insert({
            session_id: chat.id,
            role: 'system',
            content: prompt.instructions
          });
      }

      const newChat = { ...chat, messages: [], prompt };
      setChats([newChat, ...chats]);
      setActiveChat(newChat);
      return newChat;
    } catch (error) {
      console.error('Error creating new chat:', error.message, error.code);
      addNotification('Failed to create new chat', 'error');
      return null;
    }
  };

  const createCustomPrompt = async (title, emoji, instructions) => {
    try {
      const { data: prompt, error } = await supabase
        .from('chat_prompts')
        .insert({
          user_id: user.id,
          title,
          emoji,
          instructions,
          is_default: false
        })
        .select()
        .single();

      if (error) throw error;

      setPrompts([prompt, ...prompts]);
      return prompt;
    } catch (error) {
      console.error('Error creating custom prompt:', error.message);
      addNotification('Failed to create custom prompt', 'error');
      return null;
    }
  };

  const addMessage = async (content, role = 'user') => {
    if (!activeChat) return;

    try {
      const { data: message, error } = await supabase
        .from('chat_messages')
        .insert({
          session_id: activeChat.id,
          role,
          content
        })
        .select()
        .single();

      if (error) throw error;

      const updatedChat = {
        ...activeChat,
        messages: [...(activeChat.messages || []), message],
        updated_at: new Date().toISOString()
      };

      setChats(chats.map(chat => 
        chat.id === activeChat.id ? updatedChat : chat
      ));
      setActiveChat(updatedChat);

      return message;
    } catch (error) {
      console.error('Error adding message:', error.message);
      addNotification('Failed to send message', 'error');
      return null;
    }
  };

  const updateChatTitle = async (chatId, newTitle) => {
    try {
      const { error } = await supabase
        .from('chat_sessions')
        .update({ title: newTitle })
        .eq('id', chatId);

      if (error) throw error;

      const updatedChats = chats.map(chat =>
        chat.id === chatId ? { ...chat, title: newTitle } : chat
      );

      setChats(updatedChats);
      if (activeChat?.id === chatId) {
        setActiveChat({ ...activeChat, title: newTitle });
      }
    } catch (error) {
      console.error('Error updating chat title:', error.message);
      addNotification('Failed to update chat title', 'error');
    }
  };

  const deleteChats = async (chatIds) => {
    try {
      const { error } = await supabase
        .from('chat_sessions')
        .delete()
        .in('id', Array.from(chatIds));

      if (error) throw error;

      const updatedChats = chats.filter(chat => !chatIds.has(chat.id));
      setChats(updatedChats);

      if (activeChat && chatIds.has(activeChat.id)) {
        setActiveChat(updatedChats[0] || null);
      }

      setSelectedChats(new Set());

      if (updatedChats.length === 0) {
        createNewChat();
      }

      addNotification(`Deleted ${chatIds.size} chat${chatIds.size > 1 ? 's' : ''}`, 'success');
    } catch (error) {
      console.error('Error deleting chats:', error.message);
      addNotification('Failed to delete chats', 'error');
    }
  };

  const toggleChatSelection = (chatId) => {
    setSelectedChats(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(chatId)) {
        newSelection.delete(chatId);
      } else {
        newSelection.add(chatId);
      }
      return newSelection;
    });
  };

  const clearSelection = () => {
    setSelectedChats(new Set());
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        activeChat,
        prompts,
        isLoading,
        selectedChats,
        setActiveChat,
        createNewChat,
        createCustomPrompt,
        addMessage,
        updateChatTitle,
        deleteChats,
        toggleChatSelection,
        clearSelection
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}