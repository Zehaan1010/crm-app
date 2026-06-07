import { useState, useEffect } from 'react';
import { createLead, updateLead } from '../api/leads';
import toast from 'react-hot-toast';

const STATUSES = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'];
const EMPTY = { name: '', email: '', phone: '', company: '', status: 'New', notes: '' };

export default function LeadModal({ lead, onClose, onSaved }) {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lead) setForm(lead);
    else setForm(EMPTY);
  }, [lead]);

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (lead?._id) {
        await updateLead(lead._id, form);
        toast.success('Lead updated!');
      } else {
        await createLead(form);
        toast.success('Lead created!');
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700 }}>{lead?._id ? 'Edit Lead' : 'Add New Lead'}</h2>
          <button onClick={onClose} style={closeBtn}>✕</button>
        </div>

        <form onSubmit={submit}>
          {[
            { label: 'Full Name',     name: 'name',    type: 'text' },
            { label: 'Email',         name: 'email',   type: 'email' },
            { label: 'Phone Number',  name: 'phone',   type: 'text' },
            { label: 'Company Name',  name: 'company', type: 'text' },
          ].map(f => (
            <div key={f.name} style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>{f.label}</label>
              <input
                name={f.name}
                type={f.type}
                value={form[f.name]}
                onChange={handle}
                required
                style={inputStyle}
              />
            </div>
          ))}

          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Status</label>
            <select name="status" value={form.status} onChange={handle} style={inputStyle}>
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handle}
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} style={cancelBtn}>Cancel</button>
            <button type="submit" disabled={loading} style={submitBtn}>
              {loading ? 'Saving...' : lead?._id ? 'Update Lead' : 'Add Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const overlay  = { position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000 };
const modal    = { background:'#fff',borderRadius:'16px',padding:'28px',width:'100%',maxWidth:'480px',maxHeight:'90vh',overflowY:'auto' };
const closeBtn = { background:'none',border:'none',fontSize:'18px',cursor:'pointer',color:'#666' };
const labelStyle = { display:'block',fontSize:'13px',fontWeight:600,marginBottom:'6px',color:'#444' };
const inputStyle = { width:'100%',padding:'10px 12px',borderRadius:'8px',border:'1px solid #ddd',fontSize:'14px',outline:'none' };
const cancelBtn  = { padding:'10px 20px',borderRadius:'8px',border:'1px solid #ddd',background:'#fff',fontSize:'14px' };
const submitBtn  = { padding:'10px 20px',borderRadius:'8px',border:'none',background:'#1a1a2e',color:'#fff',fontSize:'14px' };