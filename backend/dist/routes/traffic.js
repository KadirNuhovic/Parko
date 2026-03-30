"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// Mock traffic data
const mockTrafficData = [
    {
        id: '1',
        location: { lat: 42.8876, lng: 20.8773 },
        level: 'high',
        description: 'Heavy traffic on main street due to rush hour',
        timestamp: new Date()
    },
    {
        id: '2',
        location: { lat: 42.8890, lng: 20.8750 },
        level: 'medium',
        description: 'Moderate traffic near city center',
        timestamp: new Date()
    },
    {
        id: '3',
        location: { lat: 42.8860, lng: 20.8790 },
        level: 'low',
        description: 'Light traffic on residential street',
        timestamp: new Date()
    }
];
// GET /api/traffic - Get all traffic data
router.get('/', (req, res) => {
    try {
        res.json({
            success: true,
            data: mockTrafficData
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch traffic data'
        });
    }
});
// GET /api/traffic/:id - Get specific traffic data
router.get('/:id', (req, res) => {
    try {
        const traffic = mockTrafficData.find(t => t.id === req.params.id);
        if (!traffic) {
            return res.status(404).json({
                success: false,
                error: 'Traffic data not found'
            });
        }
        res.json({
            success: true,
            data: traffic
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch traffic data'
        });
    }
});
// POST /api/traffic - Add new traffic data
router.post('/', (req, res) => {
    try {
        const newTraffic = {
            id: (mockTrafficData.length + 1).toString(),
            ...req.body,
            timestamp: new Date()
        };
        mockTrafficData.push(newTraffic);
        res.json({
            success: true,
            data: newTraffic
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to add traffic data'
        });
    }
});
exports.default = router;
//# sourceMappingURL=traffic.js.map