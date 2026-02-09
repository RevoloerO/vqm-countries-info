import { useMemo, useState, useEffect } from 'react';

const formatNumber = (num) => {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(0) + 'K';
  return num.toLocaleString('en-US');
};

const StatsBar = ({ totalCountries, filteredCount, activeRegion, countries }) => {
  const stats = useMemo(() => {
    const totalPop = countries.reduce((sum, c) => sum + (c.population || 0), 0);
    const totalArea = countries.reduce((sum, c) => sum + (c.area || 0), 0);
    const langs = new Set(countries.flatMap(c => Object.values(c.languages || {})));
    return { totalPop, totalArea, langCount: langs.size };
  }, [countries]);

  const facts = useMemo(() => {
    if (countries.length === 0) return [];
    const sorted = [...countries].sort((a, b) => b.population - a.population);
    const largest = [...countries].sort((a, b) => b.area - a.area)[0];
    const densest = [...countries]
      .filter(c => c.area > 0)
      .sort((a, b) => (b.population / b.area) - (a.population / a.area))[0];

    const arr = [];
    if (sorted[0]) arr.push(`${sorted[0].name.common} is the most populated with ${formatNumber(sorted[0].population)} people`);
    if (largest) arr.push(`${largest.name.common} covers ${formatNumber(largest.area)} km\u00B2`);
    if (densest) arr.push(`${densest.name.common} has the highest density at ${Math.round(densest.population / densest.area)} p/km\u00B2`);
    if (sorted.length > 1) arr.push(`${sorted[sorted.length - 1].name.common} is the least populated`);
    return arr;
  }, [countries]);

  const [factIdx, setFactIdx] = useState(0);
  useEffect(() => {
    if (facts.length <= 1) return;
    const timer = setInterval(() => {
      setFactIdx(prev => (prev + 1) % facts.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [facts.length]);

  return (
    <div className="stats-bar">
      <div className="stat-item">
        <span className="stat-value mono">{filteredCount}</span>
        <span className="stat-label">Countries</span>
      </div>
      <div className="stat-divider" />
      <div className="stat-item">
        <span className="stat-value mono">{formatNumber(stats.totalPop)}</span>
        <span className="stat-label">Population</span>
      </div>
      <div className="stat-divider" />
      <div className="stat-item">
        <span className="stat-value mono">{formatNumber(stats.totalArea)}</span>
        <span className="stat-label">Area km&sup2;</span>
      </div>
      <div className="stat-divider" />
      <div className="stat-item">
        <span className="stat-value mono">{stats.langCount}</span>
        <span className="stat-label">Languages</span>
      </div>
      {facts.length > 0 && (
        <>
          <div className="stat-divider" />
          <div className="stat-item stat-fact">
            <span className="stat-fact-text" key={factIdx}>{facts[factIdx]}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default StatsBar;
