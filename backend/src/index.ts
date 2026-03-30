import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import trafficRoutes from './routes/traffic';
import parkingRoutes from './routes/parking';
import transportRoutes from './routes/transport';
import weatherRoutes from './routes/weather';
import problemsRoutes from './routes/problems';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/traffic', trafficRoutes);
app.use('/api/parking', parkingRoutes);
app.use('/api/transport', transportRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/problems', problemsRoutes);

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
