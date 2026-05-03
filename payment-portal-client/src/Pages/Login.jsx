import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../API/axiosClient';

const PATTERNS = {
  accountNumber: /^\d{6,12}$/,
};

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ accountNumber: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!PATTERNS.accountNumber.test(form.accountNumber))
      newErrors.accountNumber = 'Must be 6–12 digits.';
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
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      navigate('/payment');
    } catch (err) {
      setServerError(err.response?.data || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>International Payments Portal</p>

        {serverError && <div style={styles.errorBox}>{serverError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Account Number</label>
            <input
              style={{ ...styles.input, ...(errors.accountNumber ? styles.inputError : {}) }}
              type="text"
              name="accountNumber"
              value={form.accountNumber}
              onChange={handleChange}
              placeholder="6–12 digit account number"
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
          Don't have an account? <Link to="/register">Register</Link>
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
    backgroundColor: '#f0f4f8',
    fontFamily: 'Segoe UI, sans-serif',
  },
  card: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '420px',
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
};

export default Login;