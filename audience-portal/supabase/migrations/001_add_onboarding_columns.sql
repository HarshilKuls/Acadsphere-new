-- Add onboarding tracking columns to public.users
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- Backfill updated_at for existing rows
UPDATE public.users
SET updated_at = COALESCE(updated_at, created_at, timezone('utc'::text, now()))
WHERE updated_at IS NULL;
