import React, { useState } from 'react';
import API from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [form, setForm]   = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      const { data } = await API.post('/auth/register', form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user',  JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>FLASHMASTER</h1>
        <p style={styles.subtitle}>Create your account</p>
        {error && <p style={styles.error}>{error}</p>}
        <input style={styles.input} name="name"     placeholder="Full Name" onChange={handleChange} />
        <input style={styles.input} name="email"    placeholder="Email"     onChange={handleChange} />
        <input style={styles.input} name="password" placeholder="Password"  type="password" onChange={handleChange} />
        <button style={styles.btn} onClick={handleSubmit}>Register</button>
        <p style={styles.link}>Already have an account? <Link to="/login">Login here</Link></p>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f4f8' },
  card:      { background: '#fff', padding: 40, borderRadius: 16, width: 360, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
  title:     { fontSize: 28, fontWeight: 700, color: '#1a1a2e', margin: '0 0 4px' },
  subtitle:  { color: '#666', marginBottom: 24, fontSize: 14 },
  input:     { width: '100%', padding: 12, marginBottom: 12, borderRadius: 8, border: '1px solid #ddd', fontSize: 14, boxSizing: 'border-box' },
  btn:       { width: '100%', padding: 12, background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer' },
  error:     { color: 'red', fontSize: 13, marginBottom: 10 },
  link:      { textAlign: 'center', marginTop: 16, fontSize: 13, color: '#666' },
};
