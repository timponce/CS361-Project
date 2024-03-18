function Results({
  countryData,
  fetchData,
}: {
  countryData: any;
  fetchData: any;
}) {
  return (
    <div id="results-section">
      <h2>Results</h2>
      <div id="results-table">
        <table>
          <thead>
            <tr>
              <th>Country</th>
              <th>Official Name</th>
              <th>Capital</th>
              <th>Population</th>
              <th>Flag</th>
              <th>Weather</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {countryData.country} {countryData.emoji}
              </td>
              <td>{countryData.officialName}</td>
              <td>{countryData.capital}</td>
              <td>{countryData.population}</td>
              <td>
                <img src={countryData.flag} alt={countryData.flagAllText} />
              </td>
              <td>
                {countryData.conditions + ", " + countryData.temp + " ºC"}
              </td>
            </tr>
          </tbody>
          <caption>
            Data fetched via {fetchData.source} in {fetchData.responseTime}
          </caption>
        </table>
      </div>
    </div>
  );
}

export default Results;
