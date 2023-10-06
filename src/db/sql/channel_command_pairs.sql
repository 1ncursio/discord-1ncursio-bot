CREATE TABLE IF NOT EXISTS public.channel_command_pairs(
    id serial PRIMARY KEY,
    channel_id text NOT NULL,
    command_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT NOW(),
    FOREIGN KEY (channel_id) REFERENCES public.channels(id) ON DELETE CASCADE,
    FOREIGN KEY (command_id) REFERENCES public.commands(id) ON DELETE CASCADE,
    CONSTRAINT channel_command_pairs_channel_id_command_id_key UNIQUE
	(channel_id, command_id)
);
