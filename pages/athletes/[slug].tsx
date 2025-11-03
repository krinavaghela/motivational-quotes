import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AthleteDetail from '@/components/AthleteDetail';
import Navbar from '@/components/Navbar';
import { Box, CircularProgress, Typography } from '@mui/material';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

interface AthleteDetailData {
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

export default function AthleteDetailPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [athlete, setAthlete] = useState<AthleteDetailData | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      loadAthlete(slug as string);
      loadFavorites();
    }
  }, [slug]);

  const loadAthlete = async (athleteSlug: string) => {
    try {
      const response = await fetch(`${basePath}/data/athletes.json`);
      const data = await response.json();
      const found = data.find((a: AthleteDetailData) => a.slug === athleteSlug);
      if (found) {
        setAthlete(found);
      }
    } catch (error) {
      console.error('Error loading athlete:', error);
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

  const handleBack = () => {
    router.push(`${basePath}/athletes`);
  };

  const handleFavorite = (athlete: AthleteDetailData) => {
    const updated = favorites.includes(athlete.slug)
      ? favorites.filter((f) => f !== athlete.slug)
      : [...favorites, athlete.slug];
    setFavorites(updated);
    localStorage.setItem('athleteFavorites', JSON.stringify(updated));
  };

  const handleNavigate = (page: 'home' | 'favorites' | 'settings') => {
    if (page === 'home') {
      router.push(`${basePath}/`);
    } else if (page === 'favorites') {
      router.push(`${basePath}/`);
    } else if (page === 'settings') {
      router.push(`${basePath}/`);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar favoritesCount={0} currentPage="home" onNavigate={handleNavigate} />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress />
        </Box>
      </>
    );
  }

  if (!athlete) {
    return (
      <>
        <Navbar favoritesCount={0} currentPage="home" onNavigate={handleNavigate} />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <Typography variant="h5">Athlete not found</Typography>
        </Box>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{athlete.name} - Daily Motivation</title>
        <meta name="description" content={athlete.excerpt} />
      </Head>
      <Navbar favoritesCount={0} currentPage="home" onNavigate={handleNavigate} />
      <AthleteDetail
        athlete={athlete}
        onBack={handleBack}
        onFavorite={handleFavorite}
        isFavorite={favorites.includes(athlete.slug)}
      />
    </>
  );
}


