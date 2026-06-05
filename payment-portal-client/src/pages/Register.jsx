import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const PATTERNS = {
  fullName: /^[a-zA-Z\s]{2,100}$/,
  idNumber: /^\d{13}$/,
  accountNumber: /^\d{6,12}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
};

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    idNumber: '',
    accountNumber: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!PATTERNS.fullName.test(form.fullName))
      newErrors.fullName = 'Only letters and spaces, 2–100 characters.';
    if (!PATTERNS.idNumber.test(form.idNumber))
      newErrors.idNumber = 'Must be exactly 13 digits.';
    if (!PATTERNS.accountNumber.test(form.accountNumber))
      newErrors.accountNumber = 'Must be 6–12 digits.';
    if (!PATTERNS.password.test(form.password))
      newErrors.password = 'Min 8 chars, must include uppercase, lowercase, number and special character.';
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
      await axiosClient.post('/auth/register', form);
      navigate('/login');
    } catch (err) {
      setServerError(err.response?.data || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>International Payments Portal</p>

        {serverError && <div style={styles.errorBox}>{serverError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <Field
            label="Full Name"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            error={errors.fullName}
            placeholder="John Smith"
          />
          <Field
            label="ID Number"
            name="idNumber"
            value={form.idNumber}
            onChange={handleChange}
            error={errors.idNumber}
            placeholder="13-digit SA ID number"
          />
          <Field
            label="Account Number"
            name="accountNumber"
            value={form.accountNumber}
            onChange={handleChange}
            error={errors.accountNumber}
            placeholder="6–12 digit account number"
          />
          <Field
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="Min 8 chars, upper, lower, number, symbol"
          />

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p style={styles.link}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, name, value, onChange, error, type = 'text', placeholder }) {
  return (
    <div style={styles.fieldGroup}>
      <label style={styles.label}>{label}</label>
      <input
        style={{ ...styles.input, ...(error ? styles.inputError : {}) }}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="off"
      />
      {error && <span style={styles.errorText}>{error}</span>}
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

export default Register;