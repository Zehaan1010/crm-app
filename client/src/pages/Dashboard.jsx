import { useState, useEffect } from 'react';
import { getLeads, deleteLead } from '../api/leads.js';
import StatsBar from '../components/StatsBar.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import LeadModal from '../components/LeadModal.jsx';

function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [totalLeads, setTotalLeads] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState(null);
  const [loading, setLoading] = useState(false); // added loading state
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(function() {
    loadLeads();
  }, [searchText, selectedStatus, currentPage, refreshCount]);

  async function loadLeads() {
    setLoading(true);
    try {
      var res = await getLeads({
        search: searchText,
        status: selectedStatus,
        page: currentPage,
        limit: 8,
      });
      // NOTE: fetch() returns json directly, not wrapped in .data like axios does
      setLeads(res.leads);
      setTotalLeads(res.total);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.log('error loading leads', err);
    }
    setLoading(false);
  }

  async function handleDelete(id) {
    var confirmed = window.confirm('Are you sure you want to delete this lead?');
    if (!confirmed) return;

    try {
      await deleteLead(id);
      setRefreshCount(refreshCount + 1);
    } catch (err) {
      console.log('error deleting', err);
      alert('Could not delete lead');
    }
  }

  function handleAddClick() {
    setLeadToEdit(null);
    setShowModal(true);
  }

  function handleEditClick(lead) {
    setLeadToEdit(lead);
    setShowModal(true);
  }

  function handleCloseModal() {
    setShowModal(false);
  }

  function handleLeadSaved() {
    setRefreshCount(refreshCount + 1);
  }

  function handleSearchChange(e) {
    setSearchText(e.target.value);
    setCurrentPage(1);
  }

  function handleStatusChange(e) {
    setSelectedStatus(e.target.value);
    setCurrentPage(1);
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000', color: '#fff' }}>

      {/* Header */}
      <div style={{ backgroundColor: '#000', borderBottom: '1px solid #1a1a1a', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '52px' }}>
        <div style={{ fontSize: '15px', fontWeight: '600', letterSpacing: '-0.02em', color: '#fff' }}>
          crm<span style={{ color: '#555' }}>.</span>
        </div>
        <button
          onClick={handleAddClick}
          style={{ backgroundColor: '#fff', color: '#000', border: 'none', padding: '7px 14px', borderRadius: '6px', fontWeight: '600', fontSize: '12px', letterSpacing: '-0.01em' }}
        >
          + Add Lead
        </button>
      </div>

      <div style={{ padding: '20px' }}>

        {/* Stats */}
        <StatsBar refresh={refreshCount} />

        {/* Search and Filter */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
          <input
            type="text"
            placeholder="Search leads..."
            value={searchText}
            onChange={handleSearchChange}
            style={{ flex: '1', padding: '8px 12px', borderRadius: '6px', border: '1px solid #1a1a1a', backgroundColor: '#000', color: '#fff', fontSize: '12px', outline: 'none' }}
          />
          <select
            value={selectedStatus}
            onChange={handleStatusChange}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #1a1a1a', backgroundColor: '#000', color: '#555', fontSize: '12px', outline: 'none' }}
          >
            <option value="" style={{ backgroundColor: '#000' }}>All statuses</option>
            <option value="New" style={{ backgroundColor: '#000' }}>New</option>
            <option value="Contacted" style={{ backgroundColor: '#000' }}>Contacted</option>
            <option value="Qualified" style={{ backgroundColor: '#000' }}>Qualified</option>
            <option value="Converted" style={{ backgroundColor: '#000' }}>Converted</option>
            <option value="Lost" style={{ backgroundColor: '#000' }}>Lost</option>
          </select>
        </div>

        {/* show how many leads we found */}
        <p style={{ fontSize: '11px', color: '#333', marginBottom: '12px' }}>
          {totalLeads} lead{totalLeads !== 1 ? 's' : ''} total
        </p>

        {/* loading state */}
        {loading && (
          <p style={{ textAlign: 'center', color: '#444', fontSize: '13px', padding: '40px' }}>
            Loading...
          </p>
        )}

        {/* Table */}
        {!loading && (
          <div style={{ border: '1px solid #1a1a1a', borderRadius: '8px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '10px', fontWeight: '500', color: '#333', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #1a1a1a' }}>Name</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '10px', fontWeight: '500', color: '#333', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #1a1a1a' }}>Email</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '10px', fontWeight: '500', color: '#333', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #1a1a1a' }}>Company</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '10px', fontWeight: '500', color: '#333', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #1a1a1a' }}>Status</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '10px', fontWeight: '500', color: '#333', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #1a1a1a' }}>Created</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '10px', fontWeight: '500', color: '#333', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #1a1a1a' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#333', fontSize: '13px' }}>
                      No leads found. Click "+ Add Lead" to add one!
                    </td>
                  </tr>
                ) : (
                  leads.map(function(lead, index) {
                    return (
                      <tr
                        key={lead._id}
                        style={{ borderBottom: '1px solid #111' }}
                        onMouseEnter={function(e) { e.currentTarget.style.backgroundColor = '#080808'; }}
                        onMouseLeave={function(e) { e.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                        <td style={{ padding: '11px 14px', fontSize: '12px', color: '#fff', fontWeight: '500' }}>{lead.name}</td>
                        <td style={{ padding: '11px 14px', fontSize: '12px', color: '#555' }}>{lead.email}</td>
                        <td style={{ padding: '11px 14px', fontSize: '12px', color: '#555' }}>{lead.company}</td>
                        <td style={{ padding: '11px 14px' }}>
                          <StatusBadge status={lead.status} />
                        </td>
                        <td style={{ padding: '11px 14px', fontSize: '12px', color: '#555' }}>
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '11px 14px' }}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              onClick={function() { handleEditClick(lead); }}
                              style={{ padding: '4px 10px', borderRadius: '4px', border: '1px solid #222', backgroundColor: '#000', color: '#666', fontSize: '10px', cursor: 'pointer' }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={function() { handleDelete(lead._id); }}
                              style={{ padding: '4px 10px', borderRadius: '4px', border: '1px solid #1a1a1a', backgroundColor: '#000', color: '#333', fontSize: '10px', cursor: 'pointer' }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: '20px' }}>
            <button
              onClick={function() { setCurrentPage(currentPage - 1); }}
              disabled={currentPage === 1}
              style={{ padding: '7px 14px', borderRadius: '6px', border: '1px solid #1a1a1a', backgroundColor: '#000', color: '#555', fontSize: '12px', cursor: 'pointer' }}
            >
              Previous
            </button>
            <span style={{ fontSize: '12px', color: '#333' }}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={function() { setCurrentPage(currentPage + 1); }}
              disabled={currentPage === totalPages}
              style={{ padding: '7px 14px', borderRadius: '6px', border: '1px solid #1a1a1a', backgroundColor: '#000', color: '#555', fontSize: '12px', cursor: 'pointer' }}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <LeadModal
          lead={leadToEdit}
          onClose={handleCloseModal}
          onSaved={handleLeadSaved}
        />
      )}

    </div>
  );
}

export default Dashboard;
