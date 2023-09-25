CREATE TABLE IF NOT EXISTS public.messages(
    id text PRIMARY KEY,
    channel_id text NOT NULL DEFAULT ''::text,
    guild_id text NOT NULL DEFAULT ''::text,
    author_id text NOT NULL DEFAULT ''::text,
    deleted_at timestamp with time zone NOT NULL DEFAULT NOW(),
    FOREIGN KEY (channel_id) REFERENCES channels(id),
    FOREIGN KEY (guild_id) REFERENCES guilds(id),
    FOREIGN KEY (author_id) REFERENCES members(id)
);
