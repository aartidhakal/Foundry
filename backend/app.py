from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)

DATABASE = 'manufacturing_data.db'

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

# Routes
@app.route('/machines', methods=['GET'])
def get_machines():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM machines')
    machines = cursor.fetchall()
    conn.close()
    return jsonify([dict(m) for m in machines])

@app.route('/readings', methods=['GET'])
def get_readings():
    machine_id = request.args.get('machine_id')
    conn = get_db_connection()
    cursor = conn.cursor()
    
    if machine_id:
        cursor.execute('''
            SELECT sr.* FROM sensor_readings sr
            JOIN sensors s ON sr.sensor_id = s.id
            WHERE s.machine_id = ?
            ORDER BY sr.timestamp DESC LIMIT 100
        ''', (machine_id,))
    else:
        cursor.execute('SELECT * FROM sensor_readings ORDER BY timestamp DESC LIMIT 1000')
    
    readings = cursor.fetchall()
    conn.close()
    return jsonify([dict(r) for r in readings])

@app.route('/maintenance', methods=['GET'])
def get_maintenance():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM maintenance_logs ORDER BY timestamp DESC')
    logs = cursor.fetchall()
    conn.close()
    return jsonify([dict(l) for l in logs])

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

if __name__ == '__main__':
    app.run(debug=True, port=5000)