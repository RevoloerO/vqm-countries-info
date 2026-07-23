import { useState, useEffect, useMemo, useCallback } from 'react';
import './App.css';
import countriesData from './data/countries.json';
import ThemeToggle from './components/ThemeToggle';
import SearchField from './components/SearchField';
import CountryCard from './components/CountryCard';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorState from './components/ErrorState';
import Dashboard from './components/Dashboard';
import RegionFilter from './components/RegionFilter';
import RecentlyViewed, { loadRecentlyViewed, saveRecentlyViewed } from './components/RecentlyViewed';
import ComparePanel from './components/ComparePanel';
import RandomDiscovery from './components/RandomDiscovery';
import VqmFooter from './vqm-footer/vqm-footer';
import { pickCountryTheme, differentiateThemes } from './utils/flagTheme';

const App = () => {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [theme, setTheme] = useState('light');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dashboard state
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'detail'
  const [visibleCount, setVisibleCount] = useState(24);

  // Region + compare state
  const [activeRegion, setActiveRegion] = useState('all');
  const [recentList, setRecentList] = useState(loadRecentlyViewed);
  const [compareA, setCompareA] = useState(null);
  const [compareB, setCompareB] = useState(null);
  const [showCompare, setShowCompare] = useState(false);
  const [compareMode, setCompareMode] = useState(false);

  // Apply theme to <body> and background image
  useEffect(() => {
    document.body.classList.toggle('dark-theme', theme === 'dark');
    document.body.classList.toggle('light-theme', theme === 'light');
    document.body.style.setProperty('--bg-image',
      theme === 'dark'
        ? "url('assets/world-bg-dark.png')"
        : "url('assets/world-bg.png')"
    );
  }, [theme]);

  // Tint the page with the selected country's flag colors
  useEffect(() => {
    const body = document.body;
    if (viewMode === 'detail' && selectedCountry) {
      const { accent, glowA, glowB } = pickCountryTheme(selectedCountry.flagColors, theme);
      body.style.setProperty('--country-accent', accent);
      body.style.setProperty('--country-glow-a', glowA);
      body.style.setProperty('--country-glow-b', glowB);
      body.classList.add('country-themed');
    } else {
      body.classList.remove('country-themed');
      body.style.removeProperty('--country-accent');
      body.style.removeProperty('--country-glow-a');
      body.style.removeProperty('--country-glow-b');
    }
  }, [selectedCountry, viewMode, theme]);

  // Tint the comparison panel with both countries' flag colors
  useEffect(() => {
    const body = document.body;
    if (showCompare && compareA && compareB) {
      const themeA = pickCountryTheme(compareA.flagColors, theme);
      const themeB = differentiateThemes(themeA, pickCountryTheme(compareB.flagColors, theme));
      body.style.setProperty('--countryA-accent', themeA.accent);
      body.style.setProperty('--countryA-glow-a', themeA.glowA);
      body.style.setProperty('--countryB-accent', themeB.accent);
      body.style.setProperty('--countryB-glow-a', themeB.glowA);
      body.classList.add('compare-themed');
    } else {
      body.classList.remove('compare-themed');
      body.style.removeProperty('--countryA-accent');
      body.style.removeProperty('--countryA-glow-a');
      body.style.removeProperty('--countryB-accent');
      body.style.removeProperty('--countryB-glow-a');
    }
  }, [compareA, compareB, showCompare, theme]);

  // Load bundled countries dataset (sourced from REST Countries — see src/data/countries.json)
  const fetchCountries = useCallback(() => {
    setLoading(true);
    setError(null);

    try {
      setCountries(countriesData);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load country data:', err);
      setError('Failed to load country data.');
      setLoading(false);
    }
  }, []);

  useEffect(fetchCountries, [fetchCountries]);

  // Select country handler — saves to recently viewed, switches to detail view
  const handleSelectCountry = useCallback((country) => {
    setSelectedCountry(country);
    setViewMode('detail');
    const updated = saveRecentlyViewed(country);
    setRecentList(updated);
  }, []);

  // Back to grid view
  const handleBackToGrid = useCallback(() => {
    setSelectedCountry(null);
    setViewMode('grid');
  }, []);

  // Reset visible count when region changes
  useEffect(() => {
    setVisibleCount(24);
  }, [activeRegion]);

  // Compare mode — from grid (shift+click) or header button
  const handleCompareSelect = useCallback((country) => {
    if (!compareA) {
      setCompareA(country);
      setCompareMode(true);
    } else if (!compareB && country.name.official !== compareA.name.official) {
      setCompareB(country);
      setShowCompare(true);
      setCompareMode(false);
    }
  }, [compareA, compareB]);

  const clearCompare = useCallback(() => {
    setCompareA(null);
    setCompareB(null);
    setShowCompare(false);
    setCompareMode(false);
  }, []);

  const toggleCompareMode = useCallback(() => {
    if (showCompare) {
      clearCompare();
    } else if (compareMode) {
      clearCompare();
    } else if (viewMode === 'detail' && selectedCountry) {
      handleCompareSelect(selectedCountry);
      // Return to the grid so there's something to pick a second country from
      setViewMode('grid');
    } else {
      setCompareMode(true);
    }
  }, [showCompare, compareMode, viewMode, selectedCountry, clearCompare, handleCompareSelect]);

  // Routes a country pick from search/recently-viewed the same way grid
  // cards do — into compare selection while compare mode is active
  const handleCountryPick = useCallback((country) => {
    if (compareMode) {
      handleCompareSelect(country);
    } else {
      handleSelectCountry(country);
    }
  }, [compareMode, handleCompareSelect, handleSelectCountry]);

  // Region-filtered countries
  const filteredCountries = useMemo(() => {
    if (activeRegion === 'all') return countries;
    return countries.filter(c => c.region === activeRegion);
  }, [countries, activeRegion]);

  // Region counts for badge display
  const regionCounts = useMemo(() => {
    const counts = { all: countries.length };
    countries.forEach(c => {
      counts[c.region] = (counts[c.region] || 0) + 1;
    });
    return counts;
  }, [countries]);

  // Compare button label
  const compareLabel = showCompare
    ? '✕ Close'
    : compareMode
      ? compareA
        ? `⚖️ ${compareA.name.common}...`
        : '⚖️ Pick first...'
      : '⚖️ Compare';

  // Determine what to show in the main content area
  const renderContent = () => {
    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorState error={error} onRetry={fetchCountries} />;

    if (viewMode === 'detail' && selectedCountry) {
      return (
        <CountryCard
          selectedCountry={selectedCountry}
          onBack={handleBackToGrid}
        />
      );
    }

    return (
      <Dashboard
        countries={filteredCountries}
        allCountries={countries}
        activeRegion={activeRegion}
        onSelectCountry={handleSelectCountry}
        visibleCount={visibleCount}
        onShowMore={() => setVisibleCount(prev => prev + 24)}
        onSelectRegion={setActiveRegion}
        regionCounts={regionCounts}
        compareMode={compareMode}
        compareA={compareA}
        onCompareSelect={handleCompareSelect}
      />
    );
  };

  return (
    <div className="app-layout">
      <header className="app-header" role="banner">
        <div className="header-inner">
          <SearchField
            countries={filteredCountries}
            setSelectedCountry={handleCountryPick}
            search={search}
            setSearch={setSearch}
          />
          <div className="header-actions">
            <button
              className={`compare-toggle-btn${compareMode || showCompare ? ' compare-active' : ''}`}
              onClick={toggleCompareMode}
              aria-label={
                showCompare ? 'Close comparison'
                : compareMode ? 'Cancel compare mode'
                : 'Compare countries'
              }
              title={
                showCompare ? 'Close comparison'
                : compareMode
                  ? compareA ? `Comparing ${compareA.name.common} — click another` : 'Click two countries to compare'
                  : 'Click to enter compare mode, or shift+click grid cards'
              }
            >
              {compareLabel}
            </button>
            <ThemeToggle theme={theme} setTheme={setTheme} />
          </div>
        </div>
      </header>

      {/* Region filter bar */}
      {!loading && !error && (
        <nav className="region-bar" aria-label="Region filter">
          <RegionFilter
            activeRegion={activeRegion}
            setActiveRegion={setActiveRegion}
            countryCounts={regionCounts}
          />
        </nav>
      )}

      {/* Recently viewed chips */}
      {!loading && !error && recentList.length > 0 && (
        <RecentlyViewed
          recentList={recentList}
          onSelect={handleCountryPick}
          countries={countries}
        />
      )}

      <main className="app-main" role="main">
        {/* Compare panel overlay */}
        {showCompare && compareA && compareB && (
          <ComparePanel
            countryA={compareA}
            countryB={compareB}
            onClose={() => setShowCompare(false)}
            onClear={clearCompare}
          />
        )}

        <div className="countryShow">
          {renderContent()}
        </div>

        {!loading && !error && viewMode === 'detail' && selectedCountry && (
          <RandomDiscovery
            countries={countries}
            currentCountry={selectedCountry}
            onSelect={handleSelectCountry}
          />
        )}
      </main>

      <VqmFooter />
    </div>
  );
};

export default App;
