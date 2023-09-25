CREATE TABLE IF NOT EXISTS public.guilds(
    id text PRIMARY KEY,
    name text NOT NULL DEFAULT ''::text,
    created_at timestamp with time zone DEFAULT NOW() NOT NULL,
);
