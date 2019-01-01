class SIRSController {
    constructor(sirsService) {
        this.sirsService = sirsService;
    }

    async calculate(req, res) {
        try {
            const result = await this.sirsService.calculateAndSave(req.body);
            res.json({ success: true, data: result });
        } catch (error) {
            console.error('Error in SIRS calculation:', error);
            res.status(500).json({ success: false, error: 'Failed to process calculation' });
        }
    }

    async getHistory(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const history = await this.sirsService.getRecentCalculations(limit);
            res.json({ success: true, data: history });
        } catch (error) {
            console.error('Error fetching history:', error);
            res.status(500).json({ success: false, error: 'Failed to fetch history' });
        }
    }

    async getById(req, res) {
        try {
            const calculation = await this.sirsService.getCalculationById(req.params.id);
            if (!calculation) {
                return res.status(404).json({ success: false, error: 'Calculation not found' });
            }
            res.json({ success: true, data: calculation });
        } catch (error) {
            console.error('Error fetching calculation:', error);
            res.status(500).json({ success: false, error: 'Failed to fetch calculation' });
        }
    }
}

module.exports = SIRSController;
