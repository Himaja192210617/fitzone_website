import mysql.connector

# MySQL configuration
config = {
    'user': 'root',
    'password': '',
    'host': 'localhost',
    'database': 'gym_fit_zone'
}

try:
    conn = mysql.connector.connect(**config)
    cur = conn.cursor(dictionary=True)

    # Get gym for admin
    cur.execute("SELECT * FROM gyms")
    gyms = cur.fetchall()
    
    print("GYMS IN DATABASE:")
    for g in gyms:
        print(f"ID: {g['gym_id']}, Name: {g['gym_name']}, Phone: {g['phone']}, Email: {g['email']}, Address: {g['address']}")

    cur.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")
