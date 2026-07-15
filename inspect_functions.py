import os
import pg8000

def inspect_functions():
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
        
        print("--- USER FUNCTIONS ---")
        cursor.execute("""
            SELECT p.proname, n.nspname, pg_get_functiondef(p.oid)
            FROM pg_proc p
            JOIN pg_namespace n ON n.oid = p.pronamespace
            WHERE n.nspname NOT IN ('pg_catalog', 'information_schema') 
              AND (p.proname LIKE '%user%' OR p.proname LIKE '%profile%' OR p.proname LIKE '%trigger%');
        """)
        funcs = cursor.fetchall()
        for f in funcs:
            print(f"Function: {f[1]}.{f[0]}")
            print(f"Def:\n{f[2]}\n")
            
        cursor.close()
        conn.close()
    except Exception as e:
        print("Error:", e)

inspect_functions()
