import 'dotenv/config';
import app from './app.js';

const PORT = process.env.PORT || 3000;

// Start server if not in production (production uses serverless)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Export for serverless
export default app;
