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
                hasKey: !!supabaseKey,
                envKeys: Object.keys(process.env)
            });
            throw new Error('Missing Supabase environment variables. Please check your configuration.');
        }

        console.log('Initializing Supabase with:', {
            url: supabaseUrl,
            hasKey: !!supabaseKey
        });

        this.supabase = createClient(supabaseUrl, supabaseKey, {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
                detectSessionInUrl: false
            }
        });
    }

    async initialize() {
        try {
            // Test the connection
            const { data, error } = await this.supabase
                .from('sirs_calculations')
                .select('count(*)')
                .limit(1)
                .single();

            if (error) {
                // If table doesn't exist, create it
                if (error.code === '42P01') {
                    await this.createTable();
                } else {
                    throw error;
                }
            }

            console.log('Supabase connection test successful');
        } catch (error) {
            console.error('Database initialization error:', error);
            throw error;
        }
    }

    async createTable() {
        try {
            const { error } = await this.supabase.rpc('create_sirs_table');
            if (error) throw error;
            console.log('SIRS table created successfully');
        } catch (error) {
            console.error('Error creating table:', error);
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

            console.log('Saving calculation:', calculationData);

            const { data, error } = await this.supabase
                .from('sirs_calculations')
                .insert([calculationData])
                .select()
                .single();

            if (error) {
                console.error('Error saving to Supabase:', error);
                throw error;
            }

            console.log('Calculation saved successfully:', data);

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
            console.log('Fetching calculation by id:', id);

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

            console.log('Found calculation:', data);

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
            console.log('Fetching recent calculations, limit:', limit);

            const { data, error } = await this.supabase
                .from('sirs_calculations')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error) {
                console.error('Error fetching from Supabase:', error);
                throw error;
            }

            console.log('Found calculations:', data?.length || 0);

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
