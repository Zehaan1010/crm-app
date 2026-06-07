import { useState, useEffect } from 'react';
import { createLead, updateLead } from '../api/leads.js';

function LeadModal({ lead, onClose, onSaved, darkMode }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [status, setStatus] = useState('New');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // theme
  var modalBg  = darkMode ? '#111111' : '#ffffff';
  var border   = darkMode ? '#1f1f1f' : '#aaaaaa';
  var inputBg  = darkMode ? '#000000' : '#f9f9f9';
  var textMain = darkMode ? '#ffffff' : '#111111';
  var textSub  = darkMode ? '#444444' : '#888888';
  var optionBg = darkMode ? '#111111' : '#ffffff';

  var inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid ' + border,
    backgroundColor: inputBg,
    color: textMain,
    fontSize: '16px',
    boxSizing: 'border-box',
    outline: 'none',
    fontFamily: 'inherit',
  };

  var labelStyle = {
    display: 'block',
    fontSize: '13px',
    color: textSub,
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontWeight: '600',
  };

  useEffect(function() {
    if (lead) {
      setName(lead.name);
      setEmail(lead.email);
      setPhone(lead.phone);
      setCompany(lead.company);
      setStatus(lead.status);
      setNotes(lead.notes || '');
    } else {
      setName('');
      setEmail('');
      setPhone('');
      setCompany('');
      setStatus('New');
      setNotes('');
    }
  }, [lead]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    var leadData = {
      name: name,
      email: email,
      phone: phone,
      company: company,
      status: status,
      notes: notes,
    };

    try {
      if (lead && lead._id) {
        await updateLead(lead._id, leadData);
      } else {
        await createLead(leadData);
      }
      onSaved();
      onClose();
    } catch (err) {
      setErrorMessage('Something went wrong. Please try again.');
      console.log('save error:', err);
    }

    setLoading(false);
  }

  return (
    <div style={{
      position: 'fixed',
      top: '0', left: '0',
      width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: '1000',
    }}>
      <div style={{
        backgroundColor: modalBg,
        border: '1px solid ' + border,
        borderRadius: '12px',
        padding: '36px',
        width: '540px',
        maxWidth: '95vw',
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>

        {/* header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <h2 style={{ margin: '0', fontSize: '22px', fontWeight: '700', color: textMain }}>
            {lead && lead._id ? 'Edit Lead' : 'New Lead'}
          </h2>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid ' + border,
              color: textSub,
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              fontSize: '15px',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>

        {/* error message */}
        {errorMessage && (
          <p style={{ color: '#f87171', fontSize: '14px', marginBottom: '20px' }}>
            ⚠️ {errorMessage}
          </p>
        )}

        <form onSubmit={handleSubmit}>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
            <div>
              <label style={labelStyle}>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={function(e) { setName(e.target.value); }}
                required
                placeholder="John Doe"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                value={email}
                onChange={function(e) { setEmail(e.target.value); }}
                required
                placeholder="john@company.com"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={function(e) { setPhone(e.target.value); }}
                required
                placeholder="+91 98765 43210"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Company</label>
              <input
                type="text"
                value={company}
                onChange={function(e) { setCompany(e.target.value); }}
                required
                placeholder="Acme Corp"
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ marginTop: '18px' }}>
            <label style={labelStyle}>Status</label>
            <select
              value={status}
              onChange={function(e) { setStatus(e.target.value); }}
              style={inputStyle}
            >
              <option value="New"       style={{ backgroundColor: optionBg }}>New</option>
              <option value="Contacted" style={{ backgroundColor: optionBg }}>Contacted</option>
              <option value="Qualified" style={{ backgroundColor: optionBg }}>Qualified</option>
              <option value="Converted" style={{ backgroundColor: optionBg }}>Converted</option>
              <option value="Lost"      style={{ backgroundColor: optionBg }}>Lost</option>
            </select>
          </div>

          <div style={{ marginTop: '18px', marginBottom: '28px' }}>
            <label style={labelStyle}>Notes</label>
            <textarea
              value={notes}
              onChange={function(e) { setNotes(e.target.value); }}
              rows={4}
              placeholder="Any extra info about this lead..."
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 22px',
                borderRadius: '8px',
                border: '1px solid ' + border,
                backgroundColor: 'transparent',
                color: textSub,
                fontSize: '16px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '10px 24px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: darkMode ? '#ffffff' : '#111111',
                color: darkMode ? '#000000' : '#ffffff',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Saving...' : lead && lead._id ? 'Update Lead' : 'Add Lead'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default LeadModal;
