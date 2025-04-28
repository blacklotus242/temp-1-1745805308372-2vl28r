import React, { useState } from 'react';
import { useChat } from '../contexts/ChatContext';
import { 
  PlusCircle, 
  MessageSquare, 
  Edit2, 
  Trash2, 
  Check, 
  X, 
  ChevronRight, 
  ChevronLeft,
  Settings,
  CheckSquare,
  Square,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Save
} from 'lucide-react';

const ChatItem = ({ chat, isSelected, onSelect, onDelete, isExpanded, onToggleExpand, onRename }) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(chat.title);

  const handleDelete = (e) => {
    e.stopPropagation();
    if (showConfirmDelete) {
      onDelete(new Set([chat.id]));
      setShowConfirmDelete(false);
    } else {
      setShowConfirmDelete(true);
      setTimeout(() => setShowConfirmDelete(false), 3000);
    }
  };

  const handleRename = (e) => {
    e.preventDefault();
    if (newTitle.trim() && newTitle !== chat.title) {
      onRename(chat.id, newTitle.trim());
    }
    setIsEditing(false);
  };

  return (
    <div className="space-y-1">
      <div 
        className={`flex items-center p-2 rounded-md transition-colors ${
          isSelected ? 'bg-gray-700' : 'hover:bg-gray-700'
        }`}
      >
        <div 
          className="flex-1 flex items-center"
          onClick={() => !isEditing && onSelect(chat.id)}
        >
          <div className="flex-shrink-0 mr-3">
            {isSelected ? (
              <CheckSquare className="h-5 w-5 text-indigo-500" />
            ) : (
              <Square className="h-5 w-5 text-gray-500" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <form onSubmit={handleRename} className="flex items-center">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="flex-1 bg-gray-900 text-white text-sm rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  autoFocus
                  onBlur={handleRename}
                />
                <button
                  type="submit"
                  className="ml-2 p-1 text-purple-400 hover:text-purple-300"
                >
                  <Save className="h-4 w-4" />
                </button>
              </form>
            ) : (
              <>
                <p className="text-sm font-medium text-gray-200 truncate">
                  {chat.title}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {new Date(chat.created_at).toLocaleDateString()}
                </p>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-1">
          {!isEditing && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-gray-400 hover:text-purple-300 transition-colors"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={onToggleExpand}
                className="p-2 text-gray-400 hover:text-gray-300 transition-colors"
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={handleDelete}
                className={`p-2 rounded-md transition-colors ${
                  showConfirmDelete 
                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                    : 'text-gray-500 hover:text-red-400'
                }`}
              >
                {showConfirmDelete ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </button>
            </>
          )}
        </div>
      </div>
      {isExpanded && chat.messages && chat.messages.length > 0 && (
        <div className="ml-8 pl-2 border-l border-gray-700 space-y-1">
          {chat.messages.slice(-3).map((message, index) => (
            <div 
              key={message.id || index}
              className="text-sm text-gray-400 truncate py-1"
            >
              <span className="text-xs text-gray-500 mr-2">
                {message.role === 'user' ? '👤' : '🤖'}
              </span>
              {message.content}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Sidebar = () => {
  const { 
    chats = [], 
    createNewChat, 
    selectedChats,
    toggleChatSelection,
    deleteChats,
    clearSelection,
    setActiveChat,
    updateChatTitle
  } = useChat();
  const [isExpanded, setIsExpanded] = useState(true);
  const [expandedChats, setExpandedChats] = useState(new Set());
  const [showSidebar, setShowSidebar] = useState(true);
  
  const toggleChatExpansion = (chatId) => {
    setExpandedChats(prev => {
      const next = new Set(prev);
      if (next.has(chatId)) {
        next.delete(chatId);
      } else {
        next.add(chatId);
      }
      return next;
    });
  };

  return (
    <div className="relative h-full">
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className="absolute -right-3 top-1/2 transform -translate-y-1/2 z-30 bg-gray-800 p-1 rounded-full border border-gray-700 shadow-lg hover:bg-gray-700 transition-colors"
      >
        {showSidebar ? (
          <ChevronLeft className="h-4 w-4 text-gray-300" />
        ) : (
          <ChevronRight className="h-4 w-4 text-gray-300" />
        )}
      </button>
      
      <div 
        className={`absolute top-0 left-0 h-full bg-gray-800 border-r border-gray-700 flex flex-col transition-all duration-300 ease-in-out ${
          showSidebar ? 'w-64' : 'w-0'
        } overflow-hidden`}
        style={{
          position: 'fixed',
          zIndex: 40
        }}
      >
        <div className="p-4 border-b border-gray-700">
          {selectedChats.size > 0 ? (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">
                {selectedChats.size} selected
              </span>
              <div className="space-x-2">
                <button
                  onClick={() => {
                    deleteChats(selectedChats);
                    clearSelection();
                  }}
                  className="p-2 text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
                <button
                  onClick={clearSelection}
                  className="p-2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                const newChat = createNewChat(null);
                if (newChat) {
                  setActiveChat(newChat);
                  setExpandedChats(prev => new Set(prev).add(newChat.id));
                }
              }}
              className="w-full flex items-center justify-center py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">New Chat</span>
            </button>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
          <div className="mt-2">
            <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Recent Chats
            </h3>
            
            {(!chats || chats.length === 0) ? (
              <p className="text-gray-500 text-sm p-2">No chats yet</p>
            ) : (
              <div className="space-y-2">
                {chats.map((chat) => (
                  <ChatItem 
                    key={chat.id} 
                    chat={chat}
                    isSelected={selectedChats.has(chat.id)}
                    onSelect={toggleChatSelection}
                    onDelete={deleteChats}
                    isExpanded={expandedChats.has(chat.id)}
                    onToggleExpand={() => toggleChatExpansion(chat.id)}
                    onRename={updateChatTitle}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-700">
          <div className="text-xs text-gray-500 text-center">
            Nova AI Assistant v1.0
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;