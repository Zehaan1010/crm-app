import { useState, useEffect } from 'react';
import { createLead, updateLead } from '../api/leads.js';

function LeadModal({ lead, onClose, onSaved }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [status, setStatus] = useState('New');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (lead) {
      setName(lead.name);
      setEmail(lead.email);
      setPhone(lead.phone);
      setCompany(lead.company);
      setStatus(lead.status);
      setNotes(lead.notes);
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
      setErrorMessage(err.response?.data?.message || 'Something went wrong. Please try again.');
    }

    setLoading(false);
  }

  var inputStyle = {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #1a1a1a',
    backgroundColor: '#000',
    color: '#fff',
    fontSize: '13px',
    boxSizing: 'border-box',
    outline: 'none',
  };

  var labelStyle = {
    display: 'block',
    fontSize: '11px',
    color: '#444',
    marginBottom: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  };

  return (
    <div style={{ position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: '1000' }}>
      <div style={{ backgroundColor: '#111', border: '1px solid #1a1a1a', borderRadius: '10px', padding: '28px', width: '480px', maxHeight: '90vh', overflowY: 'auto' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: '0', fontSize: '16px', fontWeight: '600', color: '#fff' }}>
            {lead && lead._id ? 'Edit Lead' : 'New Lead'}
          </h2>
          <button onClick={onClose} style={{ backgroundColor: '#1a1a1a', border: '1px solid #222', color: '#666', width: '30px', height: '30px', borderRadius: '6px', fontSize: '14px' }}>
            ✕
          </button>
        </div>

        {errorMessage && (
          <p style={{ color: '#f87171', fontSize: '13px', marginBottom: '16px' }}>{errorMessage}</p>
        )}

        <form onSubmit={handleSubmit}>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={labelStyle}>Full Name</label>
              <input type="text" value={name} onChange={function(e) { setName(e.target.value); }} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input type="email" value={email} onChange={function(e) { setEmail(e.target.value); }} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Phone Number</label>
              <input type="text" value={phone} onChange={function(e) { setPhone(e.target.value); }} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Company</label>
              <input type="text" value={company} onChange={function(e) { setCompany(e.target.value); }} required style={inputStyle} />
            </div>
          </div>

          <div style={{ marginTop: '14px' }}>
            <label style={labelStyle}>Status</label>
            <select value={status} onChange={function(e) { setStatus(e.target.value); }} style={{ ...inputStyle }}>
              <option value="New" style={{ backgroundColor: '#111' }}>New</option>
              <option value="Contacted" style={{ backgroundColor: '#111' }}>Contacted</option>
              <option value="Qualified" style={{ backgroundColor: '#111' }}>Qualified</option>
              <option value="Converted" style={{ backgroundColor: '#111' }}>Converted</option>
              <option value="Lost" style={{ backgroundColor: '#111' }}>Lost</option>
            </select>
          </div>

          <div style={{ marginTop: '14px', marginBottom: '24px' }}>
            <label style={labelStyle}>Notes</label>
            <textarea value={notes} onChange={function(e) { setNotes(e.target.value); }} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} style={{ padding: '9px 18px', borderRadius: '6px', border: '1px solid #222', backgroundColor: 'transparent', color: '#888', fontSize: '13px' }}>
              Cancel
            </button>
            <button type="submit" disabled={loading} style={{ padding: '9px 20px', borderRadius: '6px', border: 'none', backgroundColor: '#fff', color: '#000', fontSize: '13px', fontWeight: '600' }}>
              {loading ? 'Saving...' : lead && lead._id ? 'Update Lead' : 'Add Lead'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default LeadModal;