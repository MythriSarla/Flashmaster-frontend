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

      console.log("Sending:", subject, title);

      await API.post('/materials', fd, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setMsg('Material uploaded successfully!');
      setForm({ subject: '', title: '', topic: '' });
      setFile(null);
      fetchMaterials();

    } catch (err) {
      console.log("ERROR:", err.response?.data);
      setMsg(err.response?.data?.error || err.response?.data?.msg || "Upload failed");
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

  const getFileIcon = (fileType) => {
    if (!fileType) return '📄';
    if (fileType.includes('pdf')) return '📕';
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('text')) return '📝';
    if (fileType.includes('ppt')) return '📊';
    if (fileType.includes('doc')) return '📘';
    return '📄';
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Study Materials</h2>
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>
          ← Back
        </button>
      </div>

      {/* Upload */}
      <div style={styles.uploadBox}>
        <h3>Upload New Material</h3>

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
          placeholder="Topic (optional)"
          value={form.topic}
          onChange={e => setForm({ ...form, topic: e.target.value })}
        />

        <input
          type="file"
          onChange={e => setFile(e.target.files[0])}
        />

        <button onClick={handleUpload} disabled={loading}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>

        {msg && <p>{msg}</p>}
      </div>

      {/* List */}
      <h3>My Materials ({materials.length})</h3>

      {materials.length === 0 ? (
        <p>No materials yet</p>
      ) : (
        materials.map(m => (
          <div key={m._id} style={styles.item}>
            <div>
              <span>{getFileIcon(m.fileType)}</span>
              <p>{m.title}</p>
              <p>{m.subject}</p>
            </div>

            <div>
              {m.fileUrl && (
                <button onClick={() => window.open(m.fileUrl)}>
                  View
                </button>
              )}

              {m.fileUrl && (
                <a href={m.fileUrl + "?fl_attachment=true"}>
                  Download
                </a>
              )}

              <button onClick={() => handleDelete(m._id)}>
                Delete
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
  uploadBox: { marginBottom: 20 },
  input: { display: 'block', marginBottom: 10 },
  item: { display: 'flex', justifyContent: 'space-between', marginTop: 10 }
};