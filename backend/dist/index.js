"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
// Import routes
const traffic_1 = __importDefault(require("./routes/traffic"));
const parking_1 = __importDefault(require("./routes/parking"));
const transport_1 = __importDefault(require("./routes/transport"));
const weather_1 = __importDefault(require("./routes/weather"));
const problems_1 = __importDefault(require("./routes/problems"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/traffic', traffic_1.default);
app.use('/api/parking', parking_1.default);
app.use('/api/transport', transport_1.default);
app.use('/api/weather', weather_1.default);
app.use('/api/problems', problems_1.default);
// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        message: 'Smart Mitrovica Backend is running!',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});
// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({
        message: 'Smart Mitrovica API is working!',
        endpoints: [
            '/api/traffic',
            '/api/parking',
            '/api/transport',
            '/api/weather',
            '/api/problems'
        ]
    });
});
// Start server
app.listen(PORT, () => {
    console.log(`Smart Mitrovica server is running on port ${PORT}`);
    console.log(`Available endpoints:`);
    console.log(`  GET /api/health - Health check`);
    console.log(`  GET /api/test - Test endpoint`);
    console.log(`  GET /api/traffic - Traffic data`);
    console.log(`  GET /api/parking - Parking data`);
    console.log(`  GET /api/transport - Public transport data`);
    console.log(`  GET /api/weather - Weather data`);
    console.log(`  GET /api/problems - Problem reports`);
});
//# sourceMappingURL=index.js.map