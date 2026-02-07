import { BsCurrencyExchange, BsClockFill } from 'react-icons/bs';
import { GiWorld, GiFlatPlatform } from 'react-icons/gi';
import { IoIosPeople } from 'react-icons/io';
import { MdStars, MdNaturePeople } from 'react-icons/md';
import { HiLanguage } from 'react-icons/hi2';
import AnimatedCounter from './AnimatedCounter';

const CompareRow = ({ label, icon, left, right, highlightHigher = false }) => {
  const leftVal = typeof left === 'number' ? left : null;
  const rightVal = typeof right === 'number' ? right : null;
  const leftWins = highlightHigher && leftVal !== null && rightVal !== null && leftVal > rightVal;
  const rightWins = highlightHigher && leftVal !== null && rightVal !== null && rightVal > leftVal;

  return (
    <div className="compare-row">
      <div className={`compare-cell compare-left${leftWins ? ' compare-winner' : ''}`}>
        {typeof left === 'number' ? left.toLocaleString('en-US') : left}
      </div>
      <div className="compare-label">
        <span className="compare-label-icon">{icon}</span>
        {label}
      </div>
      <div className={`compare-cell compare-right${rightWins ? ' compare-winner' : ''}`}>
        {typeof right === 'number' ? right.toLocaleString('en-US') : right}
      </div>
    </div>
  );
};

const ComparePanel = ({ countryA, countryB, onClose, onClear }) => {
  if (!countryA || !countryB) return null;

  const getCurrencies = (c) => {
    if (!c.currencies) return 'N/A';
    return Object.values(c.currencies).map(cur => `${cur.name} (${cur.symbol || ''})`).join(', ');
  };

  const getLanguages = (c) => {
    if (!c.languages) return 'N/A';
    return Object.values(c.languages).join(', ');
  };

  return (
    <div className="compare-panel">
      <div className="compare-header">
        <h2 className="compare-title">Country Comparison</h2>
        <div className="compare-actions">
          <button className="compare-clear-btn" onClick={onClear} aria-label="Clear comparison">
            Clear
          </button>
          <button className="compare-close-btn" onClick={onClose} aria-label="Close comparison">
            ✕
          </button>
        </div>
      </div>

      {/* Country name headers with flags */}
      <div className="compare-row compare-names">
        <div className="compare-cell compare-left">
          <div className="compare-country-header">
            <img className="compare-flag" src={countryA.flags.png} alt="" />
            <span>{countryA.name.common} {countryA.flag}</span>
          </div>
        </div>
        <div className="compare-label compare-vs">VS</div>
        <div className="compare-cell compare-right">
          <div className="compare-country-header">
            <img className="compare-flag" src={countryB.flags.png} alt="" />
            <span>{countryB.name.common} {countryB.flag}</span>
          </div>
        </div>
      </div>

      <CompareRow label="Capital" icon={<MdStars />}
        left={countryA.capital?.[0] || 'N/A'} right={countryB.capital?.[0] || 'N/A'} />
      <CompareRow label="Region" icon={<GiWorld />}
        left={countryA.region} right={countryB.region} />
      <CompareRow label="Population" icon={<IoIosPeople />}
        left={countryA.population} right={countryB.population} highlightHigher />
      <CompareRow label="Area (km²)" icon={<GiFlatPlatform />}
        left={countryA.area} right={countryB.area} highlightHigher />
      <CompareRow label="Density (p/km²)" icon={<MdNaturePeople />}
        left={parseFloat((countryA.population / countryA.area).toFixed(2))}
        right={parseFloat((countryB.population / countryB.area).toFixed(2))} highlightHigher />
      <CompareRow label="Currency" icon={<BsCurrencyExchange />}
        left={getCurrencies(countryA)} right={getCurrencies(countryB)} />
      <CompareRow label="Languages" icon={<HiLanguage />}
        left={getLanguages(countryA)} right={getLanguages(countryB)} />
      <CompareRow label="Timezones" icon={<BsClockFill />}
        left={countryA.timezones?.length || 0} right={countryB.timezones?.length || 0} highlightHigher />
    </div>
  );
};

export default ComparePanel;
