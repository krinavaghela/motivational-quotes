import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Head from 'next/head';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  Grid,
  IconButton,
  InputAdornment,
  Snackbar,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  AutoAwesome,
  Favorite as FavoriteIcon,
  FavoriteBorder,
  RestartAlt,
  Search,
  Share as ShareIcon,
  Sort,
  ArrowOutward,
  ContentCopy,
  Twitter,
  Facebook,
  Instagram,
  Close,
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { motion, AnimatePresence } from 'framer-motion';

import Navbar from '@/components/Navbar';
import { athleteMindsets, AthleteMindset } from '@/lib/athletesMindset';

const STORAGE_KEY = 'athleteMindsetFavorites';
const INITIAL_VISIBLE = 9;

type SharePlatform = 'native' | 'twitter' | 'facebook' | 'instagram' | 'copy';

type ToastState = {
  open: boolean;
  message: string;
  severity: 'success' | 'info' | 'error';
};

type FavoriteMap = Record<string, AthleteMindset>;

const getFavoriteMap = (): FavoriteMap => {
  if (typeof window === 'undefined') {
    return {};
  }
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return {};
    return JSON.parse(stored) as FavoriteMap;
  } catch (error) {
    console.warn('Unable to parse athlete favorites', error);
    return {};
  }
};

const persistFavorites = (map: FavoriteMap) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
};

const themeLabel = (themeKey: string) => themeKey.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const AthleteCard = ({
  athlete,
  onSelect,
  isFavorite,
  onFavoriteToggle,
}: {
  athlete: AthleteMindset;
  onSelect: (athlete: AthleteMindset) => void;
  isFavorite: boolean;
  onFavoriteToggle: (athlete: AthleteMindset) => void;
}) => {
  const theme = useTheme();
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
    >
      <Card
        elevation={0}
        sx={{
          height: '100%',
          borderRadius: 5,
          position: 'relative',
          overflow: 'hidden',
          backdropFilter: 'blur(18px)',
          background: 'linear-gradient(145deg, #ffffff 0%, #eef1ff 100%)',
          border: '1px solid rgba(200, 208, 245, 0.65)',
          boxShadow: '0 24px 48px rgba(120, 135, 200, 0.25)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          color: theme.palette.text.primary,
          '&:hover': {
            transform: 'translateY(-10px)',
            boxShadow: '0 34px 70px rgba(90, 110, 200, 0.35)',
          },
        }}
      >
        <CardActionArea sx={{ height: '100%', alignItems: 'stretch', display: 'flex', flexDirection: 'column' }} onClick={() => onSelect(athlete)}>
          <Box
            component="div"
            sx={{
              position: 'relative',
              width: '100%',
              pt: '56%',
              borderBottom: '1px solid rgba(255,255,255,0.4)',
              overflow: 'hidden',
            }}
          >
            <Box
              component="img"
              alt={athlete.name}
              src={athlete.image}
              sx={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'saturate(1.05)',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(10,10,20,0.0) 0%, rgba(5,5,15,0.55) 100%)',
              }}
            />
            <Stack
              direction="row"
              spacing={1}
              sx={{ position: 'absolute', bottom: 16, left: 16, right: 16, alignItems: 'center' }}
            >
              <Avatar src={athlete.image} alt={athlete.name} sx={{ border: '2px solid rgba(255,255,255,0.7)' }} />
              <Box>
                <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 700 }}>
                  {athlete.name}
                </Typography>
                <Typography variant="caption" sx={{ color: alpha('#fff', 0.8) }}>
                  {athlete.sport} · {athlete.country}
                </Typography>
              </Box>
            </Stack>
          </Box>
          <CardContent sx={{ flexGrow: 1, width: '100%', p: 3, color: theme.palette.text.primary }}>
            <Stack spacing={2}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#291b52' }}>
                {athlete.headline}
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.6, color: '#43376b' }}>
                {athlete.summary}
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {athlete.themes.slice(0, 3).map((themeKey) => (
                  <Chip
                    key={themeKey}
                    size="small"
                    label={themeLabel(themeKey)}
                    sx={{
                      borderRadius: 999,
                      backgroundColor: alpha('#4c51bf', 0.14),
                      color: '#3a2b7a',
                      fontWeight: 600,
                    }}
                  />
                ))}
              </Stack>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={isFavorite ? <FavoriteIcon /> : <FavoriteBorder />}
                  onClick={(event) => {
                    event.stopPropagation();
                    onFavoriteToggle(athlete);
                  }}
                  sx={{
                    borderRadius: 999,
                    px: 2.5,
                    textTransform: 'none',
                    fontWeight: 600,
                    borderColor: alpha('#4c51bf', 0.3),
                    color: isFavorite ? '#d53f8c' : '#4c51bf',
                    '&:hover': {
                      borderColor: '#4c51bf',
                      backgroundColor: alpha('#4c51bf', 0.08),
                    },
                  }}
                >
                  {isFavorite ? 'Saved' : 'Save'}
                </Button>
                <Button
                  variant="text"
                  size="small"
                  endIcon={<ArrowOutward fontSize="small" />}
                  onClick={() => onSelect(athlete)}
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                  Learn mindset
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </CardActionArea>
      </Card>
    </motion.div>
  );
};

