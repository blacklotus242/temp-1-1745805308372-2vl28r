import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, ExternalLink, Star, X, Monitor, Smartphone, Grid, List } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const integrations = {
  apps: [
    {
      id: 'google_calendar',
      name: 'Google Calendar',
      description: 'Sync your schedule and manage events seamlessly',
      logo: 'https://images.pexels.com/photos/5726827/pexels-photo-5726827.jpeg?auto=compress&cs=tinysrgb&w=300',
      category: 'Calendar & Scheduling'
    },
    {
      id: 'asana',
      name: 'Asana',
      description: 'Project and task management for teams',
      logo: 'https://images.pexels.com/photos/7376/startup-photos.jpg?auto=compress&cs=tinysrgb&w=300',
      category: 'Project Management'
    },
    {
      id: 'notion',
      name: 'Notion',
      description: 'All-in-one workspace for notes and collaboration',
      logo: 'https://images.pexels.com/photos/2115217/pexels-photo-2115217.jpeg?auto=compress&cs=tinysrgb&w=300',
      category: 'Productivity'
    },
    {
      id: 'gmail',
      name: 'Gmail',
      description: 'Manage your email communications efficiently',
      logo: 'https://images.pexels.com/photos/193003/pexels-photo-193003.jpeg?auto=compress&cs=tinysrgb&w=300',
      category: 'Communication'
    },
    {
      id: 'google_drive',
      name: 'Google Drive',
      description: 'Cloud storage and file synchronization',
      logo: 'https://images.pexels.com/photos/2085831/pexels-photo-2085831.jpeg?auto=compress&cs=tinysrgb&w=300',
      category: 'Storage'
    },
    {
      id: 'mileiq',
      name: 'MileIQ',
      description: 'Automatic mileage tracking for business trips',
      logo: 'https://images.pexels.com/photos/3806753/pexels-photo-3806753.jpeg?auto=compress&cs=tinysrgb&w=300',
      category: 'Travel & Expenses'
    },
    {
      id: 'genius_scan',
      name: 'Genius Scan',
      description: 'Scan documents and receipts with AI-powered text recognition',
      logo: 'https://images.pexels.com/photos/2882566/pexels-photo-2882566.jpeg?auto=compress&cs=tinysrgb&w=300',
      category: 'Document Management'
    }
  ],
  websites: [
    {
      id: 'shopify',
      name: 'Shopify',
      description: 'E-commerce platform for online stores',
      logo: 'https://images.pexels.com/photos/919436/pexels-photo-919436.jpeg?auto=compress&cs=tinysrgb&w=300',
      category: 'E-commerce'
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Team communication and collaboration hub',
      logo: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=300',
      category: 'Communication'
    },
    {
      id: 'trello',
      name: 'Trello',
      description: 'Visual project management boards',
      logo: 'https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=300',
      category: 'Project Management'
    },
    {
      id: 'docusign',
      name: 'DocuSign',
      description: 'Electronic signature and agreement management',
      logo: 'https://images.pexels.com/photos/955395/pexels-photo-955395.jpeg?auto=compress&cs=tinysrgb&w=300',
      category: 'Document Management'
    },
    {
      id: 'twitter',
      name: 'X (Twitter)',
      description: 'Social media platform for real-time updates',
      logo: 'https://images.pexels.com/photos/6053/social-media-twitter-blog-communication.jpg?auto=compress&cs=tinysrgb&w=300',
      category: 'Social Media'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      description: 'Manage Pages and Groups for your business',
      logo: 'https://images.pexels.com/photos/267399/pexels-photo-267399.jpeg?auto=compress&cs=tinysrgb&w=300',
      category: 'Social Media'
    },
    {
      id: 'gcp',
      name: 'Google Cloud Platform',
      description: 'Cloud computing services and infrastructure',
      logo: 'https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&w=300',
      category: 'Cloud Computing'
    }
  ]
};

