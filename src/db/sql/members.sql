CREATE TABLE IF NOT EXISTS public.members(
    id text PRIMARY KEY,
    username text NOT NULL DEFAULT ''::text,
    display_name text NOT NULL DEFAULT ''::text,
    display_avatar_url text NOT NULL DEFAULT ''::text
);
