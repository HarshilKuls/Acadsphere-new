-- UNIFIED POSTGRESQL SCHEMA FOR ACADSPHERE ECOSYSTEM
-- Shared between Audience Portal and Admin Portal

-- 1. Profiles Table (All registered students)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT NOT NULL,
    college TEXT NOT NULL,
    year TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to read their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Allow users to update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Allow admins to read all profiles" ON public.profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.admins WHERE public.admins.id = auth.uid())
);


-- 2. Admin Accounts (Admin access permissions)
CREATE TABLE public.admins (
    id UUID PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL CHECK (role IN ('Master Admin', 'Normal Admin')),
    manage_content BOOLEAN DEFAULT TRUE NOT NULL,
    manage_users BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for admins
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read admin directory" ON public.admins FOR SELECT USING (
  email = auth.jwt()->>'email'
  OR EXISTS (SELECT 1 FROM public.admins WHERE public.admins.id = auth.uid() AND public.admins.role = 'Master Admin')
);

CREATE POLICY "Master Admins can manage normal admins" ON public.admins FOR ALL USING (
  EXISTS (SELECT 1 FROM public.admins WHERE public.admins.id = auth.uid() AND public.admins.role = 'Master Admin')
);


-- 3. Events & Announcements
CREATE TABLE public.events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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

-- Enable RLS for events
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read events feed" ON public.events FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Admins can manage events feed" ON public.events FOR ALL USING (
  EXISTS (SELECT 1 FROM public.admins WHERE public.admins.id = auth.uid() AND public.admins.manage_content = true)
);


-- 4. Internships
CREATE TABLE public.internships (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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

-- Enable RLS for internships
ALTER TABLE public.internships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read internships feed" ON public.internships FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Admins can manage internships feed" ON public.internships FOR ALL USING (
  EXISTS (SELECT 1 FROM public.admins WHERE public.admins.id = auth.uid() AND public.admins.manage_content = true)
);


-- 5. E-Library Content
CREATE TABLE public.e_library (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Notes', 'E-Books', 'Resource Links', 'PYQs')),
    subject TEXT,
    description TEXT,
    file_link TEXT,
    external_link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for e-library
ALTER TABLE public.e_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view library resources" ON public.e_library FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Admins can manage library resources" ON public.e_library FOR ALL USING (
  EXISTS (SELECT 1 FROM public.admins WHERE public.admins.id = auth.uid() AND public.admins.manage_content = true)
);


-- 6. Reported Accounts & Flagged Logs
CREATE TABLE public.reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    reason TEXT NOT NULL,
    reported_date DATE DEFAULT CURRENT_DATE NOT NULL,
    status TEXT DEFAULT 'Flagged' CHECK (status IN ('Flagged', 'Banned', 'Resolved')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for reports
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create reports on other profiles" ON public.reports FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can view and update reports logs" ON public.reports FOR ALL USING (
  EXISTS (SELECT 1 FROM public.admins WHERE public.admins.id = auth.uid() AND public.admins.manage_users = true)
);


-- 7. Banned Users Registries
CREATE TABLE public.banned_users (
    email TEXT PRIMARY KEY,
    banned_by UUID REFERENCES public.admins(id) ON DELETE SET NULL,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for banned users
ALTER TABLE public.banned_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read and write banned logs" ON public.banned_users FOR ALL USING (
  EXISTS (SELECT 1 FROM public.admins WHERE public.admins.id = auth.uid() AND public.admins.manage_users = true)
);
