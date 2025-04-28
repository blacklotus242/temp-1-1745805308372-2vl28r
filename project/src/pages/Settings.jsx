import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNotification } from '../contexts/NotificationContext';
import { Moon, Sun, Save, Upload, Mail, Phone, Globe, MapPin, Briefcase, Calendar } from 'lucide-react';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function Settings() {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { addNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState({
    display_name: '',
    avatar_url: '',
    bio: '',
    email: user?.email || '',
    phone: '',
    website: '',
    location: '',
    company: '',
    job_title: '',
    birth_date: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    notification_preferences: {
      email: true,
      push: true,
      desktop: true
    }
  });

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      if (data) {
        setProfile(prev => ({
          ...prev,
          ...data
        }));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      addNotification('Failed to load profile', 'error');
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...profile,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      addNotification('Profile updated successfully', 'success');
    } catch (error) {
      console.error('Error updating profile:', error);
      addNotification('Failed to update profile', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationPreferenceChange = (key) => {
    setProfile(prev => ({
      ...prev,
      notification_preferences: {
        ...prev.notification_preferences,
        [key]: !prev.notification_preferences[key]
      }
    }));
  };

  return (
    <div className="min-h-screen p-6 relative" style={{
      backgroundImage: "url('https://images.pexels.com/photos/2150/sky-space-dark-galaxy.jpg?auto=compress&cs=tinysrgb&w=1920')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <div className="absolute inset-0 bg-black/25 dark:bg-black/60" />

      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
          Settings
        </h1>

        {/* Profile Section */}
        <div className="bg-black/30 backdrop-blur-md border border-purple-500/20 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Profile</h2>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={profile.display_name}
                onChange={(e) => handleChange('display_name', e.target.value)}
                className="w-full bg-black/30 border border-purple-500/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Your display name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="flex-1 bg-black/30 border border-purple-500/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Phone
              </label>
              <div className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="flex-1 bg-black/30 border border-purple-500/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Website
              </label>
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-gray-400" />
                <input
                  type="url"
                  value={profile.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  className="flex-1 bg-black/30 border border-purple-500/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://your-website.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Location
              </label>
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className="flex-1 bg-black/30 border border-purple-500/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="City, Country"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Company
              </label>
              <div className="flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={profile.company}
                  onChange={(e) => handleChange('company', e.target.value)}
                  className="flex-1 bg-black/30 border border-purple-500/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Company name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Birth Date
              </label>
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={profile.birth_date}
                  onChange={(e) => handleChange('birth_date', e.target.value)}
                  className="flex-1 bg-black/30 border border-purple-500/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Bio
              </label>
              <textarea
                value={profile.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                rows={4}
                className="w-full bg-black/30 border border-purple-500/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-black/30 backdrop-blur-md border border-purple-500/20 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Notification Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Email Notifications</span>
              <button
                onClick={() => handleNotificationPreferenceChange('email')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  profile.notification_preferences.email ? 'bg-purple-600' : 'bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    profile.notification_preferences.email ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-300">Push Notifications</span>
              <button
                onClick={() => handleNotificationPreferenceChange('push')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  profile.notification_preferences.push ? 'bg-purple-600' : 'bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    profile.notification_preferences.push ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-300">Desktop Notifications</span>
              <button
                onClick={() => handleNotificationPreferenceChange('desktop')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  profile.notification_preferences.desktop ? 'bg-purple-600' : 'bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    profile.notification_preferences.desktop ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Theme Section */}
        <div className="bg-black/30 backdrop-blur-md border border-purple-500/20 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Appearance</h2>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Theme</span>
            <button
              onClick={toggleTheme}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
            >
              {isDark ? (
                <>
                  <Sun className="h-4 w-4" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}