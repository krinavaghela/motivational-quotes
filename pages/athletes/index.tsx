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
  Grid,
  Stack,
  Chip,
  Paper,
  Skeleton,
  ToggleButtonGroup,
  ToggleButton,
  alpha,
} from '@mui/material';
import { Search, FilterList, RestartAlt, Sort } from '@mui/icons-material';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import AthleteCardPinterest from '@/components/AthleteCardPinterest';
import Navbar from '@/components/Navbar';
import { getStorageData } from '@/lib/storage';
import { useTheme } from '@mui/material/styles';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

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
  const theme = useTheme();
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [displayCount, setDisplayCount] = useState(9); // Initial load - Pinterest style loads more
  const [sportFilter, setSportFilter] = useState<string>('all');
  const [sortOption, setSortOption] = useState<'az' | 'za'>('az');

  useEffect(() => {
    loadAthletes();
    loadFavorites();
  }, []);

  const loadAthletes = async () => {
    try {
      const response = await fetch(`${basePath}/data/athletes.json`);
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

  const availableSports = useMemo(() => {
    const sportSet = new Set<string>();
    athletes.forEach((athlete) => {
      if (athlete.sport) {
        sportSet.add(athlete.sport);
      }
    });
    return Array.from(sportSet).sort((a, b) => a.localeCompare(b));
  }, [athletes]);

  const highlightStats = useMemo(
    () => [
      { label: 'Athletes', value: athletes.length },
      { label: 'Favorites saved', value: favorites.length },
      { label: 'Sports represented', value: availableSports.length },
    ],
    [athletes.length, favorites.length, availableSports.length]
  );

  // Filter and search logic
  const filteredAthletes = useMemo(() => {
    let filtered = [...athletes];

    // Apply country filter
    if (filter === 'india') {
      filtered = filtered.filter((a) => a.country === 'India');
    } else if (filter === 'world') {
      filtered = filtered.filter((a) => a.country !== 'India');
    }

    if (sportFilter !== 'all') {
      filtered = filtered.filter((a) => a.sport && a.sport.toLowerCase() === sportFilter.toLowerCase());
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

    filtered.sort((a, b) =>
      sortOption === 'az'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );

    return filtered;
  }, [athletes, filter, searchQuery, sportFilter, sortOption]);

  // Display subset for infinite scroll effect
  const displayedAthletes = filteredAthletes.slice(0, displayCount);
  const hasMore = displayCount < filteredAthletes.length;
  const hasActiveFilters =
    filter !== 'all' ||
    sportFilter !== 'all' ||
    sortOption !== 'az' ||
    Boolean(searchQuery.trim());

  const handleAthleteClick = (slug: string) => {
    window.location.href = `${basePath}/athletes/${slug}`;
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
    const shareUrl = `${window.location.origin}${basePath}/athletes/${athlete.slug}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${athlete.name}'s Story`,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (err) {
        // User cancelled
      }
    }
    
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleLoadMore = () => {
    setDisplayCount((prev) => Math.min(prev + 6, filteredAthletes.length));
  };

  const handleNavigate = (page: 'home' | 'favorites' | 'settings') => {
    if (page === 'home') {
      window.location.href = `${basePath}/`;
    } else if (page === 'favorites') {
      window.location.href = `${basePath}/`;
    } else if (page === 'settings') {
      window.location.href = `${basePath}/`;
    }
  };

  if (loading) {
    return (
      <>
        <Navbar favoritesCount={0} currentPage="home" onNavigate={handleNavigate} />
        <Box
          sx={{
            background: 'linear-gradient(135deg, rgba(102,126,234,0.12) 0%, rgba(118,75,162,0.18) 100%)',
            py: { xs: 8, md: 12 },
          }}
        >
          <Container maxWidth="xl">
            <Skeleton variant="text" width={200} height={28} sx={{ mb: 2, bgcolor: 'secondary.main', opacity: 0.2 }} />
            <Skeleton variant="text" width="60%" height={56} sx={{ mb: 2 }} />
            <Skeleton variant="text" width="40%" height={32} sx={{ mb: 6 }} />
            <Stack direction="row" spacing={3} flexWrap="wrap">
              {Array.from({ length: 3 }).map((_, index) => (
                <Paper
                  key={index}
                  sx={{
                    flex: '1 1 200px',
                    minWidth: 200,
                    p: 3,
                    borderRadius: 3,
                    backgroundColor: 'background.paper',
                    boxShadow: '0 18px 40px rgba(102,126,234,0.12)',
                  }}
                >
                  <Skeleton variant="text" width={80} />
                  <Skeleton variant="text" width={120} height={36} />
                </Paper>
              ))}
            </Stack>
          </Container>
        </Box>
        <Container maxWidth="xl" sx={{ py: 6 }}>
          <GridSkeleton />
        </Container>
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
          {/* Hero section */}
          <Box
            sx={{
              position: 'relative',
              mb: 5,
              borderRadius: { xs: 4, md: 5 },
              px: { xs: 3, md: 6 },
              py: { xs: 5, md: 7 },
              overflow: 'hidden',
              background: 'linear-gradient(135deg, #1f1c2c 0%, #928DAB 100%)',
              color: '#fff',
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(circle at top left, rgba(255,255,255,0.25) 0%, transparent 45%), radial-gradient(circle at bottom right, rgba(255,255,255,0.18) 0%, transparent 55%)',
                pointerEvents: 'none',
              }}
            />

            <Stack spacing={2} sx={{ position: 'relative' }}>
              <Typography variant="overline" sx={{ letterSpacing: 2, opacity: 0.8 }}>
                Mindset Lab
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  lineHeight: 1.1,
                  maxWidth: 640,
                }}
              >
                Discover elite athletes and borrow their mental playbooks
              </Typography>
              <Typography
                variant="body1"
                sx={{ maxWidth: 620, color: alpha('#fff', 0.85) }}
              >
                Search, filter, and favorite world-class performers. Every profile is packed with routines, rituals, and lessons you can apply to your own goals today.
              </Typography>

              <Stack
                direction="row"
                spacing={2}
                flexWrap="wrap"
                sx={{ mt: 2 }}
              >
                {highlightStats.map((stat) => (
                  <Paper
                    key={stat.label}
                    sx={{
                      minWidth: 180,
                      px: 3,
                      py: 2.5,
                      borderRadius: 3,
                      backdropFilter: 'blur(12px)',
                      backgroundColor: alpha('#ffffff', 0.12),
                      border: '1px solid rgba(255,255,255,0.25)',
                    }}
                  >
                    <Typography variant="caption" sx={{ color: alpha('#fff', 0.75), letterSpacing: 1 }}>
                      {stat.label}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {stat.value.toLocaleString()}
                    </Typography>
                  </Paper>
                ))}
              </Stack>
            </Stack>
          </Box>

          {/* Search & filters */}
          <Stack spacing={2} sx={{ mb: 4 }}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              alignItems={{ xs: 'stretch', md: 'center' }}
            >
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search athletes, sports, or techniques..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setDisplayCount(9);
                }}
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

              <Stack direction="row" spacing={1.5} alignItems="center">
                <ToggleButtonGroup
                  value={sortOption}
                  exclusive
                  onChange={(_, newValue) => {
                    if (newValue) {
                      setSortOption(newValue);
                    }
                  }}
                  size="small"
                  sx={{
                    '& .MuiToggleButton-root': {
                      px: 2,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                    },
                  }}
                  aria-label="Sort athletes"
                >
                  <ToggleButton value="az" aria-label="Sort A to Z">
                    <Sort sx={{ fontSize: 18, mr: 0.5 }} /> A–Z
                  </ToggleButton>
                  <ToggleButton value="za" aria-label="Sort Z to A">
                    <Sort sx={{ fontSize: 18, mr: 0.5, transform: 'scaleX(-1)' }} /> Z–A
                  </ToggleButton>
                </ToggleButtonGroup>

                <Button
                  variant="outlined"
                  startIcon={<RestartAlt />}
                  onClick={() => {
                    setFilter('all');
                    setSportFilter('all');
                    setSearchQuery('');
                    setSortOption('az');
                    setDisplayCount(9);
                  }}
                  disabled={!hasActiveFilters}
                  sx={{ borderRadius: 2, whiteSpace: 'nowrap' }}
                >
                  Reset
                </Button>
              </Stack>
            </Stack>

            <Tabs
              value={filter}
              onChange={(_, newValue) => {
                setFilter(newValue);
                setDisplayCount(9);
              }}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': {
                  minHeight: 44,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                },
              }}
              aria-label="Filter athletes by region"
            >
              <Tab label="All regions" value="all" icon={<FilterList fontSize="small" />} iconPosition="start" />
              <Tab label="🇮🇳 India" value="india" />
              <Tab label="🌍 World" value="world" />
            </Tabs>

            {availableSports.length > 0 && (
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  flexWrap: 'wrap',
                  overflowX: 'auto',
                  pb: 0.5,
                  '&::-webkit-scrollbar': { height: 6 },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: theme.palette.divider,
                    borderRadius: 999,
                  },
                }}
                aria-label="Filter athletes by sport"
              >
                <Chip
                  label="All sports"
                  onClick={() => {
                    setSportFilter('all');
                    setDisplayCount(9);
                  }}
                  color={sportFilter === 'all' ? 'primary' : 'default'}
                  variant={sportFilter === 'all' ? 'filled' : 'outlined'}
                  sx={{ borderRadius: 999 }}
                />
                {availableSports.map((sport) => (
                  <Chip
                    key={sport}
                    label={sport}
                    onClick={() => {
                      setSportFilter(sport);
                      setDisplayCount(9);
                    }}
                    color={sportFilter.toLowerCase() === sport.toLowerCase() ? 'primary' : 'default'}
                    variant={sportFilter.toLowerCase() === sport.toLowerCase() ? 'filled' : 'outlined'}
                    sx={{ borderRadius: 999 }}
                  />
                ))}
              </Box>
            )}
          </Stack>

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

const GridSkeleton = () => (
  <Grid container spacing={3} role="status" aria-label="Loading athletes">
    {Array.from({ length: 9 }).map((_, index) => (
      <Grid item xs={12} sm={6} md={4} key={index}>
        <Skeleton
          variant="rounded"
          height={320}
          sx={{
            borderRadius: 3,
            transform: 'none',
            bgcolor: 'action.hover',
          }}
        />
      </Grid>
    ))}
  </Grid>
);
