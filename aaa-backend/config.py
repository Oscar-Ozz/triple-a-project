# config.py
import mysql.connector

def get_connection():
    return mysql.connector.connect(
        host="127.0.0.1", 
        user="root",
        password="12345", 
        database="testdb",
        port=3306 
    )