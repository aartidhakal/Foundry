import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AllMachines() {
  const [machines, setMachines] = useState([]);
  const API_BASE = 'http://127.0.0.1:5000';

  const machineImages = {
  1: 'https://i.ibb.co/rRbfFCFR/Gemini-Generated-Image-vyh2jtvyh2jtvyh2.png',
  2: 'https://i.ibb.co/mVwdbSM2/Gemini-Generated-Image-xy56jaxy56jaxy56.png',
  3: 'https://i.ibb.co/0j6Dpznr/Gemini-Generated-Image-gzlcxxgzlcxxgzlc.png',
  4: 'https://i.ibb.co/F4G4BzPp/Gemini-Generated-Image-56k8xy56k8xy56k8.png',
  5: 'https://i.ibb.co/cS1Qm6J7/Gemini-Generated-Image-ma0ix0ma0ix0ma0i.png',
};

  useEffect(() => {
    fetchMachines();
  }, []);

  const fetchMachines = async () => {
    try {
      const response = await axios.get(`${API_BASE}/machines`);
      setMachines(response.data);
    } catch (error) {
      console.error('Error fetching machines:', error);
    }
  };

  return (
    <div style={styles.container}>
      <h1>All Machines</h1>
      <p style={styles.subtitle}>Complete equipment inventory</p>
      <div style={styles.grid}>
        {machines.map(machine => (
          <div key={machine.id} style={styles.card}>
            <img 
              src={machineImages[machine.id] || 'https://via.placeholder.com/400x300'} 
              alt={machine.name}
              style={styles.image}
            />
            <div style={styles.cardContent}>
              <h3>{machine.name}</h3>
              <p><strong>Type:</strong> {machine.type}</p>
              <p><strong>Location:</strong> {machine.location}</p>
              <p style={{...styles.status, color: machine.status === 'Operational' ? '#388e3c' : '#d32f2f'}}>
                <strong>Status:</strong> {machine.status}
              </p>
            </div>
          </div>
        ))}
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
  subtitle: {
    color: '#666',
    fontSize: '16px',
    marginBottom: '30px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s',
    cursor: 'pointer'
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover'
  },
  cardContent: {
    padding: '20px'
  },
  status: {
    marginTop: '10px'
  }
};

export default AllMachines;