class SIRSCalculation {
    constructor(temperature, heartRate, respiratoryRate, wbc, id = null, createdAt = null) {
        this.id = id;
        this.temperature = temperature;
        this.heartRate = heartRate;
        this.respiratoryRate = respiratoryRate;
        this.wbc = wbc;
        this.createdAt = createdAt;
        this.criteriaCount = this.calculateCriteriaCount();
        this.criteriaDetails = this.getCriteriaDetails();
    }

    calculateCriteriaCount() {
        let count = 0;
        
        // Temperature criteria: >38.0°C (100.4°F) or <36.0°C (96.8°F)
        if (this.temperature > 38.0 || this.temperature < 36.0) count++;
        
        // Heart rate criteria: >90 beats/minute
        if (this.heartRate > 90) count++;
        
        // Respiratory rate criteria: >20 breaths/minute
        // Note: PaCO2 <32 mmHg is an alternative criterion but not implemented here
        if (this.respiratoryRate > 20) count++;
        
        // WBC criteria: >12,000/mm³ or <4,000/mm³
        // Note: >10% immature bands is an alternative criterion but not implemented here
        if (this.wbc > 12000 || this.wbc < 4000) count++;
        
        return count;
    }

    getCriteriaDetails() {
        return {
            temperature: {
                met: this.temperature > 38.0 || this.temperature < 36.0,
                value: this.temperature,
                criterion: "Temperature >38.0°C or <36.0°C"
            },
            heartRate: {
                met: this.heartRate > 90,
                value: this.heartRate,
                criterion: "Heart rate >90 beats/min"
            },
            respiratoryRate: {
                met: this.respiratoryRate > 20,
                value: this.respiratoryRate,
                criterion: "Respiratory rate >20 breaths/min"
            },
            wbc: {
                met: this.wbc > 12000 || this.wbc < 4000,
                value: this.wbc,
                criterion: "WBC >12,000/mm³ or <4,000/mm³"
            }
        };
    }

    hasSIRS() {
        return this.criteriaCount >= 2;
    }

    toJSON() {
        return {
            id: this.id,
            temperature: this.temperature,
            heartRate: this.heartRate,
            respiratoryRate: this.respiratoryRate,
            wbc: this.wbc,
            createdAt: this.createdAt,
            criteriaCount: this.criteriaCount,
            criteriaDetails: this.criteriaDetails,
            hasSIRS: this.hasSIRS()
        };
    }
}

export default SIRSCalculation;
