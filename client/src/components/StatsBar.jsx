import { useEffect, useState } from 'react';
import { getStats } from '../api/leads.js';

function StatsBar({ refresh, darkMode }) {

  // separate state for each stat - easier to manage
  const [totalLeads, setTotalLeads] = useState(0);
  const [newCount, setNewCount] = useState(0);
  const [contactedCount, setContactedCount] = useState(0);
  const [qualifiedCount, setQualifiedCount] = useState(0);
  const [convertedCount, setConvertedCount] = useState(0);
  const [lostCount, setLostCount] = useState(0);

  // colors based on theme
  var cardBg = '#000000';
  var borderCol = '#1f1f1f';
  var numberColor = '#ffffff';
  var labelColor = '#444444';

  if (darkMode === false) {
    cardBg = '#ffffff';
    borderCol = '#aaaaaa';  // made it darker so borders show up in light mode
    numberColor = '#111111';
    labelColor = '#999999';
  }

  // fetch stats from backend whenever refresh changes
  useEffect(function() {
    getStats().then(function(res) {
      // fetch returns json directly (not res.data like axios)
      setTotalLeads(res.total);

      var statsArray = res.stats;

      // loop through and set each status count
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
    <div style={{ display: 'flex', gap: '1px', marginBottom: '28px', backgroundColor: borderCol, borderRadius: '10px', overflow: 'hidden', border: '1px solid ' + borderCol }}>

      <div style={{ backgroundColor: cardBg, padding: '20px 24px', flex: '1' }}>
        <div style={{ fontSize: '36px', fontWeight: '700', letterSpacing: '-0.03em', color: numberColor, lineHeight: '1' }}>{totalLeads}</div>
        <div style={{ fontSize: '13px', color: labelColor, marginTop: '6px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Total</div>
      </div>

      <div style={{ backgroundColor: cardBg, padding: '20px 24px', flex: '1', borderLeft: '1px solid ' + borderCol }}>
        <div style={{ fontSize: '36px', fontWeight: '700', letterSpacing: '-0.03em', color: '#3b82f6', lineHeight: '1' }}>{newCount}</div>
        <div style={{ fontSize: '13px', color: labelColor, marginTop: '6px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>New</div>
      </div>

      <div style={{ backgroundColor: cardBg, padding: '20px 24px', flex: '1', borderLeft: '1px solid ' + borderCol }}>
        <div style={{ fontSize: '36px', fontWeight: '700', letterSpacing: '-0.03em', color: '#f59e0b', lineHeight: '1' }}>{contactedCount}</div>
        <div style={{ fontSize: '13px', color: labelColor, marginTop: '6px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Contacted</div>
      </div>

      <div style={{ backgroundColor: cardBg, padding: '20px 24px', flex: '1', borderLeft: '1px solid ' + borderCol }}>
        <div style={{ fontSize: '36px', fontWeight: '700', letterSpacing: '-0.03em', color: '#8b5cf6', lineHeight: '1' }}>{qualifiedCount}</div>
        <div style={{ fontSize: '13px', color: labelColor, marginTop: '6px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Qualified</div>
      </div>

      <div style={{ backgroundColor: cardBg, padding: '20px 24px', flex: '1', borderLeft: '1px solid ' + borderCol }}>
        <div style={{ fontSize: '36px', fontWeight: '700', letterSpacing: '-0.03em', color: '#22c55e', lineHeight: '1' }}>{convertedCount}</div>
        <div style={{ fontSize: '13px', color: labelColor, marginTop: '6px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Converted</div>
      </div>

      <div style={{ backgroundColor: cardBg, padding: '20px 24px', flex: '1', borderLeft: '1px solid ' + borderCol }}>
        <div style={{ fontSize: '36px', fontWeight: '700', letterSpacing: '-0.03em', color: '#ef4444', lineHeight: '1' }}>{lostCount}</div>
        <div style={{ fontSize: '13px', color: labelColor, marginTop: '6px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Lost</div>
      </div>

    </div>
  );
}

export default StatsBar;