const AppCard = ({ app, isConnected, isPinned, onConnect, onDisconnect, onTogglePin, isListView }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isConfirmingDisconnect, setIsConfirmingDisconnect] = useState(false);

  const handleDisconnect = (e) => {
    e.stopPropagation();
    if (isConfirmingDisconnect) {
      onDisconnect(app.id);
      setIsConfirmingDisconnect(false);
    } else {
      setIsConfirmingDisconnect(true);
      setTimeout(() => setIsConfirmingDisconnect(false), 3000);
    }
  };

  if (isListView) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`group relative bg-black/30 backdrop-blur-md rounded-xl border overflow-hidden transition-all duration-300 ${
          isPinned 
            ? 'border-purple-500/40 shadow-lg shadow-purple-500/20' 
            : 'border-purple-500/20 hover:border-purple-500/40'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsConfirmingDisconnect(false);
        }}
      >
        <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
          isPinned 
            ? 'from-purple-500/10 to-blue-500/10' 
            : 'from-purple-500/5 to-blue-500/5'
        }`} />
        
        <div className="relative p-4 flex items-center">
          <div className="h-12 w-12 rounded-lg overflow-hidden flex-shrink-0">
            <img 
              src={app.logo} 
              alt={`${app.name} logo`}
              className="h-full w-full object-cover"
            />
          </div>
          
          <div className="ml-4 flex-grow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white flex items-center">
                  {app.name}
                  <ExternalLink className="ml-2 h-4 w-4 text-gray-400" />
                </h3>
                <span className="px-2 py-1 text-xs rounded-full bg-purple-500/20 text-purple-300">
                  {app.category}
                </span>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => onTogglePin(app.id)}
                  className={`relative p-2 rounded-full transition-all duration-300 ${
                    isPinned 
                      ? 'text-yellow-400 hover:text-yellow-300' 
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                  title={isPinned ? 'Unpin from favorites' : 'Pin to favorites'}
                >
                  <Star className={`h-5 w-5 ${isPinned ? 'fill-current' : ''}`} />
                  {isPinned && isHovered && (
                    <X 
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-4 w-4 text-red-400"
                      style={{ opacity: isHovered ? 1 : 0 }}
                    />
                  )}
                </button>
                
                <button
                  onClick={isConnected ? handleDisconnect : () => onConnect(app.id)}
                  className={`py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all duration-300 ${
                    isConnected
                      ? isConfirmingDisconnect
                        ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                        : 'bg-green-500/20 text-green-300 hover:bg-red-500/20 hover:text-red-300'
                      : 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30'
                  }`}
                >
                  {isConnected ? (
                    isConfirmingDisconnect ? (
                      <>
                        <X className="h-4 w-4" />
                        <span>Confirm Disconnect</span>
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Connected</span>
                      </>
                    )
                  ) : (
                    <span>Connect</span>
                  )}
                </button>
              </div>
            </div>
            
            <p className="text-gray-400 text-sm mt-2">{app.description}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group relative bg-black/30 backdrop-blur-md rounded-xl border overflow-hidden transition-all duration-300 ${
        isPinned 
          ? 'border-purple-500/40 shadow-lg shadow-purple-500/20' 
          : 'border-purple-500/20 hover:border-purple-500/40'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsConfirmingDisconnect(false);
      }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
        isPinned 
          ? 'from-purple-500/10 to-blue-500/10' 
          : 'from-purple-500/5 to-blue-500/5'
      }`} />
      
      <div className="relative p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="h-12 w-12 rounded-lg overflow-hidden">
            <img 
              src={app.logo} 
              alt={`${app.name} logo`}
              className="h-full w-full object-cover"
            />
          </div>
          <button
            onClick={() => onTogglePin(app.id)}
            className={`relative p-2 rounded-full transition-all duration-300 ${
              isPinned 
                ? 'text-yellow-400 hover:text-yellow-300' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
            title={isPinned ? 'Unpin from favorites' : 'Pin to favorites'}
          >
            <Star className={`h-5 w-5 ${isPinned ? 'fill-current' : ''}`} />
            {isPinned && isHovered && (
              <X 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-4 w-4 text-red-400"
                style={{ opacity: isHovered ? 1 : 0 }}
              />
            )}
          </button>
        </div>

        <div>
          <div className="flex items-start justify-between mb-1">
            <h3 className="text-xl font-semibold text-white flex items-center">
              {app.name}
              <ExternalLink className="ml-2 h-4 w-4 text-gray-400" />
            </h3>
          </div>
          <span className="px-2 py-1 text-xs rounded-full bg-purple-500/20 text-purple-300">
            {app.category}
          </span>
          <p className="text-gray-400 text-sm mt-2">{app.description}</p>
        </div>

        <button
          onClick={isConnected ? handleDisconnect : () => onConnect(app.id)}
          className={`w-full py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all duration-300 ${
            isConnected
              ? isConfirmingDisconnect
                ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                : 'bg-green-500/20 text-green-300 hover:bg-red-500/20 hover:text-red-300'
              : 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30'
          }`}
        >
          {isConnected ? (
            isConfirmingDisconnect ? (
              <>
                <X className="h-4 w-4" />
                <span>Confirm Disconnect</span>
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                <span>Connected</span>
              </>
            )
          ) : (
            <span>Connect</span>
          )}
        </button>
      </div>
    </motion.div>
  );
};

const TabButton = ({ active, icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-300 ${
      active
        ? 'bg-purple-500/30 text-purple-300'
        : 'bg-black/30 text-gray-400 hover:bg-purple-500/20 hover:text-purple-300'
    }`}
  >
    <Icon className="h-5 w-5" />
    <span>{label}</span>
  </button>
);

