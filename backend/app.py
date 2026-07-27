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
# ML Prediction endpoint
import pickle

# Load model and scaler
try:
    with open('backend/model.pkl', 'rb') as f:
        ml_model = pickle.load(f)
    with open('backend/scaler.pkl', 'rb') as f:
        scaler = pickle.load(f)
except:
    ml_model = None
    scaler = None

@app.route('/predict', methods=['POST'])
def predict():
    if not ml_model or not scaler:
        return jsonify({'error': 'Model not loaded'}), 500
    
    data = request.json
    machine_id = data.get('machine_id')
    
    if not machine_id:
        return jsonify({'error': 'machine_id required'}), 400
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            SELECT sr.value FROM sensor_readings sr
            JOIN sensors s ON sr.sensor_id = s.id
            WHERE s.machine_id = ?
            ORDER BY sr.timestamp DESC LIMIT 7
        ''', (machine_id,))
        values = [row[0] for row in cursor.fetchall()]
        conn.close()
        
        if len(values) < 5:
            return jsonify({'prediction': 'insufficient_data', 'confidence': 0}), 200
        
        window = values[-5:]
        features = [
            np.mean(window),
            np.std(window),
            np.min(window),
            np.max(window),
            values[-1] - values[-2] if len(values) > 1 else 0,
            (values[-1] - values[-2]) - (values[-2] - values[-3]) if len(values) > 2 else 0,
            values[-1]
        ]
        
        features_scaled = scaler.transform([features])
        prediction = ml_model.predict(features_scaled)[0]
        confidence = ml_model.predict_proba(features_scaled)[0][1]
        
        return jsonify({
            'machine_id': machine_id,
            'prediction': 'high_risk' if prediction == 1 else 'low_risk',
            'confidence': float(confidence),
            'recommendation': 'Schedule maintenance within 7 days' if prediction == 1 else 'Continue normal operation'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
if __name__ == '__main__':
    app.run(debug=True, port=5000)