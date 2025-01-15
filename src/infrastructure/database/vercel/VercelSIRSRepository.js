const { createClient } = require('@supabase/supabase-js');
const ISIRSRepository = require('../../../domain/repositories/ISIRSRepository');
const SIRSCalculation = require('../../../domain/entities/SIRSCalculation');

class VercelSIRSRepository extends ISIRSRepository {
    constructor() {
        super();
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            console.error('Missing Supabase environment variables:', { 
                hasUrl: !!supabaseUrl, 
                hasKey: !!supabaseKey 
            });
            throw new Error('Missing Supabase environment variables. Please check your configuration.');
        }

        this.supabase = createClient(supabaseUrl, supabaseKey, {
            auth: {
                persistSession: false
            },
            db: {
                schema: 'public'
            }
        });
    }

    async initialize() {
        try {
            // Test the connection and create table if it doesn't exist
            const { error: tableError } = await this.supabase.rpc('create_sirs_table');
            
            if (tableError && !tableError.message.includes('relation "sirs_calculations" already exists')) {
                throw tableError;
            }

            // Test a simple query
            const { data, error } = await this.supabase
                .from('sirs_calculations')
                .select('id')
                .limit(1);

            if (error) throw error;

            console.log('Supabase connection test successful');
        } catch (error) {
            console.error('Database initialization error:', error);
            throw error;
        }
    }

    async save(sirsCalculation) {
        try {
            const calculationData = {
                temperature: sirsCalculation.temperature,
                heart_rate: sirsCalculation.heartRate,
                respiratory_rate: sirsCalculation.respiratoryRate,
                wbc: sirsCalculation.wbc,
                sirs_met: sirsCalculation.sirsMet,
                criteria_count: sirsCalculation.criteriaCount,
                criteria_details: sirsCalculation.criteriaDetails
            };

            const { data, error } = await this.supabase
                .from('sirs_calculations')
                .insert([calculationData])
                .select()
                .single();

            if (error) {
                console.error('Error saving to Supabase:', error);
                throw error;
            }

            const calculation = new SIRSCalculation(
                data.temperature,
                data.heart_rate,
                data.respiratory_rate,
                data.wbc
            );
            calculation.sirsMet = data.sirs_met;
            calculation.criteriaCount = data.criteria_count;
            calculation.criteriaDetails = data.criteria_details;
            return calculation;
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

            if (error) {
                console.error('Error fetching from Supabase:', error);
                throw error;
            }

            if (!data) return null;

            const calculation = new SIRSCalculation(
                data.temperature,
                data.heart_rate,
                data.respiratory_rate,
                data.wbc
            );
            calculation.sirsMet = data.sirs_met;
            calculation.criteriaCount = data.criteria_count;
            calculation.criteriaDetails = data.criteria_details;
            return calculation;
        } catch (error) {
            console.error('Error fetching calculation:', error);
            throw error;
        }
    }

    async getRecentCalculations(limit = 10) {
        try {
            const { data, error } = await this.supabase
                .from('sirs_calculations')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error) {
                console.error('Error fetching from Supabase:', error);
                throw error;
            }

            return data.map(item => {
                const calculation = new SIRSCalculation(
                    item.temperature,
                    item.heart_rate,
                    item.respiratory_rate,
                    item.wbc
                );
                calculation.sirsMet = item.sirs_met;
                calculation.criteriaCount = item.criteria_count;
                calculation.criteriaDetails = item.criteria_details;
                return calculation;
            });
        } catch (error) {
            console.error('Error fetching recent calculations:', error);
            throw error;
        }
    }
}

module.exports = VercelSIRSRepository;
