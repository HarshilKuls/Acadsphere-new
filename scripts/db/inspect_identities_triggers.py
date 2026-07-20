import os
import pg8000

def inspect_identities():
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
        
        print("--- TRIGGERS ON auth.identities ---")
        cursor.execute("""
            SELECT t.tgname, c.relname, p.proname, pg_get_triggerdef(t.oid)
            FROM pg_trigger t
            JOIN pg_class c ON c.oid = t.tgrelid
            JOIN pg_namespace n ON n.oid = c.relnamespace
            LEFT JOIN pg_proc p ON p.oid = t.tgfoid
            WHERE n.nspname = 'auth' AND c.relname = 'identities';
        """)
        triggers = cursor.fetchall()
        for t in triggers:
            print(f"Trigger Name: {t[0]}\nTable: auth.{t[1]}\nFunction: {t[2]}\nDefinition: {t[3]}\n")
            
        cursor.close()
        conn.close()
    except Exception as e:
        print("Error:", e)

inspect_identities()
