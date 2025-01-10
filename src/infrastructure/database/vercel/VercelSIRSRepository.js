const { sql } = require('@vercel/postgres');
const ISIRSRepository = require('../../../domain/repositories/ISIRSRepository');
const SIRSCalculation = require('../../../domain/entities/SIRSCalculation');

class VercelSIRSRepository extends ISIRSRepository {
    async initialize() {
        try {
            await sql`
                CREATE TABLE IF NOT EXISTS sirs_calculations (
                    id SERIAL PRIMARY KEY,
                    temperature DECIMAL(4,1) NOT NULL,
                    heart_rate INTEGER NOT NULL,
                    respiratory_rate INTEGER NOT NULL,
                    wbc INTEGER NOT NULL,
                    criteria_met INTEGER NOT NULL,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );
            `;
            console.log('Database initialized successfully');
        } catch (error) {
            console.error('Database initialization error:', error);
            throw error;
        }
    }

    async save(sirsCalculation) {
        const result = await sql`
            INSERT INTO sirs_calculations 
                (temperature, heart_rate, respiratory_rate, wbc, criteria_met)
            VALUES 
                (${sirsCalculation.temperature}, 
                 ${sirsCalculation.heartRate}, 
                 ${sirsCalculation.respiratoryRate}, 
                 ${sirsCalculation.wbc}, 
                 ${sirsCalculation.criteriaCount})
            RETURNING id, created_at;
        `;

        return new SIRSCalculation(
            sirsCalculation.temperature,
            sirsCalculation.heartRate,
            sirsCalculation.respiratoryRate,
            sirsCalculation.wbc,
            result[0].id,
            result[0].created_at
        );
    }

    async getById(id) {
        const result = await sql`
            SELECT * FROM sirs_calculations 
            WHERE id = ${id};
        `;

        if (result.length === 0) return null;

        return this._mapToEntity(result[0]);
    }

    async getRecentCalculations(limit = 10) {
        const result = await sql`
            SELECT * FROM sirs_calculations 
            ORDER BY created_at DESC 
            LIMIT ${limit};
        `;

        return result.map(row => this._mapToEntity(row));
    }

    _mapToEntity(row) {
        return new SIRSCalculation(
            parseFloat(row.temperature),
            row.heart_rate,
            row.respiratory_rate,
            row.wbc,
            row.id,
            row.created_at
        );
    }
}

module.exports = VercelSIRSRepository;
