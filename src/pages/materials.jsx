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

  useEffect(() => {
    fetchMaterials();
  }, []);

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
    if (window.confirm('Are you sure you want to delete this material?')) {
      await API.delete(`/materials/${id}`);
      fetchMaterials();
    }
  };

  const handleView = (url) => {
    if (url) {
      window.open(url, '_blank');
    } else {
      alert('File not available');
    }
  };

  const getFileIcon = (fileType) => {
    if (!fileType) return '📄';
    if (fileType.includes('pdf')) return '📕';
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('text')) return '📝';
    if (fileType.includes('ppt')) return '📊';
    if (fileType.includes('word')) return '📘';
    return '📄';
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Study Materials</h2>
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>← Back</button>
      </div>

      {/* Upload Box */}
      <div style={styles.uploadBox}>
        <h3 style={{ margin: '0 0 14px', fontSize: 15, color: '#1a1a2e' }}>
          Upload New Material
        </h3>

        <input
          style={styles.input}
          placeholder="Subject (e.g. Data Structures)"
          value={form.subject}
          onChange={e => setForm({ ...form, subject: e.target.value })}
        />

        <input
          style={styles.input}
          placeholder="Title (e.g. Linked List Notes)"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
        />

        <input
          style={styles.input}
          placeholder="Topic (optional)"
          value={form.topic}
          onChange={e => setForm({ ...form, topic: e.target.value })}
        />

        <input
          type="file"
          style={{ marginBottom: 14, fontSize: 13 }}
          onChange={e => setFile(e.target.files[0])}
          accept=".pdf,.txt,.docx,.pptx,.png,.jpg,.jpeg"
        />

        <button
          style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Upload Material'}
        </button>

        {msg && <p style={{ fontSize: 13, marginTop: 10 }}>{msg}</p>}
      </div>

      {/* List */}
      <h3>My Uploaded Materials ({materials.length})</h3>

      {materials.length === 0 ? (
        <p>No materials uploaded yet.</p>
      ) : (
        materials.map(m => (
          <div key={m._id} style={styles.item}>
            <div style={styles.itemLeft}>
              <span style={styles.fileIcon}>{getFileIcon(m.fileType)}</span>
              <div>
                <p style={styles.itemTitle}>{m.title}</p>
                <p style={styles.itemSub}>{m.subject}</p>
              </div>
            </div>

            <div style={styles.itemBtns}>
              {/* VIEW */}
              <button
                style={styles.viewBtn}
                onClick={() => handleView(m.fileUrl)}
              >
                👁 View
              </button>

              {/* DOWNLOAD */}
              <a
                href={m.fileUrl}
                target="_blank"
                rel="noreferrer"
                style={styles.downloadBtn}
              >
                ⬇ Download
              </a>

              {/* DELETE */}
              <button
                style={styles.deleteBtn}
                onClick={() => handleDelete(m._id)}
              >
                🗑
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
  header: { display: 'flex', justifyContent: 'space-between' },
  title: { fontSize: 22 },
  backBtn: { padding: 8 },
  uploadBox: { padding: 20, border: '1px solid #ddd', marginBottom: 20 },
  input: { width: '100%', marginBottom: 10, padding: 8 },
  btn: { padding: 10, background: 'blue', color: '#fff' },

  item: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: 12,
    border: '1px solid #ddd',
    marginBottom: 10
  },
  itemLeft: { display: 'flex', gap: 10 },
  fileIcon: { fontSize: 24 },
  itemTitle: { fontWeight: 'bold' },
  itemSub: { fontSize: 12, color: '#666' },

  itemBtns: { display: 'flex', gap: 8 },
  viewBtn: { background: '#e0f2fe', padding: 6 },
  downloadBtn: { background: '#dcfce7', padding: 6 },
  deleteBtn: { background: '#fee2e2', padding: 6 }
};