import os
import pg8000

def check_vault():
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
        
        print("--- SCHEMAS IN DATABASE ---")
        cursor.execute("SELECT schema_name FROM information_schema.schemata;")
        for s in cursor.fetchall():
            print(s[0])
            
        print("\n--- DECRYPTED SECRETS (if vault exists) ---")
        try:
            cursor.execute("SELECT * FROM vault.decrypted_secrets;")
            secrets = cursor.fetchall()
            for s in secrets:
                print(s)
        except Exception as e:
            print("Vault query failed or does not exist:", e)
            
        cursor.close()
        conn.close()
    except Exception as e:
        print("Error:", e)

check_vault()
