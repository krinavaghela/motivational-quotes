'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  IconButton,
  Button,
  Card,
  CardContent,
} from '@mui/material';
import {
  ArrowBack,
  Home,
  Favorite,
  FavoriteBorder,
  Share,
  Refresh,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import { Category, getCategoryById } from '@/lib/categories';
import { fetchQuotesByCategory, getRandomQuote } from '@/lib/quotes';
import { Quote, isFavorite, saveToFavorites, removeFromFavorites, copyToClipboard } from '@/lib/utils';

interface CategoryPageProps {
  categoryId: string;
  onBack: () => void;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ categoryId, onBack }) => {
  const theme = useTheme();
  const [category, setCategory] = useState<Category | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  useEffect(() => {
    if (snackbar.open) {
      const timer = setTimeout(() => {
        setSnackbar({ ...snackbar, open: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [snackbar]);

  useEffect(() => {
    const cat = getCategoryById(categoryId);
    setCategory(cat || null);
    
    loadQuotes();
  }, [categoryId]);

  const loadQuotes = async () => {
    setLoading(true);
    const categoryQuotes = await fetchQuotesByCategory(categoryId);
    setQuotes(categoryQuotes);
    
    if (categoryQuotes.length > 0) {
      const random = getRandomQuote(categoryQuotes);
      setCurrentQuote(random);
    }
    setLoading(false);
  };

  const handleNewQuote = () => {
    if (quotes.length > 0) {
      const random = getRandomQuote(quotes);
      setCurrentQuote(random);
    }
  };

  const handleFavorite = () => {
    if (!currentQuote) return;
    
    const isFav = isFavorite(currentQuote._id);
    if (isFav) {
      removeFromFavorites(currentQuote._id);
      setSnackbar({ open: true, message: 'Removed from favorites' });
    } else {
      saveToFavorites(currentQuote);
      setSnackbar({ open: true, message: 'Added to favorites' });
    }
  };

  const handleShare = async () => {
    if (!currentQuote) return;
    
    const shareText = `"${currentQuote.content}" - ${currentQuote.author}`;
    
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText });
        return;
      } catch (err) {
        // User cancelled
      }
    }
    
    try {
      await copyToClipboard(shareText);
      setSnackbar({ open: true, message: 'Copied to clipboard!' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to share' });
    }
  };

  if (!category) {
    return (
      <Container>
        <Typography>Category not found</Typography>
      </Container>
    );
  }

  const isFav = currentQuote ? isFavorite(currentQuote._id) : false;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton
          onClick={onBack}
          sx={{
            background: `linear-gradient(135deg, ${category.gradient[0]}, ${category.gradient[1]})`,
            color: 'white',
            '&:hover': {
              transform: 'scale(1.1)',
            },
            transition: 'transform 0.2s',
          }}
          title="Back to categories"
        >
          <ArrowBack />
        </IconButton>
        <IconButton
          onClick={onBack}
          sx={{
            background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            color: 'primary.main',
            '&:hover': {
              background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
              transform: 'scale(1.1)',
            },
            transition: 'transform 0.2s',
          }}
          title="Home"
        >
          <Home />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
            <span style={{ fontSize: '2rem' }}>{category.emoji}</span>
            {category.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {category.description}
          </Typography>
        </Box>
      </Box>

      {/* Quote Card */}
      {currentQuote && (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuote._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card
              sx={{
                mb: 3,
                borderRadius: 4,
                background: `linear-gradient(135deg, ${category.gradient[0]}15 0%, ${category.gradient[1]}15 100%)`,
                border: `2px solid ${category.color}30`,
              }}
              elevation={0}
            >
              <CardContent sx={{ p: 5 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontStyle: 'italic',
                    mb: 3,
                    lineHeight: 1.8,
                    fontSize: { xs: '1.5rem', md: '2rem' },
                  }}
                >
                  "{currentQuote.content}"
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: category.color,
                    fontWeight: 600,
                    mb: 4,
                  }}
                >
                  — {currentQuote.author}
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                  <Button
                    variant={isFav ? 'contained' : 'outlined'}
                    color={isFav ? 'error' : 'primary'}
                    startIcon={isFav ? <Favorite /> : <FavoriteBorder />}
                    onClick={handleFavorite}
                    sx={{ 
                      borderRadius: 3,
                      // Ensure visibility in light mode
                      ...(theme.palette.mode === 'light' && !isFav && {
                        borderColor: '#1976d2',
                        color: '#1976d2',
                        '&:hover': {
                          borderColor: '#1565c0',
                          backgroundColor: 'rgba(25, 118, 210, 0.04)',
                        },
                      }),
                    }}
                  >
                    {isFav ? 'Favorited' : 'Favorite'}
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<Share />}
                    onClick={handleShare}
                    sx={{ 
                      borderRadius: 3,
                      // Ensure visibility in light mode
                      ...(theme.palette.mode === 'light' && {
                        borderColor: '#1976d2',
                        color: '#1976d2',
                        '&:hover': {
                          borderColor: '#1565c0',
                          backgroundColor: 'rgba(25, 118, 210, 0.04)',
                        },
                      }),
                    }}
                  >
                    Share
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Refresh />}
                    onClick={handleNewQuote}
                    sx={{
                      borderRadius: 3,
                      background: `linear-gradient(135deg, ${category.gradient[0]}, ${category.gradient[1]})`,
                      color: '#fff',
                      fontWeight: 600,
                      '&:hover': {
                        background: `linear-gradient(135deg, ${category.gradient[0]}, ${category.gradient[1]})`,
                        transform: 'scale(1.05)',
                        boxShadow: 6,
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    New Quote
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      )}

      {snackbar.open && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            background: theme.palette.mode === 'dark' ? '#333' : '#fff',
            padding: '12px 24px',
            borderRadius: 3,
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            zIndex: 9999,
          }}
        >
          <Typography>{snackbar.message}</Typography>
        </Box>
      )}
    </Container>
  );
};

export default CategoryPage;

