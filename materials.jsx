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

      // ❗ IMPORTANT: no headers here
      await API.post('/materials', fd);

      setMsg('Material uploaded successfully!');
      setForm({ subject: '', title: '', topic: '' });
      setFile(null);
      setLoading(false);
      fetchMaterials();

    } catch (err) {
      setLoading(false);
      setMsg(err.response?.data?.error || err.message);
console.log(err.response?.data);
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
    if (fileType.includes('powerpoint') || fileType.includes('pptx')) return '📊';
    if (fileType.includes('word') || fileType.includes('docx')) return '📘';
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

        {msg && (
          <p style={{
            fontSize: 13,
            marginTop: 10,
            color: msg.includes('success')
              ? '#15803d'
              : msg.includes('wait')
              ? '#854d0e'
              : '#dc2626'
          }}>
            {msg}
          </p>
        )}
      </div>

      {/* Materials List */}
      <h3 style={{ fontSize: 16, marginBottom: 12, color: '#1a1a2e' }}>
        My Uploaded Materials ({materials.length})
      </h3>

      {materials.length === 0 ? (
        <div style={styles.emptyBox}>
          <p style={{ fontSize: 32, margin: '0 0 8px' }}>📭</p>
          <p style={{ color: '#999', fontSize: 14 }}>No materials uploaded yet.</p>
          <p style={{ color: '#bbb', fontSize: 13 }}>
            Upload your first study material above!
          </p>
        </div>
      ) : (
        materials.map(m => (
          <div key={m._id} style={styles.item}>
            <div style={styles.itemLeft}>
              <span style={styles.fileIcon}>{getFileIcon(m.fileType)}</span>
              <div>
                <p style={styles.itemTitle}>{m.title}</p>
                <p style={styles.itemSub}>
                  {m.subject}{m.topic ? ' — ' + m.topic : ''}
                </p>
                <p style={styles.itemDate}>
                  Uploaded: {new Date(m.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div style={styles.itemBtns}>
              {m.fileUrl && (
                <button
                  style={styles.viewBtn}
                  onClick={() => window.open(m.fileUrl, '_blank')}
                >
                  👁 View
                </button>
              )}

              {m.fileUrl && (
                <a
                  href={m.fileUrl + "?fl_attachment=true"}
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
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 22, fontWeight: 700, color: '#1a1a2e', margin: 0 },
  backBtn: { padding: '8px 16px', background: '#f1f5f9', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13 },
  uploadBox: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 22, marginBottom: 28 },
  input: { width: '100%', padding: 10, marginBottom: 10, borderRadius: 8, border: '1px solid #ddd', fontSize: 13 },
  btn: { padding: '11px 24px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' },
  emptyBox: { textAlign: 'center', padding: 40, background: '#f8fafc', borderRadius: 14 },
  item: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '14px 18px', marginBottom: 10 },
  itemLeft: { display: 'flex', alignItems: 'center', gap: 14 },
  fileIcon: { fontSize: 28 },
  itemTitle: { fontWeight: 600, fontSize: 14, margin: 0 },
  itemSub: { fontSize: 12, color: '#64748b' },
  itemDate: { fontSize: 11, color: '#94a3b8' },
  itemBtns: { display: 'flex', gap: 8 },
  viewBtn: { padding: '6px 12px', background: '#e0f2fe', border: 'none', borderRadius: 6 },
  downloadBtn: { padding: '6px 12px', background: '#dcfce7', borderRadius: 6, textDecoration: 'none' },
  deleteBtn: { padding: '6px 12px', background: '#fee2e2', border: 'none', borderRadius: 6 }
};