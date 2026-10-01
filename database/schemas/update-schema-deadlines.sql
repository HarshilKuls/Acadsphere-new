-- 1. Add expiry fields to Blogs
ALTER TABLE public.blogs
ADD COLUMN IF NOT EXISTS is_always_running BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS expiry_date TIMESTAMP WITH TIME ZONE;

-- 2. Add deadline field to Internships
ALTER TABLE public.internships
ADD COLUMN IF NOT EXISTS deadline_date TIMESTAMP WITH TIME ZONE;

-- 3. Add deadline field to Events
ALTER TABLE public.events
ADD COLUMN IF NOT EXISTS deadline_date TIMESTAMP WITH TIME ZONE;

-- 4. Enable pg_cron and schedule the cleanup job
CREATE EXTENSION IF NOT EXISTS pg_cron SCHEMA extensions;

-- (Unschedule command removed because it causes an error on first run)

-- Schedule job to run at midnight every day
SELECT cron.schedule(
  'cleanup_expired_content',
  '0 0 * * *',
  $$
    -- Delete internships 2 days after deadline
    DELETE FROM public.internships 
    WHERE deadline_date IS NOT NULL 
    AND (deadline_date + INTERVAL '2 days') < now();

    -- Delete events 2 days after deadline
    DELETE FROM public.events 
    WHERE deadline_date IS NOT NULL 
    AND (deadline_date + INTERVAL '2 days') < now();
  $$
);
