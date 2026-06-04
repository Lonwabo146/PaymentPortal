import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

function EmployeeDashboard() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axiosClient.get('/payment');
      setPayments(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.clear();
        navigate('/employee/login');
      }
      setError('Failed to load payments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id) => {
    setActionLoading(id + '-verify');
    setSuccessMessage('');
    try {
      await axiosClient.patch(`/payment/${id}/verify`);
      setSuccessMessage(`Payment #${id} verified successfully.`);
      fetchPayments();
    } catch (err) {
      setError(err.response?.data || 'Failed to verify payment.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSubmitToSwift = async (id) => {
    setActionLoading(id + '-submit');
    setSuccessMessage('');
    try {
      await axiosClient.patch(`/payment/${id}/submit`);
      setSuccessMessage(`Payment #${id} submitted to SWIFT successfully.`);
      fetchPayments();
    } catch (err) {
      setError(err.response?.data || 'Failed to submit payment.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/employee/login');
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Pending': return styles.statusPending;
      case 'Verified': return styles.statusVerified;
      case 'Submitted': return styles.statusSubmitted;
      default: return {};
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.badge}>EMPLOYEE PORTAL</div>
          <h1 style={styles.title}>Payments Dashboard</h1>
          <p style={styles.subtitle}>Review, verify and submit international payments to SWIFT</p>
        </div>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Log Out
        </button>
      </div>

      {/* Messages */}
      {error && <div style={styles.errorBox}>{error}</div>}
      {successMessage && <div style={styles.successBox}>{successMessage}</div>}

      {/* Stats bar */}
      <div style={styles.statsBar}>
        <div style={styles.statCard}>
          <span style={styles.statNumber}>
            {payments.filter(p => p.status === 'Pending').length}
          </span>
          <span style={styles.statLabel}>Pending</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statNumber}>
            {payments.filter(p => p.status === 'Verified').length}
          </span>
          <span style={styles.statLabel}>Verified</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statNumber}>{payments.length}</span>
          <span style={styles.statLabel}>Total</span>
        </div>
        <button onClick={fetchPayments} style={styles.refreshBtn}>
          Refresh
        </button>
      </div>

      {/* Payments list */}
      {loading ? (
        <div style={styles.loadingBox}>Loading payments...</div>
      ) : payments.length === 0 ? (
        <div style={styles.emptyBox}>No pending payments at this time.</div>
      ) : (
        <div style={styles.paymentsList}>
          {payments.map(payment => (
            <div key={payment.id} style={styles.paymentCard}>

              {/* Card header */}
              <div style={styles.cardHeader}>
                <div>
                  <span style={styles.paymentId}>Payment #{payment.id}</span>
                  <span style={{ ...styles.statusBadge, ...getStatusStyle(payment.status) }}>
                    {payment.status}
                  </span>
                </div>
                <span style={styles.dateText}>
                  {new Date(payment.createdAt).toLocaleDateString('en-ZA', {
                    day: '2-digit', month: 'short', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                  })}
                </span>
              </div>

              {/* Payment details grid */}
              <div style={styles.detailsGrid}>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Customer</span>
                  <span style={styles.detailValue}>{payment.customerName}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Customer Account</span>
                  <span style={styles.detailValue}>{payment.customerAccount}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Amount</span>
                  <span style={{ ...styles.detailValue, ...styles.amountText }}>
                    {payment.currency} {parseFloat(payment.amount).toFixed(2)}
                  </span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Provider</span>
                  <span style={styles.detailValue}>{payment.provider}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Recipient Account</span>
                  <span style={styles.detailValue}>{payment.recipientAccount}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>SWIFT Code</span>
                  <span style={{ ...styles.detailValue, ...styles.swiftText }}>
                    {payment.swiftCode}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div style={styles.actionsRow}>
                {payment.status === 'Pending' && (
                  <button
                    style={styles.verifyBtn}
                    onClick={() => handleVerify(payment.id)}
                    disabled={actionLoading === payment.id + '-verify'}
                  >
                    {actionLoading === payment.id + '-verify'
                      ? 'Verifying...'
                      : 'Verify Payment'}
                  </button>
                )}
                {payment.status === 'Verified' && (
                  <button
                    style={styles.submitBtn}
                    onClick={() => handleSubmitToSwift(payment.id)}
                    disabled={actionLoading === payment.id + '-submit'}
                  >
                    {actionLoading === payment.id + '-submit'
                      ? 'Submitting...'
                      : 'Submit to SWIFT'}
                  </button>
                )}
                {payment.status === 'Submitted' && (
                  <span style={styles.completedText}>
                    Submitted to SWIFT
                  </span>
                )}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f0f4f8',
    fontFamily: 'Segoe UI, sans-serif',
    padding: '32px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '24px',
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
    marginBottom: '8px',
  },
  title: { margin: 0, fontSize: '28px', color: '#1a1a2e' },
  subtitle: { color: '#666', marginTop: '4px' },
  logoutBtn: {
    padding: '10px 20px',
    backgroundColor: 'transparent',
    border: '1px solid #ccc',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#555',
  },
  statsBar: {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px',
    alignItems: 'center',
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '16px 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    minWidth: '100px',
  },
  statNumber: { fontSize: '28px', fontWeight: '700', color: '#1a1a2e' },
  statLabel: { fontSize: '12px', color: '#888', marginTop: '4px' },
  refreshBtn: {
    marginLeft: 'auto',
    padding: '10px 20px',
    backgroundColor: '#1a1a2e',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  errorBox: {
    backgroundColor: '#fff5f5',
    border: '1px solid #e53e3e',
    color: '#e53e3e',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '14px',
  },
  successBox: {
    backgroundColor: '#f0fff4',
    border: '1px solid #38a169',
    color: '#38a169',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '14px',
  },
  loadingBox: {
    textAlign: 'center',
    padding: '60px',
    color: '#888',
    fontSize: '16px',
  },
  emptyBox: {
    textAlign: 'center',
    padding: '60px',
    color: '#888',
    fontSize: '16px',
    backgroundColor: '#fff',
    borderRadius: '12px',
  },
  paymentsList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  paymentCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    paddingBottom: '16px',
    borderBottom: '1px solid #f0f0f0',
  },
  paymentId: { fontSize: '16px', fontWeight: '700', color: '#1a1a2e', marginRight: '12px' },
  statusBadge: {
    fontSize: '12px',
    fontWeight: '600',
    padding: '3px 10px',
    borderRadius: '20px',
  },
  statusPending: { backgroundColor: '#FFF3CD', color: '#856404' },
  statusVerified: { backgroundColor: '#D1ECF1', color: '#0C5460' },
  statusSubmitted: { backgroundColor: '#D4EDDA', color: '#155724' },
  dateText: { fontSize: '13px', color: '#888' },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    marginBottom: '20px',
  },
  detailItem: { display: 'flex', flexDirection: 'column', gap: '4px' },
  detailLabel: { fontSize: '11px', color: '#888', fontWeight: '600', textTransform: 'uppercase' },
  detailValue: { fontSize: '14px', color: '#1a1a2e', fontWeight: '500' },
  amountText: { fontSize: '16px', fontWeight: '700', color: '#1a1a2e' },
  swiftText: { fontFamily: 'Courier New, monospace', fontSize: '14px' },
  actionsRow: {
    display: 'flex',
    gap: '12px',
    paddingTop: '16px',
    borderTop: '1px solid #f0f0f0',
  },
  verifyBtn: {
    padding: '10px 24px',
    backgroundColor: '#3DBFA0',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
  submitBtn: {
    padding: '10px 24px',
    backgroundColor: '#1a1a2e',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
  completedText: {
    fontSize: '14px',
    color: '#38a169',
    fontWeight: '600',
    padding: '10px 0',
  },
};

export default EmployeeDashboard;