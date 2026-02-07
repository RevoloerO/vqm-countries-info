import { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import './App.css';
import ThemeToggle from './components/ThemeToggle';
import SearchField from './components/SearchField';
import CountryCard from './components/CountryCard';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorState from './components/ErrorState';
import WelcomeState from './components/WelcomeState';
import RegionFilter from './components/RegionFilter';
import RecentlyViewed, { loadRecentlyViewed, saveRecentlyViewed } from './components/RecentlyViewed';
import ComparePanel from './components/ComparePanel';
import VqmFooter from './vqm-footer/vqm-footer';

// ===== API CACHING (#28) =====
const CACHE_KEY = 'vqm-countries-cache';
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

const getCachedCountries = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_TTL) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
};

const setCachedCountries = (data) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
  } catch { /* localStorage full — silently ignore */ }
};

const App = () => {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [theme, setTheme] = useState('light');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Phase 5 state
  const [activeRegion, setActiveRegion] = useState('all');
  const [recentList, setRecentList] = useState(loadRecentlyViewed);
  const [compareA, setCompareA] = useState(null);
  const [compareB, setCompareB] = useState(null);
  const [showCompare, setShowCompare] = useState(false);

  // Apply theme to <body> and background image
  useEffect(() => {
    document.body.classList.toggle('dark-theme', theme === 'dark');
    document.body.classList.toggle('light-theme', theme === 'light');
    document.body.style.backgroundImage =
      theme === 'dark'
        ? "url('assets/world-bg-dark.png')"
        : "url('assets/world-bg.png')";
  }, [theme]);

  // Fetch countries data with caching (#28)
  const fetchCountries = useCallback(() => {
    setLoading(true);
    setError(null);

    // Try cache first
    const cached = getCachedCountries();
    if (cached) {
      setCountries(cached);
      setLoading(false);
      return;
    }

    const url1 = 'https://restcountries.com/v3.1/all?fields=name,flags,coatOfArms,capital,region,subregion,currencies,population,area,languages';
    const url2 = 'https://restcountries.com/v3.1/all?fields=name,flag,timezones,maps';

    Promise.all([axios.get(url1), axios.get(url2)])
      .then(([res1, res2]) => {
        const data1 = res1.data;
        const data2 = res2.data;
        const map2 = {};
        data2.forEach(c => { map2[c.name.official] = c; });
        const merged = data1.map(c => {
          const c2 = map2[c.name.official] || {};
          return { ...c, flag: c2.flag, timezones: c2.timezones, maps: c2.maps };
        });
        setCountries(merged);
        setCachedCountries(merged);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch countries:', err);
        setError('Failed to load country data. Please check your internet connection.');
        setLoading(false);
      });
  }, []);

  useEffect(fetchCountries, [fetchCountries]);

  // Select country handler — saves to recently viewed (#22)
  const handleSelectCountry = useCallback((country) => {
    setSelectedCountry(country);
    const updated = saveRecentlyViewed(country);
    setRecentList(updated);
  }, []);

  // Compare mode handlers (#23)
  const handleCompareSelect = useCallback((country) => {
    if (!compareA) {
      setCompareA(country);
    } else if (!compareB && country.name.official !== compareA.name.official) {
      setCompareB(country);
      setShowCompare(true);
    }
  }, [compareA, compareB]);

  const clearCompare = useCallback(() => {
    setCompareA(null);
    setCompareB(null);
    setShowCompare(false);
  }, []);

  // Region-filtered countries for the search (#21)
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

  // Determine what to show in the main content area
  const renderContent = () => {
    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorState error={error} onRetry={fetchCountries} />;
    if (!selectedCountry) return <WelcomeState />;
    return <CountryCard countries={filteredCountries} selectedCountry={selectedCountry} />;
  };

  return (
    <div className="app-layout">
      <header className="app-header" role="banner">
        <div className="header-inner">
          <SearchField
            countries={filteredCountries}
            setSelectedCountry={handleSelectCountry}
            search={search}
            setSearch={setSearch}
          />
          <div className="header-actions">
            {/* Compare toggle button */}
            <button
              className={`compare-toggle-btn${compareA ? ' compare-active' : ''}`}
              onClick={() => {
                if (showCompare) {
                  clearCompare();
                } else if (selectedCountry) {
                  if (!compareA) {
                    handleCompareSelect(selectedCountry);
                  } else if (!compareB) {
                    handleCompareSelect(selectedCountry);
                  }
                }
              }}
              aria-label={
                showCompare ? 'Close comparison'
                : compareA ? `Comparing ${compareA.name.common} — select another`
                : 'Compare countries'
              }
              title={
                showCompare ? 'Close comparison'
                : compareA ? `Comparing ${compareA.name.common} — select another country`
                : 'Select a country then click to compare'
              }
            >
              {showCompare ? '✕ Close' : compareA ? `⚖️ ${compareA.name.common}...` : '⚖️ Compare'}
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
          onSelect={handleSelectCountry}
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
      </main>

      <VqmFooter />
    </div>
  );
};

export default App;
