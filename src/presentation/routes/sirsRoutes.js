const express = require('express');

function createSIRSRouter(sirsController) {
    const router = express.Router();

    // Middleware to handle async errors
    const asyncHandler = (fn) => (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };

    router.post('/calculate', asyncHandler(async (req, res) => {
        await sirsController.calculate(req, res);
    }));

    router.get('/history', asyncHandler(async (req, res) => {
        await sirsController.getHistory(req, res);
    }));

    router.get('/:id', asyncHandler(async (req, res) => {
        await sirsController.getById(req, res);
    }));

    // Error handling middleware
    router.use((err, req, res, next) => {
        console.error('Route Error:', err);
        res.status(err.status || 500).json({
            success: false,
            error: err.message || 'Internal Server Error'
        });
    });

    return router;
}

module.exports = createSIRSRouter;
