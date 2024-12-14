import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config(); // Load environment variables from a .env file

const app = express();
const PORT = process.env.PORT || 5000; // Use Render-assigned PORT or default to 5000

app.use(cors({
    origin: "*", // Allow all origins (change to frontend URL for production security)
    methods: ["GET", "POST"] // Specify allowed methods if needed (e.g., GET, POST)
}));

// Store Search History
let searchHistory = [];

app.get("/weather", async (req, res) => {
    const city = req.query.q?.trim().toLowerCase();

    if (!city) {
        return res.status(400).send({ error: "City is required" });
    }

    const API_KEY = process.env.OPENWEATHERMAP_API_KEY;
    const weatherAPI = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=imperial`;

    try {
        const response = await fetch(weatherAPI);
        const data = await response.json();

        console.log(data); // Inside your `/weather` endpoint

        if (!response.ok) {
            throw new Error(data.message || "Unable to fetch weather data");
        }

        // Format the data for the frontend
        const formattedData = {
            city: data.name,
            country: data.sys.country,
            temperature: data.main.temp,
            weather: data.weather[0].description,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed
        };

        // Log formattedData to the server console
        console.log("Formatted Weather Data: ", formattedData);

        if (!searchHistory.some(entry => entry.city.toLowerCase() === formattedData.city)) {
            searchHistory.push(formattedData);
        }

        res.json(formattedData);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.get("/history", (req, res) => {
    res.json(searchHistory);
})


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});