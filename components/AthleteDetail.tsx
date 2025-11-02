'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  IconButton,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Link,
  Paper,
} from '@mui/material';
import {
  ArrowBack,
  Favorite,
  FavoriteBorder,
  Share,
  PlayArrow,
  CheckCircle,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@mui/material/styles';

interface AthleteDetail {
  slug: string;
  name: string;
  headline: string;
  excerpt: string;
  thumbnail: string;
  youtube: string;
  youtubeId: string;
  story: string;
  practice: string[];
  sources: Array<{
    title: string;
    url: string;
    publisher: string;
    date: string;
  }>;
}

interface AthleteDetailProps {
  athlete: AthleteDetail;
  onBack: () => void;
  onFavorite: (athlete: AthleteDetail) => void;
  isFavorite: boolean;
}

const AthleteDetail: React.FC<AthleteDetailProps> = ({
  athlete,
  onBack,
  onFavorite,
  isFavorite,
}) => {
  const theme = useTheme();
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const handleFavorite = () => {
    onFavorite(athlete);
    setSnackbar({
      open: true,
      message: isFavorite ? 'Removed from favorites' : 'Added to favorites',
    });
    setTimeout(() => setSnackbar({ ...snackbar, open: false }), 3000);
  };

  const handleShare = async () => {
    const shareText = `${athlete.name}: ${athlete.headline} - ${athlete.excerpt}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${athlete.name}'s Story`,
          text: shareText,
          url: window.location.href,
        });
        return;
      } catch (err) {
        // User cancelled
      }
    }
    
    try {
      await navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
      setSnackbar({ open: true, message: 'Copied to clipboard!' });
      setTimeout(() => setSnackbar({ ...snackbar, open: false }), 3000);
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to share' });
      setTimeout(() => setSnackbar({ ...snackbar, open: false }), 3000);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton
          onClick={onBack}
          sx={{
            backgroundColor: theme.palette.mode === 'dark' 
              ? 'rgba(255,255,255,0.1)' 
              : 'rgba(0,0,0,0.05)',
          }}
          aria-label="Go back"
        >
          <ArrowBack />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
            {athlete.name}
          </Typography>
          <Chip label={athlete.headline} color="primary" />
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            onClick={handleFavorite}
            color={isFavorite ? 'error' : 'default'}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
          <IconButton
            onClick={handleShare}
            aria-label="Share story"
          >
            <Share />
          </IconButton>
        </Box>
      </Box>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* YouTube Video Embed */}
        <Card sx={{ mb: 4, borderRadius: 3 }} elevation={2}>
          <CardContent sx={{ p: 0 }}>
            <Box
              sx={{
                position: 'relative',
                paddingTop: '56.25%', // 16:9 aspect ratio
                height: 0,
                overflow: 'hidden',
                borderRadius: '12px 12px 0 0',
              }}
            >
              <iframe
                src={`https://www.youtube.com/embed/${athlete.youtubeId}`}
                title={`${athlete.name} - ${athlete.headline}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                }}
                aria-label={`Video about ${athlete.name}`}
              />
            </Box>
            <Box sx={{ p: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Watch: {athlete.name}'s inspirational journey
              </Typography>
              <Link
                href={`https://www.youtube.com/watch?v=${athlete.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ mt: 1, display: 'inline-block' }}
              >
                Open in YouTube →
              </Link>
            </Box>
          </CardContent>
        </Card>

        {/* Story Section */}
        <Card sx={{ mb: 4, borderRadius: 3 }} elevation={2}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" component="h2" sx={{ fontWeight: 600, mb: 3 }}>
              The Story
            </Typography>
            <Typography
              variant="body1"
              sx={{
                lineHeight: 1.8,
                fontSize: '1.1rem',
                color: 'text.primary',
              }}
            >
              {athlete.story}
            </Typography>
          </CardContent>
        </Card>

        {/* Practice Steps */}
        <Card sx={{ mb: 4, borderRadius: 3 }} elevation={2}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" component="h2" sx={{ fontWeight: 600, mb: 3 }}>
              How to Practice
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Beginner-friendly steps to apply {athlete.name.split(' ')[0]}'s techniques:
            </Typography>
            <List>
              {athlete.practice.map((step, index) => (
                <ListItem key={index} sx={{ alignItems: 'flex-start', px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 40, mt: 1 }}>
                    <CheckCircle color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5 }}>
                        Step {index + 1}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        {step}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>

        {/* Sources */}
        <Paper sx={{ p: 3, borderRadius: 3 }} elevation={0} variant="outlined">
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Sources
          </Typography>
          <List>
            {athlete.sources.map((source, index) => (
              <ListItem key={index} sx={{ px: 0, py: 1 }}>
                <ListItemText
                  primary={
                    <Link
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      color="primary"
                      underline="hover"
                    >
                      {source.title}
                    </Link>
                  }
                  secondary={`${source.publisher} • ${new Date(source.date).getFullYear()}`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </motion.div>

      {/* Snackbar */}
      {snackbar.open && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#fff',
            color: theme.palette.text.primary,
            padding: '12px 24px',
            borderRadius: 3,
            boxShadow: 6,
            zIndex: 9999,
          }}
        >
          <Typography>{snackbar.message}</Typography>
        </Box>
      )}
    </Container>
  );
};

export default AthleteDetail;


