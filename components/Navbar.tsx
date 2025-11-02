'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Home, Favorite, Settings } from '@mui/icons-material';

interface NavbarProps {
  favoritesCount: number;
  currentPage: 'home' | 'category' | 'favorites' | 'settings';
  onNavigate: (page: 'home' | 'favorites' | 'settings') => void;
}

const Navbar: React.FC<NavbarProps> = ({ favoritesCount, currentPage, onNavigate }) => {
  return (
    <nav 
      className="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700 shadow-sm"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center"
          >
            <button
              onClick={() => onNavigate('home')}
              className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:scale-105 transition-transform"
              aria-label="Go to home page"
            >
              Daily Motivation ✨
            </button>
          </motion.div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            {/* Home */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('home')}
              className={`relative px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                currentPage === 'home'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              aria-label="Home"
              aria-current={currentPage === 'home' ? 'page' : undefined}
            >
              <Home sx={{ fontSize: 20 }} />
              <span className="hidden sm:inline">Home</span>
            </motion.button>

            {/* Favorites */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('favorites')}
              className={`relative px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                currentPage === 'favorites'
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              aria-label={`Favorites ${favoritesCount > 0 ? `(${favoritesCount} items)` : ''}`}
              aria-current={currentPage === 'favorites' ? 'page' : undefined}
            >
              <Favorite 
                sx={{ 
                  fontSize: 20,
                  fill: favoritesCount > 0 ? 'currentColor' : 'none'
                }} 
              />
              <span className="hidden sm:inline">Favorites</span>
              {favoritesCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                  aria-label={`${favoritesCount} favorite quotes`}
                >
                  {favoritesCount}
                </motion.span>
              )}
            </motion.button>

            {/* Settings */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('settings')}
              className={`relative px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                currentPage === 'settings'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              aria-label="Settings"
              aria-current={currentPage === 'settings' ? 'page' : undefined}
            >
              <Settings sx={{ fontSize: 20 }} />
              <span className="hidden sm:inline">Settings</span>
            </motion.button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

