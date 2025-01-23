import ISIRSRepository from '../../../domain/repositories/ISIRSRepository.js';
import SIRSCalculation from '../../../domain/entities/SIRSCalculation.js';

class LocalStorageSIRSRepository extends ISIRSRepository {
    constructor() {
        super();
        this.storageKey = 'sirs_calculations';
        this.nextId = 1;
    }

    async initialize() {
        // Load nextId from localStorage
        const calculations = this.loadFromStorage();
        if (calculations.length > 0) {
            this.nextId = Math.max(...calculations.map(calc => calc.id)) + 1;
        }
        return Promise.resolve();
    }

    async save(sirsCalculation) {
        const calculations = this.loadFromStorage();
        const newCalculation = {
            ...sirsCalculation,
            id: this.nextId++,
            createdAt: new Date()
        };
        calculations.push(newCalculation);
        this.saveToStorage(calculations);
        return newCalculation;
    }

    async getById(id) {
        const calculations = this.loadFromStorage();
        const calculation = calculations.find(calc => calc.id === id);
        if (!calculation) return null;
        return this.mapToEntity(calculation);
    }

    async getRecentCalculations(limit = 10) {
        const calculations = this.loadFromStorage();
        return calculations
            .slice()
            .reverse()
            .slice(0, limit)
            .map(this.mapToEntity);
    }

    mapToEntity(data) {
        return new SIRSCalculation(
            data.temperature,
            data.heartRate,
            data.respiratoryRate,
            data.wbc,
            data.id,
            new Date(data.createdAt)
        );
    }

    loadFromStorage() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return [];
        }
    }

    saveToStorage(calculations) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(calculations));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }
}

export default LocalStorageSIRSRepository;
