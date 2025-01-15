const { createClient } = require('@supabase/supabase-js');
const ISIRSRepository = require('../../../domain/repositories/ISIRSRepository');
const SIRSCalculation = require('../../../domain/entities/SIRSCalculation');

class VercelSIRSRepository extends ISIRSRepository {
    constructor() {
        super();
        this.supabase = createClient(
            process.env.SUPA__SUPABASE_URL,
            process.env.SUPA__SUPABASE_SERVICE_ROLE_KEY
        );
    }

    async initialize() {
        try {
            // Create the table if it doesn't exist using Supabase's SQL editor
            // This is typically done through Supabase's dashboard
            console.log('Supabase client initialized successfully');
        } catch (error) {
            console.error('Database initialization error:', error);
            throw error;
        }
    }

    async save(sirsCalculation) {
        try {
            const { data, error } = await this.supabase
                .from('sirs_calculations')
                .insert([
                    {
                        temperature: sirsCalculation.temperature,
                        heart_rate: sirsCalculation.heartRate,
                        respiratory_rate: sirsCalculation.respiratoryRate,
                        wbc: sirsCalculation.wbc,
                        criteria_met: sirsCalculation.criteriaCount
                    }
                ])
                .select()
                .single();

            if (error) throw error;

            return new SIRSCalculation(
                data.temperature,
                data.heart_rate,
                data.respiratory_rate,
                data.wbc,
                data.id,
                data.created_at
            );
        } catch (error) {
            console.error('Error saving calculation:', error);
            throw error;
        }
    }

    async getById(id) {
        try {
            const { data, error } = await this.supabase
                .from('sirs_calculations')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            if (!data) return null;

            return new SIRSCalculation(
                data.temperature,
                data.heart_rate,
                data.respiratory_rate,
                data.wbc,
                data.id,
                data.created_at
            );
        } catch (error) {
            console.error('Error fetching calculation:', error);
            throw error;
        }
    }

    async getAll() {
        try {
            const { data, error } = await this.supabase
                .from('sirs_calculations')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            return data.map(row => new SIRSCalculation(
                row.temperature,
                row.heart_rate,
                row.respiratory_rate,
                row.wbc,
                row.id,
                row.created_at
            ));
        } catch (error) {
            console.error('Error fetching calculations:', error);
            throw error;
        }
    }
}

module.exports = VercelSIRSRepository;
