import { useState, useEffect, useCallback } from 'react';
import { getLeads, deleteLead } from '../api/leads';
import StatsBar from '../components/StatsBar';
import StatusBadge from '../components/StatusBadge';
import LeadModal from '../components/LeadModal';
import toast, { Toaster } from 'react-hot-toast';

const STATUSES = ['', 'New', 'Contacted', 'Qualified', 'Converted', 'Lost'];

export default function Dashboard() {
  const [leads, setLeads]         = useState([]);
  const [total, setTotal]         = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage]           = useState(1);
  const [search, setSearch]       = useState('');
  const [status, setStatus]       = useState('');
  const [sort, setSort]           = useState('createdAt');
  const [order, setOrder]         = useState('desc');
  const [modalOpen, setModalOpen] = useState(false);
  const [editLead, setEditLead]   = useState(null);
  const [refresh, setRefresh]     = useState(0);

  const fetchLeads = useCallback(async () => {
    try {
      const res = await getLeads({ search, status, sort, order, page, limit: 8 });
      setLeads(res.data.leads);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
    } catch {
      toast.error('Failed to fetch leads');
    }
  }, [search, status, sort, order, page]);

  useEffect(() => { fetchLeads(); }, [fetchLeads, refresh]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this lead?')) return;
    try {
      await deleteLead(id);
      toast.success('Lead deleted');
      setRefresh(r => r + 1);
    } catch {
      toast.error('Failed to delete');
    }
  };

  const openAdd  = () => { setEditLead(null); setModalOpen(true); };
  const openEdit = (lead) => { setEditLead(lead); setModalOpen(true); };
  const onSaved  = () => setRefresh(r => r + 1);

  const toggleSort = (field) => {
    if (sort === field) setOrder(o => o === 'asc' ? 'desc' : 'asc');
    else { setSort(field); setOrder('asc'); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Toaster position="top-right" />

      {/* Header */}
      <div style={{ background: '#1a1a2e', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: '#fff', fontSize: '20px', fontWeight: 700 }}>🎯 Lead CRM</h1>
        <button onClick={openAdd} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 600 }}>
          + Add Lead
        </button>
      </div>

      <div style={{ padding: '28px 32px' }}>
        <StatsBar refresh={refresh} />

        {/* Search and Filter */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <input
            placeholder="Search by name, email or company..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            style={{ flex: 1, minWidth: '220px', padding: '10px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }}
          />
          <select
            value={status}
            onChange={e => { setStatus(e.target.value); setPage(1); }}
            style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }}
          >
            {STATUSES.map(s => <option key={s} value={s}>{s || 'All Statuses'}</option>)}
          </select>
        </div>

        {/* Table */}
        <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {[
                  { label: 'Name',    field: 'name' },
                  { label: 'Email',   field: 'email' },
                  { label: 'Phone',   field: null },
                  { label: 'Company', field: 'company' },
                  { label: 'Status',  field: 'status' },
                  { label: 'Created', field: 'createdAt' },
                  { label: 'Actions', field: null },
                ].map(col => (
                  <th
                    key={col.label}
                    onClick={() => col.field && toggleSort(col.field)}
                    style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: '#64748b', cursor: col.field ? 'pointer' : 'default', userSelect: 'none' }}
                  >
                    {col.label} {col.field && sort === col.field ? (order === 'asc' ? '↑' : '↓') : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                    No leads found. Add your first lead!
                  </td>
                </tr>
              ) : leads.map((lead, i) => (
                <tr key={lead._id} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                  <td style={td}><strong>{lead.name}</strong></td>
                  <td style={td}>{lead.email}</td>
                  <td style={td}>{lead.phone}</td>
                  <td style={td}>{lead.company}</td>
                  <td style={td}><StatusBadge status={lead.status} /></td>
                  <td style={td}>{new Date(lead.createdAt).toLocaleDateString()}</td>
                  <td style={td}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => openEdit(lead)} style={editBtn}>Edit</button>
                      <button onClick={() => handleDelete(lead._id)} style={deleteBtn}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: '20px' }}>
            <button onClick={() => setPage(p => p - 1)} disabled={page === 1} style={pageBtn}>← Prev</button>
            <span style={{ fontSize: '14px', color: '#64748b' }}>Page {page} of {totalPages} · {total} leads</span>
            <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages} style={pageBtn}>Next →</button>
          </div>
        )}
      </div>

      {modalOpen && (
        <LeadModal
          lead={editLead}
          onClose={() => setModalOpen(false)}
          onSaved={onSaved}
        />
      )}
    </div>
  );
}

const td        = { padding: '12px 16px', fontSize: '14px', color: '#334155' };
const editBtn   = { padding: '6px 12px', borderRadius: '6px', border: '1px solid #3b82f6', background: '#eff6ff', color: '#3b82f6', fontSize: '12px', fontWeight: 600 };
const deleteBtn = { padding: '6px 12px', borderRadius: '6px', border: '1px solid #ef4444', background: '#fef2f2', color: '#ef4444', fontSize: '12px', fontWeight: 600 };
const pageBtn   = { padding: '8px 16px', borderRadius: '8px', border: '1px solid #ddd', background: '#fff', fontSize: '14px' };