'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  IconButton,
  Grid,
  Alert,
  Button,
} from '@mui/material';
import {
  Favorite,
  Delete,
  ArrowBack,
  Share,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote } from '@/lib/utils';

interface FavoritesScreenProps {
  favorites: Quote[];
  onRemove: (quoteId: string) => void;
  onBack: () => void;
  onShare: (quote: Quote) => void;
}

const FavoritesScreen: React.FC<FavoritesScreenProps> = ({
  favorites,
  onRemove,
  onBack,
  onShare,
}) => {
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  useEffect(() => {
    if (snackbar.open) {
      const timer = setTimeout(() => {
        setSnackbar({ ...snackbar, open: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [snackbar]);

  const handleShare = async (quote: any) => {
    const result = await onShare(quote);
    setSnackbar({ open: true, message: 'Copied to clipboard!' });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={onBack} color="primary" size="large">
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Favorite Quotes
        </Typography>
        <Box sx={{ ml: 'auto' }}>
          <Typography variant="body1" color="text.secondary">
            {favorites.length} {favorites.length === 1 ? 'quote' : 'quotes'}
          </Typography>
        </Box>
      </Box>

      {/* Empty State */}
      {favorites.length === 0 ? (
        <Alert severity="info" sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            No favorite quotes yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Start adding quotes to your favorites by clicking the heart icon on any quote!
          </Typography>
          <Button variant="contained" onClick={onBack} sx={{ mt: 2 }}>
            Browse Quotes
          </Button>
        </Alert>
      ) : (
        <Grid container spacing={3}>
          <AnimatePresence>
            {favorites.map((quote, index) => (
              <Grid item xs={12} sm={6} md={4} key={quote._id}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                    }}
                    elevation={2}
                  >
                    <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                      {/* Quote Icon */}
                      <Box sx={{ mb: 2 }}>
                        <Favorite sx={{ color: 'error.main', fontSize: 30, opacity: 0.3 }} />
                      </Box>

                      {/* Quote Text */}
                      <Typography
                        variant="body1"
                        sx={{
                          mb: 2,
                          fontStyle: 'italic',
                          lineHeight: 1.7,
                          display: '-webkit-box',
                          WebkitLineClamp: 4,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        "{quote.content}"
                      </Typography>

                      {/* Author */}
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'primary.main',
                          fontWeight: 500,
                          mb: 2,
                        }}
                      >
                        — {quote.author}
                      </Typography>
                    </CardContent>

                    {/* Actions */}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 1,
                        p: 2,
                        pt: 0,
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() => handleShare(quote)}
                        color="primary"
                      >
                        <Share fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => onRemove(quote._id)}
                        color="error"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </AnimatePresence>
        </Grid>
      )}

      {/* Snackbar */}
      {snackbar.open && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'primary.main',
            color: 'white',
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

export default FavoritesScreen;

