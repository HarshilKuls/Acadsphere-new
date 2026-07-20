-- SQL SCHEMA FOR ACADSPHERE (SUPABASE POSTGRESQL)

-- 1. Create Profile Table linked to Supabase Auth Users
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT NOT NULL,
    college TEXT NOT NULL,
    year TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow users to read their own profile" ON public.profiles;
CREATE POLICY "Allow users to read their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Allow users to update their own profile" ON public.profiles;
CREATE POLICY "Allow users to update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);


-- 2. Timetable Entries
CREATE TABLE IF NOT EXISTS public.timetable (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    subject TEXT NOT NULL,
    faculty TEXT NOT NULL,
    room TEXT NOT NULL,
    day TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    color TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.timetable ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can CRUD their own timetable" ON public.timetable;
CREATE POLICY "Users can CRUD their own timetable"
    ON public.timetable FOR ALL
    USING (auth.uid() = user_id);


-- 3. Attendance Logs
CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    subject TEXT NOT NULL,
    attended INTEGER DEFAULT 0 NOT NULL,
    total INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can CRUD their own attendance" ON public.attendance;
CREATE POLICY "Users can CRUD their own attendance"
    ON public.attendance FOR ALL
    USING (auth.uid() = user_id);


-- 4. CGPA Semester Grades
CREATE TABLE IF NOT EXISTS public.cgpa (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    semester INTEGER NOT NULL,
    subject_name TEXT NOT NULL,
    credits INTEGER NOT NULL,
    grade TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.cgpa ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can CRUD their own cgpa subjects" ON public.cgpa;
CREATE POLICY "Users can CRUD their own cgpa subjects"
    ON public.cgpa FOR ALL
    USING (auth.uid() = user_id);


-- 5. Marks Predictions
CREATE TABLE IF NOT EXISTS public.predictor (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    subject TEXT NOT NULL,
    internal_score NUMERIC NOT NULL,
    internal_total NUMERIC NOT NULL,
    external_total NUMERIC NOT NULL,
    target_grade TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.predictor ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can CRUD their own predictions" ON public.predictor;
CREATE POLICY "Users can CRUD their own predictions"
    ON public.predictor FOR ALL
    USING (auth.uid() = user_id);


-- 6. Calendar Events
CREATE TABLE IF NOT EXISTS public.calendar (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    date DATE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('exam', 'deadline', 'reminder', 'holiday')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.calendar ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can CRUD their own calendar events" ON public.calendar;
CREATE POLICY "Users can CRUD their own calendar events"
    ON public.calendar FOR ALL
    USING (auth.uid() = user_id);


-- 7. Feedback Submissions
CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    message TEXT NOT NULL,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can insert their own feedback" ON public.feedback;
CREATE POLICY "Users can insert their own feedback"
    ON public.feedback FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own feedback" ON public.feedback;
CREATE POLICY "Users can view their own feedback"
    ON public.feedback FOR SELECT
    USING (auth.uid() = user_id);
