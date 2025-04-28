import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../contexts/ChatContext';
import ChatMessage from './ChatMessage';
import { Send, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

function useSpeechRecognition(onResult) {
  useEffect(() => {
    if (!recognition) return;
    recognition.continuous = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = event?.results?.[0]?.[0]?.transcript;
      if (transcript) onResult(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event?.error);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  }, [onResult]);
  
  const startListening = () => {
    if (recognition) {
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
  };

  return { startListening, stopListening };
}

function speakText(text) {
  if ('speechSynthesis' in window && text) {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  }
}

const ChatInterface = () => {
  const chat = useChat();
  const { activeChat, addMessage, updateChatTitle } = chat || {};
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeakingEnabled, setIsSpeakingEnabled] = useState(true);
  const messagesEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  const { startListening, stopListening } = useSpeechRecognition((transcript) => {
    if (transcript) {
      setInput(transcript);
      handleSend(transcript);
    }
  });

  const handleSend = async (messageText) => {
    if (!messageText?.trim() || !addMessage) return;
    
    // Auto-save chat title if it's the first message
    if (activeChat?.messages?.length === 0) {
      const title = messageText.slice(0, 50) + (messageText.length > 50 ? '...' : '');
      await updateChatTitle(activeChat.id, title);
    }

    await addMessage(messageText, 'user');
    setInput('');
    setIsTyping(true);

    // Simulate AI typing
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    await addMessage(`Response to: ${messageText}`, 'assistant');
    setIsTyping(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSend(input);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
      setIsListening(false);
    } else {
      startListening();
      setIsListening(true);
    }
  };

  const toggleSpeaking = () => {
    setIsSpeakingEnabled(!isSpeakingEnabled);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeChat?.messages]);

  useEffect(() => {
    if (!isSpeakingEnabled || !activeChat?.messages?.length) return;
    const lastMessage = activeChat.messages[activeChat.messages.length - 1];
    if (lastMessage?.sender === 'assistant' && lastMessage?.content) {
      speakText(lastMessage.content);
    }
  }, [activeChat?.messages, isSpeakingEnabled]);

  if (!activeChat) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Select or create a chat to begin</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-900">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {activeChat?.messages?.map((msg, idx) => (
            <motion.div
              key={msg?.id || idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ChatMessage 
                role={msg?.sender || 'user'} 
                content={msg?.content || ''} 
              />
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex space-x-2 p-4 rounded-lg bg-gray-800/50"
            >
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex p-4 border-t border-gray-800">
        <button 
          type="button" 
          onClick={toggleListening} 
          className={`mr-2 p-2 rounded-md transition-all duration-300 ${
            isListening 
              ? 'bg-red-500/20 text-red-300 animate-pulse' 
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>
        <button 
          type="button" 
          onClick={toggleSpeaking} 
          className="mr-2 p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800"
        >
          {isSpeakingEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
        <input
          className="flex-1 bg-gray-800 text-white border border-gray-700 rounded-md px-4 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or speak your message..."
        />
        <button 
          type="submit" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center transition-colors duration-300"
          disabled={!input.trim()}
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;