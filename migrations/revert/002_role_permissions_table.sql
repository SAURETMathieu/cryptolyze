-- Revert cryptolize:002_role_permissions_table from pg

BEGIN;

DROP TABLE public.role_permissions;

COMMIT;
