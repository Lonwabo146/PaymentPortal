import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../API/axiosClient';

const PATTERNS = {
  recipientAccount: /^\d{6,12}$/,
  swiftCode: /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/,
  currency: /^[A-Z]{3}$/,
  amount: /^\d+(\.\d{1,2})?$/,
};

function PaymentForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    amount: '',
    currency: '',
    recipientAccount: '',
    swiftCode: '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!PATTERNS.amount.test(form.amount) || parseFloat(form.amount) <= 0)
      newErrors.amount = 'Enter a valid positive amount (max 2 decimal places).';
    if (!PATTERNS.currency.test(form.currency))
      newErrors.currency = 'Must be 3 uppercase letters (e.g. USD, ZAR, EUR).';
    if (!PATTERNS.recipientAccount.test(form.recipientAccount))
      newErrors.recipientAccount = 'Must be 6–12 digits.';
    if (!PATTERNS.swiftCode.test(form.swiftCode))
      newErrors.swiftCode = 'Invalid SWIFT code (e.g. ABCDZA22 or ABCDZA22XXX).';
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
    setSuccess('');
    try {
      await axiosClient.post('/payment', {
        amount: parseFloat(form.amount),
        currency: form.currency,
        provider: 'SWIFT',
        recipientAccount: form.recipientAccount,
        swiftCode: form.swiftCode,
      });
      setSuccess('Payment submitted successfully! It will be reviewed shortly.');
      setForm({ amount: '', currency: '', recipientAccount: '', swiftCode: '' });
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
      setServerError(err.response?.data || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>New Payment</h2>
            <p style={styles.subtitle}>International Payments Portal</p>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Log Out
          </button>
        </div>

        {serverError && <div style={styles.errorBox}>{serverError}</div>}
        {success && <div style={styles.successBox}>{success}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Amount</label>
            <input
              style={{ ...styles.input, ...(errors.amount ? styles.inputError : {}) }}
              type="text"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="e.g. 1500.00"
            />
            {errors.amount && <span style={styles.errorText}>{errors.amount}</span>}
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Currency</label>
            <input
              style={{ ...styles.input, ...(errors.currency ? styles.inputError : {}) }}
              type="text"
              name="currency"
              value={form.currency}
              onChange={handleChange}
              placeholder="e.g. USD, ZAR, EUR"
              maxLength={3}
            />
            {errors.currency && <span style={styles.errorText}>{errors.currency}</span>}
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Provider</label>
            <input
              style={{ ...styles.input, ...styles.readOnly }}
              type="text"
              value="SWIFT"
              readOnly
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Recipient Account Number</label>
            <input
              style={{ ...styles.input, ...(errors.recipientAccount ? styles.inputError : {}) }}
              type="text"
              name="recipientAccount"
              value={form.recipientAccount}
              onChange={handleChange}
              placeholder="6–12 digit account number"
            />
            {errors.recipientAccount && (
              <span style={styles.errorText}>{errors.recipientAccount}</span>
            )}
          </div>

         <div style={styles.fieldGroup}>
  <label style={styles.label}>SWIFT Code</label>
  <input
    style={{ ...styles.input, ...(errors.swiftCode ? styles.inputError : {}) }}
    type="text"
    name="swiftCode"
    value={form.swiftCode}
    onChange={(e) => {
      // Auto uppercase as user types
      const upper = e.target.value.toUpperCase();
      setForm({ ...form, swiftCode: upper });
      setErrors({ ...errors, swiftCode: '' });
    }}
    placeholder="e.g. ABSAZAJJ"
    maxLength={11}
  />
  {errors.swiftCode && <span style={styles.errorText}>{errors.swiftCode}</span>}

  {/* Live format guide */}
  <div style={styles.swiftGuide}>
    <p style={styles.swiftGuideTitle}>SWIFT code format:</p>
    <div style={styles.swiftRow}>
      <span style={styles.swiftBlock}>
        {form.swiftCode.slice(0, 4) || 'AAAA'}
        <small>Bank</small>
      </span>
      <span style={styles.swiftBlock}>
        {form.swiftCode.slice(4, 6) || 'BB'}
        <small>Country</small>
      </span>
      <span style={styles.swiftBlock}>
        {form.swiftCode.slice(6, 8) || 'CC'}
        <small>Location</small>
      </span>
      <span style={{ ...styles.swiftBlock, opacity: form.swiftCode.length > 8 ? 1 : 0.4 }}>
        {form.swiftCode.slice(8, 11) || 'XXX'}
        <small>Branch (optional)</small>
      </span>
    </div>
    <p style={styles.swiftHint}>
      Example: <strong>ABSA</strong> + <strong>ZA</strong> + <strong>JJ</strong> = <strong>ABSAZAJJ</strong>
    </p>
  </div>
</div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
        </form>
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
    maxWidth: '460px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '24px',
  },
  title: { margin: 0, fontSize: '24px', color: '#1a1a2e' },
  subtitle: { color: '#666', margin: '4px 0 0' },
  logoutBtn: {
    padding: '8px 16px',
    backgroundColor: 'transparent',
    border: '1px solid #ccc',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#555',
  },
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
  readOnly: { backgroundColor: '#f5f5f5', color: '#888' },
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
  successBox: {
    backgroundColor: '#f0fff4',
    border: '1px solid #38a169',
    color: '#38a169',
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
  swiftGuide: {
    marginTop: '10px',
    backgroundColor: '#f8f9ff',
    border: '1px solid #dde',
    borderRadius: '8px',
    padding: '12px',
  },
  swiftGuideTitle: {
    fontSize: '12px',
    color: '#555',
    marginBottom: '8px',
    fontWeight: '600',
  },
  swiftRow: {
    display: 'flex',
    gap: '8px',
    marginBottom: '8px',
  },
  swiftBlock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    color: '#fff',
    borderRadius: '6px',
    padding: '6px 10px',
    fontSize: '14px',
    fontWeight: 'bold',
    minWidth: '50px',
    textAlign: 'center',
    gap: '2px',
  },
  swiftHint: {
    fontSize: '12px',
    color: '#666',
    marginTop: '4px',
  },

};

export default PaymentForm;