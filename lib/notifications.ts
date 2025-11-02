// Notification utilities for daily reminders

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

export const showNotification = (title: string, options?: NotificationOptions) => {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      ...options,
    });
  }
};

export const scheduleDailyNotification = (
  hour: number = 9,
  minute: number = 0,
  quote: string,
  author: string
) => {
  if (!('Notification' in window)) {
    return null;
  }

  const now = new Date();
  const scheduledTime = new Date();
  scheduledTime.setHours(hour, minute, 0, 0);

  // If the time has passed today, schedule for tomorrow
  if (scheduledTime.getTime() < now.getTime()) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }

  const timeUntilNotification = scheduledTime.getTime() - now.getTime();

  const timeoutId = setTimeout(() => {
    showNotification('Daily Motivation 💪', {
      body: `"${quote}" - ${author}`,
      tag: 'daily-motivation',
    });
  }, timeUntilNotification);

  return timeoutId;
};

export const cancelNotification = (timeoutId: number | null) => {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
};


