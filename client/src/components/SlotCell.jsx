export default function SlotCell({ rider, onSignUp }) {
  if (rider) {
    return (
      <div className="slot-cell">
        <div className="rider-badge">
          <span className="rider-dot" />
          <span className="rider-name" title={rider.name}>{rider.name}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="slot-cell">
      <button className="signup-btn" onClick={onSignUp}>
        Sign Up
      </button>
    </div>
  );
}
