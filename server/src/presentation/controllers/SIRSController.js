class SIRSController {
    constructor(sirsService) {
        this.sirsService = sirsService;
    }

    async calculate(req, res) {
        try {
            if (!req.body || typeof req.body !== 'object') {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid request body'
                });
            }

            const result = await this.sirsService.calculateAndSave(req.body);
            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            console.error('Error in SIRS calculation:', error);
            
            // Handle validation errors
            if (error.message.includes('must be between')) {
                return res.status(400).json({
                    success: false,
                    error: error.message
                });
            }

            // Handle missing fields
            if (error.message.includes('required')) {
                return res.status(400).json({
                    success: false,
                    error: error.message
                });
            }

            res.status(500).json({
                success: false,
                error: 'Failed to process calculation'
            });
        }
    }

    async getHistory(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 10;
            
            if (isNaN(limit) || limit < 1 || limit > 100) {
                return res.status(400).json({
                    success: false,
                    error: 'Limit must be a number between 1 and 100'
                });
            }

            const history = await this.sirsService.getRecentCalculations(limit);
            res.json({
                success: true,
                data: history
            });
        } catch (error) {
            console.error('Error fetching history:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch history'
            });
        }
    }

    async getById(req, res) {
        try {
            const id = parseInt(req.params.id);
            
            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid ID format'
                });
            }

            const calculation = await this.sirsService.getCalculationById(id);
            
            if (!calculation) {
                return res.status(404).json({
                    success: false,
                    error: 'Calculation not found'
                });
            }

            res.json({
                success: true,
                data: calculation
            });
        } catch (error) {
            console.error('Error fetching calculation:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch calculation'
            });
        }
    }
}

export default SIRSController;
