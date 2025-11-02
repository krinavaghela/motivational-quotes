'use client';

import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  IconButton,
  Divider,
  Alert,
} from '@mui/material';
import {
  ArrowBack,
  DarkMode,
  LightMode,
  Notifications,
  NotificationsOff,
} from '@mui/icons-material';

interface SettingsScreenProps {
  theme: 'light' | 'dark';
  notificationsEnabled: boolean;
  notificationTime: string;
  onThemeChange: (theme: 'light' | 'dark') => void;
  onNotificationsToggle: (enabled: boolean) => void;
  onNotificationTimeChange: (time: string) => void;
  onBack: () => void;
  onSave: () => void;
  showSaveMessage: boolean;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({
  theme,
  notificationsEnabled,
  notificationTime,
  onThemeChange,
  onNotificationsToggle,
  onNotificationTimeChange,
  onBack,
  onSave,
  showSaveMessage,
}) => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={onBack} color="primary" size="large">
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Settings
        </Typography>
      </Box>

      {showSaveMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Settings saved successfully!
        </Alert>
      )}

      {/* Theme Settings */}
      <Card sx={{ mb: 3 }} elevation={2}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            {theme === 'light' ? (
              <LightMode sx={{ mr: 2, fontSize: 30, color: 'primary.main' }} />
            ) : (
              <DarkMode sx={{ mr: 2, fontSize: 30, color: 'primary.main' }} />
            )}
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Appearance
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
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
                    ? 'Switch to light mode'
                    : 'Switch to dark mode'}
                </Typography>
              </Box>
            }
          />
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card sx={{ mb: 3 }} elevation={2}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            {notificationsEnabled ? (
              <Notifications sx={{ mr: 2, fontSize: 30, color: 'primary.main' }} />
            ) : (
              <NotificationsOff sx={{ mr: 2, fontSize: 30, color: 'text.disabled' }} />
            )}
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Notifications
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          
          <FormControlLabel
            control={
              <Switch
                checked={notificationsEnabled}
                onChange={(e) => onNotificationsToggle(e.target.checked)}
                color="primary"
              />
            }
            label={
              <Box>
                <Typography variant="body1">Daily Reminders</Typography>
                <Typography variant="caption" color="text.secondary">
                  Get notified with a daily motivational quote
                </Typography>
              </Box>
            }
            sx={{ mb: 2, display: 'block' }}
          />

          {notificationsEnabled && (
            <Box sx={{ mt: 2 }}>
              <TextField
                label="Notification Time"
                type="time"
                value={notificationTime}
                onChange={(e) => onNotificationTimeChange(e.target.value)}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  step: 300, // 5 minutes
                }}
                helperText="Choose the time you'd like to receive your daily motivation"
              />
            </Box>
          )}

          {!('Notification' in window) && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Your browser does not support notifications.
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button variant="outlined" onClick={onBack}>
          Cancel
        </Button>
        <Button variant="contained" onClick={onSave}>
          Save Settings
        </Button>
      </Box>
    </Container>
  );
};

export default SettingsScreen;


