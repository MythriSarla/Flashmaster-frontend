import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const user     = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();
  const logout   = () => { localStorage.clear(); navigate('/login'); };

  const cards = [
    { label: 'Upload Material', icon: '📁', path: '/materials',  bg: '#e0f2fe', color: '#0369a1' },
    { label: 'Flashcards',      icon: '🃏', path: '/flashcards', bg: '#ede9fe', color: '#6d28d9' },
    { label: 'Study Plan',      icon: '📅', path: '/plan',       bg: '#dcfce7', color: '#15803d' },
    { label: 'Progress',        icon: '📊', path: '/progress',   bg: '#fef9c3', color: '#854d0e' },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>FLASHMASTER</h1>
          <p style={styles.welcome}>Welcome back, <strong>{user.name}</strong>!</p>
        </div>
        <button style={styles.logout} onClick={logout}>Logout</button>
      </div>
      <div style={styles.grid}>
        {cards.map(c => (
          <div key={c.path} style={{ ...styles.card, background: c.bg }} onClick={() => navigate(c.path)}>
            <span style={{ fontSize: 36 }}>{c.icon}</span>
            <p style={{ ...styles.cardLabel, color: c.color }}>{c.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: 800, margin: '0 auto', padding: 32 },
  header:    { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  title:     { fontSize: 24, fontWeight: 700, color: '#1a1a2e', margin: 0 },
  welcome:   { color: '#666', margin: '4px 0 0', fontSize: 14 },
  logout:    { padding: '8px 20px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 },
  grid:      { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
  card:      { padding: 32, borderRadius: 16, cursor: 'pointer', textAlign: 'center' },
  cardLabel: { fontSize: 16, fontWeight: 600, margin: '12px 0 0' },
};
