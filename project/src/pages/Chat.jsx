import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, MicOff, Paperclip, X, Loader2, Plus, Calendar, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import Sidebar from '../components/Sidebar';

const MessageBubble = ({ message, isAI, attachment }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    className={`flex ${isAI ? 'justify-start' : 'justify-end'} mb-4`}
  >
    <div
      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
        isAI
          ? 'bg-black/40 text-white border border-purple-500/20'
          : 'bg-purple-500/20 text-white'
      }`}
    >
      {message}
      {attachment && (
        <div className="mt-2 p-2 bg-black/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Paperclip className="w-4 h-4 text-purple-300" />
            <span className="text-sm text-purple-300">{attachment.name}</span>
          </div>
        </div>
      )}
    </div>
  </motion.div>
);

const QuickAction = ({ icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center space-x-2 p-2 rounded-lg bg-black/30 border border-purple-500/20 text-purple-300 hover:bg-purple-500/20 hover:border-purple-500/30 transition-all duration-300"
  >
    <Icon className="w-4 h-4" />
    <span className="text-sm whitespace-nowrap">{label}</span>
  </button>
);

const simulateAIResponse = async (message) => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (message.toLowerCase().includes('create task') || message.toLowerCase().includes('new task')) {
    return "I'll help you create a task. What would you like to name it?";
  }
  
  if (message.toLowerCase().includes('schedule') || message.toLowerCase().includes('meeting')) {
    return "I can help you schedule that. When would you like to schedule it for?";
  }
  
  return "I understand. How else can I assist you with that?";
};

export default function Chat() {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const sliderRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (window.webkitSpeechRecognition || window.SpeechRecognition) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(prev => prev + ' ' + transcript);
        setIsRecording(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        addNotification('Failed to recognize speech', 'error');
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      addNotification('Speech recognition is not supported in your browser', 'error');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Failed to start recording:', error);
        addNotification('Failed to start recording', 'error');
      }
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachment(file);
    }
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    
    if ((!inputValue.trim() && !attachment) || isProcessing) return;

    const userMessage = inputValue;
    setInputValue('');
    setMessages(prev => [...prev, { 
      text: userMessage || 'Sent an attachment', 
      isAI: false,
      attachment: attachment 
    }]);
    setAttachment(null);
    setIsProcessing(true);

    try {
      const response = await simulateAIResponse(userMessage);
      setMessages(prev => [...prev, { text: response, isAI: true }]);
    } catch (error) {
      addNotification('Failed to process message', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'task':
        setInputValue('Create a new task: ');
        break;
      case 'calendar':
        setInputValue('Schedule a meeting for ');
        break;
      case 'message':
        setInputValue('Send message to ');
        break;
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-900">
      {/* Sidebar */}
      <div className="relative z-10">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col transition-all duration-300">
        <div className="text-center py-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
            Mission Control Center
          </h1>
          <p className="text-gray-400 mt-2">
            Your AI assistant is ready to help with tasks, scheduling, and more
          </p>
        </div>

        <div className="flex-1 mx-4 mb-4 bg-gray-800 rounded-xl border border-gray-700 overflow-hidden flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence>
              {messages.map((message, index) => (
                <MessageBubble
                  key={index}
                  message={message.text}
                  isAI={message.isAI}
                  attachment={message.attachment}
                />
              ))}
              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-start mb-4"
                >
                  <div className="bg-gray-700 text-white border border-gray-600 rounded-2xl px-4 py-3">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-700 bg-gray-900/50 backdrop-blur-sm p-4">
            <div className="max-w-4xl mx-auto">
              <AnimatePresence>
                {showQuickActions && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mb-4"
                  >
                    <div className="flex justify-center space-x-4">
                      <QuickAction
                        icon={Plus}
                        label="Create Task"
                        onClick={() => handleQuickAction('task')}
                      />
                      <QuickAction
                        icon={Calendar}
                        label="Schedule Event"
                        onClick={() => handleQuickAction('calendar')}
                      />
                      <QuickAction
                        icon={MessageSquare}
                        label="Send Message"
                        onClick={() => handleQuickAction('message')}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSend} className="space-y-2">
                {attachment && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center space-x-2 bg-gray-800 p-2 rounded-lg"
                  >
                    <Paperclip className="w-4 h-4 text-purple-300" />
                    <span className="text-sm text-purple-300 flex-1 truncate">
                      {attachment.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => setAttachment(null)}
                      className="p-1 hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}

                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-800 rounded-lg flex items-center">
                    <button
                      type="button"
                      onClick={toggleRecording}
                      className={`p-4 rounded-l-lg transition-colors duration-300 ${
                        isRecording
                          ? 'bg-red-500/20 text-red-300 animate-pulse'
                          : 'text-purple-300 hover:bg-purple-500/20'
                      }`}
                    >
                      {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>

                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none text-lg px-4"
                    />

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-4 text-purple-300 hover:bg-purple-500/20 transition-colors duration-300"
                    >
                      <Paperclip className="w-5 h-5" />
                    </button>

                    <button
                      type="submit"
                      disabled={(!inputValue.trim() && !attachment) || isProcessing}
                      className="p-4 text-purple-300 hover:bg-purple-500/20 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-r-lg"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowQuickActions(!showQuickActions)}
                    className="p-4 bg-gray-800 rounded-lg text-purple-300 hover:bg-purple-500/20 transition-colors duration-300"
                  >
                    {showQuickActions ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}