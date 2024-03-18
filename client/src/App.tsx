import React from "react";
import "./App.css";
import Search from "./components/Search";
import Results from "./components/Results";

function App() {
  const infoApiUrl = "/country/";
  const weatherApiUrl = "/countryWeather/";

  const [countryData, setCountryData] = React.useState(null);
  const [fetchData, setFetchData] = React.useState(null);

  const cleanCountryData = (data: any) => {
    const cleanData = {
      ...data,
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
          : await fetch(`${infoApiUrl}${searchQuery}`);
      let infoData = await infoResponse.json();
      const weatherResponse = await fetch(
        `${weatherApiUrl}${infoData.country}`
      );
      let weatherData = await weatherResponse.json();

      setFetchData({
        ...infoData,
        ...weatherData,
        source: infoData.source,
        responseTime: infoData.time,
      });
      infoData = cleanCountryData({ ...infoData, weatherData });
      setCountryData(infoData);
    } catch (error) {
      console.log(`Error fetching data: ${error}`);
    }
  };

  return (
    <div className="App">
      <h1>Country Facts</h1>
      <p>
        Welcome! This webpage allows you to explore the world by learning a few
        facts about a particular country. To do so, you can either enter perform
        a search for a specific country using the text input below, or if you
        don't know where to begin, click the random button to start exploring!
      </p>
      <p>
        Using this application is entirely free and each search will complete in
        under a second. Please wait until each search is complete before
        executing another. Lastly, the data in this application will persist
        whether you navigate away from any search result or even if you decide
        to leave this site and come back. So if you make any mistakes or want to
        go back to a previous search, you can always do so via the search
        function and get the same results from before.
      </p>
      <p>Enjoy exploring and learning!</p>
      <Search fetchCountryData={fetchCountryData} />
      {countryData ? (
        <Results countryData={countryData} fetchData={fetchData} />
      ) : null}
    </div>
  );
}

export default App;
