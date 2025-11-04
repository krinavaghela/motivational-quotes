'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  Alert,
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Container,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { ArrowBack, Favorite, Share as ShareIcon } from '@mui/icons-material';

import { athleteMindsets, AthleteMindset } from '@/lib/athletesMindset';
import Navbar from '@/components/Navbar';

const STORAGE_KEY = 'athleteMindsetFavorites';

const getFavorites = () => {
  if (typeof window === 'undefined') return {} as Record<string, AthleteMindset>;
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}') as Record<string, AthleteMindset>;
  } catch (error) {
    return {} as Record<string, AthleteMindset>;
  }
};

export default function AthleteDetailPage() {
  const router = useRouter();
  const { slug } = router.query;

  const athlete = useMemo(() => athleteMindsets.find((item) => item.slug === slug), [slug]);

  const [favorites, setFavorites] = useState<Record<string, AthleteMindset>>(() => getFavorites());

  if (!athlete) {
    return (
      <Container sx={{ py: 10 }}>
        <Alert severity="warning">Athlete mindset not found.</Alert>
      </Container>
    );
  }

  const isFavorite = Boolean(favorites[athlete.slug]);
  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/athletes/${athlete.slug}`;

  return (
    <>
      <Head>
        <title>{athlete.name} · Athlete Mindset Playbook</title>
        <meta name="description" content={athlete.summary} />
      </Head>
      <Navbar favoritesCount={Object.keys(favorites).length} currentPage="home" onNavigate={() => router.push('/')} />
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => router.push('/athletes')}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Back to athletes
          </Button>
        </Breadcrumbs>

        <Box
          sx={{
            position: 'relative',
            borderRadius: 5,
            overflow: 'hidden',
            mb: 4,
            height: { xs: 280, md: 360 },
          }}
        >
          <Box
            component="img"
            src={athlete.image}
            alt={athlete.name}
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(6,9,25,0.05) 0%, rgba(6,8,24,0.72) 100%)',
            }}
          />
          <Stack direction="row" spacing={2} sx={{ position: 'absolute', bottom: 24, left: 24, alignItems: 'center' }}>
            <Avatar src={athlete.image} alt={athlete.name} sx={{ width: 64, height: 64, border: '2px solid rgba(255,255,255,0.7)' }} />
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff' }}>
                {athlete.name}
              </Typography>
              <Typography variant="body2" sx={{ color: alpha('#fff', 0.8) }}>
                {athlete.sport} · {athlete.country}
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Stack spacing={3}>
          <Box>
            <Typography variant="overline" sx={{ letterSpacing: 1.2, color: '#5a4aa5' }}>
              Headline
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, mt: 1, color: '#22164d' }}>
              {athlete.headline}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1.5, lineHeight: 1.7, color: '#3c2f6f' }}>
              {athlete.summary}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} flexWrap="wrap">
            {athlete.themes.map((theme) => (
              <Chip key={theme} label={theme.replace(/-/g, ' ')} sx={{ borderRadius: 999, backgroundColor: alpha('#4c51bf', 0.14), color: '#3a2b7a', fontWeight: 600 }} />
            ))}
          </Stack>

          <Box>
            <Typography variant="overline" sx={{ letterSpacing: 1.2, color: '#5a4aa5' }}>
              Defining moment
            </Typography>
            <Typography variant="body1" sx={{ mt: 1.2, lineHeight: 1.7, color: '#3c2f6f' }}>
              {athlete.signatureMoment}
            </Typography>
          </Box>

          <Divider />

          <Box>
            <Typography variant="overline" sx={{ letterSpacing: 1.2, color: '#5a4aa5' }}>
              Mindset codes
            </Typography>
            <Stack component="ul" spacing={1.2} sx={{ mt: 1.2, pl: 2, color: '#33255f' }}>
              {athlete.mindsets.map((item) => (
                <Typography component="li" variant="body2" key={item}>
                  {item}
                </Typography>
              ))}
            </Stack>
          </Box>

          <Box>
            <Typography variant="overline" sx={{ letterSpacing: 1.2, color: '#5a4aa5' }}>
              Daily habits to copy
            </Typography>
            <Stack component="ul" spacing={1.2} sx={{ mt: 1.2, pl: 2, color: '#33255f' }}>
              {athlete.dailyHabits.map((item) => (
                <Typography component="li" variant="body2" key={item}>
                  {item}
                </Typography>
              ))}
            </Stack>
          </Box>

          <Box>
            <Typography variant="overline" sx={{ letterSpacing: 1.2, color: '#5a4aa5' }}>
              Apply it in your life
            </Typography>
            <Stack component="ul" spacing={1.2} sx={{ mt: 1.2, pl: 2, color: '#33255f' }}>
              {athlete.transferToLife.map((item) => (
                <Typography component="li" variant="body2" key={item}>
                  {item}
                </Typography>
              ))}
            </Stack>
          </Box>
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 4 }}>
          <Button
            variant="contained"
            startIcon={<Favorite />}
            onClick={() => {
              setFavorites((prev) => {
                const next = { ...prev };
                if (next[athlete.slug]) {
                  delete next[athlete.slug];
                } else {
                  next[athlete.slug] = athlete;
                }
                if (typeof window !== 'undefined') {
                  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
                }
                return next;
              });
            }}
            sx={{ borderRadius: 999, textTransform: 'none', fontWeight: 600 }}
          >
            {isFavorite ? 'Saved to your playbooks' : 'Save this playbook'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<ShareIcon />}
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: athlete.name, text: athlete.headline, url: shareUrl });
              } else {
                navigator.clipboard.writeText(shareUrl);
              }
            }}
            sx={{ borderRadius: 999, textTransform: 'none', fontWeight: 600 }}
          >
            Share mindset
          </Button>
        </Stack>

        {athlete.reference && (
          <Alert severity="info" sx={{ mt: 4 }}>
            Inspired by: {athlete.reference}
          </Alert>
        )}
      </Container>
    </>
  );
}


