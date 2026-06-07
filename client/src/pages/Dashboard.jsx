import { useState, useEffect } from 'react';
import { getLeads, deleteLead } from '../api/leads.js';
import StatsBar from '../components/StatsBar.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import LeadModal from '../components/LeadModal.jsx';

function Dashboard({ darkMode, toggleTheme }) {

  // state variables
  const [leads, setLeads] = useState([]);
  const [totalLeads, setTotalLeads] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);

  // colors change depending on dark or light mode
  var bgColor = '#000000';
  var surfaceColor = '#0a0a0a';
  var borderColor = '#1f1f1f';
  var mainText = '#ffffff';
  var secondaryText = '#666666';
  var mutedText = '#333333';
  var inputBackground = '#000000';
  var navBackground = '#000000';

  if (darkMode === false) {
    bgColor = '#f4f4f5';
    surfaceColor = '#ffffff';
    borderColor = '#aaaaaa';  // darker so you can actually see it
    mainText = '#111111';
    secondaryText = '#555555';
    mutedText = '#999999';
    inputBackground = '#ffffff';
    navBackground = '#ffffff';
  }

  // run loadLeads whenever these things change
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
      // important: fetch() gives back json directly, NOT res.data like axios would
      // took me a while to figure this out lol
      setLeads(res.leads);
      setTotalLeads(res.total);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.log('error loading leads:', err);
    }
    setLoading(false);
  }

  async function handleDelete(id) {
    // ask user before deleting
    var confirmed = window.confirm('Are you sure you want to delete this lead?');
    if (!confirmed) return;

    try {
      await deleteLead(id);
      setRefreshCount(refreshCount + 1);
    } catch (err) {
      console.log('delete failed:', err);
      alert('Could not delete. Please try again.');
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
    // refresh the list after saving
    setRefreshCount(refreshCount + 1);
  }

  function handleSearchChange(e) {
    setSearchText(e.target.value);
    setCurrentPage(1); // go back to page 1 when searching
  }

  function handleStatusChange(e) {
    setSelectedStatus(e.target.value);
    setCurrentPage(1);
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: bgColor, color: mainText }}>

      {/* top navbar */}
      <div style={{
        backgroundColor: navBackground,
        borderBottom: '1px solid ' + borderColor,
        padding: '0 36px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '68px'
      }}>
        <div style={{ fontSize: '22px', fontWeight: '700', letterSpacing: '-0.02em', color: mainText }}>
          crm<span style={{ color: secondaryText }}>.</span>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* theme toggle button */}
          <button
            onClick={toggleTheme}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid ' + borderColor,
              color: secondaryText,
              padding: '9px 18px',
              borderRadius: '8px',
              fontSize: '15px',
              cursor: 'pointer'
            }}
          >
            {darkMode ? '☀️ Light mode' : '🌙 Dark mode'}
          </button>

          <button
            onClick={handleAddClick}
            style={{
              backgroundColor: darkMode ? '#ffffff' : '#111111',
              color: darkMode ? '#000000' : '#ffffff',
              border: 'none',
              padding: '9px 20px',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '15px',
              cursor: 'pointer'
            }}
          >
            + Add Lead
          </button>
        </div>
      </div>

      <div style={{ padding: '36px' }}>

        {/* stats section at top */}
        <StatsBar refresh={refreshCount} darkMode={darkMode} />

        {/* search bar and status filter */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <input
            type="text"
            placeholder="Search by name, email or company..."
            value={searchText}
            onChange={handleSearchChange}
            style={{
              flex: '1',
              padding: '12px 18px',
              borderRadius: '8px',
              border: '1px solid ' + borderColor,
              backgroundColor: inputBackground,
              color: mainText,
              fontSize: '16px',
              outline: 'none'
            }}
          />
          <select
            value={selectedStatus}
            onChange={handleStatusChange}
            style={{
              padding: '12px 18px',
              borderRadius: '8px',
              border: '1px solid ' + borderColor,
              backgroundColor: inputBackground,
              color: secondaryText,
              fontSize: '16px',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="">All statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Converted">Converted</option>
            <option value="Lost">Lost</option>
          </select>
        </div>

        {/* show total count */}
        <p style={{ fontSize: '14px', color: mutedText, marginBottom: '16px' }}>
          {totalLeads} lead{totalLeads !== 1 ? 's' : ''} total
        </p>

        {/* show loading text while fetching */}
        {loading && (
          <p style={{ textAlign: 'center', color: secondaryText, fontSize: '16px', padding: '60px' }}>
            Loading...
          </p>
        )}

        {/* leads table - only show when not loading */}
        {!loading && (
          <div style={{ border: '1px solid ' + borderColor, borderRadius: '10px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ padding: '16px 22px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: mutedText, textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid ' + borderColor, backgroundColor: surfaceColor }}>Name</th>
                  <th style={{ padding: '16px 22px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: mutedText, textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid ' + borderColor, backgroundColor: surfaceColor }}>Email</th>
                  <th style={{ padding: '16px 22px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: mutedText, textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid ' + borderColor, backgroundColor: surfaceColor }}>Company</th>
                  <th style={{ padding: '16px 22px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: mutedText, textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid ' + borderColor, backgroundColor: surfaceColor }}>Status</th>
                  <th style={{ padding: '16px 22px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: mutedText, textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid ' + borderColor, backgroundColor: surfaceColor }}>Created</th>
                  <th style={{ padding: '16px 22px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: mutedText, textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid ' + borderColor, backgroundColor: surfaceColor }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* show message if no leads */}
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '60px', textAlign: 'center', color: mutedText, fontSize: '16px', backgroundColor: surfaceColor }}>
                      No leads found. Click "+ Add Lead" to get started!
                    </td>
                  </tr>
                ) : (
                  leads.map(function(lead, index) {
                    return (
                      <tr
                        key={lead._id}
                        style={{ borderBottom: '1px solid ' + borderColor, backgroundColor: surfaceColor }}
                        onMouseEnter={function(e) {
                          e.currentTarget.style.backgroundColor = darkMode ? '#0d0d0d' : '#fafafa';
                        }}
                        onMouseLeave={function(e) {
                          e.currentTarget.style.backgroundColor = surfaceColor;
                        }}
                      >
                        <td style={{ padding: '17px 22px', fontSize: '16px', color: mainText, fontWeight: '500' }}>{lead.name}</td>
                        <td style={{ padding: '17px 22px', fontSize: '16px', color: secondaryText }}>{lead.email}</td>
                        <td style={{ padding: '17px 22px', fontSize: '16px', color: secondaryText }}>{lead.company}</td>
                        <td style={{ padding: '17px 22px' }}>
                          <StatusBadge status={lead.status} />
                        </td>
                        <td style={{ padding: '17px 22px', fontSize: '16px', color: secondaryText }}>
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '17px 22px' }}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={function() { handleEditClick(lead); }}
                              style={{ padding: '7px 16px', borderRadius: '6px', border: '1px solid ' + borderColor, backgroundColor: surfaceColor, color: secondaryText, fontSize: '14px', cursor: 'pointer' }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={function() { handleDelete(lead._id); }}
                              style={{ padding: '7px 16px', borderRadius: '6px', border: '1px solid ' + borderColor, backgroundColor: surfaceColor, color: mutedText, fontSize: '14px', cursor: 'pointer' }}
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

        {/* pagination buttons - only show if more than 1 page */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '28px' }}>
            <button
              onClick={function() { setCurrentPage(currentPage - 1); }}
              disabled={currentPage === 1}
              style={{ padding: '10px 22px', borderRadius: '8px', border: '1px solid ' + borderColor, backgroundColor: surfaceColor, color: secondaryText, fontSize: '15px', cursor: 'pointer' }}
            >
              Previous
            </button>
            <span style={{ fontSize: '15px', color: mutedText }}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={function() { setCurrentPage(currentPage + 1); }}
              disabled={currentPage === totalPages}
              style={{ padding: '10px 22px', borderRadius: '8px', border: '1px solid ' + borderColor, backgroundColor: surfaceColor, color: secondaryText, fontSize: '15px', cursor: 'pointer' }}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* modal for add/edit */}
      {showModal && (
        <LeadModal
          lead={leadToEdit}
          onClose={handleCloseModal}
          onSaved={handleLeadSaved}
          darkMode={darkMode}
        />
      )}

    </div>
  );
}

export default Dashboard;
