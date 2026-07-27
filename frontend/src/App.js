import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './Dashboard';
import AllMachines from './pages/AllMachines';
import Predictions from './pages/Predictions';
import About from './pages/About';
import Helpline from './pages/Helpline';

function App() {
  return (
    <Router>
      <nav style={navStyles}>
        <div style={logoStyles}>🏭 Manufacturing Analytics</div>
        <ul style={navLinksStyles}>
          <li><Link to="/" style={linkStyles}>Dashboard</Link></li>
          <li><Link to="/machines" style={linkStyles}>All Machines</Link></li>
          <li><Link to="/predictions" style={linkStyles}>Predictions</Link></li>
          <li><Link to="/about" style={linkStyles}>About</Link></li>
          <li><Link to="/helpline" style={linkStyles}>Helpline</Link></li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/machines" element={<AllMachines />} />
        <Route path="/predictions" element={<Predictions />} />
        <Route path="/about" element={<About />} />
        <Route path="/helpline" element={<Helpline />} />
      </Routes>
    </Router>
  );
}

const navStyles = {
  backgroundColor: '#1976d2',
  color: 'white',
  padding: '15px 30px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

const logoStyles = {
  fontSize: '24px',
  fontWeight: 'bold'
};

const navLinksStyles = {
  display: 'flex',
  listStyle: 'none',
  gap: '20px',
  margin: 0,
  padding: 0
};

const linkStyles = {
  color: 'white',
  textDecoration: 'none',
  fontSize: '16px',
  cursor: 'pointer'
};

export default App;