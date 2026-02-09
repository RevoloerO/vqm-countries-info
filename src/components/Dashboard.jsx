import StatsBar from './StatsBar';
import QuickFacts from './QuickFacts';
import CountryGrid from './CountryGrid';
import MiniWorldMap from './MiniWorldMap';
import PopulationGrowthCounter from './PopulationGrowthCounter';
import MidnightCountries from './MidnightCountries';

const Dashboard = ({
  countries,
  allCountries,
  activeRegion,
  onSelectCountry,
  visibleCount,
  onShowMore,
  onSelectRegion,
  regionCounts,
  compareMode,
  compareA,
  onCompareSelect,
}) => {
  return (
    <div className="dashboard">
      {/* Info board section — visually distinct from the grid */}
      <section className="dashboard-info-board" aria-label="Dashboard overview">
        <div className="info-board-header">
          <h2 className="info-board-title">
            <span className="info-board-icon" aria-hidden="true">📊</span>
            Dashboard Overview
            {activeRegion !== 'all' && (
              <span className="info-board-region-tag">{activeRegion}</span>
            )}
          </h2>
        </div>

        <div className="dashboard-top">
          <div className="dashboard-top-left">
            <StatsBar
              totalCountries={allCountries.length}
              filteredCount={countries.length}
              activeRegion={activeRegion}
              countries={countries}
            />
            <QuickFacts countries={countries} activeRegion={activeRegion} />
          </div>
          <MiniWorldMap
            activeRegion={activeRegion}
            onSelectRegion={onSelectRegion}
            regionCounts={regionCounts}
          />
        </div>

        {/* Live widgets row */}
        <div className="dashboard-live-row">
          <PopulationGrowthCounter countries={countries} />
          <MidnightCountries countries={allCountries} />
        </div>
      </section>

      <CountryGrid
        countries={countries}
        onSelectCountry={onSelectCountry}
        visibleCount={visibleCount}
        onShowMore={onShowMore}
        compareMode={compareMode}
        compareA={compareA}
        onCompareSelect={onCompareSelect}
      />
    </div>
  );
};

export default Dashboard;
