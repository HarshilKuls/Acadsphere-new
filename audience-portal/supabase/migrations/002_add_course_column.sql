-- Add course column to public.users for profile tracking
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS course TEXT;
