CREATE TABLE IF NOT EXISTS public.channels(
    id text PRIMARY KEY,
    guild_id text NOT NULL DEFAULT ''::text,
    name text NOT NULL DEFAULT ''::text,
    FOREIGN KEY (guild_id) REFERENCES guilds(id)
);
