import { RiLightbulbFlashLine } from "react-icons/ri";
import { HiLanguage } from "react-icons/hi2";
import { GiWorld, GiFlatPlatform } from 'react-icons/gi';
import { MdStars, MdNaturePeople } from 'react-icons/md';
import { BsCurrencyExchange, BsClockFill } from 'react-icons/bs';
import { TbWorldCog } from "react-icons/tb";
import { IoIosPeople } from 'react-icons/io';
import { FaMapMarkedAlt } from 'react-icons/fa';
import Details from './Details';
import CollapsibleSection from './CollapsibleSection';
import AnimatedCounter from './AnimatedCounter';

const ShowCountry = ({ country }) => {
  const city = country.capital ? country.capital : 'No capital';
  const nativeName = country.name.nativeName
    ? Object.values(country.name.nativeName)[0].common
    : 'No native name';
  const currencies = country.currencies
    ? country.currencies
    : { "NaN": { name: 'No currency', symbol: 'NaN' } };
  const languages = country.languages
    ? country.languages
    : { "NaN": "Not Available" };

  const populationDisplay = (
    <><AnimatedCounter value={country.population} duration={900} /> ppl</>
  );
  const areaDisplay = (
    <><AnimatedCounter value={country.area} duration={900} /> km<sup>2</sup></>
  );
  const densityVal = parseFloat((country.population / country.area).toFixed(2));
  const densityDisplay = (
    <><AnimatedCounter value={densityVal} duration={900} /> p/km<sup>2</sup></>
  );

  return (
    <div className="countryInfo">
      <div className="countryTitle">
        <div className="flag-container">
          <img
            className="country-flag"
            src={country.flags.png}
            alt={`Flag of ${country.name.common}`}
          />
        </div>

        <div className="country-name-section">
          <h1 className="country-heading">
            <span className="country-heading-text">{country.name.common}</span>
            <span className="country-flag-emoji">{country.flag}</span>
            {country.coatOfArms?.png && (
              <img
                className="coat-of-arms"
                src={country.coatOfArms.png}
                alt={`Coat of arms of ${country.name.common}`}
                loading="lazy"
              />
            )}
          </h1>
          <p className="country-official"><b>{country.name.official}</b></p>
          <Details icon={<MdStars />} title="Capital" info={city} />
          <Details icon={<TbWorldCog />} title="Native Name" info={nativeName} />
        </div>
      </div>

      <div className="countryDetail">
        <h1><RiLightbulbFlashLine /> Insights</h1>
        <Details icon={<GiWorld />} title="Region" info={`${country.region} | ${country.subregion}`} />

        <div className="details-row">
          <span className="details-icon"><BsCurrencyExchange /></span>
          <span className="details-title"><u>Currency</u>:</span>
          <span className="details-info currency-list">
            {Object.keys(currencies).map(key => (
              <span key={key} className="currency-badge">
                <span className="currency-code">{key}</span>
                <span className="currency-name">{currencies[key].name}</span>
                {currencies[key].symbol && (
                  <span className="currency-symbol">{currencies[key].symbol}</span>
                )}
              </span>
            ))}
          </span>
        </div>

        <Details icon={<IoIosPeople />} title="Population" info={populationDisplay} />
        <Details icon={<GiFlatPlatform />} title="Area" info={areaDisplay} />
        <Details icon={<MdNaturePeople />} title="Population Density" info={densityDisplay} />

        <CollapsibleSection icon={<BsClockFill />} title="Time Zones" defaultOpen={false}>
          <ul className="collapsible-list">
            {country.timezones && country.timezones.length > 0
              ? country.timezones.map((tz) => (
                  <li key={tz} className="collapsible-list-item">
                    <span className="collapsible-bullet">•</span>
                    <span>{tz}</span>
                  </li>
                ))
              : <li>Not Available</li>
            }
          </ul>
        </CollapsibleSection>

        <CollapsibleSection icon={<HiLanguage />} title="Official Languages" defaultOpen={false}>
          <ul className="collapsible-list">
            {Object.keys(languages).length > 0
              ? Object.keys(languages).map(key => (
                  <li key={key} className="collapsible-list-item">
                    <span className="collapsible-bullet">•</span>
                    <span>{languages[key]}</span>
                  </li>
                ))
              : <li>Not Available</li>
            }
          </ul>
        </CollapsibleSection>

        <div className="details-row">
          <span className="details-icon"><FaMapMarkedAlt /></span>
          <span className="details-title"><u>Maps</u>:</span>
          <span className="details-info map-links">
            <a href={country.maps?.googleMaps} target="_blank" rel="noopener noreferrer" className="map-link">
              Google Maps
            </a>
            <span className="map-separator">|</span>
            <a href={country.maps?.openStreetMaps} target="_blank" rel="noopener noreferrer" className="map-link">
              Territory
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ShowCountry;
