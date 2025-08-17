-- Revert cryptolize:005_view_crypto_yearly_history_status from pg

BEGIN;

DROP VIEW IF EXISTS crypto_yearly_history_status;

COMMIT;
