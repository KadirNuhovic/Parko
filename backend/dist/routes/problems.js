"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// Mock problem reports data
const mockProblemData = [
    {
        id: '1',
        location: { lat: 42.8876, lng: 20.8773 },
        type: 'pothole',
        description: 'Large pothole in the middle of the road',
        severity: 'high',
        status: 'reported',
        reportedBy: 'user123',
        reportedAt: new Date(Date.now() - 2 * 60000), // 2 minutes ago
        images: ['image1.jpg', 'image2.jpg']
    },
    {
        id: '2',
        location: { lat: 42.8890, lng: 20.8750 },
        type: 'street_light',
        description: 'Street light not working',
        severity: 'medium',
        status: 'in_progress',
        reportedBy: 'user456',
        reportedAt: new Date(Date.now() - 30 * 60000), // 30 minutes ago
    },
    {
        id: '3',
        location: { lat: 42.8860, lng: 20.8790 },
        type: 'garbage',
        description: 'Overflowing garbage bin',
        severity: 'low',
        status: 'resolved',
        reportedBy: 'user789',
        reportedAt: new Date(Date.now() - 2 * 3600000), // 2 hours ago
    }
];
// GET /api/problems - Get all problem reports
router.get('/', (req, res) => {
    try {
        res.json({
            success: true,
            data: mockProblemData
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch problem reports'
        });
    }
});
// GET /api/problems/:id - Get specific problem report
router.get('/:id', (req, res) => {
    try {
        const problem = mockProblemData.find(p => p.id === req.params.id);
        if (!problem) {
            return res.status(404).json({
                success: false,
                error: 'Problem report not found'
            });
        }
        res.json({
            success: true,
            data: problem
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch problem report'
        });
    }
});
// GET /api/problems/status/:status - Get problems by status
router.get('/status/:status', (req, res) => {
    try {
        const problems = mockProblemData.filter(p => p.status === req.params.status);
        res.json({
            success: true,
            data: problems
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch problems by status'
        });
    }
});
// POST /api/problems - Add new problem report
router.post('/', (req, res) => {
    try {
        const newProblem = {
            id: (mockProblemData.length + 1).toString(),
            ...req.body,
            status: 'reported',
            reportedAt: new Date()
        };
        mockProblemData.push(newProblem);
        res.json({
            success: true,
            data: newProblem
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to add problem report'
        });
    }
});
// PUT /api/problems/:id - Update problem report status
router.put('/:id', (req, res) => {
    try {
        const problemIndex = mockProblemData.findIndex(p => p.id === req.params.id);
        if (problemIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Problem report not found'
            });
        }
        mockProblemData[problemIndex] = {
            ...mockProblemData[problemIndex],
            ...req.body
        };
        res.json({
            success: true,
            data: mockProblemData[problemIndex]
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to update problem report'
        });
    }
});
exports.default = router;
//# sourceMappingURL=problems.js.map