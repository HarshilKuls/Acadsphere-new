import os
import pg8000

def inspect_fks():
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
        
        print("--- FOREIGN KEYS REFERENCING auth.users ---")
        cursor.execute("""
            SELECT 
                tc.table_schema, 
                tc.table_name, 
                kcu.column_name, 
                ccu.table_schema AS foreign_schema,
                ccu.table_name AS foreign_table, 
                ccu.column_name AS foreign_column
            FROM information_schema.table_constraints AS tc 
            JOIN information_schema.key_column_usage AS kcu 
                ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
            JOIN information_schema.constraint_column_usage AS ccu 
                ON ccu.constraint_name = tc.constraint_name AND ccu.table_schema = tc.table_schema
            WHERE tc.constraint_type = 'FOREIGN KEY' 
              AND ccu.table_schema = 'auth' AND ccu.table_name = 'users';
        """)
        fks = cursor.fetchall()
        for fk in fks:
            print(f"Table: {fk[0]}.{fk[1]} (Col: {fk[2]}) -> References: {fk[3]}.{fk[4]}({fk[5]})")
            
        cursor.close()
        conn.close()
    except Exception as e:
        print("Error:", e)

inspect_fks()
