# Daily Motivation Quotes App 💪

A beautiful, production-ready web application built with Next.js and Material UI that delivers daily motivational quotes with a modern Material Design interface and inspirational athlete stories.

## ✨ Features

### Core Features
- **Daily Motivational Quotes**: Automatically displays a new inspirational quote each day
- **13 Quote Categories**: Animals, Philosophy, Psychology, Nature, Spirituality, Sports, Art, Technology, AI, Love, Success, Health & Fitness, Travel & Adventure
- **Random Quotes**: "New Quote" button to fetch random motivational quotes on demand
- **Favorites System**: Save your favorite quotes to local storage
- **Favorites Screen**: Beautiful grid view of all saved quotes
- **Athletes & Mindset Section**: Pinterest-style grid of inspirational athlete stories
- **Settings Page**: Comprehensive settings management
- **Light/Dark Theme**: Toggle between light and dark modes with proper button visibility
- **Daily Notifications**: Optional daily reminders with customizable time (browser notifications)
- **Share Quotes**: Native share API or clipboard fallback
- **Responsive Design**: Works beautifully on mobile and desktop
- **Error Handling**: Graceful error handling with user-friendly messages
- **Loading States**: Smooth loading indicators

### Athletes Section Features
- **Pinterest-Style Masonry Grid**: Visually rich cards with varied heights
- **8+ Athlete Stories**: Including 4 Indian athletes (Abhinav Bindra, PV Sindhu, Anjum Moudgil, Neeraj Chopra)
- **Filter & Search**: Filter by country (India/World) or search by name/sport
- **Load More**: Infinite scroll-style pagination
- **YouTube Videos**: Embedded videos for each athlete
- **Practice Steps**: Beginner-friendly mental training techniques
- **Source Citations**: Proper attribution for all content

### Material Design Features
- Modern Material UI components throughout
- Beautiful cards, buttons, and typography
- Smooth animations with Framer Motion
- Accessible design with proper ARIA labels
- Consistent color theming
- Clean, minimalist interface
- **Fixed Light Mode**: All buttons visible with proper contrast

## 🛠️ Tech Stack

- **Framework**: Next.js 12 (Pages Router)
- **UI Library**: Material UI (MUI) v5
- **Icons**: Material Icons
- **Animations**: Framer Motion
- **Language**: TypeScript
- **Styling**: Material UI theme system with custom tokens
- **API**: Quotable.io for quotes, local JSON for athletes

## 🚀 Getting Started

### Prerequisites
- Node.js 14.18+ (or Node.js 18+ recommended)
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📱 Usage

### Home Screen
- View 13 inspirational category cards
- Click any category to see quotes
- Click "💪 Athletes & Mindset Stories" to browse athlete profiles
- Use theme toggle, favorites, and settings in the navbar

### Quote Pages
- View quotes from selected category
- Click "New Quote" for random quotes
- Favorite quotes using heart icon
- Share quotes via native share or clipboard

### Athletes & Mindset Section
- Browse Pinterest-style grid of athlete cards
- Filter by country (India/World) or search
- Click any card to read full story
- Watch embedded YouTube videos
- Learn practical mental training techniques
- Save favorites and share stories

### Favorites Screen
- Access via favorites icon in navbar (shows badge count)
- View all saved quotes and athlete stories
- Remove favorites or share them

### Settings Screen
- Toggle between light and dark themes
- Adjust font size (small/medium/large)
- Change accent color
- Enable/disable daily notifications
- Set notification time
- All settings persist to localStorage

## 🎨 Theme System

The app includes a robust theming system with proper contrast:

### Light Mode
- Dark blue buttons (`#1976d2`) for visibility
- White text on colored buttons
- High contrast for accessibility

### Dark Mode
- Light blue buttons (`#90caf9`) for visibility
- Dark backgrounds with proper contrast
- WCAG AA compliant color ratios

**Theme Fix Applied**: All buttons, icons, and interactive elements are now clearly visible in both light and dark modes.

## 🏃 Athletes Section

### Included Athletes

**World Athletes:**
- Novak Djokovic (Serbia) - Mental toughness
- Serena Williams (USA) - Breaking barriers
- Michael Jordan (USA) - Learning from failure
- Simone Biles (USA) - Mental health priority
- Lionel Messi (Argentina) - Perseverance
- Kobe Bryant (USA) - Mamba mentality

**Indian Athletes:**
- **Abhinav Bindra** - "It's all in the mind" - Precision shooting mindset
- **PV Sindhu** - Perseverance under pressure - Badminton mental strength
- **Anjum Moudgil** - Mental precision and focus - Shooting techniques
- **Neeraj Chopra** - Confidence and consistency - India's Olympic gold medalist

### Adding New Athletes

