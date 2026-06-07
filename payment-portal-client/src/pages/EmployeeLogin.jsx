import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import AuthCard, { authStyles } from '../components/AuthCard';

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
      newErrors.accountNumber = 'Format: EMP followed by 3 digits (e.g. EMP001)';
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
    <AuthCard badge="EMPLOYEE PORTAL">
      <h2 style={authStyles.title}>Staff Login</h2>
      <p style={authStyles.subtitle}>International Payments — Internal System</p>

      {serverError && <div style={authStyles.errorBox}>{serverError}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div style={authStyles.fieldGroup}>
          <label style={authStyles.label}>Employee Account Number</label>
          <input
            style={{ ...authStyles.input, ...(errors.accountNumber ? authStyles.inputError : {}) }}
            type="text"
            name="accountNumber"
            value={form.accountNumber}
            onChange={handleChange}
            placeholder="e.g. EMP001"
            autoComplete="off"
          />
          {errors.accountNumber && (
            <span style={authStyles.errorText}>{errors.accountNumber}</span>
          )}
        </div>

        <div style={authStyles.fieldGroup}>
          <label style={authStyles.label}>Password</label>
          <input
            style={{ ...authStyles.input, ...(errors.password ? authStyles.inputError : {}) }}
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Your password"
          />
          {errors.password && (
            <span style={authStyles.errorText}>{errors.password}</span>
          )}
        </div>

        <button type="submit" style={authStyles.button} disabled={loading}>
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>

      <p style={authStyles.link}>
        Customer portal? <a href="/login" style={authStyles.anchor}>Click here</a>
      </p>
    </AuthCard>
  );
}

export default EmployeeLogin;