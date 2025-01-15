import SIRSCalculation from '../domain/entities/SIRSCalculation.js';
import ISIRSRepository from '../domain/repositories/ISIRSRepository.js';

class SIRSService {
    constructor(repository) {
        if (!(repository instanceof ISIRSRepository)) {
            throw new Error('Repository must implement ISIRSRepository');
        }
        this.repository = repository;
    }

    validateInput(data) {
        const { temperature, heartRate, respiratoryRate, wbc } = data;
        const errors = [];

        // Temperature validation (33-42°C covers hypothermia to severe fever)
        if (typeof temperature !== 'number' || temperature < 33 || temperature > 42) {
            errors.push('Temperature must be between 33°C and 42°C');
        }

        // Heart rate validation (20-200 bpm covers bradycardia to severe tachycardia)
        if (typeof heartRate !== 'number' || heartRate < 20 || heartRate > 200) {
            errors.push('Heart rate must be between 20 and 200 beats/min');
        }

        // Respiratory rate validation (4-60 breaths/min covers respiratory depression to severe tachypnea)
        if (typeof respiratoryRate !== 'number' || respiratoryRate < 4 || respiratoryRate > 60) {
            errors.push('Respiratory rate must be between 4 and 60 breaths/min');
        }

        // WBC validation (100-50,000 covers severe leukopenia to severe leukocytosis)
        if (typeof wbc !== 'number' || wbc < 100 || wbc > 50000) {
            errors.push('White blood cell count must be between 100 and 50,000 /mm³');
        }

        if (errors.length > 0) {
            throw new Error(errors.join(', '));
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

        const savedCalculation = await this.repository.save(calculation);
        return savedCalculation;
    }

    async getRecentCalculations(limit = 10) {
        return await this.repository.getRecentCalculations(limit);
    }

    async clearHistory() {
        return await this.repository.clearHistory();
    }
}

export default SIRSService;
