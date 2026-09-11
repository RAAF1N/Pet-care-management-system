/**
 * Member 3 Feature: Appointments & Dashboard Analytics
 * Handles clinical scheduling, dashboard metrics, status workflow, and seed reset.
 */

let allAppointments = [];
let activeApptTab = 'All';

// ==================== DASHBOARD METRICS (Member 3) ====================

async function loadDashboard() {
  try {
    const isStaff = AppState.currentUser && AppState.currentUser.role === 'staff';
    let statsUrl = '/api/appointments/dashboard/stats';
    if (!isStaff && AppState.currentUser) {
      statsUrl += `?owner_id=${AppState.currentUser.id}`;
    }

    const res = await fetch(statsUrl);
    const data = await res.json();
    if (!data.success) return;

    const stats = data.stats;
    document.getElementById('stat-total-pets').textContent = stats.totalPets;
    document.getElementById('stat-upcoming-appts').textContent = stats.scheduledAppointments;
    document.getElementById('stat-vaccines-due').textContent = stats.overdueVaccinations;
    document.getElementById('stat-completed-appts').textContent = stats.completedAppointments;

    // Render Upcoming Visits on Dashboard
    const upcomingContainer = document.getElementById('dashboard-upcoming-list');
    if (upcomingContainer) {
      if (!stats.upcoming || stats.upcoming.length === 0) {
        upcomingContainer.innerHTML = `
          <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
            <i class="fa-solid fa-calendar-check" style="font-size: 2rem; margin-bottom: 0.5rem; opacity: 0.5;"></i>
            <p>No upcoming visits scheduled.</p>
          </div>
        `;
      } else {
        upcomingContainer.innerHTML = stats.upcoming.map(item => `
          <div class="dashboard-row-item">
            <div style="display: flex; gap: 0.75rem; align-items: center;">
              <div style="width: 38px; height: 38px; border-radius: var(--radius-sm); background: #f1f5f9; display: flex; align-items: center; justify-content: center; color: var(--primary);">
                <i class="fa-solid fa-stethoscope"></i>
              </div>
              <div>
                <strong style="font-size: 0.95rem;">${item.pet_name}</strong>
                <span class="badge-tag" style="margin-left: 0.4rem;">${item.service_type}</span>
                <div style="font-size: 0.8rem; color: var(--text-muted);">${item.veterinarian}</div>
              </div>
            </div>
            <div style="text-align: right;">
              <div style="font-weight: 700; font-size: 0.88rem; color: var(--primary);">${item.appointment_date}</div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">${item.appointment_time}</div>
            </div>
          </div>
        `).join('');
      }
    }

    // Render Immediate Health Alerts
    const alertsContainer = document.getElementById('dashboard-health-alerts');
    if (alertsContainer) {
      // Fetch pets to inspect health flags
      const petsRes = await fetch(isStaff ? '/api/pets' : `/api/pets?owner_id=${AppState.currentUser?.id}`);
      const petsData = await petsRes.json();
      const flaggedPets = (petsData.pets || []).filter(p => p.vaccination_status !== 'Up-to-Date' || (p.allergies && p.allergies !== 'None'));

      if (flaggedPets.length === 0) {
        alertsContainer.innerHTML = `
          <div style="text-align: center; padding: 2rem; color: #16a34a;">
            <i class="fa-solid fa-shield-heart" style="font-size: 2rem; margin-bottom: 0.5rem;"></i>
            <p>All registered pets are up-to-date with no critical alerts.</p>
          </div>
        `;
      } else {
        alertsContainer.innerHTML = flaggedPets.map(p => {
          const isOverdue = p.vaccination_status === 'Overdue';
          return `
            <div class="alert-row-item ${isOverdue ? 'alert-danger' : 'alert-warning'}">
              <i class="fa-solid ${isOverdue ? 'fa-triangle-exclamation' : 'fa-bell'}" style="color: ${isOverdue ? '#b91c1c' : '#b45309'}; margin-top: 3px;"></i>
              <div style="flex: 1;">
                <div style="display: flex; justify-content: space-between;">
                  <strong>${p.name} (${p.species})</strong>
                  <span class="badge-tag" style="background: #fff;">${p.vaccination_status}</span>
                </div>
                <div style="font-size: 0.82rem; margin-top: 0.2rem; color: #475569;">
                  ${isOverdue ? 'Rabies/core booster is overdue. Please schedule immediately.' : 'Vaccination due soon or active allergy precaution.'}
                </div>
              </div>
            </div>
          `;
        }).join('');
      }
    }

  } catch (err) {
    console.error('Error loading dashboard:', err);
  }
}

