function AuthCard({ children, badge }) {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {badge && <div style={styles.badge}>{badge}</div>}
        {children}
      </div>
    </div>
  );
}

export const authStyles = {
  title: { margin: 0, fontSize: '24px', color: '#1a1a2e' },
  subtitle: { color: '#666', marginBottom: '24px', marginTop: '4px' },
  fieldGroup: { marginBottom: '16px' },
  label: { display: 'block', marginBottom: '6px', fontWeight: '600', color: '#333' },
  input: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#ccc',
    fontSize: '14px',
    boxSizing: 'border-box',
    outline: 'none',
  },
  inputError: { borderColor: '#e53e3e' },
  errorText: { color: '#e53e3e', fontSize: '12px', marginTop: '4px', display: 'block' },
  errorBox: {
    backgroundColor: '#fff5f5',
    border: '1px solid #e53e3e',
    color: '#e53e3e',
    padding: '10px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '14px',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#1a1a2e',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '8px',
  },
  link: { textAlign: 'center', marginTop: '16px', fontSize: '14px', color: '#555' },
  anchor: { color: '#1a1a2e', fontWeight: '600' },
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a2e',
    fontFamily: 'Segoe UI, sans-serif',
  },
  card: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    width: '100%',
    maxWidth: '420px',
  },
  badge: {
    display: 'inline-block',
    backgroundColor: '#1a1a2e',
    color: '#3DBFA0',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '2px',
    padding: '4px 12px',
    borderRadius: '20px',
    marginBottom: '16px',
  },
};

export default AuthCard;