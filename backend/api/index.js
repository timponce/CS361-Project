import "dotenv/config";
import express from "express";
import Redis from "ioredis";
import cors from "cors";
import path from "path";

import { fileURLToPath } from "url";
const __filename = path.dirname(fileURLToPath(path.dirname(import.meta.url)));
const __dirname = path.dirname(__filename);
const clientBuildPath = path.join(__dirname, "..", "..", "client", "build");

const app = express();
const port = process.env.PORT || 8000;

// const redis = new Redis({
//   port: process.env.REDIS_PORT || 6379,
//   host: process.env.REDIS_HOST || "127.0.0.1",
// });

const redis = Redis.createClient(process.env.REDISCLOUD_URL, {
  no_ready_check: true,
});

const countryEndpoint = (country) =>
  `https://restcountries.com/v3.1/name/${country}`;

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

    const data = await response.json();

    redis.set(`country:${country}`, JSON.stringify(data), "EX", 3600);
    return { ...data, source: "API", time: `${Date.now() - t0}ms` };
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

app.get("*", (req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