// ==================== APPOINTMENTS LIST & WORKFLOW ====================

async function loadAppointments() {
  try {
    const isStaff = AppState.currentUser && AppState.currentUser.role === 'staff';
    let url = '/api/appointments';
    if (!isStaff && AppState.currentUser) {
      url += `?owner_id=${AppState.currentUser.id}`;
    }

    const res = await fetch(url);
    const data = await res.json();
    if (data.success) {
      allAppointments = data.appointments;
      renderAppointments();
    }
  } catch (err) {
    showToast('Failed to load appointments.', 'error');
  }
}

function setAppointmentTab(tab) {
  activeApptTab = tab;
  document.querySelectorAll('.tabs-nav .tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent.trim() === (tab === 'All' ? 'All Bookings' : tab));
  });
  renderAppointments();
}

function renderAppointments() {
  const tbody = document.getElementById('appointments-tbody');
  if (!tbody) return;

  const filtered = allAppointments.filter(item => {
    if (activeApptTab === 'All') return true;
    return item.status.toLowerCase() === activeApptTab.toLowerCase();
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
          <i class="fa-regular fa-calendar" style="font-size: 2rem; margin-bottom: 0.5rem; opacity: 0.5;"></i>
          <p>No appointments found in this category.</p>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(a => {
    let statusBadge = 'badge-blue';
    if (a.status === 'Completed') statusBadge = 'badge-green';
    if (a.status === 'Cancelled') statusBadge = 'badge-red';
    if (a.status === 'In-Progress') statusBadge = 'badge-yellow';

    return `
      <tr>
        <td>
          <strong>${a.pet_name}</strong>
          <div style="font-size: 0.8rem; color: var(--text-muted);">${a.pet_breed || ''} (${a.pet_species})</div>
        </td>
        <td>
          <div>${a.owner_name}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">${a.owner_phone || 'No phone'}</div>
        </td>
        <td>
          <span class="pet-chip">${a.service_type}</span>
          ${a.reason_notes ? `<div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.2rem;">${a.reason_notes}</div>` : ''}
        </td>
        <td>
          <div><strong>${a.appointment_date}</strong></div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">${a.appointment_time}</div>
        </td>
        <td>${a.veterinarian}</td>
        <td>
          <span class="pet-status-badge ${statusBadge}" style="position: static;">${a.status}</span>
        </td>
        <td>
          <div style="display: flex; gap: 0.35rem;">
            ${a.status === 'Scheduled' ? `
              <button class="btn btn-secondary btn-xs" title="Mark as Completed" onclick="updateAppointmentStatus(${a.id}, 'Completed')">
                <i class="fa-solid fa-check"></i> Complete
              </button>
              <button class="btn btn-outline btn-xs" title="Cancel Appointment" onclick="updateAppointmentStatus(${a.id}, 'Cancelled')">
                <i class="fa-solid fa-xmark"></i>
              </button>
            ` : ''}
            <button class="btn btn-outline btn-xs" style="color: #ef4444;" title="Delete Record" onclick="deleteAppointment(${a.id})">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// Modal booking
async function openBookAppointmentModal() {
  const modal = document.getElementById('modal-appointment');
  const petSelect = document.getElementById('appt-pet-id');
  petSelect.innerHTML = '';

  // Ensure pets are loaded
  if (window.allPets && window.allPets.length > 0) {
    populateAppointmentPets();
  } else {
    const isStaff = AppState.currentUser && AppState.currentUser.role === 'staff';
    const res = await fetch(isStaff ? '/api/pets' : `/api/pets?owner_id=${AppState.currentUser?.id}`);
    const data = await res.json();
    window.allPets = data.pets || [];
    populateAppointmentPets();
  }

  // Set default date to tomorrow
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  document.getElementById('appt-date').value = tomorrow;

  modal.classList.remove('hidden');
}

function populateAppointmentPets() {
  const petSelect = document.getElementById('appt-pet-id');
  if (!petSelect) return;
  petSelect.innerHTML = '';

  const pets = window.allPets || [];
  if (pets.length === 0) {
    const opt = document.createElement('option');
    opt.value = '';
    opt.textContent = 'No pets registered yet - please add a pet first';
    petSelect.appendChild(opt);
  } else {
    pets.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = `${p.name} (${p.species} - ${p.breed})`;
      petSelect.appendChild(opt);
    });
  }
}

function closeBookAppointmentModal() {
  document.getElementById('modal-appointment').classList.add('hidden');
}

async function handleAppointmentSubmit(event) {
  event.preventDefault();
  const pet_id = document.getElementById('appt-pet-id').value;
  if (!pet_id) {
    showToast('Please select a registered pet.', 'error');
    return;
  }

  const payload = {
    pet_id: Number(pet_id),
    owner_id: AppState.currentUser ? AppState.currentUser.id : 1,
    service_type: document.getElementById('appt-service-type').value,
    appointment_date: document.getElementById('appt-date').value,
    appointment_time: document.getElementById('appt-time').value,
    veterinarian: document.getElementById('appt-vet').value,
    reason_notes: document.getElementById('appt-notes').value.trim()
  };

  try {
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success) {
      showToast('Appointment scheduled successfully!', 'success');
      closeBookAppointmentModal();
      await loadAppointments();
      if (window.loadDashboard) await window.loadDashboard();
    } else {
      showToast(data.message || 'Error booking appointment.', 'error');
    }
  } catch (err) {
    showToast('Network error scheduling appointment.', 'error');
  }
}

async function updateAppointmentStatus(id, status) {
  try {
    const res = await fetch(`/api/appointments/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (data.success) {
      showToast(`Appointment marked as ${status}.`, 'success');
      await loadAppointments();
      if (window.loadDashboard) await window.loadDashboard();
    } else {
      showToast('Status update failed.', 'error');
    }
  } catch (err) {
    showToast('Network error updating status.', 'error');
  }
}

async function deleteAppointment(id) {
  if (!confirm('Are you sure you wish to cancel and delete this appointment?')) return;

  try {
    const res = await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      showToast('Appointment removed.', 'success');
      await loadAppointments();
      if (window.loadDashboard) await window.loadDashboard();
    } else {
      showToast('Failed to delete appointment.', 'error');
    }
  } catch (err) {
    showToast('Network error deleting appointment.', 'error');
  }
}

// Reset sample demo dataset
async function resetSampleData() {
  if (!confirm('Reset all demo data (pets, vaccinations, appointments) to default presentation state?')) return;
  try {
    const res = await fetch('/api/appointments/reset-seed', { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      showToast('Demo dataset refreshed!', 'success');
      if (window.loadPets) await window.loadPets();
      if (window.loadAppointments) await window.loadAppointments();
      if (window.loadDashboard) await window.loadDashboard();
    }
  } catch (err) {
    showToast('Error resetting dataset.', 'error');
  }
}

// Expose globals
window.loadDashboard = loadDashboard;
window.loadAppointments = loadAppointments;
window.setAppointmentTab = setAppointmentTab;
window.renderAppointments = renderAppointments;
window.openBookAppointmentModal = openBookAppointmentModal;
window.closeBookAppointmentModal = closeBookAppointmentModal;
window.handleAppointmentSubmit = handleAppointmentSubmit;
window.updateAppointmentStatus = updateAppointmentStatus;
window.deleteAppointment = deleteAppointment;
window.resetSampleData = resetSampleData;
window.populateAppointmentPets = populateAppointmentPets;
