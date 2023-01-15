import {useState, useEffect} from 'react'
import axios from 'axios'
import { RiLightbulbFlashLine } from "react-icons/ri";

const api_key = process.env.REACT_APP_API_KEY
//const api_key = '398973d201eba525ff5e0bd79960d119'

const Country = ({countries, selectedCountry}) => {
    console.log(selectedCountry.length)
    console.log(countries)
    if(selectedCountry.length === 0){
      const show = countries.filter(country =>{
        return country.name.common.includes("Finland")
      })
      console.log("a:"+show)
      return <OneCountry country={show[0]}/>
    }else{
      return
    }
    /*
    const show =  countries.filter(country =>{
      return country.name.common.includes("Finland")
    })
    if(show.length > 10) return <p> Too many matches, specify another filter </p>
    else if(show.length === 1) {

      return <OneCountry country={show[0]}/>
    }
    else return show.map(country => <p>{country.name.common}</p> )*/
}
const OneCountry = ({country}) => {
  console.log(country)
  const unit = 'metric' // unit can be metric or imperial
  var city = country.capital
  const popDen = (country.population/country.area).toFixed(2)
  const [weathers, setWeathers] = useState([])
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

  useEffect(weatherHook, [])

  console.log(country.population/country.area)
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
        <p>Region: {country.region} | {country.subregion} </p>
        <p>Currency: {Object.values(country.currencies).map(currency => <>{currency.name} ({currency.symbol}) </>)} </p>
        <p>Population: {country.population.toLocaleString('en-US')} ppl</p>
        <p>Area: {country.area.toLocaleString('en-US')} km<sup>2</sup></p>
        <p>Population Density: {popDen} ppl/km<sup>2</sup></p>
        <p>Time Zones: <ul>
        {Object.values(country.timezones).map(timezone => <li>{timezone}</li>)}
        </ul></p>
        <p>Languages:
        <ul>{Object.values(country.languages).map(language =><li>{language}</li>)}
        </ul></p>
      </div>
    </div>
  )
}


const App = () => {
  const [countries, setCountries] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [selectedCountry, setSelectedCountry] = useState([])
  //effect hook to parse data from https://restcountries.com/v3.1/all source
  const countriesHook = () =>{
    console.log('effect')
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response =>{
        setCountries(response.data)
      })
  }
  useEffect(countriesHook, [])
  /*
  setSelectedCountry(
    (countries.filter(country =>{
      return country.name.common.includes("Finland")
    })).map((result)=>{
      setSelectedCountry(result)
    })
  )
  console.log(selectedCountry)*/
  //countries.map(country =>console.log(country.tld))

  // Craete handle for search change
  const handleSearchChange = (event) =>{
    setSearchValue(event.target.value)
  }
  const searchForResults = (searchValue) =>{
    return countries.filter(country =>{
      return country.name.common.includes(searchValue)
    })
  }
  const callSearchFunction = (event) =>{
    event.preventDefault()
    setSearchResults(searchForResults(searchValue))
  }
  return (
    <>

    <div className='countryShow'>
      <Country countries={countries}  selectedCountry={selectedCountry} />
    </div>
    </>
  )
}
/*<Country countries={countries}  search={selectedCountry} />
<form className="searchBar">
  <p>find country:
    <input value={searchValue} onChange={handleSearchChange}/>
  </p>
  <button onClick={callSearchFunction}>Search</button>
  <ul>
   {searchResults.map((result) => (
     <li key={result.idd.suffixes[0]} onClick={() => setSelectedCountry(result)}>
       {result.name.common}
     </li>
   ))}
 </ul>
</form>
*/
/*<OneCountry country={selectedCountry}/>*/
/*
{countries.map(country =>
  <p>{country.name.common}</p>
)}*/
export default App;
