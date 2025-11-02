import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Button,
  CircularProgress,
} from '@mui/material';
import { Search, FilterList } from '@mui/icons-material';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import AthleteCardPinterest from '@/components/AthleteCardPinterest';
import Navbar from '@/components/Navbar';
import { getStorageData } from '@/lib/storage';

interface Athlete {
  slug: string;
  name: string;
  country: string;
  sport?: string;
  headline: string;
  excerpt: string;
  thumbnail: string;
  youtube?: string;
  [key: string]: any;
}

type FilterType = 'all' | 'india' | 'world';

export default function AthletesPage() {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [displayCount, setDisplayCount] = useState(9); // Initial load - Pinterest style loads more

  useEffect(() => {
    loadAthletes();
    loadFavorites();
  }, []);

  const loadAthletes = async () => {
    try {
      const response = await fetch('/data/athletes.json');
      const data = await response.json();
      setAthletes(data);
    } catch (error) {
      console.error('Error loading athletes:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = () => {
    try {
      const stored = localStorage.getItem('athleteFavorites');
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  // Filter and search logic
  const filteredAthletes = useMemo(() => {
    let filtered = athletes;

    // Apply country filter
    if (filter === 'india') {
      filtered = filtered.filter((a) => a.country === 'India');
    } else if (filter === 'world') {
      filtered = filtered.filter((a) => a.country !== 'India');
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.name.toLowerCase().includes(query) ||
          a.headline.toLowerCase().includes(query) ||
          a.excerpt.toLowerCase().includes(query) ||
          (a.sport && a.sport.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [athletes, filter, searchQuery]);

  // Display subset for infinite scroll effect
  const displayedAthletes = filteredAthletes.slice(0, displayCount);
  const hasMore = displayCount < filteredAthletes.length;

  const handleAthleteClick = (slug: string) => {
    window.location.href = `/athletes/${slug}`;
  };

  const handleFavorite = (slug: string) => {
    const updated = favorites.includes(slug)
      ? favorites.filter((f) => f !== slug)
      : [...favorites, slug];
    setFavorites(updated);
    localStorage.setItem('athleteFavorites', JSON.stringify(updated));
  };

  const handleShare = async (athlete: Athlete) => {
    const shareText = `${athlete.name}: ${athlete.headline} - ${athlete.excerpt}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${athlete.name}'s Story`,
          text: shareText,
          url: `${window.location.origin}/athletes/${athlete.slug}`,
        });
        return;
      } catch (err) {
        // User cancelled
      }
    }
    
    try {
      await navigator.clipboard.writeText(`${shareText}\n${window.location.origin}/athletes/${athlete.slug}`);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleLoadMore = () => {
    setDisplayCount((prev) => Math.min(prev + 6, filteredAthletes.length));
  };

  const handleNavigate = (page: 'home' | 'favorites' | 'settings') => {
    if (page === 'home') {
      window.location.href = '/';
    } else if (page === 'favorites') {
      window.location.href = '/';
    } else if (page === 'settings') {
      window.location.href = '/';
    }
  };

  if (loading) {
    return (
      <>
        <Navbar favoritesCount={0} currentPage="home" onNavigate={handleNavigate} />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <CircularProgress />
        </Box>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Athletes & Mindset - Daily Motivation</title>
        <meta name="description" content="Inspirational stories from world-class athletes" />
      </Head>
      <Navbar favoritesCount={favorites.length} currentPage="home" onNavigate={handleNavigate} />
      
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                mb: 1,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Athletes & Mindset 💪
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
              Learn from the world's greatest athletes and their mental training techniques
            </Typography>
          </Box>

          {/* Search and Filter Bar */}
          <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search athletes, sports, or techniques..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
              aria-label="Search athletes"
            />
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tabs
                value={filter}
                onChange={(_, newValue) => {
                  setFilter(newValue);
                  setDisplayCount(9); // Reset display count when filter changes
                }}
                sx={{
                  minHeight: 'auto',
                  '& .MuiTab-root': {
                    minHeight: 48,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                  },
                }}
              >
                <Tab label="All" value="all" />
                <Tab label="🇮🇳 India" value="india" />
                <Tab label="🌍 World" value="world" />
              </Tabs>
            </Box>
          </Box>

          {/* Results Count */}
          {filteredAthletes.length > 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Showing {displayedAthletes.length} of {filteredAthletes.length} athletes
            </Typography>
          )}

          {/* Pinterest-Style Masonry Grid */}
          {displayedAthletes.length > 0 ? (
            <>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                    lg: 'repeat(3, 1fr)',
                  },
                  gap: { xs: 2, sm: 3 },
                  mb: 4,
                }}
              >
                <AnimatePresence>
                  {displayedAthletes.map((athlete, index) => (
                    <AthleteCardPinterest
                      key={athlete.slug}
                      athlete={athlete}
                      index={index}
                      onClick={() => handleAthleteClick(athlete.slug)}
                      onFavorite={() => handleFavorite(athlete.slug)}
                      onShare={() => handleShare(athlete)}
                      isFavorite={favorites.includes(athlete.slug)}
                    />
                  ))}
                </AnimatePresence>
              </Box>

              {/* Load More Button */}
              {hasMore && (
                <Box sx={{ textAlign: 'center', mt: 4 }}>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={handleLoadMore}
                    sx={{ borderRadius: 3, px: 4 }}
                  >
                    Load More Athletes
                  </Button>
                </Box>
              )}
            </>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                No athletes found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search or filter criteria
              </Typography>
            </Box>
          )}
        </motion.div>
      </Container>
    </>
  );
}
