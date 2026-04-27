import React, { useState } from 'react';
import API from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';

export default function AdminLogin() {
  const [form, setForm]   = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      const { data } = await API.post('/auth/login', form);
      if (data.user.role !== 'admin') {
        setError('Access denied. You are not an admin.');
        return;
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user',  JSON.stringify(data.user));
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <p style={styles.badge}>👨‍💼 Admin Portal</p>
        <h1 style={styles.title}>FLASHMASTER</h1>
        <p style={styles.subtitle}>Admin Login</p>
        {error && <p style={styles.error}>{error}</p>}
        <input style={styles.input} name="email"    placeholder="Admin Email"    onChange={handleChange} />
        <input style={styles.input} name="password" placeholder="Admin Password" type="password" onChange={handleChange} />
        <button style={styles.btn} onClick={handleSubmit}>Login as Admin</button>
        <p style={styles.link}><Link to="/login">← Back to Student Login</Link></p>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a1a2e' },
  card:      { background: '#fff', padding: 40, borderRadius: 16, width: 360, boxShadow: '0 4px 20px rgba(0,0,0,0.3)' },
  badge:     { background: '#fee2e2', color: '#dc2626', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, display: 'inline-block', marginBottom: 12 },
  title:     { fontSize: 28, fontWeight: 700, color: '#1a1a2e', margin: '0 0 4px' },
  subtitle:  { color: '#666', marginBottom: 24, fontSize: 14 },
  input:     { width: '100%', padding: 12, marginBottom: 12, borderRadius: 8, border: '1px solid #ddd', fontSize: 14, boxSizing: 'border-box' },
  btn:       { width: '100%', padding: 12, background: '#dc2626', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer' },
  error:     { color: 'red', fontSize: 13, marginBottom: 10 },
  link:      { textAlign: 'center', marginTop: 16, fontSize: 13, color: '#666' },
};
