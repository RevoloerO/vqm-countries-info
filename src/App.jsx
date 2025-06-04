import {useState, useEffect, React} from 'react';
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
  <div style={{
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.7em',
    marginBottom: '0.3em',
    fontSize: '1.12rem',
    lineHeight: 1.6,
    color: 'var(--theme-color-2)'
  }}>
    <span style={{
      fontSize: '1.35em',
      marginRight: '0.3em',
      color: 'var(--theme-color-3)',
      flexShrink: 0
    }}>{icon}</span>
    <span style={{
      fontWeight: 700,
      marginRight: '0.3em',
      color: 'var(--theme-color-1)'
    }}><u>{title}</u>:</span>
    <span style={{flex: 1, display: 'inline-block'}}>{info}</span>
  </div>
)
const CollapsibleSection = ({icon, title, children, defaultOpen = false}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{marginBottom: '0.3em'}}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          userSelect: 'none',
          color: 'var(--theme-color-2)',
          fontSize: '1.12rem',
          gap: '0.7em'
        }}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <span style={{
          fontSize: '1.35em',
          marginRight: '0.3em',
          color: 'var(--theme-color-3)',
          flexShrink: 0
        }}>{icon}</span>
        <span style={{
          fontWeight: 700,
          marginRight: '0.3em',
          color: 'var(--theme-color-1)'
        }}>
          <u>{title}</u>:
        </span>
        <span style={{
          marginLeft: 'auto',
          fontSize: '1.1em',
          color: 'var(--theme-color-3)'
        }}>
          {open ? '▼' : '▶'}
        </span>
      </div>
      {open && (
        <div style={{marginLeft: '2.5em', marginTop: '0.2em'}}>
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
          <span style={{
            fontSize: '2.3rem',
            marginLeft: '0.4rem',
            filter: 'drop-shadow(0 2px 8px var(--theme-color-3))'
          }}>{country.flag}</span>
          <img id="coatOfArms" src={country.coatOfArms.png} alt="" />
        </h1>
        <p style={{
          color: 'var(--theme-color-2)',
          fontWeight: 600,
          fontSize: '1.1rem',
          margin: '0.5em 0 1.1em 0'
        }}><b>{country.name.official}</b></p>
        <Details icon={<MdStars/>} title={"Capital"} info={city}/>
        <Details icon={<TbWorldCog />} title={"Native Name"} info={nativeName}/>
      </div>
    </div>
    <div className="countryDetail">
      <h1><RiLightbulbFlashLine/> Insights</h1>
      <Details icon={<GiWorld/>} title={"Region"} info={`${country.region} | ${country.subregion}`}/>
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.7em',
        marginBottom: '0.3em',
        fontSize: '1.12rem',
        color: 'var(--theme-color-2)'
      }}>
        <span style={{
          fontSize: '1.35em',
          marginRight: '0.3em',
          color: 'var(--theme-color-3)',
          flexShrink: 0
        }}><BsCurrencyExchange/></span>
        <span style={{
          fontWeight: 700,
          marginRight: '0.3em',
          color: 'var(--theme-color-1)'
        }}><u>Currency</u>:</span>
        <span style={{flex: 1, display: 'inline-block'}}>
          {Object.keys(currencies).map(
            key => <span key={key} style={{
              background: 'var(--theme-color-4)',
              borderRadius: '10px',
              padding: '0.18em 0.8em',
              marginRight: '0.5em',
              fontSize: '1em',
              display: 'inline-block',
              color: 'var(--theme-color-3)',
              border: '1.5px solid var(--theme-color-3)',
              fontWeight: 600,
              boxShadow: '0 1px 6px 0 var(--theme-color-5)'
            }}>
              {currencies[key].name} ({currencies[key].symbol || ""})
            </span>
          )}
        </span>
      </div>
      <Details icon={<IoIosPeople/>} title={"Population"} info={population}/>
      <Details icon={<GiFlatPlatform/>} title={"Area"} info = {area}/>
      <Details icon={<MdNaturePeople/>} title={"Population Density"} info = {popDen}/>
      <CollapsibleSection icon={<BsClockFill/>} title="Time Zones" defaultOpen={false}>
        <ul style={{
          margin: 0,
          padding: 0,
          listStyle: 'none',
          fontSize: '1em'
        }}>
          {country.timezones && country.timezones.length > 0
            ? country.timezones.map((tz, idx) =>
              <li key={tz} style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '0.15em'
              }}>
                <span style={{
                  color: 'var(--theme-color-3)',
                  marginRight: '0.5em',
                  fontSize: '1.1em'
                }}>•</span>
                <span>{tz}</span>
              </li>
            )
            : <li>Not Available</li>
          }
        </ul>
      </CollapsibleSection>
      <CollapsibleSection icon={<HiLanguage/>} title="Official Languages" defaultOpen={false}>
        <ul style={{
          margin: 0,
          padding: 0,
          listStyle: 'none',
          fontSize: '1em'
        }}>
          {Object.keys(languages).length > 0
            ? Object.keys(languages).map(key =>
              <li key={key} style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '0.15em'
              }}>
                <span style={{
                  color: 'var(--theme-color-3)',
                  marginRight: '0.5em',
                  fontSize: '1.1em'
                }}>•</span>
                <span>{languages[key]}</span>
              </li>
            )
            : <li>Not Available</li>
          }
        </ul>
      </CollapsibleSection>
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.7em',
        marginBottom: '0.3em',
        fontSize: '1.12rem',
        color: 'var(--theme-color-2)'
      }}>
        <span style={{
          fontSize: '1.35em',
          marginRight: '0.3em',
          color: 'var(--theme-color-3)',
          flexShrink: 0
        }}><FaMapMarkedAlt/></span>
        <span style={{
          fontWeight: 700,
          marginRight: '0.3em',
          color: 'var(--theme-color-1)'
        }}><u>Maps</u>:</span>
        <span style={{flex: 1, display: 'inline-block'}}>
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
      <div className='countryShow'>

        <Country countries={countries}  search={search} selectedCountry={selectedCountry}/>
      </div>
      <VqmFooter />
    </>
  )
}

export default App
