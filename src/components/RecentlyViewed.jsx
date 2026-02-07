const MAX_RECENT = 8;
const STORAGE_KEY = 'vqm-recently-viewed';

// Helper to load from localStorage
export const loadRecentlyViewed = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Helper to save a country visit
export const saveRecentlyViewed = (country) => {
  try {
    const recent = loadRecentlyViewed();
    // Remove if already in list
    const filtered = recent.filter(c => c.name !== country.name.common);
    // Add to front
    const updated = [
      { name: country.name.common, flag: country.flag },
      ...filtered,
    ].slice(0, MAX_RECENT);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
};

const RecentlyViewed = ({ recentList, onSelect, countries }) => {
  if (!recentList || recentList.length === 0) return null;

  const handleClick = (name) => {
    const found = countries.find(c => c.name.common === name);
    if (found) onSelect(found);
  };

  return (
    <div className="recently-viewed" aria-label="Recently viewed countries">
      <span className="recently-label">Recent:</span>
      <div className="recently-chips">
        {recentList.map((item) => (
          <button
            key={item.name}
            className="recently-chip"
            onClick={() => handleClick(item.name)}
            aria-label={`View ${item.name}`}
          >
            <span className="recently-flag">{item.flag}</span>
            <span className="recently-name">{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewed;
