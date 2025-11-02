'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Switch,
  FormControlLabel,
  Slider,
  Typography,
  Box,
  IconButton,
  Palette,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Close, Brightness4, Brightness7, TextFields, Palette as PaletteIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
  fontSize: 'small' | 'medium' | 'large';
  accentColor: string;
  onThemeChange: (theme: 'light' | 'dark') => void;
  onFontSizeChange: (size: 'small' | 'medium' | 'large') => void;
  onAccentColorChange: (color: string) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  open,
  onClose,
  theme,
  fontSize,
  accentColor,
  onThemeChange,
  onFontSizeChange,
  onAccentColorChange,
}) => {
  const accentColors = [
    { name: 'Purple', value: '#6C5CE7' },
    { name: 'Pink', value: '#E91E63' },
    { name: 'Blue', value: '#2196F3' },
    { name: 'Green', value: '#4CAF50' },
    { name: 'Orange', value: '#FF9800' },
    { name: 'Teal', value: '#009688' },
  ];

  const fontSizeMap = {
    small: 14,
    medium: 16,
    large: 18,
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: theme === 'dark' ? '#1e1e1e' : '#fff',
        },
      }}
      aria-labelledby="settings-dialog-title"
      aria-describedby="settings-dialog-description"
    >
      <DialogTitle
        id="settings-dialog-title"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1,
        }}
      >
        <Typography variant="h5" component="span" sx={{ fontWeight: 700 }}>
          Settings
        </Typography>
        <IconButton
          onClick={onClose}
          aria-label="Close settings"
          sx={{ color: 'text.secondary' }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ pt: 2 }}>
        {/* Theme Toggle */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            {theme === 'light' ? (
              <Brightness7 sx={{ mr: 1, color: 'primary.main' }} />
            ) : (
              <Brightness4 sx={{ mr: 1, color: 'primary.main' }} />
            )}
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Appearance
            </Typography>
          </Box>
          <FormControlLabel
            control={
              <Switch
                checked={theme === 'dark'}
                onChange={(e) => onThemeChange(e.target.checked ? 'dark' : 'light')}
                color="primary"
              />
            }
            label={
              <Box>
                <Typography variant="body1">
                  {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {theme === 'dark'
                    ? 'Switch to light theme'
                    : 'Switch to dark theme'}
                </Typography>
              </Box>
            }
          />
        </Box>

        {/* Font Size */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <TextFields sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Font Size
            </Typography>
          </Box>
          <Box sx={{ px: 2 }}>
            <Slider
              value={fontSize === 'small' ? 0 : fontSize === 'medium' ? 1 : 2}
              onChange={(_, value) => {
                const sizes: ('small' | 'medium' | 'large')[] = ['small', 'medium', 'large'];
                onFontSizeChange(sizes[value as number]);
              }}
              min={0}
              max={2}
              step={1}
              marks={[
                { value: 0, label: 'Small' },
                { value: 1, label: 'Medium' },
                { value: 2, label: 'Large' },
              ]}
              aria-label="Font size"
            />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1, textAlign: 'center' }}
            >
              Current: {fontSize.charAt(0).toUpperCase() + fontSize.slice(1)} ({fontSizeMap[fontSize]}px)
            </Typography>
          </Box>
        </Box>

        {/* Accent Color */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <PaletteIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Accent Color
            </Typography>
          </Box>
          <FormControl fullWidth>
            <Select
              value={accentColor}
              onChange={(e) => onAccentColorChange(e.target.value)}
              sx={{ borderRadius: 2 }}
              aria-label="Accent color"
            >
              {accentColors.map((color) => (
                <MenuItem key={color.value} value={color.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        bgcolor: color.value,
                        border: '2px solid',
                        borderColor: 'divider',
                      }}
                    />
                    <Typography>{color.name}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="contained" sx={{ borderRadius: 2 }}>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsModal;


