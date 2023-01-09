import {useState, useEffect, React} from 'react';
import axios from 'axios';
import { RiLightbulbFlashLine } from "react-icons/ri";
import { HiLanguage} from "react-icons/hi2";
import {HiSearchCircle} from "react-icons/hi"
import { GiWorld } from 'react-icons/gi';

const api_key = process.env.REACT_APP_API_KEY
//const api_key = '398973d201eba525ff5e0bd79960d119'

const Country = ({countries, search, selectedCountry}) => {
    //if(search === '') return ""
    //console.log(selectedCountry)
    if(selectedCountry.length ===0){
      const show =  countries.filter(country =>{
        return country.name.common.includes('Germa')
      })
      //if(!show[0].capital) console.log("hello")
      if(show.length > 0) return <OneCountry country={show[0]}/>
    }else{
      return <OneCountry country={selectedCountry}/>
    }
    /*
    const show =  countries.filter(country =>{
      return country.name.common.includes(search)
    })
    if(show.length > 10) return <p> Too many matches, specify another filter </p>
    else if(show.length === 1) {

      return <OneCountry country={show[0]}/>
    }
    else return show.map(country => <p>{country.name.common}</p> )*/
}
const SearchField = ({countries,setSelectedCountry,search,setSearch}) =>{
    if(search === '') return ""

    const show =  countries.filter(country =>{
      return country.name.common.includes(search)
    })
    const selectCountry = (result) =>{
      setSelectedCountry(result)
      setSearch("")
    }
    //show.map(result => console.log(result.idd.suffixes))
    return(<div className="results-box">
      <ul> {show.map((result)=>(
        <li key={result.name.common} onClick={() => selectCountry(result)}>
          {result.name.common}
        </li>))}
      </ul>
      </div>
    )
}
const OneCountry = ({country}) => {

  //console.log(country.currencies)
  const unit = 'metric' // unit can be metric or imperial
  const city = country.capital ? country.capital : 'No capital'
  const currencies = country.currencies ? country.currencies : {"NaN":{name:'No currency',symbol:'NaN'}}
  const popDen = (country.population/country.area).toFixed(2)

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
      <div className="countryTitle" >
        <img id="countryFLag" src={country.flags.png} alt="flag" />
        <div id="countryName">
          <h1>{country.name.common} {country.flag} <img id="coatOfArms" src={country.coatOfArms.png} alt="" />
          </h1>
          <p> <b> {country.name.official}</b> | Capital: {city}</p>
        </div>
      </div>
      <div className="countryDetail">
        <h2><RiLightbulbFlashLine/> Insight</h2>
        <p><GiWorld/> Region: {country.region} | {country.subregion} </p>
        <div>Currency: {Object.keys(currencies).map(
          key => <div key={key} style={{ display: 'inline-flex' }}>
            {currencies[key].name} ({currencies[key].symbol || ""})
            </div>)}
        </div>
        <p>Population: {country.population.toLocaleString('en-US')} ppl</p>
        <p>Area: {country.area.toLocaleString('en-US')} km<sup>2</sup></p>
        <p>Population Density: {popDen} ppl/km<sup>2</sup></p>
        <div>Time Zones: <ul>
        {Object.keys(country.timezones).map(key => <li key={key}>{country.timezones[key]}</li>)}
        </ul></div>
        <div> <HiLanguage/> Official Languages:
        <ul>{Object.keys(country.languages).map(key =><li key = {key}>{country.languages[key]}</li>)}
        </ul></div>
        <a href={country.maps.googleMaps} target="_blank" rel="noopener noreferrer">Google Maps</a> |
        <a href={country.maps.openStreetMaps} target="_blank" rel="noopener noreferrer"> Terrirory</a>
      </div>
    </div>
  )
}


const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [selectedCountry, setSelectedCountry] = useState([])
  //effect hook to parse data from https://restcountries.com/v3.1/all source
  const countriesHook = () =>{
    //console.log('effect')
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response =>{
        setCountries(response.data)
      })
  }
  useEffect(countriesHook, [])

  // Craete handle for search change
  const handleSearchChange = (event) =>{
    setSearch(event.target.value)
  }
  const memoryUsage =  window.performance.memory;
  console.log(memoryUsage);
  return (
    <>
      <div className="search-box">
        <button className="btn-search"> <HiSearchCircle/></button>
        <input
          class="input-search"
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
    </>
  )
}
export default App;
