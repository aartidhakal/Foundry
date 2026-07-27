import sqlite3
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
import pickle
import json
from datetime import datetime, timedelta

DATABASE = 'manufacturing_data.db'

# Load data from database
def load_data():
    conn = sqlite3.connect(DATABASE)
    query = '''
    SELECT sr.sensor_id, sr.value, sr.timestamp, s.sensor_type, s.machine_id
    FROM sensor_readings sr
    JOIN sensors s ON sr.sensor_id = s.id
    ORDER BY sr.timestamp
    '''
    df = pd.read_sql_query(query, conn)
    conn.close()
    return df

# Create features for ML
def create_features(df):
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df = df.sort_values('timestamp')
    
    features_list = []
    
    for machine_id in df['machine_id'].unique():
        machine_data = df[df['machine_id'] == machine_id].copy()
        
        for sensor_type in machine_data['sensor_type'].unique():
            sensor_data = machine_data[machine_data['sensor_type'] == sensor_type].copy()
            sensor_data = sensor_data.sort_values('timestamp')
            values = sensor_data['value'].values
            
            if len(values) < 5:
                continue
            
            # Calculate features from sensor values
            for i in range(5, len(values)):
                window = values[max(0, i-5):i]
                
                feature_dict = {
                    'machine_id': machine_id,
                    'sensor_type': sensor_type,
                    'mean': np.mean(window),
                    'std': np.std(window),
                    'min': np.min(window),
                    'max': np.max(window),
                    'trend': values[i] - values[i-1],
                    'acceleration': (values[i] - values[i-1]) - (values[i-1] - values[i-2]) if i >= 2 else 0,
                    'current_value': values[i]
                }
                features_list.append(feature_dict)
    
    features_df = pd.DataFrame(features_list)
    return features_df

# Create target variable (failure prediction)
def create_targets(df, features_df):
    conn = sqlite3.connect(DATABASE)
    query = 'SELECT machine_id, timestamp FROM maintenance_logs WHERE type = "Corrective"'
    maintenance = pd.read_sql_query(query, conn)
    conn.close()
    
    maintenance['timestamp'] = pd.to_datetime(maintenance['timestamp'])
    
    # Mark machines that had failures
    failure_machines = set(maintenance['machine_id'].unique())
    
    features_df['failure_risk'] = features_df['machine_id'].isin(failure_machines).astype(int)
    
    return features_df

# Train ML model
def train_model(features_df):
    if len(features_df) < 10:
        print("⚠️ Not enough data to train model")
        return None, None, None
    
    # Prepare data
    X = features_df[['mean', 'std', 'min', 'max', 'trend', 'acceleration', 'current_value']]
    y = features_df['failure_risk']
    
    # Handle missing values
    X = X.fillna(0)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train model
    model = RandomForestClassifier(n_estimators=50, max_depth=10, random_state=42)
    model.fit(X_train_scaled, y_train)
    
    # Predictions
    y_pred = model.predict(X_test_scaled)
    
    # Metrics
    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred, zero_division=0)
    recall = recall_score(y_test, y_pred, zero_division=0)
    f1 = f1_score(y_test, y_pred, zero_division=0)
    
    print("=" * 50)
    print("✅ ML MODEL TRAINING COMPLETE")
    print("=" * 50)
    print(f"Accuracy:  {accuracy:.2%}")
    print(f"Precision: {precision:.2%}")
    print(f"Recall:    {recall:.2%}")
    print(f"F1 Score:  {f1:.2%}")
    print("=" * 50)
    
    return model, scaler, {'accuracy': accuracy, 'precision': precision, 'recall': recall, 'f1': f1}

# Save model
def save_model(model, scaler):
    with open('backend/model.pkl', 'wb') as f:
        pickle.dump(model, f)
    with open('backend/scaler.pkl', 'wb') as f:
        pickle.dump(scaler, f)
    print("✅ Model saved!")

# Main
if __name__ == '__main__':
    print("📊 Loading data...")
    df = load_data()
    print(f"✅ Loaded {len(df)} sensor readings")
    
    print("🔧 Creating features...")
    features_df = create_features(df)
    print(f"✅ Created {len(features_df)} feature vectors")
    
    print("🎯 Creating targets...")
    features_df = create_targets(df, features_df)
    
    print("🤖 Training model...")
    model, scaler, metrics = train_model(features_df)
    
    if model:
        save_model(model, scaler)
        print("\n✅ ML PIPELINE COMPLETE!")