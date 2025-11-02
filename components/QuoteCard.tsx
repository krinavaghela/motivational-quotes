'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Share,
  Refresh,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Quote } from '@/lib/utils';

interface QuoteCardProps {
  quote: Quote | null;
  loading: boolean;
  error: string | null;
  isFavorite: boolean;
  onFavorite: () => void;
  onShare: () => void;
  onNewQuote: () => void;
}

const QuoteCard: React.FC<QuoteCardProps> = ({
  quote,
  loading,
  error,
  isFavorite,
  onFavorite,
  onShare,
  onNewQuote,
}) => {
  if (error) {
    return (
      <Card sx={{ maxWidth: 800, width: '100%', mx: 2, my: 4 }}>
        <CardContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button
            variant="contained"
            onClick={onNewQuote}
            startIcon={<Refresh />}
            fullWidth
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (loading && !quote) {
    return (
      <Card sx={{ maxWidth: 800, width: '100%', mx: 2, my: 4 }}>
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (!quote) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        sx={{
          maxWidth: 800,
          width: '100%',
          mx: 2,
          my: 4,
          position: 'relative',
          overflow: 'visible',
        }}
        elevation={3}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
          {/* Quote Icon */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
            <Typography variant="h1" sx={{ fontSize: { xs: 40, sm: 50 }, opacity: 0.2 }}>
              "
            </Typography>
          </Box>

          {/* Quote Text */}
          <Typography
            variant="h5"
            component="p"
            sx={{
              textAlign: 'center',
              mb: 4,
              fontStyle: 'italic',
              lineHeight: 1.8,
              px: { xs: 1, sm: 2 },
              fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
            }}
          >
            {quote.content}
          </Typography>

          {/* Author */}
          <Typography
            variant="h6"
            component="p"
            sx={{
              textAlign: 'center',
              mb: 4,
              color: 'primary.main',
              fontWeight: 500,
            }}
          >
            — {quote.author}
          </Typography>

          {/* Action Buttons */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              justifyContent: 'center',
              mt: 3,
            }}
          >
            <Button
              variant={isFavorite ? 'contained' : 'outlined'}
              color={isFavorite ? 'error' : 'primary'}
              startIcon={isFavorite ? <Favorite /> : <FavoriteBorder />}
              onClick={onFavorite}
              size="large"
            >
              {isFavorite ? 'Favorited' : 'Favorite'}
            </Button>

            <Button
              variant="outlined"
              color="primary"
              startIcon={<Share />}
              onClick={onShare}
              size="large"
            >
              Share
            </Button>

            <Button
              variant="contained"
              color="primary"
              startIcon={<Refresh />}
              onClick={onNewQuote}
              size="large"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'New Quote'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default QuoteCard;
