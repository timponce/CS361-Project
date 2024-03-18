import "dotenv/config";
import express from "express";
import Redis from "ioredis";
import cors from "cors";
import path from "path";

import { fileURLToPath } from "url";
const __filename = path.dirname(fileURLToPath(path.dirname(import.meta.url)));
const __dirname = path.dirname(__filename);
const clientBuildPath = path.resolve(__dirname, "client", "build");

const app = express();
const port = process.env.PORT || 8000;

const redis =
  process.env.NODE_ENV == "production"
    ? Redis.createClient(process.env.REDISCLOUD_URL, {
        no_ready_check: true,
      })
    : new Redis({
        port: process.env.REDIS_PORT || 6379,
        host: process.env.REDIS_HOST || "127.0.0.1",
      });

const countryEndpoint = (country) =>
  `https://restcountries.com/v3.1/name/${country}`;

const countryWeatherEndpoint = (country) =>
  `https://cs361-weather-application-9e327677106b.herokuapp.com/countryweather?text=${country}`;

const getCountryInfo = async (country) => {
  const t0 = Date.now();
  try {
    let cachedInfo = await redis.get(`country:${country}`);
    if (cachedInfo) {
      cachedInfo = JSON.parse(cachedInfo);
      return {
        ...cachedInfo,
        source: "Cache",
        time: `${Date.now() - t0}ms`,
      };
    }

    let response = await fetch(countryEndpoint(country));
    if (!response.ok) {
      throw new Error(`Failed to fetch country info for ${country}`);
    }

    let data = await response.json();
    data = {
      country: data[0].name.common,
      officialName: data[0].name.official,
      capital: data[0].capital,
      population: data[0].population,
      flag: data[0].flags.png,
      flagAltText: data[0].flags.alt,
      emoji: data[0].flag,
    };

    redis.set(`country:${country}`, JSON.stringify(data), "EX", 3600);
    return { ...data, source: "API", time: `${Date.now() - t0}ms` };
  } catch (error) {
    console.error(error);
    return { error: error.message };
  }
};

const getCountryWeather = async (country) => {
  try {
    let response = await fetch(countryWeatherEndpoint(country));
    if (!response.ok) {
      throw new Error(`Failed to fetch weather info for ${country}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return { error: error.message };
  }
};

app.use(cors());

app.use(express.static(clientBuildPath));

app.get("/country/:countryName", async (req, res) => {
  const countryName = req.params.countryName;
  try {
    let countryInfo = await getCountryInfo(countryName);
    res.json(countryInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/countryweather/:countryName", async (req, res) => {
  const countryName = req.params.countryName;
  try {
    let countryWeather = await getCountryWeather(countryName);
    res.json(countryWeather);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/random", async (req, res) => {
  try {
    let response = await fetch("https://restcountries.com/v3.1/all");
    if (!response.ok) {
      throw new Error("Failed to fetch random country");
    }

    const data = await response.json();
    const randomCountry = data[Math.floor(Math.random() * data.length)];
    let countryInfo = await getCountryInfo(randomCountry.name.common);
    res.json(countryInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.resolve(clientBuildPath, "index.html"));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
