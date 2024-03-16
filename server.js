const express = require("express");
const axios = require("axios");
require("dotenv").config(); // Load environment variables

const app = express();
const PORT = 3001;

app.use(express.json());

app.use(function (req, res, next) {
  // Check local or production environment
  // No need set NODE_ENV in .env file and production environment,
  // because it is a built-in environment variable that is automatically set to "production" when the app is deployed.
  if (process.env.NODE_ENV === "production") {
    res.header(
      "Access-Control-Allow-Origin",
      "https://game-hub-murex-mu.vercel.app"
    );
  } else {
    res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5173");
  }
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/api/games", async (req, res) => {
  try {
    const response = await axios.get("https://api.rawg.io/api/games", {
      params: {
        key: process.env.API_KEY, // Access API key from environment variable
        genres: req.query.genres,
        platforms: req.query.platforms,
        ordering: req.query.ordering,
        search: req.query.search,
        page: req.query.page,
      },
    });

    if (response.data.next !== null) {
      // Regular expression to match the key parameter and its value
      const regex = /([&?])key=[^&]+&?/;

      // Remove the key parameter while preserving the URL format
      response.data.next = response.data.next
        .replace(regex, "$1")
        .replace(/&$/, "")
        .replace(/\?&/, "?");
      // console.log(response.data.next);
    }

    res.json({
      results: response.data.results,
      count: response.data.count,
      next: response.data.next,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/genres", async (req, res) => {
  try {
    const response = await axios.get("https://api.rawg.io/api/genres", {
      params: {
        key: process.env.API_KEY, // Access API key from environment variable
      },
    });
    res.json({ results: response.data.results, count: response.data.count });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/platforms", async (req, res) => {
  try {
    const response = await axios.get("https://api.rawg.io/api/platforms", {
      params: {
        key: process.env.API_KEY, // Access API key from environment variable
      },
    });
    res.json({ results: response.data.results, count: response.data.count });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
