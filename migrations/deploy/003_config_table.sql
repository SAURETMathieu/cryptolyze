-- Deploy cryptolize:003_config_table to pg

BEGIN;

create table
public.config (
  key text not null,
  value text null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone null,
  updated_by uuid null default auth.uid (),
  constraint config_pkey primary key (key)
) tablespace pg_default;

ALTER TABLE public.config ENABLE ROW LEVEL SECURITY;

create policy "allow_all_users_to_select_config"
on "public"."config"
for select using (true);

INSERT INTO public.config (key, value) VALUES ('environment', 'dev');
INSERT INTO public.config (key, value) VALUES ('accept_terms_version', '0.1');
INSERT INTO public.config (key, value) VALUES ('global_message', '{"fr":null,"en":null}');

create trigger handle_config_updated_at BEFORE
update on config for EACH row
execute FUNCTION extensions.moddatetime ('updated_at');

COMMIT;
