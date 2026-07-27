import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Predictions() {
  const [machines, setMachines] = useState([]);
  const [predictions, setPredictions] = useState({});
  const API_BASE = 'http://127.0.0.1:5000';

  useEffect(() => {
    fetchMachinesAndPredictions();
  }, []);

  const fetchMachinesAndPredictions = async () => {
    try {
      const response = await axios.get(`${API_BASE}/machines`);
      setMachines(response.data);
      
      const preds = {};
      for (let machine of response.data) {
        try {
          const predRes = await axios.post(`${API_BASE}/predict`, {
            machine_id: machine.id
          });
          preds[machine.id] = predRes.data;
        } catch (error) {
          console.error(`Error predicting for machine ${machine.id}`);
        }
      }
      setPredictions(preds);
    } catch (error) {
      console.error('Error fetching machines:', error);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Machine Predictions</h1>
      <p>ML-powered risk assessment for all equipment</p>
      
      <div style={styles.grid}>
        {machines.map(machine => {
          const pred = predictions[machine.id];
          const isHighRisk = pred?.prediction === 'high_risk';
          const color = isHighRisk ? '#d32f2f' : '#388e3c';
          
          return (
            <div key={machine.id} style={{...styles.card, borderLeftColor: color}}>
              <h3>{machine.name}</h3>
              <p><strong>Location:</strong> {machine.location}</p>
              
              {pred && (
                <>
                  <div style={{...styles.badge, backgroundColor: color}}>
                    {pred.prediction?.toUpperCase()}
                  </div>
                  <p><strong>Confidence:</strong> {(pred.confidence * 100).toFixed(1)}%</p>
                  <p><strong>Recommendation:</strong> {pred.recommendation}</p>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '30px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginTop: '20px'
  },
  card: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    borderLeft: '5px solid'
  },
  badge: {
    display: 'inline-block',
    color: 'white',
    padding: '10px 15px',
    borderRadius: '4px',
    fontWeight: 'bold',
    marginTop: '10px'
  }
};

export default Predictions;