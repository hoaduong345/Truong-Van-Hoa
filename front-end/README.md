# Quiz Game Frontend

A modern React application built with TypeScript and Vite for an interactive quiz game with real-time scoring and leaderboard.

## Features

- 🎮 Interactive Quiz Interface
- 🏆 Real-time Leaderboard
- 👤 User Profile Management
- 💖 Heart Interaction System
- 🌓 Dark Mode Support
- 📱 Responsive Design

## Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **Animation:** Framer Motion
- **HTTP Client:** Axios
- **State Management:** React Hooks

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── Crud.tsx       # Main game container
│   ├── UserTabs.tsx   # Tab navigation
│   ├── Leaderboard.tsx # Leaderboard display
│   ├── QuestionInteraction.tsx # Quiz interface
│   ├── HeartInteraction.tsx    # Heart system
│   └── UserSettings.tsx        # Profile settings
├── hooks/             # Custom React hooks
├── pages/            # Page components
├── types/            # TypeScript definitions
└── utils/            # Helper functions
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file in root directory:
```env
VITE_API_URL=http://localhost:5000
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Features in Detail

### Quiz System
- Random question selection
- Immediate feedback on answers
- Score tracking
- Streak counting
- Automatic progression to next question

### Leaderboard
- Real-time score updates
- Top 10 players display
- Current user position tracking
- Sorting and filtering options
- Animated transitions

### User Profile
- Avatar upload
- Profile editing
- Score history
- Account management
- Dark mode preference

### Heart System
- Interactive heart animations
- Special score bonuses
- Social interaction feature

## Component Usage

### QuestionInteraction
```tsx
<QuestionInteraction
  currentUserId={userId}
  onScoreUpdate={handleScoreUpdate}
/>
```

### Leaderboard
```tsx
<Leaderboard
  people={users}
  currentUserId={userId}
  loading={isLoading}
  error={error}
  filters={filters}
  onFilterChange={handleFilterChange}
/>
```

### UserSettings
```tsx
<UserSettings
  currentUserId={userId}
  onClose={handleClose}
  onDeleteAccount={handleDelete}
/>
```

## Styling

The application uses TailwindCSS with custom configurations:
- Custom color palette
- Responsive breakpoints
- Dark mode variants
- Animation classes

## Performance Optimizations

- Code splitting
- Lazy loading of components
- Memoization of expensive calculations
- Optimized re-renders
- Efficient state updates

## Best Practices

- TypeScript for type safety
- ESLint for code quality
- Prettier for consistent formatting
- Component composition
- Custom hooks for logic reuse
- Proper error handling
- Loading states
- Responsive design
- Accessibility features

## Future Improvements

- [ ] Add multiplayer support
- [ ] Implement achievement system
- [ ] Add more question categories
- [ ] Enhanced animations
- [ ] Social sharing features
- [ ] PWA support
- [ ] Offline mode
- [ ] Analytics dashboard
