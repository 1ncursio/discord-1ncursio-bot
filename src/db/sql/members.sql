CREATE TABLE IF NOT EXISTS public.members(
    id text PRIMARY KEY,
    username text NOT NULL DEFAULT ''::text,
    global_name text NOT NULL DEFAULT ''::text,
    display_name text NOT NULL DEFAULT ''::text,
    display_avatar_url text NOT NULL DEFAULT ''::text,
    created_at timestamp with time zone DEFAULT NOW() NOT NULL
);
