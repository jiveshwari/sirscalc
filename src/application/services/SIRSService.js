const SIRSCalculation = require('../../domain/entities/SIRSCalculation');

class SIRSService {
    constructor(sirsRepository) {
        this.sirsRepository = sirsRepository;
    }

    validateInput(data) {
        const { temperature, heartRate, respiratoryRate, wbc } = data;
        
        if (!temperature || !heartRate || !respiratoryRate || !wbc) {
            throw new Error('All fields are required');
        }

        if (isNaN(temperature) || isNaN(heartRate) || isNaN(respiratoryRate) || isNaN(wbc)) {
            throw new Error('All values must be numbers');
        }

        // Basic range validations
        if (temperature < 30 || temperature > 45) {
            throw new Error('Temperature must be between 30°C and 45°C');
        }

        if (heartRate < 0 || heartRate > 300) {
            throw new Error('Heart rate must be between 0 and 300 beats/min');
        }

        if (respiratoryRate < 0 || respiratoryRate > 100) {
            throw new Error('Respiratory rate must be between 0 and 100 breaths/min');
        }

        if (wbc < 0 || wbc > 100000) {
            throw new Error('WBC must be between 0 and 100,000/mm³');
        }
    }

    async calculateAndSave(data) {
        this.validateInput(data);

        const calculation = new SIRSCalculation(
            parseFloat(data.temperature),
            parseInt(data.heartRate),
            parseInt(data.respiratoryRate),
            parseInt(data.wbc)
        );

        const savedCalculation = await this.sirsRepository.save(calculation);
        return savedCalculation.toJSON();
    }

    async getRecentCalculations(limit = 10) {
        const calculations = await this.sirsRepository.getAll();
        return calculations
            .slice(0, limit)
            .map(calc => calc.toJSON());
    }

    async getCalculationById(id) {
        const calculation = await this.sirsRepository.getById(id);
        return calculation ? calculation.toJSON() : null;
    }
}

module.exports = SIRSService;
