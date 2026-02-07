import ShowCountry from './ShowCountry';

const CountryCard = ({ countries, selectedCountry }) => {
  // If a country is selected, show it with a key to trigger re-mount animation
  if (selectedCountry && selectedCountry.name) {
    return (
      <div className="country-transition" key={selectedCountry.name.official}>
        <ShowCountry country={selectedCountry} />
      </div>
    );
  }

  // Default: show USA as fallback
  if (countries.length > 0) {
    const usa = countries.find(country =>
      country.name.official.toLowerCase().includes('united states of america')
    );
    if (usa) {
      return (
        <div className="country-transition" key="usa-default">
          <ShowCountry country={usa} />
        </div>
      );
    }
  }

  return null;
};

export default CountryCard;
