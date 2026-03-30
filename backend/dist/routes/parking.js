"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// Mock parking data
const mockParkingData = [
    {
        id: '1',
        location: { lat: 42.8876, lng: 20.8773 },
        isAvailable: true,
        spotNumber: 'A1',
        pricePerHour: 100,
        lastUpdated: new Date()
    },
    {
        id: '2',
        location: { lat: 42.8878, lng: 20.8775 },
        isAvailable: false,
        spotNumber: 'A2',
        pricePerHour: 100,
        lastUpdated: new Date()
    },
    {
        id: '3',
        location: { lat: 42.8874, lng: 20.8771 },
        isAvailable: true,
        spotNumber: 'B1',
        pricePerHour: 80,
        lastUpdated: new Date()
    }
];
// GET /api/parking - Get all parking spots
router.get('/', (req, res) => {
    try {
        res.json({
            success: true,
            data: mockParkingData
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch parking data'
        });
    }
});
// GET /api/parking/available - Get only available parking spots
router.get('/available', (req, res) => {
    try {
        const availableSpots = mockParkingData.filter(spot => spot.isAvailable);
        res.json({
            success: true,
            data: availableSpots
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch available parking spots'
        });
    }
});
// POST /api/parking - Add new parking spot
router.post('/', (req, res) => {
    try {
        const newSpot = {
            id: (mockParkingData.length + 1).toString(),
            ...req.body,
            lastUpdated: new Date()
        };
        mockParkingData.push(newSpot);
        res.json({
            success: true,
            data: newSpot
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to add parking spot'
        });
    }
});
// PUT /api/parking/:id - Update parking spot availability
router.put('/:id', (req, res) => {
    try {
        const spotIndex = mockParkingData.findIndex(spot => spot.id === req.params.id);
        if (spotIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Parking spot not found'
            });
        }
        mockParkingData[spotIndex] = {
            ...mockParkingData[spotIndex],
            ...req.body,
            lastUpdated: new Date()
        };
        res.json({
            success: true,
            data: mockParkingData[spotIndex]
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to update parking spot'
        });
    }
});
exports.default = router;
//# sourceMappingURL=parking.js.map