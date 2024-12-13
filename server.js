import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from a .env file

const app = express();
const PORT = process.env.PORT || 5000; // Use Render-assigned PORT or default to 5000

// Weather endpoint
app.get("/weather", async (req, res) => {
    const city = req.query.q; // City sent as a query parameter, e.g., ?q=London
    if (!city) {
        return res.status(400).send({ error: "City is required" });
    }

    const API_KEY = process.env.OPENWEATHERMAP_API_KEY; // Use your API key
    const weatherAPI = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    try {
        const response = await fetch(weatherAPI);
        if (!response.ok) {
            throw new Error("Unable to fetch weather data");
        }
        const data = await response.json();
        res.json(data); // Send weather data back to the frontend
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});