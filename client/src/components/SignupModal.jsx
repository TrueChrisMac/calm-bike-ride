import { useState, useEffect, useRef } from 'react';

export default function SignupModal({ slot, bikeIndex, onClose, onSignup }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const nameRef = useRef(null);

  useEffect(() => {
    nameRef.current?.focus();
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError('Please fill in both your name and email.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await onSignup(name.trim(), email.trim());
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const bikeNum = bikeIndex + 1;

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        {success ? (
          <div className="submit-success">
            <h3>You&apos;re in!</h3>
            <p>
              Your calendar invite is downloading now. Open it to add Slot {slot.id} (Bike {bikeNum}) to your Outlook.
            </p>
            <br />
            <button className="cancel-btn" onClick={onClose} style={{ width: '100%' }}>
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="modal-header">
              <h2 className="modal-title" id="modal-title">Claim your slot</h2>
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
                <span className="modal-info-label">Period</span>
                <span className={`modal-info-value period-${slot.period}`}>{slot.period}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {error && <div className="modal-error">{error}</div>}

              <div className="form-group">
                <label className="form-label" htmlFor="rider-name">Full Name</label>
                <input
                  id="rider-name"
                  ref={nameRef}
                  className="form-input"
                  type="text"
                  placeholder="e.g. Jane Smith"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  autoComplete="name"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="rider-email">Work Email</label>
                <input
                  id="rider-email"
                  className="form-input"
                  type="email"
                  placeholder="e.g. jane@truetechnology.co.uk"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={onClose} disabled={loading}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Booking...' : 'Claim Slot & Get Calendar Invite'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
