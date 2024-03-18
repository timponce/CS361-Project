import React from "react";

function Search({ fetchCountryData }: { fetchCountryData: any }) {
  const [query, setQuery] = React.useState("");
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    fetchCountryData(query);
  }
  async function handleRandom(e: React.FormEvent) {
    e.preventDefault();
    fetchCountryData("random");
  }
  return (
    <div>
      <h2>Search</h2>
      <div id="search-container">
        <form method="POST" action="" onSubmit={handleSubmit} id="search-form">
          <input
            type="text"
            placeholder="Search for a county"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
        <form method="POST" action="" onSubmit={handleRandom}>
          <button type="submit">Random</button>
        </form>
      </div>
    </div>
  );
}

export default Search;
