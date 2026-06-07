function StatusBadge({ status }) {
  let backgroundColor = '#111';
  let textColor = '#fff';
  let borderColor = '#222';

  if (status === 'New') {
    backgroundColor = '#111';
    textColor = '#fff';
    borderColor = '#222';
  } else if (status === 'Contacted') {
    backgroundColor = '#111';
    textColor = '#888';
    borderColor = '#222';
  } else if (status === 'Qualified') {
    backgroundColor = '#fff';
    textColor = '#000';
    borderColor = '#fff';
  } else if (status === 'Converted') {
    backgroundColor = '#1a1a1a';
    textColor = '#aaa';
    borderColor = '#333';
  } else if (status === 'Lost') {
    backgroundColor = '#111';
    textColor = '#444';
    borderColor = '#1a1a1a';
  }

  return (
    <span style={{
      backgroundColor: backgroundColor,
      color: textColor,
      border: '1px solid ' + borderColor,
      padding: '2px 8px',
      borderRadius: '4px',
      fontSize: '10px',
      fontWeight: '500',
      letterSpacing: '0.03em',
    }}>
      {status}
    </span>
  );
}

export default StatusBadge;