export default function Header({ rota }) {
  const totalSlots = rota ? rota.slots.reduce((acc, s) => acc + s.bikes.length, 0) : 144;
  const filledSlots = rota ? rota.slots.reduce((acc, s) => acc + s.bikes.filter(Boolean).length, 0) : 0;
  const availableSlots = totalSlots - filledSlots;

  return (
    <header className="header">
      <div className="header-top">
        <span className="calm-pill">CALM Charity Challenge</span>
      </div>

      <h1>Budapest Bike Ride 2026</h1>
      <p className="header-subtitle">
        Guildford &rarr; Budapest &nbsp;&middot;&nbsp; 3 bikes &nbsp;&middot;&nbsp; 1 team &nbsp;&middot;&nbsp; 1 cause
      </p>

      <div className="header-stats">
        <div className="stat">
          <div className="stat-value">1,500km</div>
          <div className="stat-label">Total distance</div>
        </div>
        <div className="stat">
          <div className="stat-value">24 hrs</div>
          <div className="stat-label">Non-stop</div>
        </div>
        <div className="stat">
          <div className="stat-value">3</div>
          <div className="stat-label">Bikes</div>
        </div>
        <div className="stat">
          <div className="stat-value">48</div>
          <div className="stat-label">Slots</div>
        </div>
        {rota && (
          <div className="stat">
            <div className="stat-value" style={{ color: availableSlots > 0 ? '#4ade80' : '#f87171' }}>
              {availableSlots}
            </div>
            <div className="stat-label">Slots open</div>
          </div>
        )}
      </div>

      <p className="header-dates">
        Tuesday 21 May 10:00 &rarr; Wednesday 22 May 10:00 &middot; True Technology Guildford
      </p>
    </header>
  );
}
