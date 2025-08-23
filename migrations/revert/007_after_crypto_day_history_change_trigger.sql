-- Revert cryptolize:007_after_crypto_day_history_change_trigger from pg

BEGIN;

DROP TRIGGER IF EXISTS crypto_day_history_changes_trigger ON crypto_day_history;

DROP FUNCTION IF EXISTS notify_crypto_day_history_changes ();

COMMIT;