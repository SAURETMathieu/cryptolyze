-- Revert cryptolize:006_request_crypto_day_history_function from pg

BEGIN;

DROP FUNCTION IF EXISTS public.request_crypto_day_history;

COMMIT;