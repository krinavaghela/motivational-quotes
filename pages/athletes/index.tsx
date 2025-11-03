'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Head from 'next/head';
import {
  Alert,
  Box,
  Button,
  Card,
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
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Skeleton,
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
  Close,
  ContentCopy,
  Favorite as FavoriteIcon,
  FavoriteBorder,
  Facebook,
  Instagram,
  RestartAlt,
  Search,
  Share as ShareIcon,
  Sort,
  Twitter,
  FilterList,
  ArrowOutward,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { alpha, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import Navbar from '@/components/Navbar';
import { getFavorites, removeFromFavorites, saveToFavorites } from '@/lib/utils';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const INITIAL_VISIBLE_CARDS = 12;

interface QuoteCardData {
  _id: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
}

type SharePlatform = 'twitter' | 'facebook' | 'instagram' | 'copy' | 'native';

const CATEGORY_GRADIENTS: Record<string, [string, string]> = {
  animals: ['#ff9a9e', '#fecfef'],
  philosophy: ['#a18cd1', '#fbc2eb'],
  psychology: ['#fddb92', '#d1fdff'],
  nature: ['#a8edea', '#fed6e3'],
  spirituality: ['#f6d365', '#fda085'],
  sports: ['#84fab0', '#8fd3f4'],
  art: ['#cfd9df', '#e2ebf0'],
  technology: ['#89f7fe', '#66a6ff'],
  ai: ['#d4fc79', '#96e6a1'],
  love: ['#fbc2eb', '#a6c1ee'],
  success: ['#fdfbfb', '#ebedee'],
  health: ['#fa709a', '#fee140'],
  travel: ['#ffecd2', '#fcb69f'],
  default: ['#e0c3fc', '#8ec5fc'],
};

const SOCIAL_PLATFORMS: Array<{
  id: SharePlatform;
  label: string;
  icon: React.ReactNode;
  description?: string;
}> = [
  { id: 'twitter', label: 'Share to Twitter', icon: <Twitter fontSize="small" /> },
  { id: 'facebook', label: 'Share to Facebook', icon: <Facebook fontSize="small" /> },
  { id: 'instagram', label: 'Share to Instagram', icon: <Instagram fontSize="small" /> },
  { id: 'copy', label: 'Copy Link', icon: <ContentCopy fontSize="small" /> },
];

const QuoteCard: React.FC<{
  quote: QuoteCardData;
  isFavorite: boolean;
  onFavoriteToggle: (quote: QuoteCardData) => void;
  onShare: (quote: QuoteCardData, platform: SharePlatform) => void;
}> = ({ quote, isFavorite, onFavoriteToggle, onShare }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const gradient = CATEGORY_GRADIENTS[quote.category] ?? CATEGORY_GRADIENTS.default;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        elevation={0}
        sx={{
          position: 'relative',
          height: '100%',
          borderRadius: 4,
          overflow: 'hidden',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 24px 55px rgba(138, 173, 255, 0.25)',
          border: `1px solid ${alpha(theme.palette.common.black, 0.06)}`,
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 32px 70px rgba(138, 173, 255, 0.28)',
          },
          transition: 'all 0.3s ease',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            px: 3,
            py: 4,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: 280,
            background: `linear-gradient(135deg, ${gradient[0]} 0%, ${gradient[1]} 100%)`,
            color: theme.palette.getContrastText(gradient[1]),
          }}
        >
          <Box sx={{ position: 'absolute', inset: 0, opacity: 0.18, background: 'radial-gradient(circle at top right, rgba(255,255,255,0.6), transparent 55%)' }} />

          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ position: 'relative', mb: 3 }}>
            <Chip
              label={quote.category.charAt(0).toUpperCase() + quote.category.slice(1)}
              size="small"
              sx={{
                backgroundColor: alpha(theme.palette.common.white, 0.25),
                color: theme.palette.common.white,
                backdropFilter: 'blur(5px)',
                fontWeight: 600,
                letterSpacing: 0.4,
                textTransform: 'capitalize',
              }}
            />
          </Stack>

          <CardContent sx={{ position: 'relative', px: 0, pt: 0 }}>
            <Typography
              variant="h6"
              component="blockquote"
              sx={{
                fontWeight: 600,
                fontSize: { xs: '1.1rem', sm: '1.35rem' },
                lineHeight: 1.6,
                fontStyle: 'italic',
              }}
            >
              “{quote.content}”
            </Typography>
            <Typography
              variant="subtitle2"
              component="p"
              sx={{
                mt: 3,
                fontWeight: 600,
                opacity: 0.85,
                letterSpacing: 0.4,
              }}
            >
              — {quote.author}
            </Typography>
          </CardContent>

          <Stack direction="row" spacing={1.5} sx={{ position: 'relative', mt: 3 }}>
            <Button
              size="small"
              variant="outlined"
              color="inherit"
              startIcon={isFavorite ? <FavoriteIcon /> : <FavoriteBorder />}
              onClick={() => onFavoriteToggle(quote)}
              sx={{
                borderRadius: 999,
                px: 2.5,
                borderColor: alpha(theme.palette.common.white, 0.7),
                color: theme.palette.common.white,
                '&:hover': {
                  borderColor: theme.palette.common.white,
                  backgroundColor: alpha(theme.palette.common.white, 0.12),
                },
              }}
            >
              {isFavorite ? 'Favorited' : 'Favorite'}
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="inherit"
              startIcon={<ShareIcon />}
              onClick={(event) => {
                if (typeof navigator.share === 'function') {
                  onShare(quote, 'native');
                  return;
                }
                setAnchorEl(event.currentTarget);
              }}
              sx={{
                borderRadius: 999,
                px: 2.5,
                borderColor: alpha(theme.palette.common.white, 0.7),
                color: theme.palette.common.white,
                '&:hover': {
                  borderColor: theme.palette.common.white,
                  backgroundColor: alpha(theme.palette.common.white, 0.12),
                },
              }}
            >
              Share
            </Button>
          </Stack>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={() => setAnchorEl(null)}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            {SOCIAL_PLATFORMS.map((platform) => (
              <MenuItem
                key={platform.id}
                onClick={() => {
                  onShare(quote, platform.id);
                  setAnchorEl(null);
                }}
              >
                <ListItemIcon>{platform.icon}</ListItemIcon>
                <ListItemText primary={platform.label} />
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Card>
    </motion.div>
  );
};

export default function QuotesGalleryPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [quotes, setQuotes] = useState<QuoteCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortOption, setSortOption] = useState<'az' | 'za'>('az');
  const [displayCount, setDisplayCount] = useState(INITIAL_VISIBLE_CARDS);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [randomQuote, setRandomQuote] = useState<QuoteCardData | null>(null);
  const [randomDialogOpen, setRandomDialogOpen] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'info' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loadQuotes = async () => {
      try {
        const response = await fetch(`${basePath}/data/quotes.json`);
        const data: Array<{ text: string; author: string; category: string }> = await response.json();
        const mapped = data.map((quote, index) => ({
          _id: `${quote.category}-${index}-${quote.text.substring(0, 24).replace(/[^a-z0-9]+/gi, '-')}`.toLowerCase(),
          content: quote.text,
          author: quote.author,
          category: quote.category,
          tags: [quote.category],
        }));
        setQuotes(mapped);
      } catch (error) {
        console.error('Error loading quotes:', error);
        setToast({ open: true, message: 'Unable to load quotes. Please try again.', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };

    loadQuotes();
  }, []);

  useEffect(() => {
    const storedFavorites = getFavorites();
    setFavoriteIds(new Set(storedFavorites.map((quote) => quote._id)));
  }, []);

  const categories = useMemo(() => {
    const unique = new Set<string>();
    quotes.forEach((quote) => unique.add(quote.category));
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [quotes]);

  const filteredQuotes = useMemo(() => {
    let filtered = [...quotes];

    if (categoryFilter !== 'all') {
      filtered = filtered.filter((quote) => quote.category === categoryFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (quote) =>
          quote.content.toLowerCase().includes(query) || quote.author.toLowerCase().includes(query)
      );
    }

    filtered.sort((a, b) =>
      sortOption === 'az'
        ? a.author.localeCompare(b.author)
        : b.author.localeCompare(a.author)
    );

    return filtered;
  }, [quotes, categoryFilter, searchQuery, sortOption]);

  const displayedQuotes = filteredQuotes.slice(0, displayCount);
  const hasMore = displayCount < filteredQuotes.length;
  const hasActiveFilters =
    categoryFilter !== 'all' || sortOption !== 'az' || Boolean(searchQuery.trim());

  const handleFavoriteToggle = (quote: QuoteCardData) => {
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (next.has(quote._id)) {
        next.delete(quote._id);
        removeFromFavorites(quote._id);
        setToast({ open: true, message: 'Removed from favorites', severity: 'info' });
      } else {
        next.add(quote._id);
        saveToFavorites({ _id: quote._id, content: quote.content, author: quote.author, tags: [quote.category] });
        setToast({ open: true, message: 'Saved to favorites', severity: 'success' });
      }
      return next;
    });
  };

  const getShareUrl = (quote: QuoteCardData) => {
    const slug = `${basePath}/athletes#${quote._id}`;
    return `${window.location.origin}${slug}`;
  };

  const handleShare = (quote: QuoteCardData, platform: SharePlatform) => {
    const url = getShareUrl(quote);

    if (platform === 'native' && typeof navigator.share === 'function') {
      navigator
        .share({
          title: `${quote.author} on ${quote.category}`,
          text: `“${quote.content}” — ${quote.author}`,
          url,
        })
        .catch(() => setToast({ open: true, message: 'Share cancelled', severity: 'info' }));
      return;
    }

    const text = encodeURIComponent(`“${quote.content}” — ${quote.author}`);
    const encodedUrl = encodeURIComponent(url);

    const shareTargets: Record<Exclude<SharePlatform, 'native'>, string | null> = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      instagram: null,
      copy: url,
    };

    if (platform === 'copy') {
      navigator.clipboard
        .writeText(url)
        .then(() => setToast({ open: true, message: 'Link copied to clipboard', severity: 'success' }))
        .catch(() => setToast({ open: true, message: 'Copy failed. Try again.', severity: 'error' }));
      return;
    }

    const shareLink = shareTargets[platform === 'native' ? 'copy' : platform];

    if (!shareLink) {
      navigator.clipboard
        .writeText(url)
        .then(() =>
          setToast({
            open: true,
            message: 'Instagram sharing is not supported directly. Link copied for you!',
            severity: 'info',
          })
        )
        .catch(() => setToast({ open: true, message: 'Copy failed. Try again.', severity: 'error' }));
      return;
    }

    window.open(shareLink, '_blank', 'noopener,noreferrer');
  };

  const handleLoadMore = useCallback(() => {
    setDisplayCount((prev) => Math.min(prev + 12, filteredQuotes.length));
  }, [filteredQuotes.length]);

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore();
        }
      },
      { rootMargin: '240px 0px' }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [handleLoadMore, hasMore]);

  const resetFilters = () => {
    setCategoryFilter('all');
    setSortOption('az');
    setSearchQuery('');
    setDisplayCount(INITIAL_VISIBLE_CARDS);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setDisplayCount(INITIAL_VISIBLE_CARDS);
  };

  const handleCategoryChange = (_: React.SyntheticEvent, value: string) => {
    setCategoryFilter(value);
    setDisplayCount(INITIAL_VISIBLE_CARDS);
  };

  const openRandomQuote = () => {
    if (filteredQuotes.length === 0) return;
    const random = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
    setRandomQuote(random);
    setRandomDialogOpen(true);
  };

  const highlightStats = useMemo(
    () => [
      { label: 'Quotes curated', value: quotes.length },
      { label: 'Favorite inspirations', value: favoriteIds.size },
      { label: 'Categories to explore', value: categories.length },
    ],
    [quotes.length, favoriteIds.size, categories.length]
  );

  const renderSkeleton = () => (
    <>
      <Box
        sx={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.75) 0%, rgba(226, 231, 255, 0.7) 100%)',
          py: { xs: 8, md: 12 },
          borderRadius: { xs: 0, md: 0 },
        }}
      >
        <Container maxWidth="xl">
          <Skeleton variant="text" width={220} height={24} sx={{ mb: 2 }} />
          <Skeleton variant="text" width="65%" height={56} sx={{ mb: 2 }} />
          <Skeleton variant="text" width="40%" height={32} sx={{ mb: 6 }} />
          <Stack direction="row" spacing={3} flexWrap="wrap">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton
                key={index}
                variant="rounded"
                width={isMobile ? '100%' : 240}
                height={120}
                sx={{ borderRadius: 4 }}
              />
            ))}
          </Stack>
        </Container>
      </Box>
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Grid container spacing={3}>
          {Array.from({ length: 9 }).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Skeleton variant="rounded" height={300} sx={{ borderRadius: 4 }} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );

  if (loading) {
    return (
      <>
        <Navbar favoritesCount={favoriteIds.size} currentPage="home" onNavigate={() => {}} />
        {renderSkeleton()}
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Motivational Quotes Gallery</title>
        <meta name="description" content="Discover inspirational quotes in a Pinterest-style gallery." />
      </Head>
      <Navbar favoritesCount={favoriteIds.size} currentPage="home" onNavigate={() => {}} />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Box
            sx={{
              position: 'relative',
              mb: 5,
              borderRadius: { xs: 4, md: 6 },
              px: { xs: 3, md: 6 },
              py: { xs: 5, md: 7 },
              overflow: 'hidden',
              background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)',
              boxShadow: '0 24px 60px rgba(120, 135, 182, 0.25)',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(circle at top left, rgba(255,255,255,0.8) 0%, transparent 50%), radial-gradient(circle at bottom right, rgba(209, 224, 255, 0.65) 0%, transparent 55%)',
              }}
            />
            <Stack spacing={2} sx={{ position: 'relative' }}>
              <Typography variant="overline" sx={{ letterSpacing: 2, color: alpha(theme.palette.text.primary, 0.6) }}>
                Motivation Playground
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, lineHeight: 1.1, maxWidth: 720 }}>
                Pinterest-inspired quote wall for daily sparks of courage and calm
              </Typography>
              <Typography variant="body1" sx={{ maxWidth: 680, color: alpha(theme.palette.text.primary, 0.75) }}>
                Browse curated perspectives on success, mindfulness, growth, and more. Save what resonates, share what inspires, and let a random quote surprise you when you need it most.
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
                {highlightStats.map((stat) => (
                  <Box
                    key={stat.label}
                    sx={{
                      flex: 1,
                      minWidth: 180,
                      px: 3,
                      py: 2.5,
                      borderRadius: 4,
                      backgroundColor: alpha('#ffffff', 0.75),
                      border: '1px solid rgba(231, 235, 250, 0.7)',
                      boxShadow: '0 12px 25px rgba(152, 162, 199, 0.2)',
                    }}
                  >
                    <Typography variant="caption" sx={{ color: alpha(theme.palette.text.primary, 0.6), letterSpacing: 1 }}>
                      {stat.label}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {stat.value.toLocaleString()}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Stack>
          </Box>

          <Stack spacing={2} sx={{ mb: 4 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'stretch', md: 'center' }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search quotes or authors..."
                value={searchQuery}
                onChange={handleSearchChange}
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
                aria-label="Search quotes"
              />

              <Stack direction="row" spacing={1.5} alignItems="center">
                <ToggleButtonGroup
                  value={sortOption}
                  exclusive
                  onChange={(_, newValue) => {
                    if (newValue) {
                      setSortOption(newValue);
                      setDisplayCount(INITIAL_VISIBLE_CARDS);
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
                  aria-label="Sort quotes"
                >
                  <ToggleButton value="az" aria-label="Author A to Z">
                    <Sort sx={{ fontSize: 18, mr: 0.5 }} /> A–Z
                  </ToggleButton>
                  <ToggleButton value="za" aria-label="Author Z to A">
                    <Sort sx={{ fontSize: 18, mr: 0.5, transform: 'scaleX(-1)' }} /> Z–A
                  </ToggleButton>
                </ToggleButtonGroup>

                <Button
                  variant="outlined"
                  startIcon={<RestartAlt />}
                  onClick={resetFilters}
                  disabled={!hasActiveFilters}
                  sx={{ borderRadius: 2, whiteSpace: 'nowrap' }}
                >
                  Reset
                </Button>
              </Stack>
            </Stack>

            <Box
              sx={{
                display: 'flex',
                overflowX: 'auto',
                pb: 0.5,
                '&::-webkit-scrollbar': { height: 6 },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: alpha(theme.palette.divider, 0.6),
                  borderRadius: 999,
                },
              }}
            >
              <ToggleButtonGroup
                value={categoryFilter}
                exclusive
                onChange={handleCategoryChange}
                size={isMobile ? 'small' : 'medium'}
                aria-label="Filter quotes by category"
                sx={{
                  '& .MuiToggleButton-root': {
                    borderRadius: 999,
                    textTransform: 'capitalize',
                    px: 2.5,
                  },
                }}
              >
                <ToggleButton value="all">
                  <FilterList sx={{ fontSize: 18, mr: 1 }} /> All
                </ToggleButton>
                {categories.map((category) => (
                  <ToggleButton key={category} value={category}>
                    {category}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Box>
          </Stack>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Showing {displayedQuotes.length} of {filteredQuotes.length} quotes
          </Typography>

          <Grid container spacing={3}>
            <AnimatePresence>
              {displayedQuotes.map((quote) => (
                <Grid item xs={12} sm={6} md={4} key={quote._id} sx={{ display: 'flex' }}>
                  <QuoteCard
                    quote={quote}
                    isFavorite={favoriteIds.has(quote._id)}
                    onFavoriteToggle={handleFavoriteToggle}
                    onShare={handleShare}
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
                sx={{ borderRadius: 999, px: 4 }}
              >
                Load More Quotes
              </Button>
            </Box>
          )}

          {!hasMore && filteredQuotes.length > 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
              You’ve reached the end. Save your favorites or tap the star button for a surprise inspiration.
            </Typography>
          )}

          {filteredQuotes.length === 0 && (
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
                borderRadius: 4,
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
              }}
            >
              <Typography variant="h6" sx={{ mb: 1 }}>
                No quotes match that… yet.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your filters or search term to uncover more inspiration.
              </Typography>
            </Box>
          )}
        </motion.div>
      </Container>

      <Tooltip title="Inspire me" placement="left">
        <Fab
          color="primary"
          size="large"
          onClick={openRandomQuote}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            boxShadow: '0 18px 45px rgba(102, 126, 234, 0.35)',
          }}
        >
          <AutoAwesome />
        </Fab>
      </Tooltip>

      <Dialog
        open={randomDialogOpen && Boolean(randomQuote)}
        onClose={() => setRandomDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            padding: 3,
            boxShadow: '0 32px 80px rgba(99, 132, 255, 0.32)',
            position: 'relative',
            overflow: 'hidden',
          },
        }}
      >
        <IconButton
          onClick={() => setRandomDialogOpen(false)}
          sx={{ position: 'absolute', top: 16, right: 16 }}
          aria-label="Close random quote"
        >
          <Close />
        </IconButton>

        {randomQuote && (
          <>
            <DialogTitle sx={{ fontWeight: 700, textTransform: 'capitalize' }}>
              {randomQuote.category} inspiration
            </DialogTitle>
            <DialogContent>
              <Typography
                variant="h5"
                sx={{ fontStyle: 'italic', lineHeight: 1.7, mb: 3 }}
              >
                “{randomQuote.content}”
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                — {randomQuote.author}
              </Typography>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 3 }}>
              <Stack direction="row" spacing={1.5}>
                <Button
                  variant="contained"
                  startIcon={<FavoriteIcon />}
                  onClick={() => {
                    handleFavoriteToggle(randomQuote);
                    setRandomDialogOpen(false);
                  }}
                >
                  Save Quote
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ShareIcon />}
                  onClick={() =>
                    handleShare(
                      randomQuote,
                      typeof navigator.share === 'function' ? 'native' : 'twitter'
                    )
                  }
                >
                  Share
                </Button>
              </Stack>
              <Button onClick={() => setRandomDialogOpen(false)} startIcon={<ArrowOutward />}>
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
          sx={{ borderRadius: 3 }}
          onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
}
