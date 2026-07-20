import os
import pg8000

def inspect_auth_users():
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
        
        print("--- COLUMNS IN auth.users ---")
        cursor.execute("""
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns
            WHERE table_schema = 'auth' AND table_name = 'users';
        """)
        for col in cursor.fetchall():
            print(f"Col: {col[0]} | Type: {col[1]} | Nullable: {col[2]} | Default: {col[3]}")
            
        cursor.close()
        conn.close()
    except Exception as e:
        print("Error:", e)

inspect_auth_users()
