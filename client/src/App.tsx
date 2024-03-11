import React from "react";
import "./App.css";
import Search from "./components/Search";
import Results from "./components/Results";

function App() {
  const infoApiUrl = "/country/";
  const infoApiUrlFilters =
    "?fields=name,capital,population,languages,flag,flags";
  const weatherApiUrl = "/countryWeather/";

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
      conditions: data.weatherData.weather[0].main,
      temp: data.weatherData.main.temp,
    };
    return cleanData;
  };

  const fetchCountryData = async (searchQuery: string) => {
    try {
      const infoResponse =
        searchQuery === "random"
          ? await fetch("random")
          : await fetch(`${infoApiUrl}${searchQuery}${infoApiUrlFilters}`);
      let infoData = await infoResponse.json();
      let countryName =
        searchQuery === "random" ? infoData[0].name.common : searchQuery;
      const weatherResponse = await fetch(`${weatherApiUrl}${countryName}`);
      let weatherData = await weatherResponse.json();

      setFetchData({
        ...infoData,
        ...weatherData,
        source: infoData.source,
        responseTime: infoData.time,
      });
      console.log({ ...infoData[0], ...weatherData });
      infoData = cleanCountryData({ ...infoData[0], weatherData });
      setCountryData(infoData);
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
