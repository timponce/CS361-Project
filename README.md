# Get Country Data

Discover interesting facts about any country on Earth!

View live here: https://cs361-countries-project-67d38ed9c442.herokuapp.com/

An full stack application built using Express, React, Node.js, and Redis.
Makes use of the [restcountries](https://restcountries.com/) API.

## Frontend Application

### How to Use:

The landing page contains a search bar to query any country by text.
You can also request a random country to learn about.

On submit, a table will be populated and displayed of the chosen country with fun facts about said country.

### Technologies Used:

- React

## Backend Microservice

### How to Use:

The microservice is essentially a wrapper of an existing API, [restcountries.com](https://restcountries.com), but with caching.

There are two methods of utilizing this microservice to return country data.

1. Web

This is the easiest method.

To request data, send an HTTP GET request to this url, https://cs361-countries-project-67d38ed9c442.herokuapp.com/country/:country, with :country being replaced by your country query of choice.

This is similar to how restcountries API is called so you can reference the documentation to learn more. Note: The API will be able to search incomplete or abbreviated country names but this can result in the unintended country being returned so for best results use official names, e.g. United States (of America) vs. US, USA...

You will either recieve an Error Status Code or if successful, JSON Object with key:value pairs that can be parsed through.

Example Call (JavaScript):

```
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
```

2. Locally

Optionally, you can clone this repository to you local machine and utilize the backend service that way.

After cloning the repo, you can discard the client/ folder. You must create a .env file and define PORT to point to where the backend service will run. Additionally, if wishing to utilize Redis caching, define REDIST_PORT and REDIS_HOST. The microservice should function without implementing a local Redis cache but you can implement it if you wish to speed up the microservice.

To implement Redis, you must install [Docker](https://docs.docker.com/desktop/) on your local machine and then create a redis instance within in docker.

Then you can call the microservice as usual but at the assigned port. For instance, localhost:8000/country/:country

### Technologies Used

- Express
- Node.js
- Redis
