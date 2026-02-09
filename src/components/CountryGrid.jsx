import { useMemo, useState, useCallback } from 'react';

const formatPop = (num) => {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(0) + 'K';
  return num.toLocaleString('en-US');
};

const SORT_OPTIONS = [
  { key: 'name-asc', label: 'Name A-Z', icon: '🔤' },
  { key: 'name-desc', label: 'Name Z-A', icon: '🔤' },
  { key: 'pop-desc', label: 'Most Populated', icon: '👥' },
  { key: 'pop-asc', label: 'Least Populated', icon: '👤' },
  { key: 'area-desc', label: 'Largest Area', icon: '🌍' },
  { key: 'area-asc', label: 'Smallest Area', icon: '📍' },
  { key: 'density-desc', label: 'Highest Density', icon: '🏙️' },
];

const sortFns = {
  'name-asc': (a, b) => a.name.common.localeCompare(b.name.common),
  'name-desc': (a, b) => b.name.common.localeCompare(a.name.common),
  'pop-desc': (a, b) => b.population - a.population,
  'pop-asc': (a, b) => a.population - b.population,
  'area-desc': (a, b) => b.area - a.area,
  'area-asc': (a, b) => a.area - b.area,
  'density-desc': (a, b) => {
    const da = a.area > 0 ? a.population / a.area : 0;
    const db = b.area > 0 ? b.population / b.area : 0;
    return db - da;
  },
};

const CountryGrid = ({
  countries,
  onSelectCountry,
  visibleCount,
  onShowMore,
  compareMode,
  compareA,
  onCompareSelect,
}) => {
  const [sortKey, setSortKey] = useState('name-asc');

  const sorted = useMemo(() =>
    [...countries].sort(sortFns[sortKey] || sortFns['name-asc']),
    [countries, sortKey]
  );

  const visible = sorted.slice(0, visibleCount);
  const hasMore = visibleCount < sorted.length;

  // Random country
  const handleRandom = useCallback(() => {
    if (countries.length === 0) return;
    const idx = Math.floor(Math.random() * countries.length);
    onSelectCountry(countries[idx]);
  }, [countries, onSelectCountry]);

  // Card click handler — normal select or compare select
  const handleCardClick = useCallback((country, e) => {
    if (compareMode || e.shiftKey) {
      e.preventDefault();
      if (onCompareSelect) onCompareSelect(country);
    } else {
      onSelectCountry(country);
    }
  }, [compareMode, onCompareSelect, onSelectCountry]);

  return (
    <div className="country-grid-wrapper">
      {/* Sort controls + Random button */}
      <div className="grid-toolbar">
        <div className="sort-controls">
          <label className="sort-label" htmlFor="sort-select">Sort by</label>
          <select
            id="sort-select"
            className="sort-select"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.key} value={opt.key}>
                {opt.icon} {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="grid-toolbar-actions">
          {compareMode && (
            <span className="compare-hint">
              {compareA ? `Click another to compare with ${compareA.name.common}` : 'Click a country to compare'}
            </span>
          )}
          <button
            className="random-btn"
            onClick={handleRandom}
            aria-label="Random country"
            title="Discover a random country"
          >
            <span className="random-dice">🎲</span>
            <span className="random-text">Random</span>
          </button>
        </div>
      </div>

      <div className="country-grid">
        {visible.map((country, idx) => {
          const isCompareSelected = compareA && compareA.name.official === country.name.official;
          return (
            <button
              key={country.name.official}
              className={`grid-card grid-card-enter${isCompareSelected ? ' grid-card-compare-selected' : ''}${compareMode ? ' grid-card-compare-mode' : ''}`}
              style={{ animationDelay: `${Math.min(idx * 30, 600)}ms` }}
              onClick={(e) => handleCardClick(country, e)}
              aria-label={
                compareMode
                  ? `Compare ${country.name.common}`
                  : `View details for ${country.name.common}`
              }
            >
              {isCompareSelected && (
                <span className="grid-card-check" aria-hidden="true">✓</span>
              )}
              <div className="grid-card-flag">
                <img
                  src={country.flags?.png}
                  alt=""
                  loading="lazy"
                />
              </div>
              <div className="grid-card-body">
                <span className="grid-card-name">{country.name.common}</span>
                <span className="grid-card-capital">
                  {country.capital?.[0] || 'No capital'}
                </span>
                <div className="grid-card-meta">
                  <span className="grid-card-pop mono">
                    {formatPop(country.population)}
                  </span>
                  <span className="grid-card-region-badge">{country.region}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      {hasMore && (
        <div className="grid-show-more">
          <button className="show-more-btn" onClick={onShowMore}>
            Show More ({sorted.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </div>
  );
};

export default CountryGrid;
