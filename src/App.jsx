import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'
import { RiLightbulbFlashLine } from "react-icons/ri";
import { HiLanguage} from "react-icons/hi2";
import { GiWorld, GiFlatPlatform } from 'react-icons/gi';
import { MdStars, MdNaturePeople} from 'react-icons/md';
import {BsCurrencyExchange, BsClockFill} from 'react-icons/bs';
import { TbWorldCog } from "react-icons/tb";
import {IoIosPeople} from 'react-icons/io';
import {FaMapMarkedAlt} from 'react-icons/fa';
import VqmFooter from "./vqm-footer/vqm-footer";

const ThemeToggle = ({theme, setTheme}) => (
  <button
    className="theme-toggle-btn"
    onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    aria-label="Toggle theme"
  >
    {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
  </button>
);

const Country = ({countries, search, selectedCountry}) => {
  //if(search === '') return ""
  //console.log(selectedCountry)
  //Initial Beginning Country for Panel
  if(selectedCountry.length ===0){
    const show =  countries.filter(country =>{
      return country.name.official.toLowerCase().includes(('United States of America').toLowerCase())
    })
    if(show.length > 0) return <ShowCountry country={show[0]}/>
  }else{
    return <ShowCountry country={selectedCountry}/>
  }
}

const SearchField = ({countries,setSelectedCountry,search,setSearch}) =>{
  //Check search box for input
  if(search === '') return ""

  //Filtering countries based on input
  let show =  countries.filter(country =>{
    return country.name.common.toLowerCase().includes(search.toLowerCase())
  })
  const selectCountry = (result) =>{
    setSelectedCountry(result)
    setSearch("")
    show = []
  }
  //Return results for the selection
  return(<div className="results-box">
   {show.map((result)=>(
      <button key={result.name.common} onClick={() => {
        console.log(result)
        selectCountry(result)
        }}>
        {result.name.common}
      </button>))}
    </div>
  )

}
const Details = ({icon,title, info}) => (
  <div className="details-row">
    <span className="details-icon">{icon}</span>
    <span className="details-title"><u>{title}</u>:</span>
    <span className="details-info">{info}</span>
  </div>
)

const CollapsibleSection = ({icon, title, children, defaultOpen = false}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="collapsible-section">
      <div
        className="collapsible-header"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <span className="details-icon">{icon}</span>
        <span className="details-title"><u>{title}</u>:</span>
        <span className="collapsible-arrow">{open ? '▼' : '▶'}</span>
      </div>
      {open && (
        <div className="collapsible-content">
          {children}
        </div>
      )}
    </div>
  );
};

