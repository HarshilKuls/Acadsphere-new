import os
import pg8000

def inspect_all_funcs():
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
        
        print("--- ALL FUNCTIONS IN public SCHEMA ---")
        cursor.execute("""
            SELECT p.proname, pg_get_functiondef(p.oid)
            FROM pg_proc p
            JOIN pg_namespace n ON n.oid = p.pronamespace
            WHERE n.nspname = 'public';
        """)
        funcs = cursor.fetchall()
        for f in funcs:
            print(f"Function: {f[0]}")
            print(f"Def:\n{f[1]}\n")
            
        cursor.close()
        conn.close()
    except Exception as e:
        print("Error:", e)

inspect_all_funcs()
