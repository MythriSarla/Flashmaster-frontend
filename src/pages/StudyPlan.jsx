import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function StudyPlan() {
  const [plans, setPlans] = useState([]);
  const [form,  setForm]  = useState({ subject: '', examDate: '', dailyStudyHours: '', chapters: '' });
  const [msg,   setMsg]   = useState('');
  const navigate          = useNavigate();

  useEffect(() => { fetchPlans(); }, []);

  const fetchPlans = async () => {
    try { const { data } = await API.get('/plans'); setPlans(data); }
    catch { navigate('/login'); }
  };

  const createPlan = async () => {
    try {
      const chapters = form.chapters
        .split(',')
        .map(c => ({ name: c.trim(), completed: false }))
        .filter(c => c.name);
      await API.post('/plans', {
        subject:         form.subject,
        examDate:        form.examDate,
        dailyStudyHours: Number(form.dailyStudyHours),
        chapters,
      });
      setMsg('Study plan created successfully!');
      fetchPlans();
    } catch (err) { setMsg(err.response?.data?.msg || 'Error creating plan'); }
  };

  const daysLeft = d => Math.max(0, Math.ceil((new Date(d) - new Date()) / 86400000));

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Study Plans</h2>
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>Back</button>
      </div>
      <div style={styles.formBox}>
        <h3 style={{ margin: '0 0 12px', fontSize: 15 }}>Create New Study Plan</h3>
        <input style={styles.input} placeholder="Subject (e.g. DBMS)" onChange={e => setForm({...form, subject: e.target.value})} />
        <input style={styles.input} placeholder="Exam Date" type="date" onChange={e => setForm({...form, examDate: e.target.value})} />
        <input style={styles.input} placeholder="Daily Study Hours (e.g. 3)" type="number" onChange={e => setForm({...form, dailyStudyHours: e.target.value})} />
        <input style={styles.input} placeholder="Chapters separated by commas: Arrays, Trees, Graphs" onChange={e => setForm({...form, chapters: e.target.value})} />
        <button style={styles.btn} onClick={createPlan}>Create Plan</button>
        {msg && <p style={{ color: 'green', fontSize: 13, marginTop: 8 }}>{msg}</p>}
      </div>
      {plans.length === 0
        ? <p style={{ color: '#999', fontSize: 14 }}>No study plans yet. Create one above!</p>
        : plans.map(plan => (
          <div key={plan._id} style={styles.planCard}>
            <div style={styles.planHeader}>
              <h3 style={styles.planTitle}>{plan.subject}</h3>
              <span style={styles.badge}>{daysLeft(plan.examDate)} days left</span>
            </div>
            <p style={styles.planSub}>
              Exam: {new Date(plan.examDate).toDateString()} &nbsp;·&nbsp; {plan.dailyStudyHours} hrs/day
            </p>
            <div style={styles.chapters}>
              {plan.chapters.map((ch, i) => (
                <span key={i} style={{
                  ...styles.chapter,
                  background: ch.completed ? '#dcfce7' : '#f1f5f9',
                  color:      ch.completed ? '#15803d' : '#475569'
                }}>
                  {ch.completed ? '✓ ' : ''}{ch.name}
                </span>
              ))}
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
  planCard:   { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20, marginBottom: 16 },
  planHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  planTitle:  { fontSize: 16, fontWeight: 700, color: '#1a1a2e', margin: 0 },
  badge:      { background: '#ede9fe', color: '#6d28d9', padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 },
  planSub:    { color: '#888', fontSize: 13, margin: '0 0 12px' },
  chapters:   { display: 'flex', flexWrap: 'wrap', gap: 8 },
  chapter:    { padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500 },
};
