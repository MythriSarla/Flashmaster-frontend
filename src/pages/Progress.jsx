import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Progress() {
  const [records, setRecords] = useState([]);
  const [form, setForm]       = useState({ subject: '', completedTopics: '', pendingTopics: '', revisionStatus: 'Not Started' });
  const [msg,  setMsg]        = useState('');
  const navigate              = useNavigate();

  useEffect(() => { fetchProgress(); }, []);

  const fetchProgress = async () => {
    try { const { data } = await API.get('/progress'); setRecords(data); }
    catch { navigate('/login'); }
  };

  const addProgress = async () => {
    try {
      await API.post('/progress', {
        subject:         form.subject,
        completedTopics: Number(form.completedTopics),
        pendingTopics:   Number(form.pendingTopics),
        revisionStatus:  form.revisionStatus,
      });
      setMsg('Progress saved successfully!');
      fetchProgress();
    } catch (err) { setMsg(err.response?.data?.msg || 'Error saving progress'); }
  };

  const getPercent = r => {
    const total = r.completedTopics + r.pendingTopics;
    return total === 0 ? 0 : Math.round((r.completedTopics / total) * 100);
  };

  const statusColor = { 'Not Started': '#fee2e2', 'In Progress': '#fef9c3', 'Completed': '#dcfce7' };
  const statusText  = { 'Not Started': '#dc2626', 'In Progress': '#854d0e', 'Completed': '#15803d' };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>My Progress</h2>
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>Back</button>
      </div>
      <div style={styles.formBox}>
        <h3 style={{ margin: '0 0 12px', fontSize: 15 }}>Track Your Progress</h3>
        <input style={styles.input} placeholder="Subject (e.g. Operating Systems)" onChange={e => setForm({...form, subject: e.target.value})} />
        <input style={styles.input} placeholder="Completed Topics (e.g. 8)" type="number" onChange={e => setForm({...form, completedTopics: e.target.value})} />
        <input style={styles.input} placeholder="Pending Topics (e.g. 3)"   type="number" onChange={e => setForm({...form, pendingTopics: e.target.value})} />
        <select style={styles.input} onChange={e => setForm({...form, revisionStatus: e.target.value})}>
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <button style={styles.btn} onClick={addProgress}>Save Progress</button>
        {msg && <p style={{ color: 'green', fontSize: 13, marginTop: 8 }}>{msg}</p>}
      </div>
      {records.length === 0
        ? <p style={{ color: '#999', fontSize: 14 }}>No progress records yet. Add one above!</p>
        : records.map(r => (
          <div key={r._id} style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>{r.subject}</h3>
              <span style={{ ...styles.badge, background: statusColor[r.revisionStatus], color: statusText[r.revisionStatus] }}>
                {r.revisionStatus}
              </span>
            </div>
            <div style={styles.barBg}>
              <div style={{ ...styles.barFill, width: getPercent(r) + '%' }} />
            </div>
            <div style={styles.stats}>
              <span style={{ color: '#15803d' }}>✓ {r.completedTopics} completed</span>
              <span style={{ color: '#4f46e5', fontWeight: 600 }}>{getPercent(r)}%</span>
              <span style={{ color: '#dc2626' }}>○ {r.pendingTopics} pending</span>
            </div>
          </div>
        ))
      }
    </div>
  );
}

const styles = {
  container:  { maxWidth: 800, margin: '0 auto', padding: 32 },
  header:     { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title:      { fontSize: 22, fontWeight: 700, color: '#1a1a2e', margin: 0 },
  backBtn:    { padding: '8px 16px', background: '#f1f5f9', border: 'none', borderRadius: 8, cursor: 'pointer' },
  formBox:    { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20, marginBottom: 28 },
  input:      { width: '100%', padding: 10, marginBottom: 10, borderRadius: 8, border: '1px solid #ddd', fontSize: 13, boxSizing: 'border-box' },
  btn:        { padding: '10px 20px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 },
  card:       { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20, marginBottom: 16 },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardTitle:  { fontSize: 16, fontWeight: 700, color: '#1a1a2e', margin: 0 },
  badge:      { padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 },
  barBg:      { height: 10, background: '#f1f5f9', borderRadius: 10, marginBottom: 10, overflow: 'hidden' },
  barFill:    { height: 10, background: '#4f46e5', borderRadius: 10, transition: 'width 0.4s' },
  stats:      { display: 'flex', justifyContent: 'space-between', fontSize: 13 },
};
