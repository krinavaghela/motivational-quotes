import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Box,
  Switch,
  FormControlLabel,
  Button,
} from '@mui/material';
import { Favorite, Settings, Brightness4, Brightness7 } from '@mui/icons-material';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import CategoryCard from '@/components/CategoryCard';
import CategoryPage from '@/components/CategoryPage';
import FavoritesScreen from '@/components/FavoritesScreen';
import SettingsScreen from '@/components/SettingsScreen';
import { categories } from '@/lib/categories';
import { getFavorites } from '@/lib/utils';
import { getStorageData } from '@/lib/storage';

type Screen = 'home' | 'category' | 'favorites' | 'settings';

export default function Home() {
  const theme = useTheme();
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [favorites, setFavorites] = useState(getFavorites());
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(
    getStorageData().theme
  );
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    getStorageData().notificationsEnabled
  );
  const [notificationTime, setNotificationTime] = useState(
    getStorageData().notificationTime
  );
  const [showSaveMessage, setShowSaveMessage] = useState(false);

  const handleThemeToggle = () => {
    const newTheme = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newTheme);
    const { setStorageData } = require('@/lib/storage');
    setStorageData({ theme: newTheme });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('themeChanged'));
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentScreen('category');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
    setSelectedCategory('');
    setFavorites(getFavorites()); // Refresh favorites
  };

  const handleRemoveFavorite = (quoteId: string) => {
    const { removeFromFavorites } = require('@/lib/utils');
    removeFromFavorites(quoteId);
    setFavorites(getFavorites());
  };

  const handleSaveSettings = () => {
    const { setStorageData } = require('@/lib/storage');
    setStorageData({
      theme: themeMode,
      notificationsEnabled,
      notificationTime,
    });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('themeChanged'));
    }

    setShowSaveMessage(true);
    setTimeout(() => setShowSaveMessage(false), 3000);
  };

  return (
    <>
      <Head>
        <title>Daily Motivation ✨</title>
        <meta name="description" content="Get inspired with daily motivational quotes by category" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        {/* App Bar */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            background: theme.palette.mode === 'dark'
              ? 'rgba(18, 18, 18, 0.8)'
              : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Toolbar>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, fontWeight: 700 }}
            >
              Daily Motivation ✨
            </Typography>

            {/* Dark/Light Mode Toggle */}
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
              <IconButton
                onClick={handleThemeToggle}
                color="inherit"
                sx={{ mr: 1 }}
                title={themeMode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              >
                {themeMode === 'light' ? <Brightness4 /> : <Brightness7 />}
              </IconButton>
            </Box>

            <IconButton
              color="inherit"
              onClick={() => {
                setCurrentScreen('favorites');
                setFavorites(getFavorites());
              }}
              sx={{ mr: 1 }}
              title="Favorites"
            >
              <Badge badgeContent={favorites.length} color="error">
                <Favorite />
              </Badge>
            </IconButton>

            <IconButton
              color="inherit"
              onClick={() => setCurrentScreen('settings')}
              title="Settings"
            >
              <Settings />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        {currentScreen === 'home' && (
          <Container maxWidth="lg" sx={{ py: 6 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Typography
                variant="h3"
                sx={{
                  textAlign: 'center',
                  mb: 2,
                  fontWeight: 800,
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Choose Your Inspiration
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ textAlign: 'center', mb: 4, fontSize: '1.1rem' }}
              >
                Explore motivational quotes by category
              </Typography>

              {/* Athletes Link */}
              <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => window.location.href = '/athletes'}
                  sx={{ borderRadius: 3, px: 4 }}
                >
                  💪 Athletes & Mindset Stories →
                </Button>
              </Box>

              <Grid container spacing={3}>
                {categories.map((category, index) => (
                  <Grid item xs={12} sm={6} md={4} key={category.id}>
                    <CategoryCard
                      category={category}
                      index={index}
                      onClick={() => handleCategoryClick(category.id)}
                    />
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          </Container>
        )}

        {currentScreen === 'category' && (
          <CategoryPage
            categoryId={selectedCategory}
            onBack={handleBackToHome}
          />
        )}

        {currentScreen === 'favorites' && (
          <FavoritesScreen
            favorites={favorites}
            onRemove={handleRemoveFavorite}
            onBack={handleBackToHome}
            onShare={async (quote) => {
              const shareText = `"${quote.content}" - ${quote.author}`;
              if (navigator.share) {
                try {
                  await navigator.share({ text: shareText });
                  return;
                } catch (err) {
                  // User cancelled, fall through to clipboard
                }
              }
              try {
                await navigator.clipboard.writeText(shareText);
              } catch (err) {
                console.error('Failed to copy to clipboard:', err);
              }
            }}
          />
        )}

        {currentScreen === 'settings' && (
          <SettingsScreen
            theme={themeMode}
            notificationsEnabled={notificationsEnabled}
            notificationTime={notificationTime}
            onThemeChange={setThemeMode}
            onNotificationsToggle={setNotificationsEnabled}
            onNotificationTimeChange={setNotificationTime}
            onBack={handleBackToHome}
            onSave={handleSaveSettings}
            showSaveMessage={showSaveMessage}
          />
        )}
      </Box>
    </>
  );
}
