const express = require('express');

function createSIRSRouter(sirsController) {
    const router = express.Router();

    router.post('/calculate', (req, res) => sirsController.calculate(req, res));
    router.get('/history', (req, res) => sirsController.getHistory(req, res));
    router.get('/:id', (req, res) => sirsController.getById(req, res));

    return router;
}

module.exports = createSIRSRouter;
