import React from "react";
import "./App.css";
import Search from "./components/Search";
import Results from "./components/Results";

function App() {
  const apiURL = "/country/";
  const apiURLFilters = "?fields=name,capital,population,languages,flag,flags";

  const [countryData, setCountryData] = React.useState(null);
  const [fetchData, setFetchData] = React.useState(null);

  const cleanCountryData = (data: any) => {
    const cleanData = {
      country: data.name.common,
      officialName: data.name.official,
      // nativeName: data.name.nativeName[Object.keys(data.name)[0]].common,
      capital: data.capital,
      population: data.population,
      // language: data.languages[0],
      flag: data.flags.png,
      flagAltText: data.flags.alt,
      emoji: data.flag,
    };
    return cleanData;
  };

  const fetchCountryData = async (searchQuery: string) => {
    try {
      const response = await fetch(`${apiURL}${searchQuery}${apiURLFilters}`);
      let data = await response.json();
      setFetchData({ ...data, source: data.source, responseTime: data.time });
      data = cleanCountryData(data[0]);
      setCountryData(data);
    } catch (error) {
      console.log(`Error fetching data: ${error}`);
    }
  };

  return (
    <div className="App">
      <Search fetchCountryData={fetchCountryData} />
      {countryData ? (
        <Results countryData={countryData} fetchData={fetchData} />
      ) : null}
    </div>
  );
}

export default App;
