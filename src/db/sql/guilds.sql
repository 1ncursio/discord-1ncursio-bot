CREATE TABLE IF NOT EXISTS public.guilds(
    id text PRIMARY KEY,
    name text NOT NULL DEFAULT ''::text
);