const ShowCountry = ({country}) => {

//console.log(country.currencies)
//const unit = 'metric' // unit can be metric or imperial
const city = country.capital ? country.capital : 'No capital'
const nativeName = country.name.nativeName ? Object.values(country.name.nativeName)[0].common : 'No native name';
const currencies = country.currencies ? country.currencies : {"NaN":{name:'No currency',symbol:'NaN'}}
const population = <>{country.population.toLocaleString('en-US')} ppl</>
const area =  <>{country.area.toLocaleString('en-US')} km<sup>2</sup></>
const popDen = <>{(country.population/country.area).toFixed(2)} p/km<sup>2</sup></>
const languages = country.languages ? country.languages : {"NaN":"Not Available"}


/*const [weathers, setWeathers] = useState([])
const weatherHook = () =>{
  //console.log('effect')
  axios
    .get('http://api.openweathermap.org/data/2.5/weather?q='
      + city
      +'&units='+unit
      +'&appid='+api_key)
    .then(response =>{
      setWeathers(response.data)
    })
}

useEffect(weatherHook, [])*/

//console.log(country.population/country.area)
//const weatherIcon = "http://openweathermap.org/img/wn/"+weathers.weather[0].icon +"@2x.png"
/*
<p>temperature {weathers.main.temp} Celcius</p>
<img src={weatherIcon} width="100" height="100"/>
<p>wind {weathers.wind.speed} m/s</p>
*/
return(
  <div className="countryInfo">
    <div className="countryTitle">
      <img id="countryFLag" src={country.flags.png} alt="flag" />
      <div id="countryName">
        <h1>
          {country.name.common}
          <span className="country-flag-emoji">{country.flag}</span>
          <img id="coatOfArms" src={country.coatOfArms.png} alt="" />
        </h1>
        <p className="country-official"><b>{country.name.official}</b></p>
        <Details icon={<MdStars/>} title={"Capital"} info={city}/>
        <Details icon={<TbWorldCog />} title={"Native Name"} info={nativeName}/>
      </div>
    </div>
    <div className="countryDetail">
      <h1><RiLightbulbFlashLine/> Insights</h1>
      <Details icon={<GiWorld/>} title={"Region"} info={`${country.region} | ${country.subregion}`}/>
      <div className="details-row">
        <span className="details-icon"><BsCurrencyExchange/></span>
        <span className="details-title"><u>Currency</u>:</span>
        <span className="details-info">
          {Object.keys(currencies).map(
            key => <span key={key} className="currency-badge">
              {currencies[key].name} ({currencies[key].symbol || ""})
            </span>
          )}
        </span>
      </div>
      <Details icon={<IoIosPeople/>} title={"Population"} info={population}/>
      <Details icon={<GiFlatPlatform/>} title={"Area"} info = {area}/>
      <Details icon={<MdNaturePeople/>} title={"Population Density"} info = {popDen}/>
      <CollapsibleSection icon={<BsClockFill/>} title="Time Zones" defaultOpen={false}>
        <ul className="collapsible-list">
          {country.timezones && country.timezones.length > 0
            ? country.timezones.map((tz, idx) =>
              <li key={tz} className="collapsible-list-item">
                <span className="collapsible-bullet">•</span>
                <span>{tz}</span>
              </li>
            )
            : <li>Not Available</li>
          }
        </ul>
      </CollapsibleSection>
      <CollapsibleSection icon={<HiLanguage/>} title="Official Languages" defaultOpen={false}>
        <ul className="collapsible-list">
          {Object.keys(languages).length > 0
            ? Object.keys(languages).map(key =>
              <li key={key} className="collapsible-list-item">
                <span className="collapsible-bullet">•</span>
                <span>{languages[key]}</span>
              </li>
            )
            : <li>Not Available</li>
          }
        </ul>
      </CollapsibleSection>
      <div className="details-row">
        <span className="details-icon"><FaMapMarkedAlt/></span>
        <span className="details-title"><u>Maps</u>:</span>
        <span className="details-info">
          <a href={country.maps.googleMaps} target="_blank" rel="noopener noreferrer" className="map-link">Google Maps</a> | <a href={country.maps.openStreetMaps} target="_blank" rel="noopener noreferrer" className="map-link">Terrirory</a>
        </span>
      </div>
    </div>
  </div>
)
}
const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [selectedCountry, setSelectedCountry] = useState([])
  const [theme, setTheme] = useState('light');

  // Apply theme to <body> and background image
  useEffect(() => {
    document.body.classList.toggle('dark-theme', theme === 'dark');
    document.body.classList.toggle('light-theme', theme === 'light');
    document.body.style.backgroundImage =
      theme === 'dark'
        ? "url('assets/world-bg-dark.png')"
        : "url('assets/world-bg.png')";
  }, [theme]);

  //effect hook to parse data from https://restcountries.com/v3.1/all source
  const countriesHook = () => {
    // First API call: first 10 fields
    const url1 = 'https://restcountries.com/v3.1/all?fields=name,flags,coatOfArms,capital,region,subregion,currencies,population,area,languages';
    // Second API call: remaining fields
    const url2 = 'https://restcountries.com/v3.1/all?fields=name,timezones,maps';

    Promise.all([axios.get(url1), axios.get(url2)]).then(([res1, res2]) => {
      // Merge by country name (official)
      const data1 = res1.data;
      const data2 = res2.data;
      // Create a map for fast lookup
      const map2 = {};
      data2.forEach(c => {
        map2[c.name.official] = c;
      });
      // Merge fields from both responses
      const merged = data1.map(c => {
        const c2 = map2[c.name.official] || {};
        return {
          ...c,
          timezones: c2.timezones,
          maps: c2.maps
        };
      });
      setCountries(merged);
    });
  }
  useEffect(countriesHook, [])

  // Craete handle for search change
  const handleSearchChange = (event) =>{
    setSearch(event.target.value)
  }
  return (
    <>
      <div className='countryShow'>
        <div className="theme-search-row">
          
          <div className="search-box">
            <input
              className="input-search"
              value={search}
              onChange={handleSearchChange}
              placeholder="Type to Search..."
            />
            <SearchField
              countries={countries}
              setSelectedCountry={setSelectedCountry}
              search={search}
              setSearch={setSearch}
            />
          </div>
          <div className="theme-toggle-container">
            <ThemeToggle theme={theme} setTheme={setTheme} />
          </div>
        </div>
        <Country countries={countries} search={search} selectedCountry={selectedCountry}/>
      </div>
      <VqmFooter />
    </>
  )
}

export default App
