const { createClient } = require('@supabase/supabase-js');
const ISIRSRepository = require('../../../domain/repositories/ISIRSRepository');
const SIRSCalculation = require('../../../domain/entities/SIRSCalculation');

class VercelSIRSRepository extends ISIRSRepository {
    constructor() {
        super();
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Missing Supabase environment variables. Please check your configuration.');
        }

        this.supabase = createClient(supabaseUrl, supabaseKey);
    }

    async initialize() {
        try {
            // Test the connection
            const { data, error } = await this.supabase
                .from('sirs_calculations')
                .select('count')
                .limit(1);

            if (error) {
                throw error;
            }

            console.log('Supabase connection test successful');
        } catch (error) {
            console.error('Database initialization error:', error);
            throw error;
        }
    }

    async save(sirsCalculation) {
        if (!this.supabase) {
            throw new Error('Supabase client not initialized');
        }

        try {
            const calculationData = {
                temperature: sirsCalculation.temperature,
                heart_rate: sirsCalculation.heartRate,
                respiratory_rate: sirsCalculation.respiratoryRate,
                wbc: sirsCalculation.wbc,
                criteria_met: sirsCalculation.criteriaCount
            };

            const { data, error } = await this.supabase
                .from('sirs_calculations')
                .insert([calculationData])
                .select()
                .single();

            if (error) {
                throw error;
            }

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
