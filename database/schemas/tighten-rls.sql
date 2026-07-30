-- AcadSphere Phase 5 Database Security Hardening Migration Script
-- Copy and paste this script into your Supabase Dashboard SQL Editor and click "Run".

-- 1. Tighten e_library SELECT policy (Restrict to authenticated users)
DROP POLICY IF EXISTS "Allow public read to e_library" ON public.e_library;
CREATE POLICY "Allow authenticated read to e_library" ON public.e_library
  FOR SELECT USING (auth.role() = 'authenticated');

-- 2. Tighten events SELECT policy (Restrict to authenticated users)
DROP POLICY IF EXISTS "Allow public read to events" ON public.events;
CREATE POLICY "Allow authenticated read to events" ON public.events
  FOR SELECT USING (auth.role() = 'authenticated');

-- 3. Tighten internships SELECT policy (Restrict to authenticated users)
DROP POLICY IF EXISTS "Allow public read to internships" ON public.internships;
CREATE POLICY "Allow authenticated read to internships" ON public.internships
  FOR SELECT USING (auth.role() = 'authenticated');

-- 4. Tighten holidays SELECT policy (Restrict to authenticated users)
DROP POLICY IF EXISTS "Allow public read to holidays" ON public.holidays;
CREATE POLICY "Allow authenticated read to holidays" ON public.holidays
  FOR SELECT USING (auth.role() = 'authenticated');

-- 5. Tighten banned_users SELECT policy (Restrict to authenticated users)
DROP POLICY IF EXISTS "Allow public read to banned_users" ON public.banned_users;
CREATE POLICY "Allow authenticated read to banned_users" ON public.banned_users
  FOR SELECT USING (auth.role() = 'authenticated');

-- 6. Tighten users SELECT policy (Students can only read their own profile, admins can read all)
DROP POLICY IF EXISTS "Allow public read to users" ON public.users;
CREATE POLICY "Allow authenticated read to users" ON public.users
  FOR SELECT USING (auth.uid() = id OR public.is_admin());

-- 7. Add Feedback Rate-Limiting Trigger (Max 10 submissions per 10 minutes per user)
CREATE OR REPLACE FUNCTION public.check_feedback_rate_limit()
RETURNS TRIGGER AS $$
DECLARE
  submission_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO submission_count
  FROM public.feedback
  WHERE user_id = auth.uid()
    AND created_at >= NOW() - INTERVAL '10 minutes';
  
  IF submission_count >= 10 THEN
    RAISE EXCEPTION 'Rate limit exceeded: Max 10 submissions per 10 minutes.';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS feedback_rate_limit_trg ON public.feedback;
CREATE TRIGGER feedback_rate_limit_trg
  BEFORE INSERT ON public.feedback
  FOR EACH ROW
  EXECUTE FUNCTION public.check_feedback_rate_limit();

-- 8. Create Rate Limits table if not exists for backup logging
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT NOT NULL,
  action_type TEXT NOT NULL, -- 'login' or 'password_reset'
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on rate_limits
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;
