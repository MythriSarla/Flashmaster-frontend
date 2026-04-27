import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Materials() {
  const [materials, setMaterials] = useState([]);
  const [form, setForm]           = useState({ subject: '', title: '', topic: '' });
  const [file, setFile]           = useState(null);
  const [msg,  setMsg]            = useState('');
  const navigate                  = useNavigate();

  useEffect(() => { fetchMaterials(); }, []);

  const fetchMaterials = async () => {
    try { const { data } = await API.get('/materials'); setMaterials(data); }
    catch { navigate('/login'); }
  };

  const handleUpload = async () => {
    try {
      const fd = new FormData();
      fd.append('subject', form.subject);
      fd.append('title',   form.title);
      fd.append('topic',   form.topic);
      if (file) fd.append('file', file);
      await API.post('/materials', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMsg('Material uploaded successfully!');
      setForm({ subject: '', title: '', topic: '' });
      setFile(null);
      fetchMaterials();
    } catch (err) { setMsg(err.response?.data?.msg || 'Upload failed'); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this material?')) {
      await API.delete(`/materials/${id}`);
      fetchMaterials();
    }
  };

  // ✅ View file using Google/Microsoft viewers
  const handleView = (m) => {
    const url = m.fileUrl;
    if (!url) { alert('No file available'); return; }

    if (m.fileType === 'application/pdf') {
      // Open PDF in Google Docs Viewer
      window.open(`https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`, '_blank');

    } else if (
      m.fileType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
      m.fileType === 'application/vnd.ms-powerpoint' ||
      m.fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      m.fileType === 'application/msword'
    ) {
      // Open PPTX / DOCX in Microsoft Office Online Viewer
      window.open(`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(url)}`, '_blank');

    } else {
      // Images, TXT — open directly
      window.open(url, '_blank');
    }
  };

  // ✅ Download file
  const handleDownload = (m) => {
    const url = m.fileUrl;
    if (!url) return;
    const downloadUrl = url.includes('?') ? url + '&fl_attachment=true' : url + '?fl_attachment=true';
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
        <h2 style={styles.title}>Study Materials</h2>
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>Back</button>
      </div>

      <div style={styles.uploadBox}>
        <h3 style={{ margin: '0 0 12px', fontSize: 15 }}>Upload New Material</h3>
        <input style={styles.input} placeholder="Subject (e.g. Data Structures)" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} />
        <input style={styles.input} placeholder="Title (e.g. Linked List Notes)"  value={form.title}   onChange={e => setForm({...form, title: e.target.value})} />
        <input style={styles.input} placeholder="Topic (optional)"                value={form.topic}   onChange={e => setForm({...form, topic: e.target.value})} />
        <input type="file" style={{ marginBottom: 12, fontSize: 13 }} onChange={e => setFile(e.target.files[0])} />
        <button style={styles.btn} onClick={handleUpload}>Upload Material</button>
        {msg && <p style={{ color: msg.includes('success') ? 'green' : 'red', fontSize: 13, marginTop: 8 }}>{msg}</p>}
      </div>

      <h3 style={{ fontSize: 16, marginBottom: 12, color: '#1a1a2e' }}>My Uploaded Materials ({materials.length})</h3>

      {materials.length === 0
        ? <p style={{ color: '#999', fontSize: 14 }}>No materials uploaded yet.</p>
        : materials.map(m => (
          <div key={m._id} style={styles.item}>
            <div>
              <p style={styles.itemTitle}>{m.title}</p>
              <p style={styles.itemSub}>{m.subject}{m.topic ? ' — ' + m.topic : ''}</p>
              <p style={{ fontSize: 11, color: '#bbb', margin: '2px 0 0' }}>{m.fileType}</p>
            </div>

            {/* ✅ View + Download + Delete buttons */}
            <div style={{ display: 'flex', gap: 8 }}>
              {m.fileUrl && (
                <button style={styles.viewBtn} onClick={() => handleView(m)}>
                  👁 View
                </button>
              )}
              {m.fileUrl && (
                <button style={styles.downloadBtn} onClick={() => handleDownload(m)}>
                  ⬇ Download
                </button>
              )}
              <button style={styles.deleteBtn} onClick={() => handleDelete(m._id)}>
                🗑 Delete
              </button>
            </div>
          </div>
        ))
      }
    </div>
  );
}

const styles = {
  container:   { maxWidth: 800, margin: '0 auto', padding: 32 },
  header:      { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title:       { fontSize: 22, fontWeight: 700, color: '#1a1a2e', margin: 0 },
  backBtn:     { padding: '8px 16px', background: '#f1f5f9', border: 'none', borderRadius: 8, cursor: 'pointer' },
  uploadBox:   { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20, marginBottom: 28 },
  input:       { width: '100%', padding: 10, marginBottom: 10, borderRadius: 8, border: '1px solid #ddd', fontSize: 13, boxSizing: 'border-box' },
  btn:         { padding: '10px 20px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 },
  item:        { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '14px 18px', marginBottom: 10 },
  itemTitle:   { fontWeight: 600, fontSize: 14, margin: 0, color: '#1a1a2e' },
  itemSub:     { fontSize: 12, color: '#888', margin: '4px 0 0' },
  viewBtn:     { padding: '6px 14px', background: '#06B6D4', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12 },
  downloadBtn: { padding: '6px 14px', background: '#22C55E', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12 },
  deleteBtn:   { padding: '6px 14px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12 },
};
