"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// Mock public transport data
const mockTransportData = [
    {
        id: '1',
        type: 'bus',
        line: '1A',
        location: { lat: 42.8876, lng: 20.8773 },
        direction: 'City Center',
        nextStop: 'Main Square',
        arrivalTime: new Date(Date.now() + 5 * 60000), // 5 minutes from now
        capacity: {
            current: 25,
            max: 50
        }
    },
    {
        id: '2',
        type: 'tram',
        line: '2B',
        location: { lat: 42.8890, lng: 20.8750 },
        direction: 'North Station',
        nextStop: 'Park Avenue',
        arrivalTime: new Date(Date.now() + 3 * 60000), // 3 minutes from now
        capacity: {
            current: 40,
            max: 60
        }
    },
    {
        id: '3',
        type: 'bus',
        line: '3C',
        location: { lat: 42.8860, lng: 20.8790 },
        direction: 'South Terminal',
        nextStop: 'Hospital',
        arrivalTime: new Date(Date.now() + 8 * 60000), // 8 minutes from now
        capacity: {
            current: 15,
            max: 40
        }
    }
];
// GET /api/transport - Get all transport vehicles
router.get('/', (req, res) => {
    try {
        res.json({
            success: true,
            data: mockTransportData
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch transport data'
        });
    }
});
// GET /api/transport/line/:line - Get vehicles by line
router.get('/line/:line', (req, res) => {
    try {
        const vehicles = mockTransportData.filter(v => v.line === req.params.line);
        res.json({
            success: true,
            data: vehicles
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch transport data for line'
        });
    }
});
// GET /api/transport/type/:type - Get vehicles by type
router.get('/type/:type', (req, res) => {
    try {
        const vehicles = mockTransportData.filter(v => v.type === req.params.type);
        res.json({
            success: true,
            data: vehicles
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch transport data for type'
        });
    }
});
// POST /api/transport - Add new transport vehicle
router.post('/', (req, res) => {
    try {
        const newVehicle = {
            id: (mockTransportData.length + 1).toString(),
            ...req.body
        };
        mockTransportData.push(newVehicle);
        res.json({
            success: true,
            data: newVehicle
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to add transport vehicle'
        });
    }
});
exports.default = router;
//# sourceMappingURL=transport.js.map