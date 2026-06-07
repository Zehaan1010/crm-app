import { useEffect, useState } from 'react';
import { getStats } from '../api/leads.js';

function StatsBar({ refresh }) {
  const [totalLeads, setTotalLeads] = useState(0);
  const [newCount, setNewCount] = useState(0);
  const [contactedCount, setContactedCount] = useState(0);
  const [qualifiedCount, setQualifiedCount] = useState(0);
  const [convertedCount, setConvertedCount] = useState(0);
  const [lostCount, setLostCount] = useState(0);

  useEffect(() => {
    getStats().then(function(res) {
      setTotalLeads(res.total);

      var statsArray = res.stats;

      for (var i = 0; i < statsArray.length; i++) {
        if (statsArray[i]._id === 'New') {
          setNewCount(statsArray[i].count);
        }
        if (statsArray[i]._id === 'Contacted') {
          setContactedCount(statsArray[i].count);
        }
        if (statsArray[i]._id === 'Qualified') {
          setQualifiedCount(statsArray[i].count);
        }
        if (statsArray[i]._id === 'Converted') {
          setConvertedCount(statsArray[i].count);
        }
        if (statsArray[i]._id === 'Lost') {
          setLostCount(statsArray[i].count);
        }
      }
    }).catch(function(err) {
      console.log('error getting stats', err);
    });
  }, [refresh]);

  return (
    <div style={{ display: 'flex', gap: '1px', marginBottom: '20px', backgroundColor: '#1a1a1a', borderRadius: '8px', overflow: 'hidden' }}>

      <div style={{ backgroundColor: '#000', padding: '14px 18px', flex: '1' }}>
        <div style={{ fontSize: '22px', fontWeight: '600', letterSpacing: '-0.03em', color: '#fff' }}>{totalLeads}</div>
        <div style={{ fontSize: '10px', color: '#444', marginTop: '2px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Total</div>
      </div>

      <div style={{ backgroundColor: '#000', padding: '14px 18px', flex: '1', borderLeft: '1px solid #1a1a1a' }}>
        <div style={{ fontSize: '22px', fontWeight: '600', letterSpacing: '-0.03em', color: '#fff' }}>{newCount}</div>
        <div style={{ fontSize: '10px', color: '#444', marginTop: '2px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>New</div>
      </div>

      <div style={{ backgroundColor: '#000', padding: '14px 18px', flex: '1', borderLeft: '1px solid #1a1a1a' }}>
        <div style={{ fontSize: '22px', fontWeight: '600', letterSpacing: '-0.03em', color: '#fff' }}>{contactedCount}</div>
        <div style={{ fontSize: '10px', color: '#444', marginTop: '2px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Contacted</div>
      </div>

      <div style={{ backgroundColor: '#000', padding: '14px 18px', flex: '1', borderLeft: '1px solid #1a1a1a' }}>
        <div style={{ fontSize: '22px', fontWeight: '600', letterSpacing: '-0.03em', color: '#fff' }}>{qualifiedCount}</div>
        <div style={{ fontSize: '10px', color: '#444', marginTop: '2px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Qualified</div>
      </div>

      <div style={{ backgroundColor: '#000', padding: '14px 18px', flex: '1', borderLeft: '1px solid #1a1a1a' }}>
        <div style={{ fontSize: '22px', fontWeight: '600', letterSpacing: '-0.03em', color: '#fff' }}>{convertedCount}</div>
        <div style={{ fontSize: '10px', color: '#444', marginTop: '2px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Converted</div>
      </div>

      <div style={{ backgroundColor: '#000', padding: '14px 18px', flex: '1', borderLeft: '1px solid #1a1a1a' }}>
        <div style={{ fontSize: '22px', fontWeight: '600', letterSpacing: '-0.03em', color: '#fff' }}>{lostCount}</div>
        <div style={{ fontSize: '10px', color: '#444', marginTop: '2px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Lost</div>
      </div>

    </div>
  );
}

export default StatsBar;