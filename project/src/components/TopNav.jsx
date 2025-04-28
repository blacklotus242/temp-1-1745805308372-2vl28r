import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, Settings, Moon, Sun } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const TopNav = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = async () => {
    if (logout) {
      await logout();
    }
  };
  
  return (
    <nav className="bg-gray-900 dark:bg-gray-950 border-b border-gray-800 dark:border-gray-900 transition-colors duration-300">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex items-center">
            <div className="flex items-center space-x-4">
              <span className="text-xl font-bold text-gradient">Nova</span>
            </div>
          </div>
          
          {user && (
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDark ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>

              <Link
                to="/settings"
                className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                title="Settings"
              >
                <Settings className="h-5 w-5" />
              </Link>

              <button 
                onClick={handleLogout}
                className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default TopNav;