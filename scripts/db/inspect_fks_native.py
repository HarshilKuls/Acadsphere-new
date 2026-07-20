import os
import pg8000

def inspect_fks_native():
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
        
        print("--- FOREIGN KEYS REFERENCING auth.users (via pg_constraint) ---")
        cursor.execute("""
            SELECT 
                conname AS constraint_name,
                conrelid::regclass AS table_name,
                confrelid::regclass AS referenced_table_name,
                pg_get_constraintdef(oid) AS constraint_definition
            FROM pg_constraint
            WHERE confrelid = 'auth.users'::regclass;
        """)
        fks = cursor.fetchall()
        for fk in fks:
            print(f"Constraint: {fk[0]} | Table: {fk[1]} | Ref Table: {fk[2]}")
            print(f"Def: {fk[3]}\n")
            
        cursor.close()
        conn.close()
    except Exception as e:
        print("Error:", e)

inspect_fks_native()
