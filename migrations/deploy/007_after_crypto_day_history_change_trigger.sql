-- Deploy cryptolize:007_after_crypto_day_history_change_trigger to pg

BEGIN;

CREATE OR REPLACE FUNCTION notify_crypto_day_history_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = 'public'
AS $$
DECLARE
    payload JSON;
    crypto_info RECORD;
BEGIN
    SELECT *
    INTO crypto_info
    FROM crypto c
    WHERE c.id = NEW.crypto_id;

    CASE TG_OP
        WHEN 'INSERT' THEN
            payload := json_build_object(
                'event_type', 'INSERT',
                'table', TG_TABLE_NAME,
                'new_record', to_jsonb(NEW) - 'prices_per_minute',
                'old_record', null,
                'crypto', to_jsonb(crypto_info),
                'timestamp', now()
            );
        WHEN 'UPDATE' THEN
            payload := json_build_object(
                'event_type', 'UPDATE',
                'table', TG_TABLE_NAME,
                'new_record', to_jsonb(NEW) - 'prices_per_minute',
                'old_record', to_jsonb(OLD) - 'prices_per_minute',
                'crypto', to_jsonb(crypto_info),
                'timestamp', now()
            );
        WHEN 'DELETE' THEN
            payload := json_build_object(
                'event_type', 'DELETE',
                'table', TG_TABLE_NAME,
                'new_record', null,
                'old_record', to_jsonb(OLD) - 'prices_per_minute',
                'crypto', to_jsonb(crypto_info),
                'timestamp', now()
            );
    END CASE;

    PERFORM pg_notify('crypto_day_history_changes', payload::text);

    RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER crypto_day_history_changes_trigger
    AFTER INSERT OR UPDATE OR DELETE ON crypto_day_history
    FOR EACH ROW EXECUTE FUNCTION notify_crypto_day_history_changes();

COMMIT;