const SIRSCalculation = require('../../domain/entities/SIRSCalculation');

class SIRSService {
    constructor(sirsRepository) {
        this.sirsRepository = sirsRepository;
    }

    async calculateAndSave(data) {
        const calculation = new SIRSCalculation(
            data.temperature,
            data.heartRate,
            data.respiratoryRate,
            data.wbc
        );

        const savedCalculation = await this.sirsRepository.save(calculation);
        return savedCalculation.toJSON();
    }

    async getRecentCalculations(limit = 10) {
        const calculations = await this.sirsRepository.getRecentCalculations(limit);
        return calculations.map(calc => calc.toJSON());
    }

    async getCalculationById(id) {
        const calculation = await this.sirsRepository.getById(id);
        return calculation ? calculation.toJSON() : null;
    }
}

module.exports = SIRSService;
