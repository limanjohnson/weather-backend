import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from a .env file

const app = express();
const PORT = process.env.PORT || 5000; // Use Render-assigned PORT or default to 5000

app.get("/weather", async (req, res) => {
    const city = req.query.q;

    if (!city) {
        return res.status(400).send({ error: "City is required" });
    }

    const API_KEY = process.env.OPENWEATHERMAP_API_KEY;
    const weatherAPI = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    try {
        const response = await fetch(weatherAPI);
        const data = await response.json();

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

        res.json(formattedData);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});