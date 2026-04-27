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
    const subject = form.subject.trim();
    const title = form.title.trim();
    const topic = form.topic.trim();

    if (!subject || !title) {
      setMsg('Please fill in Subject and Title');
      return;
    }

    try {
      setLoading(true);
      setMsg('Uploading... please wait');

      const fd = new FormData();
      fd.append('subject', subject);
      fd.append('title', title);
      fd.append('topic', topic);
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
    if (window.confirm('Delete this material?')) {
      await API.delete(`/materials/${id}`);
      fetchMaterials();
    }
  };

  // 🔥 FIXED VIEW FUNCTION
  const handleView = (m) => {
    let url = m.fileUrl;

    // ✅ Convert raw → image for PDF preview
    if (m.fileType === 'application/pdf') {
      url = url.replace('/raw/upload/', '/image/upload/');
    }

    window.open(url, '_blank');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Study Materials</h2>
        <button onClick={() => navigate('/dashboard')}>Back</button>
      </div>

      {/* Upload */}
      <div style={styles.box}>
        <h3>Upload New Material</h3>

        <input
          placeholder="Subject"
          value={form.subject}
          onChange={e => setForm({ ...form, subject: e.target.value })}
        />

        <input
          placeholder="Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
        />

        <input
          placeholder="Topic"
          value={form.topic}
          onChange={e => setForm({ ...form, topic: e.target.value })}
        />

        <input type="file" onChange={e => setFile(e.target.files[0])} />

        <button onClick={handleUpload} disabled={loading}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>

        {msg && <p>{msg}</p>}
      </div>

      {/* List */}
      <h3>My Materials ({materials.length})</h3>

      {materials.length === 0 ? (
        <p>No materials uploaded</p>
      ) : (
        materials.map(m => (
          <div key={m._id} style={styles.item}>
            <div>
              <p><b>{m.title}</b></p>
              <p>{m.subject}</p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              {m.fileUrl && (
                <button onClick={() => handleView(m)}>
                  👁 View
                </button>
              )}

              {m.fileUrl && (
                <a href={m.fileUrl + "?fl_attachment=true"} target="_blank" rel="noreferrer">
                  ⬇ Download
                </a>
              )}

              <button onClick={() => handleDelete(m._id)}>
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
  container: { padding: 20 },
  header: { display: 'flex', justifyContent: 'space-between' },
  box: { marginBottom: 20 },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    border: '1px solid #ddd',
    padding: 10,
    marginTop: 10
  }
};