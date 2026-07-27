import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Dashboard() {
  const [machines, setMachines] = useState([]);
  const [selectedMachine, setSelectedMachine] = useState(1);
  const [readings, setReadings] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_BASE = 'http://127.0.0.1:5000';

  useEffect(() => {
    fetchMachines();
  }, []);

  useEffect(() => {
    if (selectedMachine) {
      fetchReadings();
      getPrediction();
    }
  }, [selectedMachine]);

  const fetchMachines = async () => {
    try {
      const response = await axios.get(`${API_BASE}/machines`);
      setMachines(response.data);
      if (response.data.length > 0) {
        setSelectedMachine(response.data[0].id);
      }
    } catch (error) {
      console.error('Error fetching machines:', error);
    }
  };

  const fetchReadings = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/readings`, {
        params: { machine_id: selectedMachine }
      });
      setReadings(response.data.slice(0, 50));
    } catch (error) {
      console.error('Error fetching readings:', error);
    }
    setLoading(false);
  };

  const getPrediction = async () => {
    try {
      const response = await axios.post(`${API_BASE}/predict`, {
        machine_id: selectedMachine
      });
      setPrediction(response.data);
    } catch (error) {
      console.error('Error getting prediction:', error);
    }
  };

  const selectedMachineData = machines.find(m => m.id === selectedMachine);
  const predictionColor = prediction?.prediction === 'high_risk' ? '#d32f2f' : '#388e3c';

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>🏭 Manufacturing Analytics Dashboard</h1>
        <p>Predictive Maintenance Platform</p>
      </header>

      <div style={styles.bannerStyles}>
        <img 
          src="https://i.ibb.co/Qv9KSwrH/Chat-GPT-Image-Jul-27-2026-10-47-56-PM.png" 
          alt="Banner" 
          style={styles.bannerImageStyles}
        />
      </div>

      <div style={styles.content}>
        <div style={styles.selectorSection}>
          <label style={styles.label}>Select Machine:</label>
          <select 
            value={selectedMachine} 
            onChange={(e) => setSelectedMachine(parseInt(e.target.value))}
            style={styles.select}
          >
            {machines.map(machine => (
              <option key={machine.id} value={machine.id}>
                {machine.name} - {machine.location}
              </option>
            ))}
          </select>
        </div>

        {selectedMachineData && (
          <div style={styles.machineInfo}>
            <h2>{selectedMachineData.name}</h2>
            <p><strong>Type:</strong> {selectedMachineData.type}</p>
            <p><strong>Location:</strong> {selectedMachineData.location}</p>
            <p><strong>Status:</strong> {selectedMachineData.status}</p>
          </div>
        )}

        {prediction && (
          <div style={{...styles.predictionCard, borderLeftColor: predictionColor}}>
            <h3>ML Prediction</h3>
            <div style={{...styles.predictionBadge, backgroundColor: predictionColor}}>
              {prediction.prediction?.toUpperCase()}
            </div>
            <p><strong>Confidence:</strong> {(prediction.confidence * 100).toFixed(1)}%</p>
            <p><strong>Recommendation:</strong> {prediction.recommendation}</p>
          </div>
        )}

        {readings.length > 0 && !loading && (
          <div style={styles.chartSection}>
            <h3>Sensor Readings Chart</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={readings.slice().reverse()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#1f77b4" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {loading && <p>Loading...</p>}

        {readings.length > 0 && (
          <div style={styles.tableSection}>
            <h3>Latest Readings</h3>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {readings.slice(0, 10).map((reading, idx) => (
                  <tr key={idx}>
                    <td>{new Date(reading.timestamp).toLocaleString()}</td>
                    <td>{reading.value.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    minHeight: '100vh',
    padding: '20px'
  },
  header: {
    background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
    color: 'white',
    padding: '40px',
    borderRadius: '12px',
    marginBottom: '30px',
    textAlign: 'center',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  },
  bannerStyles: {
    width: '100%',
    height: 'auto',
    marginBottom: '20px'
  },
  bannerImageStyles: {
    width: '100%',
    height: 'auto',
    display: 'block',
    borderRadius: '8px'
  },
  content: {
    maxWidth: '1400px',
    margin: '0 auto'
  },
  selectorSection: {
    background: 'white',
    padding: '25px',
    borderRadius: '12px',
    marginBottom: '25px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
    border: '1px solid #e0e0e0'
  },
  label: {
    display: 'block',
    marginBottom: '12px',
    fontWeight: '600',
    color: '#333',
    fontSize: '16px'
  },
  select: {
    width: '100%',
    padding: '12px 15px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '2px solid #e0e0e0',
    backgroundColor: '#f9f9f9',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  machineInfo: {
    background: 'white',
    padding: '25px',
    borderRadius: '12px',
    marginBottom: '25px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
    borderLeft: '5px solid #1976d2'
  },
  predictionCard: {
    background: 'white',
    padding: '25px',
    borderRadius: '12px',
    marginBottom: '25px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
    borderLeft: '5px solid'
  },
  predictionBadge: {
    display: 'inline-block',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    fontWeight: 'bold',
    marginBottom: '15px',
    fontSize: '18px',
    letterSpacing: '0.5px'
  },
  chartSection: {
    background: 'white',
    padding: '25px',
    borderRadius: '12px',
    marginBottom: '25px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)'
  },
  tableSection: {
    background: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '15px'
  }
};

export default Dashboard;