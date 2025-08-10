-- Revert cryptolize:001_trigger_function_for_profiles from pg

BEGIN;

DROP TRIGGER trigger_synchronize_user_metadatas ON auth.users;
DROP FUNCTION update_profile_with_user_metadatas;

DROP TRIGGER trigger_update_profile_email ON auth.users;
DROP FUNCTION update_profile_email;

DROP TRIGGER trigger_update_deleted_at ON auth.users;
DROP FUNCTION update_deleted_at_in_profiles;

DROP TRIGGER trigger_update_banned_until ON auth.users;
DROP FUNCTION update_banned_until_in_profiles;

DROP TRIGGER on_auth_user_created ON auth.users;
DROP FUNCTION handle_new_user;

DROP TRIGGER before_insert_profiles_accept_terms_trigger ON profiles;
DROP TRIGGER before_update_accept_terms_trigger ON profiles;
DROP FUNCTION update_accept_terms_history;

DROP TRIGGER handle_profile_updated_at ON profiles;

DROP EXTENSION IF EXISTS "moddatetime";

DROP TABLE public.profiles;
DROP TYPE public.role;

COMMIT;
