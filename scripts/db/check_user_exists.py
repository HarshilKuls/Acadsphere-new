import os
import pg8000

def check_users():
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
        
        print("--- RECENT USERS IN auth.users ---")
        cursor.execute("""
            SELECT id, email, created_at, email_confirmed_at
            FROM auth.users
            ORDER BY created_at DESC
            LIMIT 10;
        """)
        users = cursor.fetchall()
        for u in users:
            print(f"ID: {u[0]} | Email: {u[1]} | Created: {u[2]} | Confirmed: {u[3]}")
            
        cursor.close()
        conn.close()
    except Exception as e:
        print("Error:", e)

check_users()
