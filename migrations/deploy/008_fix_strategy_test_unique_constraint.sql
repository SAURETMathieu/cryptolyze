-- Deploy cryptolize:008_fix_strategy_test_unique_constraint to pg

BEGIN;

-- Supprimer l'ancienne contrainte unique qui ne inclut pas strategy_id
ALTER TABLE public.strategy_test
DROP CONSTRAINT IF EXISTS unique_strategy_test_year_crypto_id;

-- Ajouter la nouvelle contrainte unique qui inclut strategy_id
-- Cela permet d'avoir plusieurs stratégies testées pour la même crypto/année
ALTER TABLE public.strategy_test
ADD CONSTRAINT unique_strategy_test_year_crypto_id_strategy_id UNIQUE (
    "year",
    "crypto_id",
    "strategy_id"
);

COMMIT;