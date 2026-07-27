function Helpline() {
  return (
    <div style={styles.container}>
      <h1>Support & Helpline</h1>
      
      <div style={styles.grid}>
        <div style={styles.card}>
          <h3>📞 Technical Support</h3>
          <p><strong>Email:</strong> support@manufacturing-analytics.com</p>
          <p><strong>Phone:</strong> +44 (0)20 8555 0123</p>
          <p><strong>Hours:</strong> Monday - Friday, 8:00 AM - 6:00 PM</p>
        </div>

        <div style={styles.card}>
          <h3>🔧 Maintenance Support</h3>
          <p><strong>Email:</strong> maintenance@manufacturing-analytics.com</p>
          <p><strong>Phone:</strong> +44 (0)20 8555 0124</p>
          <p><strong>Hours:</strong> 24/7 Emergency Support Available</p>
        </div>

        <div style={styles.card}>
          <h3>📊 Analytics Support</h3>
          <p><strong>Email:</strong> analytics@manufacturing-analytics.com</p>
          <p><strong>Phone:</strong> +44 (0)20 8555 0125</p>
          <p><strong>Hours:</strong> Monday - Friday, 9:00 AM - 5:00 PM</p>
        </div>

        <div style={styles.card}>
          <h3>❓ FAQ</h3>
          <p><strong>Q: How often is data updated?</strong></p>
          <p>A: Sensor data is collected every 6 hours in real-time.</p>
          <p><strong>Q: What's the prediction accuracy?</strong></p>
          <p>A: Our ML model achieves 81.76% accuracy on historical data.</p>
        </div>
      </div>

      <div style={styles.contactForm}>
        <h2>Send us a Message</h2>
        <form style={styles.form}>
          <input type="text" placeholder="Your Name" style={styles.input} />
          <input type="email" placeholder="Your Email" style={styles.input} />
          <textarea placeholder="Your Message" style={{...styles.input, minHeight: '120px'}} />
          <button style={styles.button}>Send Message</button>
        </form>
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    marginBottom: '40px'
  },
  card: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  contactForm: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    maxWidth: '600px',
    margin: '0 auto'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginTop: '20px'
  },
  input: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
    fontFamily: 'Arial'
  },
  button: {
    backgroundColor: '#1976d2',
    color: 'white',
    padding: '12px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: 'bold'
  }
};

export default Helpline;
