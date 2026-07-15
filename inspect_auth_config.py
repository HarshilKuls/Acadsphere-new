import os
import pg8000

def check_auth_config():
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
        
        print("--- TABLES IN auth SCHEMA ---")
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'auth';
        """)
        tables = cursor.fetchall()
        for t in tables:
            print(t[0])
            
        cursor.close()
        conn.close()
    except Exception as e:
        print("Error:", e)

check_auth_config()
