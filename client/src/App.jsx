import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import RotaBoard from './components/RotaBoard';
import SignupModal from './components/SignupModal';

export default function App() {
  const [rota, setRota] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null); // { slot, bikeIndex }

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
    const { slot, bikeIndex } = selected;
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

    setSelected(null);
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
          onSlotClick={(slot, bikeIndex) => setSelected({ slot, bikeIndex })}
          onRefresh={fetchRota}
        />
      )}
      {selected && (
        <SignupModal
          slot={selected.slot}
          bikeIndex={selected.bikeIndex}
          onClose={() => setSelected(null)}
          onSignup={handleSignup}
        />
      )}
    </div>
  );
}
