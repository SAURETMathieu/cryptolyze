-- Deploy cryptolize:006_request_crypto_day_history_function to pg

BEGIN;

CREATE OR REPLACE FUNCTION public.request_crypto_day_history(p_crypto_id INTEGER, p_year INTEGER)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = 'public'
AS $$
DECLARE
    v_crypto_record RECORD;
    v_current_year INTEGER;
    v_start_year INTEGER;
    v_end_year INTEGER;
    v_year INTEGER;
    v_current_date DATE;
    v_end_date DATE;
    v_day_date DATE;
BEGIN
    -- Get crypto record
    SELECT * INTO v_crypto_record
    FROM crypto
    WHERE id = p_crypto_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Crypto with ID % not found', p_crypto_id;
    END IF;

    -- Get current year
    v_current_year := EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER;

    -- Determine years to process
    IF p_year = 0 THEN
        -- If year = 0, take all years from first_year to current year - 1
        v_start_year := v_crypto_record.first_year;
        v_end_year := v_current_year - 1;
    ELSE
        -- Vérifier si l'année demandée est >= à first_year
        IF p_year < v_crypto_record.first_year THEN
            RAISE EXCEPTION 'Year % is before first_year % for crypto %', p_year, v_crypto_record.first_year, v_crypto_record.symbol;
        END IF;

        v_start_year := p_year;
        v_end_year := p_year;
    END IF;

    -- Process each year
    FOR v_year IN v_start_year..v_end_year LOOP
        -- Define start and end dates for the year
        v_current_date := DATE(v_year || '-01-01');
        v_end_date := DATE(v_year || '-12-31');

        -- Generate all days of the year
        v_day_date := v_current_date;

        WHILE v_day_date <= v_end_date LOOP
            -- Upsert in crypto_day_history
            INSERT INTO crypto_day_history (
                crypto_id,
                date
            ) VALUES (
                p_crypto_id,
                v_day_date
            )
            ON CONFLICT (date, crypto_id) DO NOTHING;

            v_day_date := v_day_date + INTERVAL '1 day';
        END LOOP;
    END LOOP;

    RETURN TRUE;
END;
$$;

COMMIT;