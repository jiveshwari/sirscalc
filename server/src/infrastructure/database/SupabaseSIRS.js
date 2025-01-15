import { createClient } from '@supabase/supabase-js';
import ISIRSRepository from '../../domain/repositories/ISIRSRepository.js';
import SIRSCalculation from '../../domain/entities/SIRSCalculation.js';

class SupabaseSIRS extends ISIRSRepository {
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
            // First try to create the table if it doesn't exist
            await this.createTable();

            // Test the connection by fetching a single row
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

    async createTable() {
        try {
            // Using raw SQL query to create table
            const { error } = await this.supabase.rpc('create_sirs_table');
            
            // If the function doesn't exist yet, create it first
            if (error && error.message.includes('does not exist')) {
                const createFunction = `
                    CREATE OR REPLACE FUNCTION create_sirs_table()
                    RETURNS void
                    LANGUAGE plpgsql
                    SECURITY DEFINER
                    AS $$
                    BEGIN
                        CREATE TABLE IF NOT EXISTS sirs_calculations (
                            id SERIAL PRIMARY KEY,
                            temperature DECIMAL(5,2) NOT NULL,
                            heart_rate INTEGER NOT NULL,
                            respiratory_rate INTEGER NOT NULL,
                            wbc INTEGER NOT NULL,
                            sirs_met BOOLEAN NOT NULL,
                            criteria_count INTEGER NOT NULL,
                            criteria_details JSONB NOT NULL,
                            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                        );
                    END;
                    $$;
                `;
                
                const { error: functionError } = await this.supabase.rpc('exec', { sql: createFunction });
                if (functionError && !functionError.message.includes('already exists')) {
                    throw functionError;
                }
                
                // Try creating the table again
                const { error: retryError } = await this.supabase.rpc('create_sirs_table');
                if (retryError && !retryError.message.includes('already exists')) {
                    throw retryError;
                }
            }

            console.log('SIRS table setup completed');
        } catch (error) {
            console.error('Error setting up table:', error);
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
                sirs_met: sirsCalculation.hasSIRS(),
                criteria_count: sirsCalculation.criteriaCount,
                criteria_details: sirsCalculation.criteriaDetails,
                created_at: new Date().toISOString()
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

            return new SIRSCalculation(
                data.temperature,
                data.heart_rate,
                data.respiratory_rate,
                data.wbc,
                data.id,
                new Date(data.created_at)
            );
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

            return new SIRSCalculation(
                data.temperature,
                data.heart_rate,
                data.respiratory_rate,
                data.wbc,
                data.id,
                new Date(data.created_at)
            );
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

            return data.map(item => new SIRSCalculation(
                item.temperature,
                item.heart_rate,
                item.respiratory_rate,
                item.wbc,
                item.id,
                new Date(item.created_at)
            ));
        } catch (error) {
            console.error('Error fetching calculations:', error);
            throw error;
        }
    }

    async deleteCalculation(id) {
        try {
            console.log('Deleting calculation:', id);

            const { error } = await this.supabase
                .from('sirs_calculations')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Error deleting from Supabase:', error);
                throw error;
            }

            console.log('Calculation deleted successfully');
        } catch (error) {
            console.error('Error deleting calculation:', error);
            throw error;
        }
    }

    async clearHistory() {
        try {
            console.log('Clearing all calculations');

            const { error } = await this.supabase
                .from('sirs_calculations')
                .delete()
                .neq('id', 0); // Delete all rows

            if (error) {
                console.error('Error clearing history in Supabase:', error);
                throw error;
            }

            console.log('History cleared successfully');
        } catch (error) {
            console.error('Error clearing history:', error);
            throw error;
        }
    }
}

export default SupabaseSIRS;
