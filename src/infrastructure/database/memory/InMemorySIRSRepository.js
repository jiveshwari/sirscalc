const ISIRSRepository = require('../../../domain/repositories/ISIRSRepository');
const SIRSCalculation = require('../../../domain/entities/SIRSCalculation');

class InMemorySIRSRepository extends ISIRSRepository {
    constructor() {
        super();
        this.calculations = [];
        this.nextId = 1;
    }

    async initialize() {
        // No initialization needed for in-memory storage
        return Promise.resolve();
    }

    async save(sirsCalculation) {
        const newCalculation = {
            ...sirsCalculation,
            id: this.nextId++,
            createdAt: new Date()
        };
        this.calculations.push(newCalculation);
        return newCalculation;
    }

    async getById(id) {
        const calculation = this.calculations.find(calc => calc.id === id);
        if (!calculation) return null;
        return new SIRSCalculation(
            calculation.temperature,
            calculation.heartRate,
            calculation.respiratoryRate,
            calculation.wbc,
            calculation.id,
            calculation.createdAt
        );
    }

    async getRecentCalculations(limit = 10) {
        return this.calculations
            .slice()
            .reverse()
            .slice(0, limit)
            .map(calc => new SIRSCalculation(
                calc.temperature,
                calc.heartRate,
                calc.respiratoryRate,
                calc.wbc,
                calc.id,
                calc.createdAt
            ));
    }
}

module.exports = InMemorySIRSRepository;
