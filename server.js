const express = require("express");
const axios = require("axios");
require("dotenv").config(); // Load environment variables

const app = express();
const PORT = 3001;

app.use(express.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://game-hub-murex-mu.vercel.app");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.get("/api/games", async (req, res) => {
  try {
    const response = await axios.get("https://api.rawg.io/api/games", {
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
