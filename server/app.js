import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Import dependencies
import VercelSIRSRepository from './src/infrastructure/database/SupabaseSIRS.js';
import SIRSService from './src/services/SIRSService.js';
import SIRSController from './src/presentation/controllers/SIRSController.js';
import createSIRSRouter from './src/presentation/routes/sirsRoutes.js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize application
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

// Initialize repository and service instances
let sirsRepository;
let sirsService;
let sirsController;

// Initialize repository
async function initialize() {
    try {
        if (!sirsRepository) {
            sirsRepository = new VercelSIRSRepository();
            await sirsRepository.initialize();
            sirsService = new SIRSService(sirsRepository);
            sirsController = new SIRSController(sirsService);
            console.log('Repository initialized successfully');
        }
    } catch (error) {
        console.error('Initialization error:', error);
        throw error;
    }
}

// Middleware to ensure initialization
app.use(async (req, res, next) => {
    try {
        if (!sirsRepository) {
            await initialize();
        }
        next();
    } catch (error) {
        next(error);
    }
});

// Mount SIRS routes
app.use('/api/sirs', createSIRSRouter(sirsController));

// Serve index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global Error:', err);
    res.status(500).json({
        success: false,
        error: err.message || 'Internal Server Error'
    });
});

// Start server if running directly
if (import.meta.url === `file://${process.argv[1]}`) {
    initialize().catch(console.error);
}

export default app;
