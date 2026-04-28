import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
  const [users, setUsers]       = useState([]);
  const [materials, setMaterials] = useState([]);
  const [tab, setTab]           = useState('users');
  const [error, setError]       = useState('');
  const navigate                = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') { navigate('/login'); return; }
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [u, m] = await Promise.all([
        API.get('/auth/users'),
        API.get('/materials/all'),
      ]);
      setUsers(u.data);
      setMaterials(m.data);
    } catch (err) {
      setError('Failed to load data: ' + (err.response?.data?.msg || err.message));
    }
  };

  const handleLogout = () => { localStorage.clear(); navigate('/login'); };

  const students = users.filter(u => u.role === 'student');
  const admins   = users.filter(u => u.role === 'admin');

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>👨‍💼 Admin Dashboard</h2>
          <p style={styles.subtitle}>FlashMaster Control Panel</p>
        </div>
        <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </div>

      {error && <p style={{ color: 'red', marginBottom: 16 }}>{error}</p>}

      {/* Stats */}
      <div style={styles.statsRow}>
        <div style={styles.statBox}>
          <p style={styles.statNum}>{users.length}</p>
          <p style={styles.statLabel}>Total Users</p>
        </div>
        <div style={styles.statBox}>
          <p style={styles.statNum}>{students.length}</p>
          <p style={styles.statLabel}>Students</p>
        </div>
        <div style={styles.statBox}>
          <p style={styles.statNum}>{admins.length}</p>
          <p style={styles.statLabel}>Admins</p>
        </div>
        <div style={styles.statBox}>
          <p style={styles.statNum}>{materials.length}</p>
          <p style={styles.statLabel}>Total Uploads</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {['users', 'materials', 'reports'].map(t => (
          <button
            key={t}
            style={{ ...styles.tab, ...(tab === t ? styles.tabActive : {}) }}
            onClick={() => setTab(t)}
          >
            {t === 'users' ? '👥 Users' : t === 'materials' ? '📁 Uploaded Content' : '📊 Reports'}
          </button>
        ))}
      </div>

      {/* Users Tab */}
      {tab === 'users' && (
        <div>
          <h3 style={styles.sectionTitle}>All Registered Users ({users.length})</h3>
          {users.length === 0 ? <p style={{ color: '#999' }}>No users found.</p> : (
            users.map((u, i) => (
              <div key={u._id} style={styles.item}>
                <div style={styles.itemLeft}>
                  <div style={styles.avatar}>{u.name?.[0]?.toUpperCase()}</div>
                  <div>
                    <p style={styles.itemName}>{u.name}</p>
                    <p style={styles.itemEmail}>{u.email}</p>
                    <p style={styles.itemDate}>Joined: {new Date(u.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <span style={{ ...styles.badge, background: u.role === 'admin' ? '#fee2e2' : '#e0f2fe', color: u.role === 'admin' ? '#dc2626' : '#0369a1' }}>
                  {u.role}
                </span>
              </div>
            ))
          )}
        </div>
      )}

      {/* Materials Tab */}
      {tab === 'materials' && (
        <div>
          <h3 style={styles.sectionTitle}>All Uploaded Materials ({materials.length})</h3>
          {materials.length === 0 ? <p style={{ color: '#999' }}>No materials found.</p> : (
            materials.map(m => (
              <div key={m._id} style={styles.item}>
                <div style={styles.itemLeft}>
                  <span style={{ fontSize: 28 }}>📄</span>
                  <div>
                    <p style={styles.itemName}>{m.title}</p>
                    <p style={styles.itemEmail}>{m.subject}{m.topic ? ' — ' + m.topic : ''}</p>
                    <p style={styles.itemDate}>Uploaded: {new Date(m.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                {m.fileUrl && (
                  <a href={m.fileUrl} target="_blank" rel="noreferrer" style={styles.viewLink}>View</a>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Reports Tab */}
      {tab === 'reports' && (
        <div>
          <h3 style={styles.sectionTitle}>📊 Platform Reports</h3>
          <div style={styles.reportGrid}>
            <div style={styles.reportBox}>
              <p style={styles.reportTitle}>👥 User Summary</p>
              <p style={styles.reportLine}>Total Registered Users: <b>{users.length}</b></p>
              <p style={styles.reportLine}>Students: <b>{students.length}</b></p>
              <p style={styles.reportLine}>Admins: <b>{admins.length}</b></p>
            </div>
            <div style={styles.reportBox}>
              <p style={styles.reportTitle}>📁 Content Summary</p>
              <p style={styles.reportLine}>Total Uploads: <b>{materials.length}</b></p>
              <p style={styles.reportLine}>PDFs: <b>{materials.filter(m => m.fileType?.includes('pdf')).length}</b></p>
              <p style={styles.reportLine}>Images: <b>{materials.filter(m => m.fileType?.includes('image')).length}</b></p>
              <p style={styles.reportLine}>Others: <b>{materials.filter(m => !m.fileType?.includes('pdf') && !m.fileType?.includes('image')).length}</b></p>
            </div>
            <div style={styles.reportBox}>
              <p style={styles.reportTitle}>🔐 Access Control</p>
              <p style={styles.reportLine}>Auth Method: <b>JWT Token</b></p>
              <p style={styles.reportLine}>Token Expiry: <b>7 Days</b></p>
              <p style={styles.reportLine}>Password: <b>bcrypt hashed</b></p>
              <p style={styles.reportLine}>Admin Portal: <b>Separate Login</b></p>
            </div>
            <div style={styles.reportBox}>
              <p style={styles.reportTitle}>☁️ Platform Status</p>
              <p style={styles.reportLine}>Frontend: <b style={{color:'green'}}>Live ✅</b></p>
              <p style={styles.reportLine}>Backend: <b style={{color:'green'}}>Live ✅</b></p>
              <p style={styles.reportLine}>Database: <b style={{color:'green'}}>Connected ✅</b></p>
              <p style={styles.reportLine}>Storage: <b style={{color:'green'}}>Cloudinary ✅</b></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container:    { maxWidth: 900, margin: '0 auto', padding: 32 },
  header:       { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title:        { fontSize: 22, fontWeight: 700, color: '#1a1a2e', margin: 0 },
  subtitle:     { fontSize: 13, color: '#888', margin: '4px 0 0' },
  logoutBtn:    { padding: '8px 16px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 8, cursor: 'pointer' },
  statsRow:     { display: 'flex', gap: 16, marginBottom: 28 },
  statBox:      { flex: 1, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20, textAlign: 'center' },
  statNum:      { fontSize: 32, fontWeight: 700, color: '#4f46e5', margin: 0 },
  statLabel:    { fontSize: 13, color: '#888', margin: '4px 0 0' },
  tabs:         { display: 'flex', gap: 8, marginBottom: 24 },
  tab:          { padding: '10px 20px', background: '#f1f5f9', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500 },
  tabActive:    { background: '#4f46e5', color: '#fff' },
  sectionTitle: { fontSize: 16, fontWeight: 600, marginBottom: 12, color: '#1a1a2e' },
  item:         { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '14px 18px', marginBottom: 10 },
  itemLeft:     { display: 'flex', alignItems: 'center', gap: 14 },
  avatar:       { width: 40, height: 40, borderRadius: 20, background: '#4f46e5', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16 },
  itemName:     { fontWeight: 600, fontSize: 14, margin: 0, color: '#1a1a2e' },
  itemEmail:    { fontSize: 12, color: '#64748b', margin: '3px 0 0' },
  itemDate:     { fontSize: 11, color: '#94a3b8', margin: '2px 0 0' },
  badge:        { padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 },
  viewLink:     { padding: '6px 14px', background: '#e0f2fe', color: '#0369a1', borderRadius: 6, fontSize: 12, fontWeight: 500, textDecoration: 'none' },
  reportGrid:   { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  reportBox:    { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20 },
  reportTitle:  { fontWeight: 700, fontSize: 15, color: '#1a1a2e', margin: '0 0 12px' },
  reportLine:   { fontSize: 13, color: '#64748b', margin: '6px 0' },
};
