/**
 * Member 1 Feature: Application Shell, State Management & Authentication
 * Coordinates navigation, user sessions, role-based views, and modals.
 */

const AppState = {
  currentUser: null,
  currentView: 'dashboard',
  users: []
};

// Local storage keys
const STORAGE_KEY_USER = 'petcare_active_user';

document.addEventListener('DOMContentLoaded', async () => {
  initAuth();
  setupNavLinks();
  await loadGlobalData();
});

// Toast notification helper
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  let icon = 'fa-circle-info';
  if (type === 'success') icon = 'fa-circle-check';
  if (type === 'error') icon = 'fa-triangle-exclamation';

  toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Navigation between sections
function navigateTo(viewId) {
  AppState.currentView = viewId;

  // Update nav buttons
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.remove('active');
  });
  const activeBtn = document.getElementById(`nav-${viewId}`);
  if (activeBtn) activeBtn.classList.add('active');

  // Update view visibility
  document.querySelectorAll('.page-view').forEach(view => {
    view.classList.remove('active');
  });
  const targetView = document.getElementById(`view-${viewId}`);
  if (targetView) targetView.classList.add('active');

  // View-specific reloads
  if (viewId === 'dashboard') {
    if (window.loadDashboard) window.loadDashboard();
  } else if (viewId === 'pets') {
    if (window.loadPets) window.loadPets();
  } else if (viewId === 'appointments') {
    if (window.loadAppointments) window.loadAppointments();
  }
}

function setupNavLinks() {
  window.navigateTo = navigateTo;
}

// ==================== AUTHENTICATION (Member 1) ====================

function initAuth() {
  const storedUser = localStorage.getItem(STORAGE_KEY_USER);
  if (storedUser) {
    try {
      AppState.currentUser = JSON.parse(storedUser);
    } catch (e) {
      AppState.currentUser = null;
    }
  }

  // If no user saved, default to Sarah Jenkins (pet owner)
  if (!AppState.currentUser) {
    AppState.currentUser = {
      id: 1,
      name: 'Sarah Jenkins',
      email: 'sarah.owner@petcare.com',
      role: 'owner',
      phone: '+880 1712-345678'
    };
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(AppState.currentUser));
  }

  renderAuthBadge();
}

function renderAuthBadge() {
  const container = document.getElementById('auth-state-box');
  if (!container) return;

  if (AppState.currentUser) {
    const isStaff = AppState.currentUser.role === 'staff';
    const initials = AppState.currentUser.name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('');

    container.innerHTML = `
      <div class="user-badge-btn" onclick="openAuthModal()" title="Click to switch user or log out">
        <div class="user-avatar-circle">${initials}</div>
        <span>${AppState.currentUser.name}</span>
        <span class="badge-tag" style="background:${isStaff ? '#ede9fe' : '#ccfbf1'}; color:${isStaff ? '#6b21a8' : '#0f766e'};">
          ${isStaff ? 'Staff / Vet' : 'Pet Owner'}
        </span>
        <i class="fa-solid fa-chevron-down" style="font-size: 0.7rem; color: var(--text-muted)"></i>
      </div>
    `;
  } else {
    container.innerHTML = `
      <button class="btn btn-primary" onclick="openAuthModal()">
        <i class="fa-solid fa-right-to-bracket"></i> Sign In
      </button>
    `;
  }
}

let currentAuthMode = 'login';

function openAuthModal() {
  document.getElementById('modal-auth').classList.remove('hidden');
  switchAuthMode('login');
}

function closeAuthModal() {
  document.getElementById('modal-auth').classList.add('hidden');
}

function switchAuthMode(mode) {
  currentAuthMode = mode;
  const isReg = mode === 'register';

  document.getElementById('tab-login').classList.toggle('active', !isReg);
  document.getElementById('tab-register').classList.toggle('active', isReg);

  document.getElementById('group-name').classList.toggle('hidden', !isReg);
  document.getElementById('group-role').classList.toggle('hidden', !isReg);
  document.getElementById('group-phone').classList.toggle('hidden', !isReg);

  document.getElementById('auth-modal-title').textContent = isReg ? 'Create a PetCare Account' : 'Sign In to PetCare';
  document.getElementById('auth-submit-btn').textContent = isReg ? 'Register Account' : 'Sign In';
}

async function handleAuthSubmit(event) {
  event.preventDefault();
  const email = document.getElementById('auth-email').value;
  const password = document.getElementById('auth-password').value;

  if (currentAuthMode === 'login') {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        AppState.currentUser = data.user;
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(data.user));
        renderAuthBadge();
        closeAuthModal();
        showToast(`Welcome back, ${data.user.name}!`, 'success');
        refreshCurrentView();
      } else {
        showToast(data.message || 'Login failed', 'error');
      }
    } catch (err) {
      showToast('Network error during login.', 'error');
    }
  } else {
    // Register
    const name = document.getElementById('auth-name').value;
    const role = document.getElementById('auth-role').value;
    const phone = document.getElementById('auth-phone').value;

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, phone })
      });
      const data = await res.json();
      if (data.success) {
        AppState.currentUser = data.user;
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(data.user));
        renderAuthBadge();
        closeAuthModal();
        showToast('Registration successful! Logged in.', 'success');
        refreshCurrentView();
      } else {
        showToast(data.message || 'Registration failed', 'error');
      }
    } catch (err) {
      showToast('Network error during registration.', 'error');
    }
  }
}

// Quick demo login
async function quickLogin(email) {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'password123' })
    });
    const data = await res.json();
    if (data.success) {
      AppState.currentUser = data.user;
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(data.user));
      renderAuthBadge();
      closeAuthModal();
      showToast(`Switched account to ${data.user.name} (${data.user.role})`, 'success');
      refreshCurrentView();
    } else {
      showToast('Quick login failed.', 'error');
    }
  } catch (e) {
    showToast('Network error during quick login.', 'error');
  }
}

function refreshCurrentView() {
  if (AppState.currentView === 'dashboard' && window.loadDashboard) window.loadDashboard();
  if (AppState.currentView === 'pets' && window.loadPets) window.loadPets();
  if (AppState.currentView === 'appointments' && window.loadAppointments) window.loadAppointments();
}

async function loadGlobalData() {
  if (window.loadDashboard) await window.loadDashboard();
}

// Expose global helpers
window.AppState = AppState;
window.showToast = showToast;
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;
window.switchAuthMode = switchAuthMode;
window.handleAuthSubmit = handleAuthSubmit;
window.quickLogin = quickLogin;
window.refreshCurrentView = refreshCurrentView;
