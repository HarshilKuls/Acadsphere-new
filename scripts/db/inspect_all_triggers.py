import os
import pg8000

def inspect_all():
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
        
        print("--- ALL TRIGGERS IN DATABASE ---")
        cursor.execute("""
            SELECT t.tgname, c.relname, n.nspname, pg_get_triggerdef(t.oid)
            FROM pg_trigger t
            JOIN pg_class c ON c.oid = t.tgrelid
            JOIN pg_namespace n ON n.oid = c.relnamespace
            WHERE t.tgisinternal = false;
        """)
        triggers = cursor.fetchall()
        for t in triggers:
            print(f"Trigger Name: {t[0]}\nTable: {t[2]}.{t[1]}\nDefinition: {t[3]}\n")
            
        cursor.close()
        conn.close()
    except Exception as e:
        print("Error:", e)

inspect_all()
