CREATE TABLE IF NOT EXISTS public.unauthenticated_checks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    feature TEXT NOT NULL,
    blog_slug TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE public.unauthenticated_checks ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (unauthenticated usage tracking)
CREATE POLICY "Allow anonymous inserts for analytics" 
ON public.unauthenticated_checks 
FOR INSERT 
TO public, anon 
WITH CHECK (true);

-- Allow admins to read analytics
CREATE POLICY "Allow admins to read analytics" 
ON public.unauthenticated_checks 
FOR SELECT 
TO authenticated 
USING (
    auth.email() IN (SELECT email FROM public.admins)
);
