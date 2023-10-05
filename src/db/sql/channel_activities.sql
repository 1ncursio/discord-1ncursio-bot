CREATE TYPE action_type AS ENUM(
    'join',
    'leave',
    'muted',
    'unmuted',
    'deafened',
    'undeafened',
    'stream_started',
    'stream_stopped'
);

CREATE TABLE IF NOT EXISTS public.channel_activities(
    id serial PRIMARY KEY,
    channel_id text NOT NULL,
    member_id text NOT NULL,
    action_type action_type NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT NOW(),
    FOREIGN KEY (channel_id) REFERENCES public.channels(id),
    FOREIGN KEY (member_id) REFERENCES public.members(id)
);