export default function AthleteMindsetGallery() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [searchQuery, setSearchQuery] = useState('');
  const [themeFilter, setThemeFilter] = useState<string>('all');
  const [sortOption, setSortOption] = useState<'az' | 'za'>('az');
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [selectedAthlete, setSelectedAthlete] = useState<AthleteMindset | null>(null);
  const [favorites, setFavorites] = useState<FavoriteMap>({});
  const [toast, setToast] = useState<ToastState>({ open: false, message: '', severity: 'success' });
  const [randomOpen, setRandomOpen] = useState(false);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setFavorites(getFavoriteMap());
  }, []);

  const themeOptions = useMemo(() => {
    const set = new Set<string>();
    athleteMindsets.forEach((athlete) => athlete.themes.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, []);

  const filteredAthletes = useMemo(() => {
    let list = [...athleteMindsets];

    if (themeFilter !== 'all') {
      list = list.filter((athlete) => athlete.themes.includes(themeFilter));
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      list = list.filter((athlete) =>
        [athlete.name, athlete.sport, athlete.headline, athlete.summary]
          .join(' ')
          .toLowerCase()
          .includes(query)
      );
    }

    list.sort((a, b) =>
      sortOption === 'az' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );

    return list;
  }, [searchQuery, themeFilter, sortOption]);

  const displayedAthletes = filteredAthletes.slice(0, visibleCount);
  const hasMore = visibleCount < filteredAthletes.length;

  const favoritesCount = Object.keys(favorites).length;

  const handleFavoriteToggle = (athlete: AthleteMindset) => {
    setFavorites((prev) => {
      const next = { ...prev };
      if (next[athlete.slug]) {
        delete next[athlete.slug];
        setToast({ open: true, message: `${athlete.name} removed from favorites`, severity: 'info' });
      } else {
        next[athlete.slug] = athlete;
        setToast({ open: true, message: `${athlete.name} saved`, severity: 'success' });
      }
      persistFavorites(next);
      return next;
    });
  };

  const handleShare = (athlete: AthleteMindset, platform: SharePlatform) => {
    const url = `${window.location.origin}/athletes/${athlete.slug}`;
    const text = `${athlete.name}: ${athlete.headline}`;

    if (platform === 'native' && navigator.share) {
      navigator
        .share({ title: athlete.name, text, url })
        .catch(() => setToast({ open: true, message: 'Share cancelled', severity: 'info' }));
      return;
    }

    if (platform === 'copy') {
      navigator.clipboard
        .writeText(url)
        .then(() => setToast({ open: true, message: 'Link copied', severity: 'success' }))
        .catch(() => setToast({ open: true, message: 'Copy failed', severity: 'error' }));
      return;
    }

    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(text);

    const target: Record<Exclude<SharePlatform, 'native'>, string | null> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      instagram: null,
      copy: url,
    };

    const shareUrl = target[platform as Exclude<SharePlatform, 'native'>];

    if (!shareUrl) {
      navigator.clipboard
        .writeText(url)
        .then(() =>
          setToast({
            open: true,
            message: 'Instagram sharing is manual—link copied for you!',
            severity: 'info',
          })
        )
        .catch(() => setToast({ open: true, message: 'Copy failed', severity: 'error' }));
      return;
    }

    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + 6, filteredAthletes.length));
  }, [filteredAthletes.length]);

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore();
        }
      },
      { rootMargin: '200px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [handleLoadMore, hasMore]);

  const resetFilters = () => {
    setThemeFilter('all');
    setSortOption('az');
    setSearchQuery('');
    setVisibleCount(INITIAL_VISIBLE);
  };

  const openRandomAthlete = () => {
    if (filteredAthletes.length === 0) return;
    const random = filteredAthletes[Math.floor(Math.random() * filteredAthletes.length)];
    setSelectedAthlete(random);
    setRandomOpen(true);
  };

  const heroStats = [
    { label: 'Legends decoded', value: athleteMindsets.length },
    { label: 'Mindset themes', value: themeOptions.length },
    { label: 'Saved playbooks', value: favoritesCount },
  ];

  return (
    <>
      <Head>
        <title>Athlete Mindset Playbooks</title>
        <meta name="description" content="Borrow elite routines, rituals, and mental models from the world’s most resilient athletes." />
      </Head>
      <Navbar favoritesCount={favoritesCount} currentPage="home" onNavigate={() => {}} />

      <Container maxWidth="xl" sx={{ py: 5 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Box
            sx={{
              position: 'relative',
              borderRadius: 5,
              px: { xs: 3, md: 6 },
              py: { xs: 5, md: 7 },
              mb: 5,
              overflow: 'hidden',
              background: 'linear-gradient(135deg, #15192f 0%, #2b1c54 55%, #47297d 100%)',
              border: '1px solid rgba(255,255,255,0.14)',
              boxShadow: '0 40px 85px rgba(21, 24, 50, 0.65)',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(circle at top right, rgba(255,255,255,0.32), transparent 60%)',
              }}
            />
            <Stack spacing={3} sx={{ position: 'relative' }}>
              <Typography variant="overline" sx={{ letterSpacing: 2, color: 'rgba(255,255,255,0.72)' }}>
                Elite mindsets for everyday breakthroughs
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, lineHeight: { xs: 1.1, md: 1.05 }, maxWidth: 720, color: '#fff' }}>
                Borrow routines, rituals, and mental models from sports icons
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.74)', maxWidth: 680 }}>
                Scroll through glassy playbooks, filter by the mindset you need, save your favourites, and share the stories that move you.
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 1 }}>
                {heroStats.map((stat) => (
                  <Box
                    key={stat.label}
                    sx={{
                      flex: 1,
                      minWidth: 180,
                      px: 3,
                      py: 2.5,
                      borderRadius: 4,
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(18px)',
                      border: '1px solid rgba(255,255,255,0.25)',
                      boxShadow: '0 18px 38px rgba(20, 24, 55, 0.35)',
                    }}
                  >
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.75)', letterSpacing: 1 }}>
                      {stat.label}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff' }}>
                      {stat.value.toLocaleString()}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Stack>
          </Box>

          <Stack spacing={2.5} sx={{ mb: 4 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', lg: 'row' },
                gap: 2,
                padding: { xs: 2.2, md: 2.8 },
                borderRadius: 4,
                backgroundColor: alpha('#f7f8ff', 0.6),
                backdropFilter: 'blur(22px)',
                border: '1px solid rgba(210, 216, 250, 0.6)',
                boxShadow: '0 24px 48px rgba(170, 180, 225, 0.28)',
              }}
            >
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search by athlete, sport, or mindset keyword..."
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setVisibleCount(INITIAL_VISIBLE);
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
                    borderRadius: 999,
                    backgroundColor: alpha('#ffffff', 0.75),
                    '& fieldset': {
                      border: '1px solid rgba(210, 216, 250, 0.7)',
                    },
                    '&:hover fieldset': {
                      borderColor: alpha(theme.palette.primary.main, 0.65),
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
                aria-label="Search athletes"
              />

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', sm: 'center' }} justifyContent="flex-end">
                <ToggleButtonGroup
                  value={sortOption}
                  exclusive
                  onChange={(_, value) => {
                    if (value) {
                      setSortOption(value);
                      setVisibleCount(INITIAL_VISIBLE);
                    }
                  }}
                  size="small"
                  aria-label="Sort athletes"
                  sx={{
                    backgroundColor: alpha('#ffffff', 0.65),
                    borderRadius: 999,
                    border: '1px solid rgba(205, 212, 248, 0.65)',
                    '& .MuiToggleButton-root': {
                      borderRadius: 999,
                      px: 2.5,
                      textTransform: 'none',
                      fontWeight: 600,
                    },
                    '& .Mui-selected': {
                      background: 'linear-gradient(135deg, rgba(118,75,162,0.85), rgba(102,126,234,0.85))',
                      color: '#fff',
                      boxShadow: '0 12px 24px rgba(102,126,234,0.28)',
                    },
                  }}
                >
                  <ToggleButton value="az" aria-label="A to Z">
                    <Sort sx={{ fontSize: 18, mr: 0.5 }} /> A–Z
                  </ToggleButton>
                  <ToggleButton value="za" aria-label="Z to A">
                    <Sort sx={{ fontSize: 18, mr: 0.5, transform: 'scaleX(-1)' }} /> Z–A
                  </ToggleButton>
                </ToggleButtonGroup>

                <Button
                  variant="contained"
                  startIcon={<RestartAlt />}
                  onClick={resetFilters}
                  disabled={themeFilter === 'all' && sortOption === 'az' && !searchQuery}
                  sx={{
                    borderRadius: 999,
                    px: 3,
                    textTransform: 'none',
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.85), rgba(229,233,255,0.95))',
                    color: theme.palette.text.primary,
                    boxShadow: '0 18px 32px rgba(160, 170, 215, 0.35)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.92), rgba(215,222,255,1))',
                    },
                    '&.Mui-disabled': {
                      opacity: 0.45,
                    },
                  }}
                >
                  Reset
                </Button>
              </Stack>
            </Box>

            <Box
              sx={{
                overflowX: 'auto',
                display: 'flex',
                gap: 1,
                pb: 0.5,
                '&::-webkit-scrollbar': { height: 6 },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.3),
                  borderRadius: 999,
                },
              }}
            >
              <ToggleButtonGroup
                value={themeFilter}
                exclusive
                onChange={(_, value) => {
                  if (value !== null) {
                    setThemeFilter(value);
                    setVisibleCount(INITIAL_VISIBLE);
                  }
                }}
                size={isMobile ? 'small' : 'medium'}
                aria-label="Mindset theme"
                sx={{
                  backgroundColor: alpha('#ffffff', 0.65),
                  borderRadius: 999,
                  border: '1px solid rgba(210, 216, 250, 0.65)',
                  '& .MuiToggleButton-root': {
                    borderRadius: 999,
                    textTransform: 'capitalize',
                    px: 2.5,
                  },
                  '& .Mui-selected': {
                    background: 'linear-gradient(135deg, rgba(76,81,191,0.85), rgba(118,75,162,0.85))',
                    color: '#fff',
                    boxShadow: '0 12px 24px rgba(90,100,190,0.28)',
                  },
                }}
              >
                <ToggleButton value="all">
                  All focuses
                </ToggleButton>
                {themeOptions.map((themeKey) => (
                  <ToggleButton key={themeKey} value={themeKey}>
                    {themeLabel(themeKey)}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Box>
          </Stack>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Showing {displayedAthletes.length} of {filteredAthletes.length} mindset playbooks
          </Typography>

          <Grid container spacing={3}>
            <AnimatePresence>
              {displayedAthletes.map((athlete) => (
                <Grid item xs={12} sm={6} md={4} key={athlete.slug} sx={{ display: 'flex' }}>
                  <AthleteCard
                    athlete={athlete}
                    onSelect={(a) => {
                      setSelectedAthlete(a);
                      setRandomOpen(false);
                    }}
                    isFavorite={Boolean(favorites[athlete.slug])}
                    onFavoriteToggle={handleFavoriteToggle}
                  />
                </Grid>
              ))}
            </AnimatePresence>
          </Grid>

          {hasMore && (
            <Box ref={loadMoreRef} sx={{ textAlign: 'center', mt: 6 }}>
              <Button
                variant="outlined"
                startIcon={<ShareIcon sx={{ transform: 'rotate(90deg)' }} />}
                onClick={handleLoadMore}
                sx={{
                  borderRadius: 999,
                  px: 4,
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Load more mindsets
              </Button>
            </Box>
          )}

          {!hasMore && filteredAthletes.length > 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
              End of the wall—tap the spark icon for a random mentor.
            </Typography>
          )}

          {filteredAthletes.length === 0 && (
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
                borderRadius: 4,
                backgroundColor: alpha(theme.palette.primary.main, 0.07),
              }}
            >
              <Typography variant="h6" sx={{ mb: 1 }}>
                No playbooks match that filter yet.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Reset your filters or try searching by a different quality—resilience, leadership, calm.
              </Typography>
            </Box>
          )}
        </motion.div>
      </Container>

      <Tooltip title="Surprise me with a mindset" placement="left">
        <Fab
          color="primary"
          size="large"
          onClick={openRandomAthlete}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            boxShadow: '0 22px 45px rgba(102,126,234,0.35)',
          }}
        >
          <AutoAwesome />
        </Fab>
      </Tooltip>

      <Dialog
        open={Boolean(selectedAthlete)}
        onClose={() => setSelectedAthlete(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 5,
            overflow: 'hidden',
            backdropFilter: 'blur(24px)',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.92), rgba(236,240,255,0.95))',
            border: '1px solid rgba(205, 212, 248, 0.6)',
            boxShadow: '0 40px 88px rgba(100,110,190,0.28)',
          },
        }}
      >
        {selectedAthlete && (
          <>
            <Box sx={{ position: 'relative', width: '100%', pt: '40%' }}>
              <Box
                component="img"
                src={selectedAthlete.image}
                alt={selectedAthlete.name}
                sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(5,5,15,0.0) 0%, rgba(5,8,30,0.65) 100%)' }} />
              <IconButton
                onClick={() => setSelectedAthlete(null)}
                sx={{ position: 'absolute', top: 16, right: 16, color: '#fff', backgroundColor: alpha('#000', 0.3) }}
              >
                <Close />
              </IconButton>
              <Stack direction="row" spacing={2} sx={{ position: 'absolute', bottom: 24, left: 24, alignItems: 'center' }}>
                <Avatar src={selectedAthlete.image} alt={selectedAthlete.name} sx={{ border: '2px solid rgba(255,255,255,0.7)' }} />
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff' }}>
                    {selectedAthlete.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: alpha('#fff', 0.8) }}>
                    {selectedAthlete.sport} · {selectedAthlete.country}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <DialogContent sx={{ pt: 4, pb: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                {selectedAthlete.headline}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {selectedAthlete.summary}
              </Typography>

              <Stack spacing={3}>
                <Box>
                  <Typography variant="overline" sx={{ letterSpacing: 1.2 }}>
                    Defining moment
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1.2, lineHeight: 1.7 }}>
                    {selectedAthlete.signatureMoment}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="overline" sx={{ letterSpacing: 1.2 }}>
                    Mindset codes
                  </Typography>
                  <Stack component="ul" spacing={1.2} sx={{ mt: 1.2, pl: 2, '& li': { lineHeight: 1.6 } }}>
                    {selectedAthlete.mindsets.map((item) => (
                      <Typography component="li" variant="body2" key={item}>
                          {item}
                      </Typography>
                    ))}
                  </Stack>
                </Box>

                <Box>
                  <Typography variant="overline" sx={{ letterSpacing: 1.2 }}>
                    Daily habits to steal
                  </Typography>
                  <Stack component="ul" spacing={1.2} sx={{ mt: 1.2, pl: 2 }}>
                    {selectedAthlete.dailyHabits.map((item) => (
                      <Typography component="li" variant="body2" key={item}>
                        {item}
                      </Typography>
                    ))}
                  </Stack>
                </Box>

                <Box>
                  <Typography variant="overline" sx={{ letterSpacing: 1.2 }}>
                    Bring it into your life
                  </Typography>
                  <Stack component="ul" spacing={1.2} sx={{ mt: 1.2, pl: 2 }}>
                    {selectedAthlete.transferToLife.map((item) => (
                      <Typography component="li" variant="body2" key={item}>
                        {item}
                      </Typography>
                    ))}
                  </Stack>
                </Box>
              </Stack>
            </DialogContent>

            <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 3 }}>
              <Stack direction="row" spacing={1.5}>
                <Button
                  variant="contained"
                  startIcon={favorites[selectedAthlete.slug] ? <FavoriteIcon /> : <FavoriteBorder />}
                  onClick={() => handleFavoriteToggle(selectedAthlete)}
                  sx={{ borderRadius: 999, textTransform: 'none', fontWeight: 600 }}
                >
                  {favorites[selectedAthlete.slug] ? 'Saved' : 'Save playbook'}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ShareIcon />}
                  onClick={() =>
                    handleShare(
                      selectedAthlete,
                      typeof navigator !== 'undefined' && typeof navigator.share === 'function'
                        ? 'native'
                        : 'twitter'
                    )
                  }
                  sx={{ borderRadius: 999, textTransform: 'none', fontWeight: 600 }}
                >
                  Share insight
                </Button>
              </Stack>
              <Button onClick={() => setSelectedAthlete(null)} startIcon={<ArrowOutward />} sx={{ textTransform: 'none', fontWeight: 600 }}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={toast.severity}
          variant="filled"
          iconMapping={{
            success: <FavoriteIcon fontSize="small" />,
            info: <ShareIcon fontSize="small" />,
            error: <ContentCopy fontSize="small" />,
          }}
          sx={{ borderRadius: 3 }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
}
