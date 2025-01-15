-- Create the function to create the SIRS table if it doesn't exist
CREATE OR REPLACE FUNCTION create_sirs_table()
RETURNS void
LANGUAGE plpgsql
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
