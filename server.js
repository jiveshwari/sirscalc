require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import dependencies
const VercelSIRSRepository = require('./src/infrastructure/database/vercel/VercelSIRSRepository');
const SIRSService = require('./src/application/services/SIRSService');
const SIRSController = require('./src/presentation/controllers/SIRSController');
const createSIRSRouter = require('./src/presentation/routes/sirsRoutes');

// Initialize application
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize singleton repository instance
const sirsRepository = new VercelSIRSRepository();
const sirsService = new SIRSService(sirsRepository);
const sirsController = new SIRSController(sirsService);

// Initialize repository
async function initialize() {
    try {
        await sirsRepository.initialize();
        console.log('Vercel MySQL repository initialized successfully');
    } catch (error) {
        console.error('Initialization error:', error);
        console.error(error);
    }
}

// Routes
app.use('/api/sirs', createSIRSRouter(sirsController));

// Serve the frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Initialize on startup
initialize();

// Export for serverless
module.exports = app;
