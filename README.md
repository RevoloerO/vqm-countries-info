# VQM Countries Info

An interactive world countries explorer built with React and Vite. Browse 250+ countries with real-time statistics, side-by-side comparison, live population pulse, and a midnight timezone tracker.

**Live Demo:** [revoloero.github.io/vqm-countries-info](https://revoloero.github.io/vqm-countries-info)

---

## Features

### Dashboard Overview
- **Stats Bar** — Country count, total population, total area, language count, and a rotating fun-fact ticker
- **Quick Facts** — Four insight cards: most populated, largest area, smallest country, and unique currency count (reactive to region filter)
- **Mini World Map** — Clickable SVG continent map that doubles as a region filter with country count labels

### Live Widgets
- **Population Growth Live Counter** — Real-time births, deaths, and net population growth ticking since page load, scaled to the currently filtered region
- **Midnight Countries** — Shows which countries are currently near midnight based on their timezone data

### Browsable Country Grid
- Responsive card grid with flag, name, capital, population, and region badge
- **7 sort options** — Name (A-Z / Z-A), population, area, and population density
- **Random Country** button for discovery
- **Staggered entrance animation** with per-card delay
- **Show More** pagination (24 cards per batch)

### Country Detail View
- Two-column layout with flag, coat of arms, and full country details
- Capital, region/subregion, population, area, languages, currencies, timezones
- Google Maps and OpenStreetMap links
- Sticky flag panel on desktop

### Search & Filter
- **Fuzzy search** with Levenshtein distance scoring
- Dropdown suggestions with keyboard navigation
- **Region filter bar** with count badges (Africa, Americas, Asia, Europe, Oceania, Antarctic)

### Country Comparison
- **Shift+click** any two grid cards, or use the Compare mode button
- Side-by-side comparison panel with population, area, density, languages, currencies, and timezones
- Visual compare-mode feedback with glow ring and checkmark badges

### Other
- **Recently Viewed** — Persistent chip bar of last 6 viewed countries (localStorage)
- **Light / Dark theme toggle** — Indigo/slate light mode, violet/periwinkle dark mode
- **API response caching** — 1-hour localStorage cache to reduce API calls
- **Animated number counters** with easeOutCubic easing
- **Fully responsive** — Mobile, tablet, and desktop breakpoints
- **Accessible** — ARIA labels, focus-visible outlines, keyboard navigation

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18 |
| Build Tool | Vite 6 |
| HTTP Client | Axios |
| Data Source | [REST Countries API v3.1](https://restcountries.com) |
| Styling | CSS custom properties (no CSS-in-JS) |
| Typography | Inter (sans-serif) + Share Tech Mono (numeric data) |
| Deployment | GitHub Pages via `gh-pages` |

---

## Project Structure

```
src/
  App.jsx                  # Root component - state management, routing, layout
  App.css                  # All styles, theme variables, responsive breakpoints
  main.jsx                 # React entry point
  index.css                # Global base styles
  search-button.css        # Search button styles (imported by App.css)
  assets/                  # Background images, logos
  vqm-footer/              # Footer component + styles
  components/
    Dashboard.jsx           # Dashboard orchestrator (stats + facts + map + live widgets)
    StatsBar.jsx            # Horizontal stats bar with rotating facts
    QuickFacts.jsx          # 4-card insight grid
    CountryGrid.jsx         # Browsable card grid with sort, random, compare
    MiniWorldMap.jsx        # SVG interactive world map / region selector
    PopulationGrowthCounter.jsx  # Live births/deaths/net growth counter
    MidnightCountries.jsx   # Countries currently near midnight
    CountryCard.jsx         # Detail view wrapper
    ShowCountry.jsx         # Country detail content
    Details.jsx             # Detail row component
    ComparePanel.jsx        # Side-by-side country comparison
    SearchField.jsx         # Fuzzy search with dropdown suggestions
    RegionFilter.jsx        # Region filter tab bar
    RecentlyViewed.jsx      # Recently viewed country chips
    AnimatedCounter.jsx     # Animated number counter
    CollapsibleSection.jsx  # Collapsible detail sections
    ThemeToggle.jsx         # Light/dark theme switch
    LoadingSpinner.jsx      # Loading state
    ErrorState.jsx          # Error state with retry
```

---

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Install & Run

```bash
# Clone the repository
git clone https://github.com/revoloero/vqm-countries-info.git
cd vqm-countries-info

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

Output goes to `dist/`.

### Deploy to GitHub Pages

```bash
npm run deploy
```

---

## API

The app fetches data from the [REST Countries API](https://restcountries.com/v3.1/all) using two parallel requests (to stay within the API's per-request field limit), then merges the results:

| Request | Fields |
|---------|--------|
| 1 | name, flags, coatOfArms, capital, region, subregion, currencies, population, area, languages |
| 2 | name, flag (emoji), timezones, maps |

Responses are cached in `localStorage` for 1 hour to minimize API calls.

---

## Theming

The app uses CSS custom properties for theming. Two built-in themes:

- **Light** — Indigo/slate palette with glassmorphism backgrounds
- **Dark** — Violet/periwinkle palette with deep slate backgrounds

Toggle via the sun/moon button in the header. Theme preference is applied to `<body>` classes (`light-theme` / `dark-theme`).

---

## License

This project is for educational and personal use.
