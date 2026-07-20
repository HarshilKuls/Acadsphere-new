import os
import pg8000

def run_migrations():
    password = os.environ["SUPABASE_DB_PASSWORD"]
    try:
        conn = pg8000.connect(
            host="db.lrtywitlsyzkzsdhsnfv.supabase.co",
            user="postgres",
            password=password,
            database="postgres",
            port=5432
        )
        conn.autocommit = True
        cursor = conn.cursor()
        
        print("Reading schema.sql...")
        with open(r"c:\Akaash\Acadsphere\schema.sql", "r", encoding="utf-8") as f:
            sql_script = f.read()
            
        print("Executing schema.sql on Supabase PostgreSQL...")
        
        # Split by semicolon, but be careful with functions/triggers that contain semicolons.
        # Since pg8000 allows executing multiple statements in one call or we can execute the whole script:
        # pg8000 cursor.execute can run multiple SQL statements separated by semicolons if they are passed as a single string.
        cursor.execute(sql_script)
        print("schema.sql executed successfully!")
        
        # Let's list the tables in public again to verify!
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public';
        """)
        tables = cursor.fetchall()
        print("\n--- NEW TABLES IN public SCHEMA ---")
        for t in tables:
            print(t[0])
            
        cursor.close()
        conn.close()
    except Exception as e:
        print("Error executing migrations:", e)

run_migrations()
