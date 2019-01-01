// Interface for SIRS Repository
class ISIRSRepository {
    async save(sirsCalculation) {
        throw new Error('Method not implemented');
    }

    async getById(id) {
        throw new Error('Method not implemented');
    }

    async getRecentCalculations(limit) {
        throw new Error('Method not implemented');
    }
}

module.exports = ISIRSRepository;
