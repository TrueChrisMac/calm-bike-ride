import SlotCell from './SlotCell';

const PERIODS = ['Day', 'Evening', 'Night', 'Morning'];
const PERIOD_LABELS = {
  Day:     'Day  10:00 – 18:00',
  Evening: 'Evening  18:00 – 22:00',
  Night:   'Night  22:00 – 06:00',
  Morning: 'Morning  06:00 – 10:00',
};

export default function RotaBoard({ slots, onSlotClick, onCancelClick, onRefresh }) {
  const filledCount = slots.reduce((acc, s) => acc + s.bikes.filter(Boolean).length, 0);
  const totalCount = slots.length * 3;

  const slotsByPeriod = PERIODS.map(period => ({
    period,
    slots: slots.filter(s => s.period === period),
  }));

  return (
    <div className="rota-board">
      <div className="rota-controls">
        <p className="rota-summary">
          <strong>{filledCount}</strong> of <strong>{totalCount}</strong> rider slots filled &nbsp;&middot;&nbsp;{' '}
          <strong>{totalCount - filledCount}</strong> still available
        </p>
        <button className="refresh-btn" onClick={onRefresh}>
          Refresh
        </button>
      </div>

      <div className="legend">
        {PERIODS.map(p => (
          <div key={p} className="legend-item">
            <span className={`legend-dot ${p.toLowerCase()}`} />
            {PERIOD_LABELS[p]}
          </div>
        ))}
      </div>

      <div className="rota-table-wrapper">
        <table className="rota-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}>#</th>
              <th>Time</th>
              <th className="bike-col">Bike 1</th>
              <th className="bike-col">Bike 2</th>
              <th className="bike-col">Bike 3</th>
            </tr>
          </thead>
          <tbody>
            {slotsByPeriod.map(({ period, slots: periodSlots }) => (
              <>
                <tr key={`period-${period}`} className={`period-header-row ${period}`}>
                  <td colSpan={5}>{PERIOD_LABELS[period]}</td>
                </tr>
                {periodSlots.map(slot => (
                  <tr key={slot.id} className={`slot-row ${slot.period}`}>
                    <td className="slot-num">{slot.id}</td>
                    <td className="slot-time">{slot.label}</td>
                    {slot.bikes.map((rider, bikeIndex) => (
                      <td key={bikeIndex} style={{ padding: 0, borderLeft: '1px solid #0f172a' }}>
                        <SlotCell
                          rider={rider}
                          onSignUp={() => onSlotClick(slot, bikeIndex)}
                          onCancel={() => onCancelClick(slot, bikeIndex)}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
