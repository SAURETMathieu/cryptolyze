-- Deploy cryptolize:001_trigger_function_for_profiles to pg

BEGIN;

--------------------------------------------------------
-- Create role type
--------------------------------------------------------
CREATE TYPE "public"."role" AS ENUM (
    'User',
    'Team'
);

--------------------------------------------------------
-- Create profiles table
--------------------------------------------------------
CREATE TABLE public.profiles (
  id uuid not null,
  first_name text not null,
  last_name text not null,
  birth_date date not null,
  role public.role not null default 'User'::role,
  email text not null,
  nb_banned smallint not null default '0'::smallint,
  banned_until timestamp with time zone null,
  updated_at timestamp with time zone null,
  created_at timestamp with time zone not null default now(),
  ban_reason text null,
  accept_terms_at timestamp with time zone null,
  accept_terms_version text null,
  accept_terms_history jsonb[] null,
  language text not null default 'fr'::text,
  deleted_at timestamp with time zone null,
  constraint profiles_pkey primary key (id),
  constraint profiles_email_key unique (email),
  constraint profiles_id_fkey foreign KEY (id) references auth.users (id) on update CASCADE on delete CASCADE,
  constraint birth_date_check check (
    (
      birth_date <= (CURRENT_DATE - '18 years'::interval)
    )
  ),
  constraint nb_banned_check check ((nb_banned >= 0))
) TABLESPACE pg_default;

--------------------------------------------------------
-- Enable row level security on profiles table
--------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "delete_own_profile" ON "public"."profiles" FOR DELETE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "id"));

CREATE POLICY "insert_own_profile" ON "public"."profiles" FOR INSERT WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "id"));

CREATE POLICY "select_own_profile" ON "public"."profiles" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "id"));

CREATE POLICY "update_own_profile" ON "public"."profiles" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "id"));

--------------------------------------------------------
-- Update accept_terms_history column when profile is updated
--------------------------------------------------------
CREATE OR REPLACE FUNCTION update_accept_terms_history()
RETURNS TRIGGER AS $$
DECLARE
    terms_version TEXT;
    last_timestamp TEXT;
BEGIN

    SELECT value INTO terms_version
    FROM "public"."config"
    WHERE key = 'accept_terms_version';

    IF terms_version IS NULL OR terms_version='0.0' THEN
        RETURN NEW;
    END IF;

    NEW.accept_terms_version := terms_version;

    IF array_length(NEW.accept_terms_history, 1) > 0 THEN
      SELECT history_item->>'timestamp'
      INTO last_timestamp
      FROM unnest(NEW.accept_terms_history) AS history_item
      ORDER BY (history_item->>'timestamp') DESC
      LIMIT 1;

      IF NEW.accept_terms_at <= last_timestamp::TIMESTAMP THEN
          RAISE EXCEPTION 'accept_terms_at_must_greater_than_last_accept_terms_history';
      END IF;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM unnest(NEW.accept_terms_history) AS history_item
        WHERE history_item->>'version' = terms_version
    ) THEN
        NEW.accept_terms_history := NEW.accept_terms_history ||
            jsonb_build_object(
                'version', terms_version,
                'timestamp', NEW.accept_terms_at::TEXT
            );
    ELSE
        RAISE EXCEPTION 'accept_terms_version_already_accepted';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql

SECURITY DEFINER;

CREATE TRIGGER before_update_accept_terms_trigger BEFORE
UPDATE OF accept_terms_at ON profiles FOR EACH ROW WHEN (
    NEW.accept_terms_at IS DISTINCT
    FROM OLD.accept_terms_at
)
EXECUTE FUNCTION update_accept_terms_history ();

CREATE TRIGGER before_insert_profiles_accept_terms_trigger BEFORE
INSERT
    ON profiles FOR EACH ROW
EXECUTE FUNCTION update_accept_terms_history ();

--------------------------------------------------------
-- Update updated_at column when profile is updated
--------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "moddatetime" WITH SCHEMA "extensions";

CREATE OR REPLACE TRIGGER "handle_profile_updated_at" BEFORE UPDATE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "extensions"."moddatetime"('updated_at');

--------------------------------------------------------
-- Create function to handle new user
--------------------------------------------------------
CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$begin
  insert into public.profiles (id, first_name, last_name, email, birth_date, accept_terms_at)
  values (new.id, new.raw_user_meta_data->>'first_name', new.raw_user_meta_data->>'last_name', new.email, to_date(new.raw_user_meta_data->>'birth_date', 'YYYY-MM-DD'), (new.raw_user_meta_data->>'accept_terms_at')::timestamptz);
  return new;
end;$$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();

--------------------------------------------------------
-- Create function to update banned_until in profiles table
--------------------------------------------------------
CREATE OR REPLACE FUNCTION update_banned_until_in_profiles()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.profiles
    SET banned_until = NEW.banned_until
    WHERE id = NEW.id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_update_banned_until
AFTER UPDATE OF banned_until
ON auth.users
FOR EACH ROW
WHEN (OLD.banned_until IS DISTINCT FROM NEW.banned_until)
EXECUTE FUNCTION update_banned_until_in_profiles();

--------------------------------------------------------
-- Create function to update deleted_at in profiles table
--------------------------------------------------------
CREATE OR REPLACE FUNCTION update_deleted_at_in_profiles()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.profiles
    SET deleted_at = NEW.deleted_at
    WHERE id = NEW.id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_update_deleted_at
AFTER UPDATE OF deleted_at
ON auth.users
FOR EACH ROW
WHEN (OLD.deleted_at IS DISTINCT FROM NEW.deleted_at)
EXECUTE FUNCTION update_deleted_at_in_profiles();

---------------------------------------------------------
-- Create function to update email in profiles table
---------------------------------------------------------
CREATE OR REPLACE FUNCTION update_profile_email()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles
  SET email = NEW.email
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_update_profile_email
AFTER UPDATE OF email ON auth.users
FOR EACH ROW
WHEN (OLD.email IS DISTINCT FROM NEW.email)
EXECUTE FUNCTION update_profile_email();

--------------------------------------------------------
-- Create function to update profile with user metadatas
--------------------------------------------------------
CREATE OR REPLACE FUNCTION update_profile_with_user_metadatas()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles
  SET
    first_name = COALESCE(NEW.raw_user_meta_data->>'first_name', 'DELETED'),
    last_name = COALESCE(NEW.raw_user_meta_data->>'last_name', 'DELETED'),
    language = COALESCE(NEW.raw_user_meta_data->>'language', language),
    birth_date = COALESCE(
      to_date(NEW.raw_user_meta_data->>'birth_date', 'YYYY-MM-DD'),
      birth_date
    ),
    accept_terms_at = COALESCE(
      (NEW.raw_user_meta_data->>'accept_terms_at')::timestamptz,
      accept_terms_at
    )
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_synchronize_user_metadatas
AFTER UPDATE OF raw_user_meta_data ON auth.users
FOR EACH ROW
WHEN (OLD.raw_user_meta_data IS DISTINCT FROM NEW.raw_user_meta_data)
EXECUTE FUNCTION update_profile_with_user_metadatas();

COMMIT;
