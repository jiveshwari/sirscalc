import ISIRSRepository from '../../../../domain/repositories/ISIRSRepository.js';
import SIRSCalculation from '../../../../domain/entities/SIRSCalculation.js';

class MySQLSIRSRepository extends ISIRSRepository {
    constructor(pool) {
        super();
        this.pool = pool;
    }

    async initialize() {
        const connection = await this.pool.promise().getConnection();
        try {
            await connection.query(`
                CREATE TABLE IF NOT EXISTS sirs_calculations (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    temperature DECIMAL(4,1) NOT NULL,
                    heart_rate INT NOT NULL,
                    respiratory_rate INT NOT NULL,
                    wbc INT NOT NULL,
                    criteria_met INT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);
        } finally {
            connection.release();
        }
    }

    async save(sirsCalculation) {
        const [result] = await this.pool.promise().query(
            'INSERT INTO sirs_calculations (temperature, heart_rate, respiratory_rate, wbc, criteria_met) VALUES (?, ?, ?, ?, ?)',
            [
                sirsCalculation.temperature,
                sirsCalculation.heartRate,
                sirsCalculation.respiratoryRate,
                sirsCalculation.wbc,
                sirsCalculation.criteriaCount
            ]
        );

        return { ...sirsCalculation, id: result.insertId };
    }

    async getById(id) {
        const [rows] = await this.pool.promise().query(
            'SELECT * FROM sirs_calculations WHERE id = ?',
            [id]
        );

        if (rows.length === 0) return null;

        return this._mapToEntity(rows[0]);
    }

    async getRecentCalculations(limit = 10) {
        const [rows] = await this.pool.promise().query(
            'SELECT * FROM sirs_calculations ORDER BY created_at DESC LIMIT ?',
            [limit]
        );

        return rows.map(row => this._mapToEntity(row));
    }

    _mapToEntity(row) {
        return new SIRSCalculation(
            row.temperature,
            row.heart_rate,
            row.respiratory_rate,
            row.wbc,
            row.id,
            row.created_at
        );
    }
}

export default MySQLSIRSRepository;