1. Edit `public/data/athletes.json`
2. Add a new athlete object following this schema:
   ```json
   {
     "slug": "athlete-slug",
     "name": "Athlete Name",
     "country": "Country",
     "sport": "Sport",
     "headline": "Catchy headline",
     "excerpt": "Short excerpt",
     "thumbnail": "/images/athletes/athlete.jpg",
     "youtube": "https://www.youtube.com/embed/VIDEO_ID",
     "youtubeId": "VIDEO_ID",
     "story": "Full story text (300-600 words)",
     "practice": [
       "Step 1: Practice technique",
       "Step 2: Another technique"
     ],
     "sources": [
       {
         "title": "Article title",
         "url": "https://...",
         "publisher": "Publisher name",
         "date": "YYYY-MM-DD"
       }
     ]
   }
   ```
3. Add athlete image to `/public/images/athletes/` (optional)
4. Reload the app

## 💾 Data Storage

All user data is stored in browser local storage:
- Favorite quotes
- Favorite athlete stories
- Theme preference (light/dark)
- Font size preference
- Accent color
- Notification settings
- Last quote and date

Data persists across browser sessions and device restarts.

## 🔔 Notifications

The app supports browser notifications for daily motivational quotes:

1. Enable notifications in Settings
2. Set your preferred notification time
3. Grant browser notification permissions when prompted
4. Receive daily quotes at your chosen time

**Note**: Notifications require browser permission and work best when the browser is open. For true push notifications on mobile, consider implementing a service worker with Push API.

## 📁 Project Structure

```
├── pages/
│   ├── _app.tsx          # App wrapper with theme provider
│   ├── index.tsx         # Main home page
│   └── athletes/
│       ├── index.tsx     # Athletes grid (Pinterest-style)
│       └── [slug].tsx    # Individual athlete detail page
├── components/
│   ├── QuoteCard.tsx     # Main quote display card
│   ├── CategoryCard.tsx # Category grid card
│   ├── CategoryPage.tsx  # Category quote display
│   ├── FavoritesScreen.tsx # Favorites grid view
│   ├── SettingsScreen.tsx  # Settings page
│   ├── AthleteCard.tsx   # Original athlete card
│   ├── AthleteCardPinterest.tsx # Pinterest-style athlete card
│   ├── AthleteDetail.tsx # Athlete detail view
│   └── Navbar.tsx       # Top navigation bar
├── lib/
│   ├── utils.ts         # Quote API and utilities
│   ├── storage.ts       # Local storage management
│   ├── quotes.ts        # Quote fetching utilities
│   ├── categories.ts    # Category definitions
│   └── notifications.ts # Notification handling
├── theme/
│   └── theme.ts         # Material UI theme configuration
└── public/
    └── data/
        ├── athletes.json      # Athlete stories data
        ├── quotes.json        # Quotes in flat format
        └── quotesByCategory.json # Quotes by category
```

## 🔧 Customization

### Changing Theme Colors
Edit `theme/theme.ts` to customize:
- Primary/secondary colors
- Background colors
- Button styles
- Ensure WCAG AA contrast ratios

### Adding Quote Sources
Update `lib/utils.ts` to add new quote API sources or modify the fallback quotes array.

### Modifying Athlete Data
All athlete content is in `public/data/athletes.json`. Edit this file to:
- Add new athletes
- Update stories
- Change YouTube video links
- Modify practice steps

## 🐛 Error Handling

The app includes comprehensive error handling:
- Network errors when fetching quotes
- Missing browser API support (notifications, clipboard)
- Invalid data handling
- User-friendly error messages with retry options
- Graceful fallbacks for all features

## 📝 Code Quality

- TypeScript for type safety
- ESLint for code quality
- Clean component architecture
- Reusable utilities
- Well-commented code
- Material UI best practices
- Accessible design patterns

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

**Note**: Some features (notifications, share API) require modern browser support.

## 📄 License

MIT License - Feel free to use this project for learning or as a base for your own applications.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## 📧 Support

For questions or issues, please open an issue on the repository.

---

## 🎯 Recent Updates

### Pinterest-Style Athletes Section
- ✅ Masonry grid layout with varied card heights
- ✅ Smooth hover animations (zoom, shadow)
- ✅ Filter by country (India/World)
- ✅ Search functionality
- ✅ Load More pagination
- ✅ 4 Indian athletes included
- ✅ 4 World athletes included
- ✅ YouTube video embeds
- ✅ Practice steps for each athlete

### Theme Fixes
- ✅ Light mode buttons now visible (dark icons/text)
- ✅ Dark mode buttons maintain proper contrast
- ✅ All interactive elements accessible
- ✅ WCAG AA compliant color ratios

---

Built with ❤️ using Next.js and Material UI
