import mysql.connector

def get_connection():
    return mysql.connector.connect(
        host="db-server",      
        user="root",
        password="rootpassword", 
        database="inventario_db",
        port=3306 
    )