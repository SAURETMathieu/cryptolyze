-- Revert cryptolize:008_fix_strategy_test_unique_constraint from pg

BEGIN;

-- Supprimer la nouvelle contrainte
ALTER TABLE public.strategy_test
DROP CONSTRAINT IF EXISTS unique_strategy_test_year_crypto_id_strategy_id;

-- Restaurer l'ancienne contrainte (sans strategy_id)
ALTER TABLE public.strategy_test
ADD CONSTRAINT unique_strategy_test_year_crypto_id UNIQUE ("year", "crypto_id");

COMMIT;