import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role !== 'admin') {
      navigate('/login');
      return;
    }
    API.get('/admin/users')
      .then(res => setUsers(res.data))
      .catch(() => setError('Failed to load users'));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin-login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <p style={styles.badge}>👨‍💼 Admin Portal</p>
          <h1 style={styles.title}>Admin Dashboard</h1>
        </div>
        <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </div>

      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <h2 style={styles.statNum}>{users.length}</h2>
          <p style={styles.statLabel}>Total Users</p>
        </div>
        <div style={styles.statCard}>
          <h2 style={styles.statNum}>{users.filter(u => u.role === 'admin').length}</h2>
          <p style={styles.statLabel}>Admins</p>
        </div>
        <div style={styles.statCard}>
          <h2 style={styles.statNum}>{users.filter(u => u.role !== 'admin').length}</h2>
          <p style={styles.statLabel}>Students</p>
        </div>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.tableWrap}>
        <h2 style={styles.tableTitle}>All Users</h2>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              <th style={styles.th}>#</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u._id} style={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                <td style={styles.td}>{i + 1}</td>
                <td style={styles.td}>{u.name}</td>
                <td style={styles.td}>{u.email}</td>
                <td style={styles.td}>
                  <span style={u.role === 'admin' ? styles.badgeAdmin : styles.badgeStudent}>
                    {u.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  container:    { minHeight: '100vh', background: '#f1f5f9', padding: 32 },
  header:       { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  badge:        { background: '#fee2e2', color: '#dc2626', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, display: 'inline-block', marginBottom: 4 },
  title:        { fontSize: 28, fontWeight: 700, color: '#1a1a2e', margin: 0 },
  logoutBtn:    { padding: '10px 20px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' },
  statsRow:     { display: 'flex', gap: 20, marginBottom: 32 },
  statCard:     { background: '#fff', borderRadius: 12, padding: '24px 32px', flex: 1, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textAlign: 'center' },
  statNum:      { fontSize: 36, fontWeight: 700, color: '#1a1a2e', margin: 0 },
  statLabel:    { color: '#666', marginTop: 4, fontSize: 14 },
  tableWrap:    { background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  tableTitle:   { fontSize: 18, fontWeight: 600, marginBottom: 16, color: '#1a1a2e' },
  table:        { width: '100%', borderCollapse: 'collapse' },
  thead:        { background: '#1a1a2e' },
  th:           { padding: '12px 16px', color: '#fff', textAlign: 'left', fontSize: 13 },
  td:           { padding: '12px 16px', fontSize: 14, color: '#333' },
  trEven:       { background: '#fff' },
  trOdd:        { background: '#f8fafc' },
  badgeAdmin:   { background: '#fee2e2', color: '#dc2626', padding: '2px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600 },
  badgeStudent: { background: '#dbeafe', color: '#2563eb', padding: '2px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600 },
  error:        { color: 'red', marginBottom: 16 },
};
