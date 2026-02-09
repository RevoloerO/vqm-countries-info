import { useState, useEffect, useRef, useMemo } from 'react';

// World birth rate ≈ 4.3 births/sec, death rate ≈ 1.8/sec → net ≈ 2.5/sec (2024 estimate)
const WORLD_BIRTHS_PER_SEC = 4.3;
const WORLD_DEATHS_PER_SEC = 1.8;
const WORLD_NET_PER_SEC = WORLD_BIRTHS_PER_SEC - WORLD_DEATHS_PER_SEC;
const WORLD_POPULATION = 8_100_000_000; // ~8.1B

const PopulationGrowthCounter = ({ countries }) => {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(Date.now());
  const rafRef = useRef(null);

  // Fraction of world population represented by current filtered countries
  const popFraction = useMemo(() => {
    const totalPop = countries.reduce((sum, c) => sum + (c.population || 0), 0);
    return Math.min(totalPop / WORLD_POPULATION, 1);
  }, [countries]);

  // Scaled rates
  const birthsPerSec = WORLD_BIRTHS_PER_SEC * popFraction;
  const deathsPerSec = WORLD_DEATHS_PER_SEC * popFraction;
  const netPerSec = WORLD_NET_PER_SEC * popFraction;

  useEffect(() => {
    startRef.current = Date.now();
    const tick = () => {
      setElapsed((Date.now() - startRef.current) / 1000);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const births = Math.floor(birthsPerSec * elapsed);
  const deaths = Math.floor(deathsPerSec * elapsed);
  const netGrowth = Math.floor(netPerSec * elapsed);

  const formatNum = (n) => n.toLocaleString('en-US');

  return (
    <div className="pop-growth-counter">
      <div className="pop-growth-header">
        <span className="pop-growth-icon" aria-hidden="true">📈</span>
        <span className="pop-growth-title">Live Population Pulse</span>
        <span className="pop-growth-since">since you opened this page</span>
      </div>
      <div className="pop-growth-stats">
        <div className="pop-growth-stat pop-growth-births">
          <span className="pop-growth-value mono">{formatNum(births)}</span>
          <span className="pop-growth-label">Births</span>
          <span className="pop-growth-rate mono">+{birthsPerSec.toFixed(1)}/s</span>
        </div>
        <div className="pop-growth-stat pop-growth-deaths">
          <span className="pop-growth-value mono">{formatNum(deaths)}</span>
          <span className="pop-growth-label">Deaths</span>
          <span className="pop-growth-rate mono">-{deathsPerSec.toFixed(1)}/s</span>
        </div>
        <div className="pop-growth-stat pop-growth-net">
          <span className="pop-growth-value mono">+{formatNum(netGrowth)}</span>
          <span className="pop-growth-label">Net Growth</span>
          <span className="pop-growth-rate mono">+{netPerSec.toFixed(1)}/s</span>
        </div>
      </div>
      <div className="pop-growth-bar">
        <div
          className="pop-growth-bar-fill"
          style={{ width: `${Math.min((elapsed % 60) / 60 * 100, 100)}%` }}
        />
      </div>
    </div>
  );
};

export default PopulationGrowthCounter;
