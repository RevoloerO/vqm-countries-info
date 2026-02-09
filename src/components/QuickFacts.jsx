import { useMemo } from 'react';

const formatPop = (num) => {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2) + 'B';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(0) + 'K';
  return num.toLocaleString('en-US');
};

const formatArea = (num) => {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(2) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
  return num.toLocaleString('en-US');
};

const QuickFacts = ({ countries, activeRegion }) => {
  const facts = useMemo(() => {
    if (countries.length === 0) return null;

    const mostPopulated = countries.reduce((max, c) =>
      c.population > max.population ? c : max, countries[0]);

    const largest = countries.reduce((max, c) =>
      c.area > max.area ? c : max, countries[0]);

    const smallest = countries.reduce((min, c) =>
      c.area > 0 && c.area < min.area ? c : min, countries[0]);

    const currencies = new Set(
      countries.flatMap(c => Object.keys(c.currencies || {}))
    );

    return { mostPopulated, largest, smallest, currencyCount: currencies.size };
  }, [countries]);

  if (!facts) return null;

  return (
    <div className="quick-facts">
      <div className="quick-fact-card">
        <span className="quick-fact-icon" aria-hidden="true">&#x1F3C6;</span>
        <div className="quick-fact-content">
          <span className="quick-fact-label">Most Populated</span>
          <span className="quick-fact-value">{facts.mostPopulated.name.common}</span>
          <span className="quick-fact-sub mono">{formatPop(facts.mostPopulated.population)}</span>
        </div>
      </div>
      <div className="quick-fact-card">
        <span className="quick-fact-icon" aria-hidden="true">&#x1F30D;</span>
        <div className="quick-fact-content">
          <span className="quick-fact-label">Largest Area</span>
          <span className="quick-fact-value">{facts.largest.name.common}</span>
          <span className="quick-fact-sub mono">{formatArea(facts.largest.area)} km&sup2;</span>
        </div>
      </div>
      <div className="quick-fact-card">
        <span className="quick-fact-icon" aria-hidden="true">&#x1F48E;</span>
        <div className="quick-fact-content">
          <span className="quick-fact-label">Smallest</span>
          <span className="quick-fact-value">{facts.smallest.name.common}</span>
          <span className="quick-fact-sub mono">{formatArea(facts.smallest.area)} km&sup2;</span>
        </div>
      </div>
      <div className="quick-fact-card">
        <span className="quick-fact-icon" aria-hidden="true">&#x1F4B0;</span>
        <div className="quick-fact-content">
          <span className="quick-fact-label">Currencies</span>
          <span className="quick-fact-value mono">{facts.currencyCount} unique</span>
        </div>
      </div>
    </div>
  );
};

export default QuickFacts;
