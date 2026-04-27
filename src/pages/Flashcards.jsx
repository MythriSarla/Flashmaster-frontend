import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';

function FlipCard({ card, onMark }) {
  const [flipped, setFlipped] = useState(false);
  const colors = { easy: '#dcfce7', medium: '#fef9c3', difficult: '#fee2e2' };
  return (
    <div onClick={() => setFlipped(!flipped)} style={{ ...styles.card, background: colors[card.difficulty] || '#f9fafb' }}>
      <p style={styles.cardType}>{flipped ? 'Answer' : 'Question'}</p>
      <p style={styles.cardText}>{flipped ? card.answer : card.question}</p>
      {flipped && (
        <div style={styles.btnRow} onClick={e => e.stopPropagation()}>
          {['easy','medium','difficult'].map(lvl => (
            <button key={lvl} style={styles.markBtn} onClick={() => onMark(card._id, lvl)}>{lvl}</button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Flashcards() {
  const [cards, setCards] = useState([]);
  const [form,  setForm]  = useState({ question: '', answer: '' });
  const [msg,   setMsg]   = useState('');
  const navigate          = useNavigate();

  useEffect(() => { fetchCards(); }, []);

  const fetchCards = async () => {
    try { const { data } = await API.get('/flashcards'); setCards(data); }
    catch { navigate('/login'); }
  };

  const addCard = async () => {
    try {
      await API.post('/flashcards', { ...form, materialId: '000000000000000000000000' });
      setMsg('Flashcard added!');
      setForm({ question: '', answer: '' });
      fetchCards();
    } catch (err) { setMsg(err.response?.data?.msg || 'Error adding card'); }
  };

  const markDifficulty = async (id, level) => {
    await API.patch(`/flashcards/${id}/difficulty`, { difficulty: level });
    fetchCards();
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>My Flashcards</h2>
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>Back</button>
      </div>
      <div style={styles.addBox}>
        <h3 style={{ margin: '0 0 12px', fontSize: 15 }}>Add New Flashcard</h3>
        <input style={styles.input} placeholder="Question" value={form.question} onChange={e => setForm({...form, question: e.target.value})} />
        <input style={styles.input} placeholder="Answer"   value={form.answer}   onChange={e => setForm({...form, answer: e.target.value})} />
        <button style={styles.btn} onClick={addCard}>Add Flashcard</button>
        {msg && <p style={{ color: 'green', fontSize: 13, marginTop: 8 }}>{msg}</p>}
      </div>
      <p style={{ color: '#666', fontSize: 13, marginBottom: 16 }}>Click a card to flip. Then mark your difficulty level.</p>
      <div style={styles.grid}>
        {cards.length === 0
          ? <p style={{ color: '#999' }}>No flashcards yet. Add one above!</p>
          : cards.map(c => <FlipCard key={c._id} card={c} onMark={markDifficulty} />)
        }
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: 900, margin: '0 auto', padding: 32 },
  header:    { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title:     { fontSize: 22, fontWeight: 700, color: '#1a1a2e', margin: 0 },
  backBtn:   { padding: '8px 16px', background: '#f1f5f9', border: 'none', borderRadius: 8, cursor: 'pointer' },
  addBox:    { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20, marginBottom: 28 },
  input:     { width: '100%', padding: 10, marginBottom: 10, borderRadius: 8, border: '1px solid #ddd', fontSize: 13, boxSizing: 'border-box' },
  btn:       { padding: '10px 20px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 },
  grid:      { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))', gap: 16 },
  card:      { padding: 24, borderRadius: 12, cursor: 'pointer', minHeight: 140, border: '1px solid #e2e8f0' },
  cardType:  { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#888', margin: '0 0 8px' },
  cardText:  { fontSize: 15, color: '#1a1a2e', lineHeight: 1.5, margin: 0 },
  btnRow:    { display: 'flex', gap: 8, marginTop: 16 },
  markBtn:   { padding: '4px 12px', borderRadius: 6, border: '1px solid #ccc', cursor: 'pointer', fontSize: 12, background: '#fff' },
};
