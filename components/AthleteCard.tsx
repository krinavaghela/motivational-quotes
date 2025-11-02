'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  Chip,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Favorite, Share, PlayArrow } from '@mui/icons-material';

interface Athlete {
  slug: string;
  name: string;
  headline: string;
  excerpt: string;
  thumbnail: string;
  youtube: string;
}

interface AthleteCardProps {
  athlete: Athlete;
  index: number;
  onClick: () => void;
  onFavorite?: () => void;
  isFavorite?: boolean;
}

const AthleteCard: React.FC<AthleteCardProps> = ({
  athlete,
  index,
  onClick,
  onFavorite,
  isFavorite = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        sx={{
          height: '100%',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 3,
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: 6,
          },
        }}
        elevation={2}
        onClick={onClick}
        role="article"
        aria-label={`${athlete.name} - ${athlete.headline}`}
      >
        {/* Thumbnail Placeholder */}
        <Box
          sx={{
            height: 200,
            background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <Typography variant="h1" sx={{ fontSize: 80, opacity: 0.3 }}>
            🏃
          </Typography>
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              display: 'flex',
              gap: 1,
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (onFavorite) onFavorite();
            }}
          >
            <Chip
              icon={<Favorite sx={{ color: isFavorite ? 'error.main' : 'inherit' }} />}
              label={athlete.name.split(' ')[0]}
              size="small"
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' },
              }}
            />
          </Box>
        </Box>

        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h5"
            component="h2"
            sx={{
              fontWeight: 700,
              mb: 1,
              color: 'text.primary',
            }}
          >
            {athlete.name}
          </Typography>
          <Chip
            label={athlete.headline}
            size="small"
            color="primary"
            sx={{ mb: 2 }}
          />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {athlete.excerpt}
          </Typography>
          <Button
            variant="contained"
            fullWidth
            startIcon={<PlayArrow />}
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            sx={{
              borderRadius: 2,
            }}
            aria-label={`Read ${athlete.name}'s story`}
          >
            Read Story
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AthleteCard;


