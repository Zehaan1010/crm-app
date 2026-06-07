const colors = {
  New:       { bg: '#dbeafe', text: '#1d4ed8' },
  Contacted: { bg: '#fef9c3', text: '#854d0e' },
  Qualified: { bg: '#ede9fe', text: '#6d28d9' },
  Converted: { bg: '#dcfce7', text: '#166534' },
  Lost:      { bg: '#fee2e2', text: '#991b1b' },
};

export default function StatusBadge({ status }) {
  const c = colors[status] || colors.New;
  return (
    <span style={{
      backgroundColor: c.bg,
      color: c.text,
      padding: '3px 10px',
      borderRadius: '999px',
      fontSize: '12px',
      fontWeight: 600,
    }}>
      {status}
    </span>
  );
}