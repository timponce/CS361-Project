import React from "react";

function Search({ fetchCountryData }: { fetchCountryData: any }) {
  const [query, setQuery] = React.useState("");
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    fetchCountryData(query);

    console.log("submitted");
  }
  return (
    <div>
      <h1>Search</h1>
      <form method="POST" action="" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search for a county"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
}

export default Search;
