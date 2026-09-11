/**
 * Member 2 Feature: Pet Profile & Medical Records Management
 * Handles Pet CRUD, Search/Filter, Medical Profiles, and Vaccinations.
 */

let allPets = [];
let activeSpeciesFilter = 'All';

async function loadPets() {
  try {
    const isStaff = AppState.currentUser && AppState.currentUser.role === 'staff';
    let url = '/api/pets';
    // If regular pet owner, filter by their owner ID
    if (!isStaff && AppState.currentUser) {
      url += `?owner_id=${AppState.currentUser.id}`;
    }

    const res = await fetch(url);
    const data = await res.json();
    if (data.success) {
      allPets = data.pets;
      filterAndRenderPets();
    }
  } catch (err) {
    console.error('Failed to load pets:', err);
    showToast('Failed to load pets.', 'error');
  }
}

function filterAndRenderPets() {
  const search = (document.getElementById('pet-search-input')?.value || '').toLowerCase().trim();

  let filtered = allPets.filter(pet => {
    // Species filter
    if (activeSpeciesFilter !== 'All' && pet.species.toLowerCase() !== activeSpeciesFilter.toLowerCase()) {
      return false;
    }
    // Search query
    if (search) {
      const matchName = pet.name.toLowerCase().includes(search);
      const matchBreed = pet.breed.toLowerCase().includes(search);
      const matchOwner = (pet.owner_name || '').toLowerCase().includes(search);
      if (!matchName && !matchBreed && !matchOwner) return false;
    }
    return true;
  });

  renderPets(filtered);
}

function setSpeciesFilter(species) {
  activeSpeciesFilter = species;
  document.querySelectorAll('#species-filter-group .filter-pill').forEach(btn => {
    btn.classList.toggle('active', btn.textContent.includes(species) || (species === 'All' && btn.textContent.includes('All')));
  });
  filterAndRenderPets();
}

function filterPets() {
  filterAndRenderPets();
}

