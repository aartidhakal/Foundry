import sqlite3
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random

# Create database
conn = sqlite3.connect('manufacturing_data.db')
cursor = conn.cursor()

# Create tables
cursor.execute('''
CREATE TABLE IF NOT EXISTS machines (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT,
    type TEXT,
    status TEXT
)
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS sensors (
    id INTEGER PRIMARY KEY,
    machine_id INTEGER,
    sensor_type TEXT,
    unit TEXT,
    FOREIGN KEY(machine_id) REFERENCES machines(id)
)
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS sensor_readings (
    id INTEGER PRIMARY KEY,
    sensor_id INTEGER,
    timestamp TEXT,
    value REAL,
    FOREIGN KEY(sensor_id) REFERENCES sensors(id)
)
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS maintenance_logs (
    id INTEGER PRIMARY KEY,
    machine_id INTEGER,
    timestamp TEXT,
    type TEXT,
    description TEXT,
    FOREIGN KEY(machine_id) REFERENCES machines(id)
)
''')

# Insert machines
machines = [
    ('Engine Block Press', 'Dagenham - Line A', 'Hydraulic Press', 'Operational'),
    ('Conveyor Belt Assembly', 'Dagenham - Line B', 'Conveyor', 'Operational'),
    ('Robotic Welder', 'Dagenham - Line C', 'Robot', 'Operational'),
    ('Quality Scanner', 'Dagenham - Inspection', 'Optical', 'Operational'),
    ('Hydraulic Pump', 'Dagenham - Support', 'Pump', 'Operational'),
]

for machine in machines:
    cursor.execute('INSERT INTO machines (name, location, type, status) VALUES (?, ?, ?, ?)', machine)

# Insert sensors
sensor_types = [
    ('temperature', '°C'),
    ('vibration', 'mm/s'),
    ('pressure', 'PSI'),
    ('rpm', 'RPM'),
]

for machine_id in range(1, 6):
    for sensor_type, unit in sensor_types:
        cursor.execute('INSERT INTO sensors (machine_id, sensor_type, unit) VALUES (?, ?, ?)',
                      (machine_id, sensor_type, unit))

# Generate readings
base_date = datetime(2026, 6, 1)
readings = []

for sensor_id in range(1, 21):
    machine_id = (sensor_id - 1) // 4 + 1
    sensor_type = sensor_types[(sensor_id - 1) % 4][0]
    
    for day in range(30):
        for hour in [6, 12, 18]:
            timestamp = base_date + timedelta(days=day, hours=hour)
            
            if sensor_type == 'temperature':
                value = 75 + random.gauss(0, 3) + (day * 0.5)
            elif sensor_type == 'vibration':
                value = 0.5 + random.gauss(0, 0.05) + (day * 0.01)
            elif sensor_type == 'pressure':
                value = 100 + random.gauss(0, 3) + (day * 0.3)
            else:
                value = 3000 + random.gauss(0, 50)
            
            readings.append({
                'sensor_id': sensor_id,
                'timestamp': timestamp.isoformat(),
                'value': value
            })

# Insert readings
df_readings = pd.DataFrame(readings)
df_readings.to_sql('sensor_readings', conn, if_exists='append', index=False)

# Maintenance logs
maintenance = [
    (1, '2026-06-05T08:00:00', 'Preventive', 'Oil change'),
    (2, '2026-06-10T10:00:00', 'Corrective', 'Belt adjustment'),
]

for log in maintenance:
    cursor.execute('INSERT INTO maintenance_logs (machine_id, timestamp, type, description) VALUES (?, ?, ?, ?)', log)

conn.commit()
print('✅ Database created successfully!')
conn.close()