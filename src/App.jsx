import {useState, useEffect, React} from 'react';
import axios from 'axios';
import './App.css'
import { RiLightbulbFlashLine } from "react-icons/ri";
import { HiLanguage} from "react-icons/hi2";
import { GiWorld, GiFlatPlatform } from 'react-icons/gi';
import { MdStars, MdNaturePeople} from 'react-icons/md';
import {BsCurrencyExchange, BsClockFill} from 'react-icons/bs';
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
<p> {icon} <u>{title}</u>: {info}</p>
)
const ShowCountry = ({country}) => {

//console.log(country.currencies)
//const unit = 'metric' // unit can be metric or imperial
const city = country.capital ? country.capital : 'No capital'
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
    <div className="countryTitle" >
      <img id="countryFLag" src={country.flags.png} alt="flag" />
      <div id="countryName">
        <h1> {country.name.common} {country.flag} <img id="coatOfArms" src={country.coatOfArms.png} alt="" />
        </h1>
        <p> <b> {country.name.official}</b> </p>
        <Details icon={<MdStars/>} title={"Capital"} info={city}/>
      </div>
    </div>
    <div className="countryDetail">
      <h1><RiLightbulbFlashLine/> Insights</h1>
      <Details icon={<GiWorld/>} title={"Region"} info={`${country.region} | ${country.subregion}`}/>
      <div><BsCurrencyExchange/> <u>Currency</u>: {Object.keys(currencies).map(
        key => <div key={key} style={{ display: 'inline-flex' }}>
          {currencies[key].name} ({currencies[key].symbol || ""})
          </div>)}
      </div>
      <Details icon={<IoIosPeople/>} title={"Population"} info={population}/>
      <Details icon={<GiFlatPlatform/>} title={"Area"} info = {area}/>
      <Details icon={<MdNaturePeople/>} title={"Population Density"} info = {popDen}/>
      <div> <BsClockFill/> <u>Time Zones</u>: <ul>
      {Object.keys(country.timezones).map(key => <li key={key}>{country.timezones[key]}</li>)}
      </ul></div>
      <div> <HiLanguage/> <u>Official Languages</u>:
      <ul>{Object.keys(languages).map(key =><li key = {key}>{languages[key]}</li>)}
      </ul></div>
      <FaMapMarkedAlt/> <u>Maps</u>:
      <a href={country.maps.googleMaps} target="_blank" rel="noopener noreferrer">Google Maps</a> | <a href={country.maps.openStreetMaps} target="_blank" rel="noopener noreferrer">Terrirory</a>
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
