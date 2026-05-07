import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import RotaBoard from './components/RotaBoard';
import SignupModal from './components/SignupModal';
import CancelModal from './components/CancelModal';

export default function App() {
  const [rota, setRota] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [signupTarget, setSignupTarget] = useState(null);  // { slot, bikeIndex }
  const [cancelTarget, setCancelTarget] = useState(null);  // { slot, bikeIndex }

  const fetchRota = useCallback(async () => {
    try {
      const res = await fetch('/api/rota');
      if (!res.ok) throw new Error('Server error');
      const data = await res.json();
      setRota(data);
      setError(null);
    } catch {
      setError('Could not connect to the server. Make sure it is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRota();
    const interval = setInterval(fetchRota, 30000);
    return () => clearInterval(interval);
  }, [fetchRota]);

  async function handleSignup(name, email) {
    const { slot, bikeIndex } = signupTarget;
    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slotId: slot.id, bikeIndex, name, email }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Signup failed');
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calm-bike-ride-slot-${slot.id}-bike-${bikeIndex + 1}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setSignupTarget(null);
    fetchRota();
  }

  async function handleCancel(email) {
    const { slot, bikeIndex } = cancelTarget;
    const res = await fetch('/api/cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slotId: slot.id, bikeIndex, email }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Could not release slot');
    }

    setCancelTarget(null);
    fetchRota();
  }

  return (
    <div>
      <Header rota={rota} />
      {loading && <p className="state-message">Loading rota...</p>}
      {error && <p className="state-message error">{error}</p>}
      {rota && (
        <RotaBoard
          slots={rota.slots}
          onSlotClick={(slot, bikeIndex) => setSignupTarget({ slot, bikeIndex })}
          onCancelClick={(slot, bikeIndex) => setCancelTarget({ slot, bikeIndex })}
          onRefresh={fetchRota}
        />
      )}
      {signupTarget && (
        <SignupModal
          slot={signupTarget.slot}
          bikeIndex={signupTarget.bikeIndex}
          onClose={() => setSignupTarget(null)}
          onSignup={handleSignup}
        />
      )}
      {cancelTarget && (
        <CancelModal
          slot={cancelTarget.slot}
          bikeIndex={cancelTarget.bikeIndex}
          onClose={() => setCancelTarget(null)}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
