import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Materials() {
  const [materials, setMaterials] = useState([]);
  const [form, setForm] = useState({ subject: '', title: '', topic: '' });
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { fetchMaterials(); }, []);

  const fetchMaterials = async () => {
    try {
      const { data } = await API.get('/materials');
      setMaterials(data);
    } catch {
      navigate('/login');
    }
  };

  const handleUpload = async () => {
    if (!form.subject || !form.title) {
      setMsg('Please fill in Subject and Title');
      return;
    }

    try {
      setLoading(true);
      setMsg('Uploading... please wait');

      const fd = new FormData();
      fd.append('subject', form.subject);
      fd.append('title', form.title);
      fd.append('topic', form.topic);
      if (file) fd.append('file', file);

      await API.post('/materials', fd);

      setMsg('Material uploaded successfully!');
      setForm({ subject: '', title: '', topic: '' });
      setFile(null);
      fetchMaterials();

    } catch (err) {
      setMsg(err.response?.data?.msg || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    await API.delete(`/materials/${id}`);
    fetchMaterials();
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Study Materials</h2>
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>← Back</button>
      </div>

      {/* Upload */}
      <div style={styles.uploadBox}>
        <input
          style={styles.input}
          placeholder="Subject"
          value={form.subject}
          onChange={e => setForm({ ...form, subject: e.target.value })}
        />

        <input
          style={styles.input}
          placeholder="Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
        />

        <input
          style={styles.input}
          placeholder="Topic"
          value={form.topic}
          onChange={e => setForm({ ...form, topic: e.target.value })}
        />

        <input type="file" onChange={e => setFile(e.target.files[0])} />

        <button style={styles.btn} onClick={handleUpload}>
          {loading ? 'Uploading...' : 'Upload Material'}
        </button>

        <p>{msg}</p>
      </div>

      {/* LIST */}
      <h3>My Uploaded Materials</h3>

      {materials.length === 0 ? (
        <p>No materials uploaded yet</p>
      ) : (
        materials.map(m => (
          <div key={m._id} style={styles.item}>
            <div>
              <b>{m.title}</b>
              <p>{m.subject}</p>
            </div>

            <div style={styles.itemBtns}>

              {/* VIEW */}
              {m.fileUrl && (
                <button
                  style={styles.viewBtn}
                  onClick={() => window.open(m.fileUrl, '_blank')}
                >
                  👁 View
                </button>
              )}

              {/* DOWNLOAD */}
              {m.fileUrl && (
                <a
                  href={m.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={styles.downloadBtn}
                >
                  ⬇ Download
                </a>
              )}

              <button
                style={styles.deleteBtn}
                onClick={() => handleDelete(m._id)}
              >
                🗑 Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: 800, margin: '0 auto', padding: 32 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 22 },
  backBtn: { padding: '8px 16px' },

  uploadBox: {
    background: '#fff',
    padding: 20,
    marginBottom: 20,
    borderRadius: 10
  },

  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10
  },

  btn: {
    padding: '10px 20px',
    background: '#4f46e5',
    color: '#fff',
    border: 'none'
  },

  item: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: 10,
    border: '1px solid #ddd',
    marginBottom: 10
  },

  itemBtns: {
    display: 'flex',
    gap: 8
  },

  viewBtn: {
    padding: '6px 12px',
    background: '#e0f2fe',
    border: 'none'
  },

  downloadBtn: {
    padding: '6px 12px',
    background: '#dcfce7',
    textDecoration: 'none'
  },

  deleteBtn: {
    padding: '6px 12px',
    background: '#fee2e2',
    border: 'none'
  }
};