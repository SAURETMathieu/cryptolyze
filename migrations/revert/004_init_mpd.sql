-- Revert cryptolize:004_init_mpd from pg

BEGIN;

--------------------------------------------------------
-- Drop transaction table
--------------------------------------------------------
DROP TABLE IF EXISTS public.transaction CASCADE;

--------------------------------------------------------
-- Drop trade table
--------------------------------------------------------
DROP TABLE IF EXISTS public.trade CASCADE;

--------------------------------------------------------
-- Drop bot table
--------------------------------------------------------
DROP TABLE IF EXISTS public.bot CASCADE;

DROP TYPE IF EXISTS public.bot_status CASCADE;

--------------------------------------------------------
-- Drop strategy_test_history table
--------------------------------------------------------
DROP TABLE IF EXISTS public.strategy_test_history CASCADE;

--------------------------------------------------------
-- Drop strategy_test table
--------------------------------------------------------
DROP TABLE IF EXISTS public.strategy_test CASCADE;

--------------------------------------------------------
-- Drop strategy table
--------------------------------------------------------
DROP TABLE IF EXISTS public.strategy CASCADE;

--------------------------------------------------------
-- Drop api_key table
--------------------------------------------------------
DROP TABLE IF EXISTS public.api_key CASCADE;

--------------------------------------------------------
-- Drop balance_history table
--------------------------------------------------------
DROP TABLE IF EXISTS public.balance_history CASCADE;

--------------------------------------------------------
-- Drop wallet_cryptos table
--------------------------------------------------------
DROP TABLE IF EXISTS public.wallet_cryptos CASCADE;

--------------------------------------------------------
-- Drop crypto_day_history table
--------------------------------------------------------
DROP TABLE IF EXISTS public.crypto_day_history CASCADE;

--------------------------------------------------------
-- Drop crypto table
--------------------------------------------------------
DROP TABLE IF EXISTS public.crypto CASCADE;

--------------------------------------------------------
-- Drop wallet table
--------------------------------------------------------
DROP TABLE IF EXISTS public.wallet CASCADE;

DROP TYPE IF EXISTS public.wallet_type CASCADE;

COMMIT;