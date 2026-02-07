const REGIONS = [
  { key: 'all', label: 'All', emoji: '🌍' },
  { key: 'Africa', label: 'Africa', emoji: '🌍' },
  { key: 'Americas', label: 'Americas', emoji: '🌎' },
  { key: 'Asia', label: 'Asia', emoji: '🌏' },
  { key: 'Europe', label: 'Europe', emoji: '🌍' },
  { key: 'Oceania', label: 'Oceania', emoji: '🏝️' },
  { key: 'Antarctic', label: 'Antarctic', emoji: '🧊' },
];

const RegionFilter = ({ activeRegion, setActiveRegion, countryCounts }) => {
  return (
    <div className="region-filter" role="tablist" aria-label="Filter by region">
      {REGIONS.map(({ key, label, emoji }) => (
        <button
          key={key}
          role="tab"
          aria-selected={activeRegion === key}
          className={`region-tab${activeRegion === key ? ' region-tab-active' : ''}`}
          onClick={() => setActiveRegion(key)}
        >
          <span className="region-emoji" aria-hidden="true">{emoji}</span>
          <span className="region-label">{label}</span>
          {countryCounts && countryCounts[key] !== undefined && (
            <span className="region-count">{countryCounts[key]}</span>
          )}
        </button>
      ))}
    </div>
  );
};

export default RegionFilter;
