-- ====================================================================
-- ⚡ ACADSPHERE ECOSYSTEM SCHEMA MIGRATION SCRIPT (REVISED)
-- ====================================================================
-- Copy and run this script in your Supabase SQL Editor (https://supabase.com)
-- to instantly provision all tables and enable real-time synchronization.

-- 1. ADMISSION ADMINISTRATORS TABLE
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'Normal Admin' CHECK (role IN ('Master Admin', 'Normal Admin')),
    manage_content BOOLEAN NOT NULL DEFAULT TRUE,
    manage_users BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed Master Admin Account
INSERT INTO public.admins (id, full_name, email, role, manage_content, manage_users)
VALUES (
    '2a4ef6e3-238d-4be9-ba4f-4d4de8392cd1',
    'Harshil Kulshreshtha',
    'kulsharshil@acadsph.com',
    'Master Admin',
    TRUE,
    TRUE
) ON CONFLICT (email) DO UPDATE SET role = 'Master Admin', manage_content = TRUE, manage_users = TRUE;


-- 2. USERS PROFILE TABLE (Linked to auth.users UUIDs)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    college TEXT NOT NULL,
    year TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- 3. CALENDAR HOLIDAYS / ACADEMIC EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.holidays (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    date TEXT NOT NULL, -- YYYY-MM-DD
    type TEXT NOT NULL CHECK (type IN ('holiday', 'exam', 'deadline', 'reminder')),
    color TEXT DEFAULT 'violet' CHECK (color IN ('violet', 'cyan', 'amber', 'rose')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- 4. TIMETABLE SCHEDULE TABLE
CREATE TABLE IF NOT EXISTS public.timetable (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    faculty TEXT,
    room TEXT,
    day TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    color TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- 5. ATTENDANCE TALLY COUNTERS TABLE
CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    attended INTEGER NOT NULL DEFAULT 0,
    total INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- 6. CGPA SUBJECT GRADE LEDGER TABLE
CREATE TABLE IF NOT EXISTS public.cgpa (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    semester INTEGER NOT NULL,
    subject_name TEXT NOT NULL,
    credits INTEGER NOT NULL,
    grade TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- 7. MARKS PREDICTOR TABLE
CREATE TABLE IF NOT EXISTS public.predictor (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    internal_score NUMERIC NOT NULL,
    internal_total NUMERIC NOT NULL,
    external_total NUMERIC NOT NULL,
    target_grade TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- 8. DYNAMIC EVENTS / HACKATHONS TABLE
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    organizer TEXT,
    date TEXT,
    location TEXT,
    apply_link TEXT,
    image TEXT,
    tags TEXT,
    category TEXT NOT NULL CHECK (category IN ('Competition/Event', 'News/Announcement')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- 9. ACTIVE INTERNSHIPS BOARD TABLE
CREATE TABLE IF NOT EXISTS public.internships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    company_name TEXT,
    apply_link TEXT,
    duration TEXT,
    stipend TEXT,
    qualification TEXT,
    location TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- 10. ACADEMIC E-LIBRARY INDEX TABLE
CREATE TABLE IF NOT EXISTS public.e_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Notes', 'E-Books', 'Resource Links', 'PYQs')),
    subject TEXT,
    description TEXT,
    file_link TEXT,
    external_link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- 11. BANNED STUDENTS EMAIL REGISTRY
CREATE TABLE IF NOT EXISTS public.banned_users (
    email TEXT PRIMARY KEY,
    reason TEXT DEFAULT 'Suspended by administrator',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- 12. CALENDAR EVENTS (Student specific custom events)
CREATE TABLE IF NOT EXISTS public.calendar (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    date TEXT NOT NULL, -- YYYY-MM-DD
    type TEXT NOT NULL CHECK (type IN ('exam', 'deadline', 'reminder', 'holiday')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 13. FEEDBACK SUBMISSIONS
CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- ====================================================================
-- 🔒 ROW LEVEL SECURITY (RLS) & ACCESS POLICIES
-- ====================================================================

-- Function to check admin privileges
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admins WHERE email = auth.jwt()->>'email'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.holidays ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cgpa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictor ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.e_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banned_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Allow public read-only access to global tables
CREATE POLICY "Allow admins to read admins" ON public.admins FOR SELECT USING (email = auth.jwt()->>'email' OR public.is_admin());
CREATE POLICY "Allow public read to events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Allow public read to internships" ON public.internships FOR SELECT USING (true);
CREATE POLICY "Allow public read to e_library" ON public.e_library FOR SELECT USING (true);
CREATE POLICY "Allow public read to holidays" ON public.holidays FOR SELECT USING (true);
CREATE POLICY "Allow public read to banned_users" ON public.banned_users FOR SELECT USING (true);
CREATE POLICY "Allow public read to users" ON public.users FOR SELECT USING (true);

-- Allow student-specific access to personal dashboards
CREATE POLICY "Students manage their own timetable" ON public.timetable FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Students manage their own attendance" ON public.attendance FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Students manage their own cgpa" ON public.cgpa FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Students manage their own predictor" ON public.predictor FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Students manage their own calendar" ON public.calendar FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Students insert their own feedback" ON public.feedback FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Students view their own feedback" ON public.feedback FOR SELECT USING (auth.uid() = user_id);

-- Restricted administrative permissions for global tables
CREATE POLICY "Allow writes to users" ON public.users FOR ALL USING (auth.uid() = id OR public.is_admin()) WITH CHECK (auth.uid() = id OR public.is_admin());
CREATE POLICY "Allow writes to banned_users" ON public.banned_users FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Allow writes to events" ON public.events FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Allow writes to internships" ON public.internships FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Allow writes to e_library" ON public.e_library FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Allow writes to holidays" ON public.holidays FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Allow writes to admins" ON public.admins FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Enable Real-Time Publications
ALTER PUBLICATION supabase_realtime ADD TABLE public.events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.internships;
ALTER PUBLICATION supabase_realtime ADD TABLE public.e_library;
ALTER PUBLICATION supabase_realtime ADD TABLE public.holidays;
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
ALTER PUBLICATION supabase_realtime ADD TABLE public.banned_users;
