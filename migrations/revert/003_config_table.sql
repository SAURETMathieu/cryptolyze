-- Revert cryptolize:003_config_table from pg

BEGIN;

DROP TRIGGER handle_config_updated_at ON public.config;
DROP TABLE public.config;

COMMIT;