export default function Integrations() {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [connectedApps, setConnectedApps] = useState(new Set());
  const [pinnedApps, setPinnedApps] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('apps');
  const [filter, setFilter] = useState('all');
  const [isListView, setIsListView] = useState(false);

  useEffect(() => {
    const loadUserPreferences = async () => {
      try {
        const { data, error } = await supabase
          .from('integrations')
          .select('service, status, pinned')
          .eq('user_id', user.id);

        if (error) throw error;

        const connected = new Set();
        const pinned = new Set();

        data.forEach(integration => {
          if (integration.status === 'active') {
            connected.add(integration.service);
          }
          if (integration.pinned) {
            pinned.add(integration.service);
          }
        });

        setConnectedApps(connected);
        setPinnedApps(pinned);
      } catch (error) {
        console.error('Error loading integrations:', error);
        addNotification('Failed to load integrations', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadUserPreferences();
    }
  }, [user]);

  const handleConnect = async (appId) => {
    try {
      const { error } = await supabase
        .from('integrations')
        .upsert({
          user_id: user.id,
          service: appId,
          status: 'active',
          pinned: false,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setConnectedApps(prev => {
        const newSet = new Set(prev);
        newSet.add(appId);
        return newSet;
      });
      addNotification('Integration connected successfully', 'success');
    } catch (error) {
      console.error('Error connecting integration:', error);
      addNotification('Failed to connect integration', 'error');
    }
  };

  const handleDisconnect = async (appId) => {
    try {
      const { error } = await supabase
        .from('integrations')
        .update({
          status: 'pending',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('service', appId);

      if (error) throw error;

      setConnectedApps(prev => {
        const newSet = new Set(prev);
        newSet.delete(appId);
        return newSet;
      });
      addNotification('Integration disconnected successfully', 'success');
    } catch (error) {
      console.error('Error disconnecting integration:', error);
      addNotification('Failed to disconnect integration', 'error');
    }
  };

  const handleTogglePin = async (appId) => {
    try {
      const newPinned = !pinnedApps.has(appId);
      
      const { data: existingIntegrations, error: queryError } = await supabase
        .from('integrations')
        .select('id')
        .eq('user_id', user.id)
        .eq('service', appId)
        .limit(1);

      if (queryError) throw queryError;

      const existingIntegration = existingIntegrations?.[0];

      if (!existingIntegration) {
        const { error: createError } = await supabase
          .from('integrations')
          .insert({
            user_id: user.id,
            service: appId,
            status: 'pending',
            pinned: newPinned,
            updated_at: new Date().toISOString()
          });

        if (createError) throw createError;
      } else {
        const { error: updateError } = await supabase
          .from('integrations')
          .update({
            pinned: newPinned,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id)
          .eq('service', appId);

        if (updateError) throw updateError;
      }

      setPinnedApps(prev => {
        const newSet = new Set(prev);
        if (newPinned) {
          newSet.add(appId);
          addNotification('Integration pinned to favorites', 'success');
        } else {
          newSet.delete(appId);
          addNotification('Integration unpinned from favorites', 'success');
        }
        return newSet;
      });
    } catch (error) {
      console.error('Error updating pin status:', error);
      addNotification('Failed to update pin status', 'error');
    }
  };

  const currentIntegrations = integrations[activeTab] || [];
  const categories = ['all', ...new Set(currentIntegrations.map(app => app.category))];

  const filteredIntegrations = currentIntegrations
    .filter(app => filter === 'all' || app.category === filter)
    .sort((a, b) => {
      if (pinnedApps.has(a.id) && !pinnedApps.has(b.id)) return -1;
      if (!pinnedApps.has(a.id) && pinnedApps.has(b.id)) return 1;
      return a.name.localeCompare(b.name);
    });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 relative" style={{
      backgroundImage: "url('https://images.pexels.com/photos/2150/sky-space-dark-galaxy.jpg?auto=compress&cs=tinysrgb&w=1920')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <div className="absolute inset-0 bg-black/25 dark:bg-black/60" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-2">
            Integration Hub
          </h1>
          <p className="text-gray-400">
            Connect your favorite apps and services to enhance your workflow.
            Star integrations to pin them to the top, and hover over the star to unpin.
          </p>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <div className="flex space-x-4">
            <TabButton
              active={activeTab === 'apps'}
              icon={Smartphone}
              label="Apps"
              onClick={() => {
                setActiveTab('apps');
                setFilter('all');
              }}
            />
            <TabButton
              active={activeTab === 'websites'}
              icon={Monitor}
              label="Websites"
              onClick={() => {
                setActiveTab('websites');
                setFilter('all');
              }}
            />
          </div>

          <button
            onClick={() => setIsListView(!isListView)}
            className="p-2 rounded-lg bg-black/30 text-gray-400 hover:bg-purple-500/20 hover:text-purple-300 transition-all duration-300"
            title={isListView ? "Switch to grid view" : "Switch to list view"}
          >
            {isListView ? <Grid className="h-5 w-5" /> : <List className="h-5 w-5" />}
          </button>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                filter === category
                  ? 'bg-purple-500/30 text-purple-300'
                  : 'bg-black/30 text-gray-400 hover:bg-purple-500/20 hover:text-purple-300'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        <div className={
          isListView 
            ? "space-y-4"
            : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        }>
          {filteredIntegrations.map(app => (
            <AppCard
              key={app.id}
              app={app}
              isConnected={connectedApps.has(app.id)}
              isPinned={pinnedApps.has(app.id)}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
              onTogglePin={handleTogglePin}
              isListView={isListView}
            />
          ))}
        </div>
      </div>
    </div>
  );
}