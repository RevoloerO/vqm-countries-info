import ShowCountry from './ShowCountry';

const CountryCard = ({ countries, selectedCountry, onBack }) => {
  if (selectedCountry && selectedCountry.name) {
    return (
      <div className="country-transition" key={selectedCountry.name.official}>
        {onBack && (
          <button className="back-to-grid-btn" onClick={onBack}>
            ← Browse Countries
          </button>
        )}
        <ShowCountry country={selectedCountry} />
      </div>
    );
  }

  return null;
};

export default CountryCard;
