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
      const response =
        searchQuery === "random"
          ? await fetch("random")
          : await fetch(`${apiURL}${searchQuery}${apiURLFilters}`);
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
      <h1>Country Data</h1>
      <p>Explore the world and get to know more about any country you wish.</p>
      <Search fetchCountryData={fetchCountryData} />
      <p>
        In this application, you can either search for a specific country of
        your choice OR get facts about a random country!
      </p>
      <p>
        If you are unsure of where to start looking, we recommend that you click
        Random to start exploring.
      </p>
      <p>
        If you accidentally navigate away from the page, you can always use the
        search bar to find the country you were looking for.
      </p>
      {countryData ? (
        <Results countryData={countryData} fetchData={fetchData} />
      ) : null}
    </div>
  );
}

export default App;
