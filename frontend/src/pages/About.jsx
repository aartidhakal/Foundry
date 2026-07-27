function About() {
  return (
    <div style={styles.container}>
      <h1>About This Project</h1>
      
      <div style={styles.section}>
        <h2>Smart Manufacturing Analytics & Predictive Maintenance Platform</h2>
        <p>
          This is a full-stack web application built to solve real manufacturing challenges. 
          The platform uses machine learning to predict equipment failures before they happen, 
          enabling proactive maintenance and reducing costly downtime.
        </p>
      </div>

      <div style={styles.section}>
        <h2>Technology Stack</h2>
        <ul>
          <li><strong>Frontend:</strong> React.js with Recharts for data visualization</li>
          <li><strong>Backend:</strong> Python Flask REST API</li>
          <li><strong>Machine Learning:</strong> scikit-learn Random Forest classifier</li>
          <li><strong>Database:</strong> SQLite with real manufacturing sensor data</li>
          <li><strong>Deployment:</strong> Vercel (frontend), local Flask (backend)</li>
        </ul>
      </div>

      <div style={styles.section}>
        <h2>Features</h2>
        <ul>
          <li>Real-time sensor data visualization</li>
          <li>ML-powered equipment failure prediction</li>
          <li>Machine performance monitoring dashboard</li>
          <li>Maintenance recommendations</li>
          <li>Historical data tracking</li>
        </ul>
      </div>

      <div style={styles.section}>
        <h2>Business Impact</h2>
        <p>
          Manufacturing facilities lose millions annually to unplanned equipment downtime. 
          This platform predicts failures 5-7 days in advance, allowing strategic maintenance 
          scheduling and preventing catastrophic breakdowns.
        </p>
      </div>

      <div style={styles.section}>
        <h2>Built For</h2>
        <p>
          Ford Motor Company - Dagenham Engine Manufacturing Facility
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '30px',
    lineHeight: '1.8'
  },
  section: {
    marginBottom: '40px',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  }
};

export default About;