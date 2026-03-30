"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// Mock weather data
const mockWeatherData = {
    temperature: 22,
    condition: 'sunny',
    humidity: 65,
    windSpeed: 12,
    timestamp: new Date(),
    forecast: [
        {
            date: new Date(Date.now() + 24 * 60000), // Tomorrow
            high: 25,
            low: 18,
            condition: 'partly_cloudy',
            precipitation: 20
        },
        {
            date: new Date(Date.now() + 48 * 60000), // Day after tomorrow
            high: 23,
            low: 16,
            condition: 'rainy',
            precipitation: 80
        },
        {
            date: new Date(Date.now() + 72 * 60000), // Three days from now
            high: 20,
            low: 14,
            condition: 'cloudy',
            precipitation: 40
        }
    ]
};
// GET /api/weather - Get current weather and forecast
router.get('/', (req, res) => {
    try {
        res.json({
            success: true,
            data: mockWeatherData
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch weather data'
        });
    }
});
// GET /api/weather/current - Get current weather only
router.get('/current', (req, res) => {
    try {
        const { forecast, ...currentWeather } = mockWeatherData;
        res.json({
            success: true,
            data: currentWeather
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch current weather'
        });
    }
});
// GET /api/weather/forecast - Get forecast only
router.get('/forecast', (req, res) => {
    try {
        res.json({
            success: true,
            data: mockWeatherData.forecast
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch weather forecast'
        });
    }
});
exports.default = router;
//# sourceMappingURL=weather.js.map