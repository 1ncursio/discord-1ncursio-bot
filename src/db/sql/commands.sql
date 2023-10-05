CREATE TABLE IF NOT EXISTS public.commands(
    id serial PRIMARY KEY,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT NOW(),
    updated_at timestamp with time zone DEFAULT NOW()
);
