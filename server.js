const express = require("express");
const axios = require("axios");
require("dotenv").config(); // Load environment variables

const app = express();
const PORT = 3001;

app.use(express.json());

app.get("/api/games", async (req, res) => {
  try {
    const response = await axios.get("https://api.rawg.io/api/games", {
      params: {
        key: process.env.API_KEY, // Access API key from environment variable
      },
    });
    res.json(response.data.results);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
