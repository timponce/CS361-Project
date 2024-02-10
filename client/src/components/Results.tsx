import React from "react";

function Results({ countryData }: { countryData: any }) {
  return (
    <div>
      <h1>Results</h1>
      <table>
        <thead>
          <tr>
            <th>Country</th>
            <th>Official Name</th>
            {/* <th>Native Name</th> */}
            <th>Capital</th>
            <th>Population</th>
            {/* <th>Language</th> */}
            <th>Flag</th>
            <th>Forecast</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              {countryData.country} {countryData.emoji}
            </td>
            <td>{countryData.officialName}</td>
            {/* <td>{countryData.nativeName}</td> */}
            <td>{countryData.capital}</td>
            <td>{countryData.population}</td>
            {/* <td>{countryData.language}</td> */}
            <td>
              <img src={countryData.flag} alt={countryData.flagAllText} />
            </td>
            <td>
              <button>Get Forecast</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Results;
