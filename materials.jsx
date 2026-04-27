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

  // ✅ FIXED: Open file correctly based on type
  const handleView = (m) => {
    const url = m.fileUrl;

    if (!url) {
      alert('No file available');
      return;
    }

    if (m.fileType === 'application/pdf') {
      // ✅ Open PDF inside Google Docs viewer — works in any browser
      const googleViewer = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
      window.open(googleViewer, '_blank');

    } else if (
      m.fileType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
      m.fileType === 'application/vnd.ms-powerpoint'
    ) {
      // ✅ Open PPTX inside Microsoft Office Online viewer
      const officeViewer = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(url)}`;
      window.open(officeViewer, '_blank');

    } else if (
      m.fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      m.fileType === 'application/msword'
    ) {
      // ✅ Open DOCX inside Microsoft Office Online viewer
      const officeViewer = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(url)}`;
      window.open(officeViewer, '_blank');

    } else {
      // ✅ For images, TXT and other files — open directly
      window.open(url, '_blank');
    }
  };

  // ✅ FIXED: Download with correct Cloudinary download flag
  const handleDownload = (m) => {
    const url = m.fileUrl;
    if (!url) return;

    // Add fl_attachment to force download from Cloudinary
    const downloadUrl = url.includes('?')
      ? url + '&fl_attachment=true'
      : url + '?fl_attachment=true';

    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = m.title || 'file';
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
          style={styles.input}
        />

        <input
          placeholder="Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          style={styles.input}
        />

        <input
          placeholder="Topic"
          value={form.topic}
          onChange={e => setForm({ ...form, topic: e.target.value })}
          style={styles.input}
        />

        <input type="file" onChange={e => setFile(e.target.files[0])} style={styles.input} />

        <button onClick={handleUpload} disabled={loading} style={styles.uploadBtn}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>

        {msg && <p style={{ color: msg.includes('success') ? 'green' : 'red' }}>{msg}</p>}
      </div>

      {/* List */}
      <h3>My Materials ({materials.length})</h3>

      {materials.length === 0 ? (
        <p>No materials uploaded yet.</p>
      ) : (
        materials.map(m => (
          <div key={m._id} style={styles.item}>
            <div>
              <p style={{ margin: 0, fontWeight: 'bold' }}>{m.title}</p>
              <p style={{ margin: 0, color: '#666', fontSize: 14 }}>{m.subject}</p>
              {m.topic && <p style={{ margin: 0, color: '#999', fontSize: 12 }}>{m.topic}</p>}
              <p style={{ margin: 0, color: '#aaa', fontSize: 11 }}>{m.fileType}</p>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {m.fileUrl && (
                <button onClick={() => handleView(m)} style={styles.viewBtn}>
                  👁 View
                </button>
              )}

              {m.fileUrl && (
                <button onClick={() => handleDownload(m)} style={styles.downloadBtn}>
                  ⬇ Download
                </button>
              )}

              <button onClick={() => handleDelete(m._id)} style={styles.deleteBtn}>
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
  container: { padding: 20, maxWidth: 900, margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  box: { marginBottom: 20, padding: 16, border: '1px solid #ddd', borderRadius: 8 },
  input: { display: 'block', width: '100%', marginBottom: 10, padding: 8, borderRadius: 4, border: '1px solid #ccc' },
  uploadBtn: { padding: '8px 20px', background: '#4F46E5', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid #ddd',
    padding: 12,
    marginTop: 10,
    borderRadius: 8
  },
  viewBtn: { padding: '6px 14px', background: '#06B6D4', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' },
  downloadBtn: { padding: '6px 14px', background: '#22C55E', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' },
  deleteBtn: { padding: '6px 14px', background: '#EF4444', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' },
};
