import { useState, useEffect, useRef } from 'react';

export default function CancelModal({ slot, bikeIndex, onClose, onCancel }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await onCancel(email.trim());
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const rider = slot.bikes[bikeIndex];
  const bikeNum = bikeIndex + 1;

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal-header">
          <h2 className="modal-title">Change or cancel slot</h2>
        </div>

        <div className="modal-slot-info">
          <div className="modal-info-item">
            <span className="modal-info-label">Slot</span>
            <span className="modal-info-value">#{slot.id}</span>
          </div>
          <div className="modal-info-item">
            <span className="modal-info-label">Time</span>
            <span className="modal-info-value">{slot.label}</span>
          </div>
          <div className="modal-info-item">
            <span className="modal-info-label">Bike</span>
            <span className="modal-info-value">Bike {bikeNum}</span>
          </div>
          <div className="modal-info-item">
            <span className="modal-info-label">Booked by</span>
            <span className="modal-info-value">{rider?.name}</span>
          </div>
        </div>

        <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '1rem' }}>
          Enter the email used when booking to release this slot. You can then sign up for a different one.
        </p>

        <form onSubmit={handleSubmit}>
          {error && <div className="modal-error">{error}</div>}

          <div className="form-group">
            <label className="form-label" htmlFor="cancel-email">Your Email</label>
            <input
              id="cancel-email"
              ref={inputRef}
              className="form-input"
              type="email"
              placeholder="The email you booked with"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose} disabled={loading}>
              Keep slot
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
              style={{ background: 'linear-gradient(135deg, #9f1239, #881337)', borderColor: '#be123c' }}
            >
              {loading ? 'Releasing...' : 'Release slot'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
