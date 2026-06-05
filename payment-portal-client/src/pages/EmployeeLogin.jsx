import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const PATTERNS = {
  accountNumber: /^EMP\d{3}$/,
};

function EmployeeLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ accountNumber: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!PATTERNS.accountNumber.test(form.accountNumber))
      newErrors.accountNumber = 'Employee account number format: EMP followed by 3 digits (e.g. EMP001)';
    if (!form.password)
      newErrors.password = 'Password is required.';
    return newErrors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setServerError('');
    try {
      const res = await axiosClient.post('/auth/login', form);

      if (res.data.role !== 'Employee') {
        setServerError('Access denied. This portal is for employees only.');
        return;
      }

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      navigate('/employee/dashboard');
    } catch (err) {
      setServerError(err.response?.data || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.badge}>EMPLOYEE PORTAL</div>
        <h2 style={styles.title}>Staff Login</h2>
        <p style={styles.subtitle}>International Payments — Internal System</p>

        {serverError && <div style={styles.errorBox}>{serverError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Employee Account Number</label>
            <input
              style={{ ...styles.input, ...(errors.accountNumber ? styles.inputError : {}) }}
              type="text"
              name="accountNumber"
              value={form.accountNumber}
              onChange={handleChange}
              placeholder="e.g. EMP001"
              autoComplete="off"
            />
            {errors.accountNumber && (
              <span style={styles.errorText}>{errors.accountNumber}</span>
            )}
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Password</label>
            <input
              style={{ ...styles.input, ...(errors.password ? styles.inputError : {}) }}
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Your password"
            />
            {errors.password && (
              <span style={styles.errorText}>{errors.password}</span>
            )}
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p style={styles.link}>
          Customer portal? <a href="/login" style={styles.anchor}>Click here</a>
        </p>
      </div>
    </div>
  );
}

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

export default EmployeeLogin;