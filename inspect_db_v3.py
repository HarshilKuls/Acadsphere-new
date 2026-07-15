import os
import pg8000

def inspect_v3():
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
        
        print("--- ALL USER-DEFINED TRIGGERS ---")
        cursor.execute("""
            SELECT t.tgname, c.relname, n.nspname, p.proname, pg_get_triggerdef(t.oid)
            FROM pg_trigger t
            JOIN pg_class c ON c.oid = t.tgrelid
            JOIN pg_namespace n ON n.oid = c.relnamespace
            LEFT JOIN pg_proc p ON p.oid = t.tgfoid
            WHERE t.tgisinternal = false OR (t.tgname NOT LIKE 'RI_Constraint%' AND t.tgname NOT LIKE 'pg_%');
        """)
        triggers = cursor.fetchall()
        for t in triggers:
            print(f"Trigger Name: {t[0]}\nTable: {t[2]}.{t[1]}\nFunction: {t[3]}\nDefinition: {t[4]}\n")
            
        cursor.close()
        conn.close()
    except Exception as e:
        print("Error:", e)

inspect_v3()
