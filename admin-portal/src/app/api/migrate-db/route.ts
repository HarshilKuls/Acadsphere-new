import { NextRequest, NextResponse } from "next/server";
import { Client } from "pg";

export async function GET(request: NextRequest) {
  const client = new Client({
    host: "aws-0-us-east-1.pooler.supabase.com",
    port: 6543,
    user: "postgres.lrtywitlsyzkzsdhsnfv",
    password: "hdsk@76002200GNG!#79845423",
    database: "postgres",
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();

    const sql = `
      -- 1. Tighten e_library SELECT policy
      DROP POLICY IF EXISTS "Allow public read to e_library" ON public.e_library;
      CREATE POLICY "Allow authenticated read to e_library" ON public.e_library
        FOR SELECT USING (auth.role() = 'authenticated');

      -- 2. Tighten events SELECT policy
      DROP POLICY IF EXISTS "Allow public read to events" ON public.events;
      CREATE POLICY "Allow authenticated read to events" ON public.events
        FOR SELECT USING (auth.role() = 'authenticated');

      -- 3. Tighten internships SELECT policy
      DROP POLICY IF EXISTS "Allow public read to internships" ON public.internships;
      CREATE POLICY "Allow authenticated read to internships" ON public.internships
        FOR SELECT USING (auth.role() = 'authenticated');

      -- 4. Tighten holidays SELECT policy
      DROP POLICY IF EXISTS "Allow public read to holidays" ON public.holidays;
      CREATE POLICY "Allow authenticated read to holidays" ON public.holidays
        FOR SELECT USING (auth.role() = 'authenticated');

      -- 5. Tighten banned_users SELECT policy
      DROP POLICY IF EXISTS "Allow public read to banned_users" ON public.banned_users;
      CREATE POLICY "Allow authenticated read to banned_users" ON public.banned_users
        FOR SELECT USING (auth.role() = 'authenticated');

      -- 6. Tighten users SELECT policy
      DROP POLICY IF EXISTS "Allow public read to users" ON public.users;
      CREATE POLICY "Allow authenticated read to users" ON public.users
        FOR SELECT USING (auth.uid() = id OR public.is_admin());

      -- 7. Add feedback rate limit trigger function
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
    `;

    await client.query(sql);
    await client.end();

    return NextResponse.json({ success: true, message: "Database RLS policies tightened and rate-limiting triggers installed successfully!" });
  } catch (err: any) {
    try {
      await client.end();
    } catch {}
    return NextResponse.json({ success: false, error: err.message || err }, { status: 500 });
  }
}