function renderPets(pets) {
  const container = document.getElementById('pets-container');
  if (!container) return;

  if (pets.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: #fff; border-radius: var(--radius-lg); border: 1px dashed var(--border);">
        <i class="fa-solid fa-shield-cat" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
        <h3 style="color: var(--text-main);">No pet profiles found</h3>
        <p style="color: var(--text-muted); margin-top: 0.5rem;">Try adjusting your search criteria or register a new pet profile.</p>
        <button class="btn btn-primary" style="margin-top: 1rem;" onclick="openPetModal()">
          <i class="fa-solid fa-plus"></i> Register First Pet
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = pets.map(pet => {
    let badgeClass = 'badge-green';
    if (pet.vaccination_status === 'Due Soon') badgeClass = 'badge-yellow';
    if (pet.vaccination_status === 'Overdue') badgeClass = 'badge-red';

    return `
      <div class="pet-card">
        <div class="pet-card-image-wrap">
          <img src="${pet.avatar_url}" alt="${pet.name}" class="pet-card-image" onerror="this.src='https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=400&q=80'">
          <span class="pet-status-badge ${badgeClass}">${pet.vaccination_status}</span>
        </div>

        <div class="pet-card-content">
          <div class="pet-header-row">
            <div>
              <h3 class="pet-name">${pet.name}</h3>
              <span class="pet-breed-tag">${pet.breed} (${pet.species})</span>
            </div>
            <span style="font-weight: 700; font-size: 0.9rem; color: var(--primary);">${pet.age} yrs</span>
          </div>

          <div class="pet-chips">
            <span class="pet-chip"><i class="fa-solid fa-venus-mars"></i> ${pet.gender}</span>
            <span class="pet-chip"><i class="fa-solid fa-weight-scale"></i> ${pet.weight} kg</span>
            ${pet.allergies && pet.allergies !== 'None' ? `<span class="pet-chip" style="background: #fee2e2; color: #b91c1c;"><i class="fa-solid fa-triangle-exclamation"></i> ${pet.allergies}</span>` : ''}
            ${pet.microchip_id ? `<span class="pet-chip"><i class="fa-solid fa-id-card"></i> ${pet.microchip_id}</span>` : ''}
          </div>

          <div class="pet-notes-box">
            ${pet.medical_notes ? pet.medical_notes : 'No behavioral or clinical notes recorded yet.'}
          </div>

          <div class="pet-card-actions">
            <button class="btn btn-secondary btn-xs" style="flex: 1;" onclick="openPetDetailModal(${pet.id})">
              <i class="fa-solid fa-notes-medical"></i> Medical File
            </button>
            <button class="btn btn-outline btn-xs" title="Edit Pet Details" onclick="openPetModal(${pet.id})">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button class="btn btn-outline btn-xs" style="color: #ef4444;" title="Delete Pet" onclick="deletePet(${pet.id}, '${pet.name}')">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Modal Handlers
function openPetModal(petId = null) {
  const modal = document.getElementById('modal-pet');
  const form = document.getElementById('pet-form');
  form.reset();

  if (petId) {
    const pet = allPets.find(p => p.id === Number(petId));
    if (pet) {
      document.getElementById('pet-modal-title').textContent = `Edit Profile: ${pet.name}`;
      document.getElementById('pet-id').value = pet.id;
      document.getElementById('pet-name').value = pet.name;
      document.getElementById('pet-species').value = pet.species;
      document.getElementById('pet-breed').value = pet.breed;
      document.getElementById('pet-gender').value = pet.gender;
      document.getElementById('pet-age').value = pet.age;
      document.getElementById('pet-weight').value = pet.weight;
      document.getElementById('pet-microchip').value = pet.microchip_id || '';
      document.getElementById('pet-allergies').value = pet.allergies || '';
      document.getElementById('pet-vax-status').value = pet.vaccination_status || 'Up-to-Date';
      document.getElementById('pet-notes').value = pet.medical_notes || '';
    }
  } else {
    document.getElementById('pet-modal-title').textContent = 'Register Pet Profile';
    document.getElementById('pet-id').value = '';
    document.getElementById('pet-age').value = 2;
    document.getElementById('pet-weight').value = 8.5;
  }

  modal.classList.remove('hidden');
}

function closePetModal() {
  document.getElementById('modal-pet').classList.add('hidden');
}

async function handlePetSubmit(event) {
  event.preventDefault();
  const petId = document.getElementById('pet-id').value;

  const payload = {
    name: document.getElementById('pet-name').value.trim(),
    species: document.getElementById('pet-species').value,
    breed: document.getElementById('pet-breed').value.trim(),
    gender: document.getElementById('pet-gender').value,
    age: Number(document.getElementById('pet-age').value),
    weight: Number(document.getElementById('pet-weight').value),
    microchip_id: document.getElementById('pet-microchip').value.trim(),
    allergies: document.getElementById('pet-allergies').value.trim(),
    vaccination_status: document.getElementById('pet-vax-status').value,
    medical_notes: document.getElementById('pet-notes').value.trim(),
    owner_id: AppState.currentUser ? AppState.currentUser.id : 1
  };

  const method = petId ? 'PUT' : 'POST';
  const url = petId ? `/api/pets/${petId}` : '/api/pets';

  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success) {
      showToast(data.message || 'Pet profile saved successfully!', 'success');
      closePetModal();
      await loadPets();
      if (window.loadDashboard) await window.loadDashboard();
      if (window.populateAppointmentPets) window.populateAppointmentPets();
    } else {
      showToast(data.message || 'Failed to save pet.', 'error');
    }
  } catch (err) {
    showToast('Network error while saving pet profile.', 'error');
  }
}

async function deletePet(petId, petName) {
  if (!confirm(`Are you sure you want to delete ${petName}'s profile? Associated appointments and medical records will also be removed.`)) {
    return;
  }

  try {
    const res = await fetch(`/api/pets/${petId}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      showToast(`${petName}'s profile removed.`, 'success');
      await loadPets();
      if (window.loadDashboard) await window.loadDashboard();
      if (window.loadAppointments) await window.loadAppointments();
    } else {
      showToast('Could not delete pet profile.', 'error');
    }
  } catch (err) {
    showToast('Network error while deleting pet.', 'error');
  }
}

// Medical Details & Vaccination Records Modal
async function openPetDetailModal(petId) {
  try {
    const res = await fetch(`/api/pets/${petId}`);
    const data = await res.json();
    if (!data.success) {
      showToast('Could not retrieve medical record.', 'error');
      return;
    }

    const pet = data.pet;
    const body = document.getElementById('pet-detail-body');

    body.innerHTML = `
      <div style="display: flex; gap: 1.5rem; margin-bottom: 1.5rem; flex-wrap: wrap; align-items: center;">
        <img src="${pet.avatar_url}" style="width: 90px; height: 90px; border-radius: var(--radius-md); object-fit: cover;" onerror="this.src='https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=400&q=80'">
        <div>
          <h3 style="font-size: 1.3rem; margin-bottom: 0.25rem;">${pet.name} <span class="badge-tag" style="margin-left: 0.5rem;">${pet.vaccination_status}</span></h3>
          <p style="color: var(--text-muted); font-size: 0.9rem;">
            ${pet.breed} • ${pet.gender} • ${pet.age} Years Old • ${pet.weight} kg
          </p>
          <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 0.2rem;">
            <strong>Owner:</strong> ${pet.owner_name} (${pet.owner_phone || 'N/A'})
          </p>
        </div>
      </div>

      <div style="background: #f8fafc; border: 1px solid var(--border); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1.5rem;">
        <h4 style="margin-bottom: 0.5rem; font-size: 0.95rem; color: var(--text-main);"><i class="fa-solid fa-clipboard-list"></i> Clinical Information & Notes</h4>
        <p style="font-size: 0.88rem; color: #475569; margin-bottom: 0.5rem;">
          <strong>Allergies:</strong> <span style="color: ${pet.allergies && pet.allergies !== 'None' ? '#b91c1c' : '#15803d'};">${pet.allergies || 'None recorded'}</span>
        </p>
        <p style="font-size: 0.88rem; color: #475569;">
          <strong>Observations:</strong> ${pet.medical_notes || 'No special clinical notes recorded.'}
        </p>
      </div>

      <div style="margin-bottom: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
          <h4 style="font-size: 1rem; font-weight: 700;"><i class="fa-solid fa-syringe"></i> Vaccination History</h4>
        </div>

        <div style="max-height: 180px; overflow-y: auto; border: 1px solid var(--border); border-radius: var(--radius-md);">
          <table class="data-table" style="font-size: 0.82rem;">
            <thead>
              <tr>
                <th>Vaccine</th>
                <th>Administered</th>
                <th>Next Due</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${(pet.vaccinations && pet.vaccinations.length > 0) ? pet.vaccinations.map(v => `
                <tr>
                  <td><strong>${v.vaccine_name}</strong></td>
                  <td>${v.administered_date}</td>
                  <td>${v.next_due_date}</td>
                  <td><span class="badge-tag" style="background:${v.status === 'Overdue' ? '#fee2e2' : '#dcfce7'}; color:${v.status === 'Overdue' ? '#b91c1c' : '#15803d'}">${v.status}</span></td>
                </tr>
              `).join('') : `<tr><td colspan="4" style="text-align: center; color: var(--text-muted);">No vaccination records logged yet.</td></tr>`}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Quick Add Vaccine Form -->
      <div style="border-top: 1px solid var(--border); padding-top: 1.25rem;">
        <h4 style="font-size: 0.95rem; margin-bottom: 0.75rem;"><i class="fa-solid fa-plus-circle"></i> Log New Vaccine Dose</h4>
        <form onsubmit="handleQuickVaccineSubmit(event, ${pet.id})">
          <div class="form-row">
            <div class="form-group col">
              <label>Vaccine Name *</label>
              <input type="text" id="vax-name" required placeholder="e.g. Rabies Booster">
            </div>
            <div class="form-group col">
              <label>Administered Date *</label>
              <input type="date" id="vax-date" required value="${new Date().toISOString().split('T')[0]}">
            </div>
            <div class="form-group col">
              <label>Next Due Date *</label>
              <input type="date" id="vax-next-date" required>
            </div>
          </div>
          <button type="submit" class="btn btn-secondary btn-block">Record Vaccine</button>
        </form>
      </div>
    `;

    document.getElementById('modal-pet-details').classList.remove('hidden');
  } catch (err) {
    showToast('Failed to load pet details.', 'error');
  }
}

function closePetDetailModal() {
  document.getElementById('modal-pet-details').classList.add('hidden');
}

async function handleQuickVaccineSubmit(event, petId) {
  event.preventDefault();
  const vaccine_name = document.getElementById('vax-name').value;
  const administered_date = document.getElementById('vax-date').value;
  const next_due_date = document.getElementById('vax-next-date').value;

  try {
    const res = await fetch(`/api/pets/${petId}/vaccinations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vaccine_name,
        administered_date,
        next_due_date,
        veterinarian: AppState.currentUser?.name || 'Dr. K. Rahman',
        status: 'Administered'
      })
    });
    const data = await res.json();
    if (data.success) {
      showToast('Vaccination recorded successfully!', 'success');
      await openPetDetailModal(petId);
      await loadPets();
      if (window.loadDashboard) await window.loadDashboard();
    } else {
      showToast(data.message || 'Error recording vaccination.', 'error');
    }
  } catch (e) {
    showToast('Network error logging vaccine.', 'error');
  }
}

function handleSpeciesChange() {
  // Can be extended for species-specific fields
}

// Expose globals
window.loadPets = loadPets;
window.filterPets = filterPets;
window.setSpeciesFilter = setSpeciesFilter;
window.openPetModal = openPetModal;
window.closePetModal = closePetModal;
window.handlePetSubmit = handlePetSubmit;
window.deletePet = deletePet;
window.openPetDetailModal = openPetDetailModal;
window.closePetDetailModal = closePetDetailModal;
window.handleQuickVaccineSubmit = handleQuickVaccineSubmit;
window.handleSpeciesChange = handleSpeciesChange;
