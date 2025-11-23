-- Verify cryptolize:008_fix_strategy_test_unique_constraint

-- Vérifier que la nouvelle contrainte unique existe
SELECT constraint_name
FROM information_schema.table_constraints
WHERE
    table_schema = 'public'
    AND table_name = 'strategy_test'
    AND constraint_name = 'unique_strategy_test_year_crypto_id_strategy_id'
    AND constraint_type = 'UNIQUE';

-- Vérifier que l'ancienne contrainte n'existe plus
SELECT constraint_name
FROM information_schema.table_constraints
WHERE
    table_schema = 'public'
    AND table_name = 'strategy_test'
    AND constraint_name = 'unique_strategy_test_year_crypto_id'
    AND constraint_type = 'UNIQUE';