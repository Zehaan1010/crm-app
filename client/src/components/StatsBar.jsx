import { useEffect, useState } from 'react';
import { getStats } from '../api/leads.js';

const statusOrder = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'];

const colors = {
  New:       '#3b82f6',
  Contacted: '#eab308',
  Qualified: '#8b5cf6',
  Converted: '#22c55e',
  Lost:      '#ef4444',
};

export default function StatsBar({ refresh }) {
  const [stats, setStats] = useState({ total: 0, stats: [] });

  useEffect(() => {
    getStats().then(r => setStats(r.data));
  }, [refresh]);

  const getCount = (status) => {
    const found = stats.stats.find(s => s._id === status);
    return found ? found.count : 0;
  };

  return (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
      <div style={cardStyle('#1a1a2e', '#fff')}>
        <div style={{ fontSize: '28px', fontWeight: 700 }}>{stats.total}</div>
        <div style={{ fontSize: '13px', opacity: 0.7 }}>Total Leads</div>
      </div>
      {statusOrder.map(status => (
        <div key={status} style={cardStyle(colors[status], '#fff')}>
          <div style={{ fontSize: '28px', fontWeight: 700 }}>{getCount(status)}</div>
          <div style={{ fontSize: '13px', opacity: 0.85 }}>{status}</div>
        </div>
      ))}
    </div>
  );
}

const cardStyle = (bg, color) => ({
  background: bg,
  color,
  padding: '16px 24px',
  borderRadius: '12px',
  minWidth: '110px',
  flex: 1,
});