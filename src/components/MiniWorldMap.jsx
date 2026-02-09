import { useMemo } from 'react';

// Simplified SVG world map regions — each path is a rough silhouette of a continent
const REGION_PATHS = {
  Africa: {
    d: 'M52,38 L56,36 L60,38 L62,42 L64,50 L62,58 L58,64 L54,66 L50,62 L48,54 L48,46 L50,40 Z',
    label: { x: 55, y: 52 },
  },
  Europe: {
    d: 'M48,22 L52,20 L58,22 L60,26 L58,32 L54,34 L50,36 L46,34 L44,28 L46,24 Z',
    label: { x: 52, y: 28 },
  },
  Asia: {
    d: 'M62,18 L70,16 L82,18 L88,24 L90,32 L86,40 L80,44 L72,42 L66,38 L62,32 L60,26 Z',
    label: { x: 76, y: 30 },
  },
  Americas: {
    d: 'M18,18 L24,16 L28,20 L30,28 L28,36 L26,42 L24,50 L22,58 L20,66 L18,72 L16,64 L14,52 L14,40 L16,30 L16,24 Z',
    label: { x: 22, y: 42 },
  },
  Oceania: {
    d: 'M80,52 L86,50 L92,52 L94,56 L92,62 L86,64 L80,62 L78,58 L78,54 Z',
    label: { x: 86, y: 57 },
  },
  Antarctic: {
    d: 'M20,82 L40,80 L60,80 L80,82 L80,86 L60,88 L40,88 L20,86 Z',
    label: { x: 50, y: 84 },
  },
};

const MiniWorldMap = ({ activeRegion, onSelectRegion, regionCounts }) => {
  const regions = useMemo(() =>
    Object.entries(REGION_PATHS).map(([name, { d, label }]) => ({
      name, d, label,
      count: regionCounts[name] || 0,
      isActive: activeRegion === name,
      isHighlighted: activeRegion === 'all' || activeRegion === name,
    })),
    [activeRegion, regionCounts]
  );

  return (
    <div className="mini-map-container">
      <svg
        viewBox="0 0 100 92"
        className="mini-map-svg"
        aria-label="World map region selector"
        role="img"
      >
        {/* Grid lines for depth */}
        <line x1="0" y1="45" x2="100" y2="45" className="mini-map-equator" />

        {regions.map(({ name, d, label, count, isActive, isHighlighted }) => (
          <g key={name} className="mini-map-region-group">
            <path
              d={d}
              className={`mini-map-region ${isActive ? 'mini-map-active' : ''} ${isHighlighted ? '' : 'mini-map-dimmed'}`}
              onClick={() => onSelectRegion(isActive ? 'all' : name)}
              role="button"
              aria-label={`${name}: ${count} countries`}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectRegion(isActive ? 'all' : name);
                }
              }}
            />
            <text
              x={label.x}
              y={label.y}
              className={`mini-map-label ${isActive ? 'mini-map-label-active' : ''} ${isHighlighted ? '' : 'mini-map-label-dimmed'}`}
              textAnchor="middle"
              dominantBaseline="central"
              pointerEvents="none"
            >
              {count}
            </text>
          </g>
        ))}
      </svg>
      <div className="mini-map-hint">
        {activeRegion === 'all' ? 'Click a region to filter' : `Viewing ${activeRegion} — click to reset`}
      </div>
    </div>
  );
};

export default MiniWorldMap;
