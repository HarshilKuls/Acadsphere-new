import os
import pg8000

def inspect_v4():
    password = os.environ["SUPABASE_DB_PASSWORD"]
    try:
        conn = pg8000.connect(
            host="db.lrtywitlsyzkzsdhsnfv.supabase.co",
            user="postgres",
            password=password,
            database="postgres",
            port=5432
        )
        cursor = conn.cursor()
        
        print("--- COLUMNS IN public.profiles ---")
        cursor.execute("""
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns
            WHERE table_schema = 'public' AND table_name = 'profiles';
        """)
        for col in cursor.fetchall():
            print(f"Col: {col[0]} | Type: {col[1]} | Nullable: {col[2]} | Default: {col[3]}")
            
        print("\n--- FOREIGN KEYS ON public.profiles ---")
        cursor.execute("""
            SELECT tc.constraint_name, kcu.column_name, ccu.table_name AS foreign_table_name, ccu.column_name AS foreign_column_name 
            FROM information_schema.table_constraints AS tc 
            JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
            JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name AND ccu.table_schema = tc.table_schema
            WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name='profiles';
        """)
        for fk in cursor.fetchall():
            print(f"Key: {fk[0]} | Col: {fk[1]} -> Ref Table: {fk[2]}.{fk[3]}")
            
        print("\n--- TRIGGERS ON public.profiles ---")
        cursor.execute("""
            SELECT tgname, pg_get_triggerdef(oid)
            FROM pg_trigger
            WHERE tgrelid = 'public.profiles'::regclass;
        """)
        for t in cursor.fetchall():
            print(f"Trigger: {t[0]}\nDef: {t[1]}\n")

        cursor.close()
        conn.close()
    except Exception as e:
        print("Error:", e)

inspect_v4()
