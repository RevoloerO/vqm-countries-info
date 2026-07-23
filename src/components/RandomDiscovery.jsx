import { useMemo } from 'react';

function pickRandom(countries, excludeOfficial, count) {
  const pool = countries.filter((c) => c.name.official !== excludeOfficial);
  const picks = [];
  const usedIdx = new Set();
  while (picks.length < count && usedIdx.size < pool.length) {
    const idx = Math.floor(Math.random() * pool.length);
    if (usedIdx.has(idx)) continue;
    usedIdx.add(idx);
    picks.push(pool[idx]);
  }
  return picks;
}

const RandomDiscovery = ({ countries, currentCountry, onSelect }) => {
  const picks = useMemo(
    () => pickRandom(countries, currentCountry?.name?.official, 3),
    [countries, currentCountry?.name?.official]
  );

  if (picks.length === 0) return null;

  return (
    <div className="random-discovery">
      <h3 className="random-discovery-title">🎲 Discover More</h3>
      <div className="random-discovery-grid">
        {picks.map((country) => (
          <button
            key={country.name.official}
            className="random-discovery-card"
            onClick={() => onSelect(country)}
            aria-label={`View details for ${country.name.common}`}
          >
            <img
              className="random-discovery-flag"
              src={country.flags?.png}
              alt=""
              loading="lazy"
            />
            <div className="random-discovery-info">
              <span className="random-discovery-name">{country.name.common}</span>
              <span className="random-discovery-capital">{country.capital?.[0] || 'No capital'}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RandomDiscovery;
