import os
import pg8000
import uuid

def test_insert():
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
        
        user_id = str(uuid.uuid4())
        print(f"Attempting test insert into auth.users with ID {user_id}...")
        
        # We start a transaction
        cursor.execute("BEGIN;")
        
        cursor.execute("""
            INSERT INTO auth.users (id, email, encrypted_password, aud, role, is_sso_user, is_anonymous)
            VALUES (%s, 'test_insert@example.com', 'test_password', 'authenticated', 'authenticated', false, false);
        """, [user_id])
        
        print("Insert inside transaction succeeded! Rolling back transaction...")
        cursor.execute("ROLLBACK;")
        
        cursor.close()
        conn.close()
    except Exception as e:
        print("\n--- POSTGRES ERROR CAUGHT ---")
        print(e)
        try:
            cursor.execute("ROLLBACK;")
        except:
            pass

test_insert()
