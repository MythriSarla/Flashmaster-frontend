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
    const fd = new FormData();
    fd.append('subject', form.subject);
    fd.append('title', form.title);
    fd.append('topic', form.topic);
    if (file) fd.append('file', file);

    try {
      setLoading(true);
      setMsg('Uploading...');

      await API.post('/materials', fd);

      setMsg('Uploaded successfully!');
      setForm({ subject: '', title: '', topic: '' });
      setFile(null);

      fetchMaterials();
    } catch (err) {
      setMsg(err.response?.data?.msg || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (m) => {
    if (!m.fileUrl) return;

    window.open(m.fileUrl, '_blank');
  };

  const handleDelete = async (id) => {
    await API.delete(`/materials/${id}`);
    fetchMaterials();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Study Materials</h2>

      {/* UPLOAD */}
      <div>
        <input placeholder="Subject"
          value={form.subject}
          onChange={e => setForm({ ...form, subject: e.target.value })}
        />

        <input placeholder="Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
        />

        <input placeholder="Topic"
          value={form.topic}
          onChange={e => setForm({ ...form, topic: e.target.value })}
        />

        <input type="file"
          onChange={e => setFile(e.target.files[0])}
        />

        <button onClick={handleUpload} disabled={loading}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>

        <p>{msg}</p>
      </div>

      {/* LIST */}
      <h3>My Materials</h3>

      {materials.map(m => (
        <div key={m._id} style={{ border: '1px solid #ccc', margin: 10, padding: 10 }}>
          <p><b>{m.title}</b></p>
          <p>{m.subject}</p>

          {/* VIEW BUTTON */}
          {m.fileUrl && (
            <button onClick={() => handleView(m)}>
              👁 View
            </button>
          )}

          {/* DOWNLOAD */}
          {m.fileUrl && (
            <a href={m.fileUrl} target="_blank" rel="noreferrer">
              ⬇ Download
            </a>
          )}

          <button onClick={() => handleDelete(m._id)}>
            🗑 Delete
          </button>
        </div>
      ))}
    </div>
  );
}