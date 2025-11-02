'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
  alpha,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Favorite, FavoriteBorder, Share } from '@mui/icons-material';

interface Athlete {
  slug: string;
  name: string;
  country: string;
  sport?: string;
  headline: string;
  excerpt: string;
  thumbnail: string;
  youtube?: string;
}

interface AthleteCardPinterestProps {
  athlete: Athlete;
  index: number;
  onClick: () => void;
  onFavorite?: () => void;
  onShare?: () => void;
  isFavorite?: boolean;
}

const AthleteCardPinterest: React.FC<AthleteCardPinterestProps> = ({
  athlete,
  index,
  onClick,
  onFavorite,
  onShare,
  isFavorite = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Varied card heights for masonry effect (Pinterest-style)
  const cardHeights = [280, 320, 300, 340, 310, 330];
  const cardHeight = cardHeights[index % cardHeights.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{ height: '100%' }}
    >
      <Card
        onClick={onClick}
        sx={{
          height: '100%',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 4,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: isHovered ? 8 : 2,
          transform: isHovered ? 'scale(1.02) translateY(-4px)' : 'scale(1)',
          '&:hover': {
            boxShadow: 12,
          },
        }}
        elevation={0}
        role="article"
        aria-label={`${athlete.name} - ${athlete.headline}`}
      >
        {/* Image/Thumbnail with Overlay */}
        <Box
          sx={{
            height: cardHeight,
            position: 'relative',
            background: `linear-gradient(135deg, ${getColorForAthlete(athlete.name)} 0%, ${getColorForAthlete(athlete.name, true)} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Emoji/Icon Placeholder */}
          <Typography 
            variant="h1" 
            sx={{ 
              fontSize: { xs: 60, sm: 80 }, 
              opacity: 0.2,
              transform: isHovered ? 'scale(1.1)' : 'scale(1)',
              transition: 'transform 0.3s ease',
            }}
          >
            {getEmojiForSport(athlete.sport)}
          </Typography>

          {/* Gradient Overlay on Hover */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: isHovered
                ? `linear-gradient(to bottom, ${alpha('#000', 0.4)} 0%, ${alpha('#000', 0.6)} 100%)`
                : `linear-gradient(to bottom, transparent 0%, ${alpha('#000', 0.7)} 100%)`,
              transition: 'background 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              p: 3,
            }}
          >
            {/* Country/Sport Badge */}
            <Box sx={{ mb: 'auto', mt: 1 }}>
              <Chip
                label={athlete.country === 'India' ? '🇮🇳 India' : athlete.country}
                size="small"
                sx={{
                  backgroundColor: alpha('#fff', 0.9),
                  color: 'text.primary',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                }}
              />
              {athlete.sport && (
                <Chip
                  label={athlete.sport}
                  size="small"
                  sx={{
                    backgroundColor: alpha('#fff', 0.8),
                    color: 'text.secondary',
                    ml: 1,
                    fontSize: '0.7rem',
                  }}
                />
              )}
            </Box>

            {/* Name and Headline */}
            <Box>
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  fontWeight: 800,
                  color: '#fff',
                  mb: 0.5,
                  textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
                }}
              >
                {athlete.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: alpha('#fff', 0.95),
                  fontWeight: 500,
                  textShadow: '0 1px 4px rgba(0,0,0,0.5)',
                  fontSize: { xs: '0.85rem', sm: '0.9rem' },
                }}
              >
                {athlete.headline}
              </Typography>
            </Box>
          </Box>

          {/* Action Buttons (visible on hover) */}
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              display: 'flex',
              gap: 1,
              opacity: isHovered ? 1 : 0.7,
              transition: 'opacity 0.3s ease',
            }}
          >
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                if (onFavorite) onFavorite();
              }}
              sx={{
                backgroundColor: alpha('#fff', 0.9),
                color: isFavorite ? 'error.main' : 'text.secondary',
                '&:hover': {
                  backgroundColor: '#fff',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.2s ease',
              }}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isFavorite ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
            </IconButton>
            {onShare && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onShare) onShare();
                }}
                sx={{
                  backgroundColor: alpha('#fff', 0.9),
                  color: 'text.secondary',
                  '&:hover': {
                    backgroundColor: '#fff',
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.2s ease',
                }}
                aria-label="Share athlete story"
              >
                <Share fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Box>

        {/* Excerpt Content */}
        <CardContent sx={{ p: 2.5, pb: 2 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              lineHeight: 1.6,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
            }}
          >
            {athlete.excerpt}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Helper function to get emoji based on sport
const getEmojiForSport = (sport?: string): string => {
  const sportEmojis: { [key: string]: string } = {
    'Tennis': '🎾',
    'Basketball': '🏀',
    'Gymnastics': '🤸',
    'Shooting': '🎯',
    'Badminton': '🏸',
    'Javelin Throw': '⚡',
    'Football': '⚽',
  };
  return sportEmojis[sport || ''] || '🏃';
};

// Helper function to get gradient colors for athletes
const getColorForAthlete = (name: string, secondary: boolean = false): string => {
  const colors: { [key: string]: string[] } = {
    'Novak Djokovic': ['#667eea', '#764ba2'],
    'Serena Williams': ['#f093fb', '#f5576c'],
    'Michael Jordan': ['#4facfe', '#00f2fe'],
    'Simone Biles': ['#fa709a', '#fee140'],
    'Abhinav Bindra': ['#30cfd0', '#330867'],
    'PV Sindhu': ['#a8edea', '#fed6e3'],
    'Anjum Moudgil': ['#ff9a9e', '#fecfef'],
    'Neeraj Chopra': ['#ffecd2', '#fcb69f'],
    'Lionel Messi': ['#a8edea', '#fed6e3'],
    'Kobe Bryant': ['#2c3e50', '#34495e'],
  };
  const athleteColors = colors[name] || ['#667eea', '#764ba2'];
  return athleteColors[secondary ? 1 : 0];
};

export default AthleteCardPinterest;


