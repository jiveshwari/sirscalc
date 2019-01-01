class SIRSCalculation {
    constructor(temperature, heartRate, respiratoryRate, wbc, id = null, createdAt = null) {
        this.id = id;
        this.temperature = temperature;
        this.heartRate = heartRate;
        this.respiratoryRate = respiratoryRate;
        this.wbc = wbc;
        this.createdAt = createdAt;
        this.criteriaCount = this.calculateCriteriaCount();
    }

    calculateCriteriaCount() {
        let count = 0;
        if (this.temperature > 38 || this.temperature < 36) count++;
        if (this.heartRate > 90) count++;
        if (this.respiratoryRate > 20) count++;
        if (this.wbc > 12000 || this.wbc < 4000) count++;
        return count;
    }

    isSIRSMet() {
        return this.criteriaCount >= 2;
    }

    toJSON() {
        return {
            id: this.id,
            temperature: this.temperature,
            heartRate: this.heartRate,
            respiratoryRate: this.respiratoryRate,
            wbc: this.wbc,
            criteriaCount: this.criteriaCount,
            sirsMet: this.isSIRSMet(),
            createdAt: this.createdAt
        };
    }
}

module.exports = SIRSCalculation;
