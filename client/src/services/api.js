// client/src/services/api.js
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Public Endpoint: Fetch active questions & business config
 */
export async function fetchPublicConfig() {
  const res = await fetch(`${API_BASE}/config`);
  if (!res.ok) {
    throw new Error('Failed to load estimator configuration.');
  }
  return res.json();
}

/**
 * Public Endpoint: Submit answers and calculate estimate server-side
 */
export async function submitEstimate(payload) {
  const res = await fetch(`${API_BASE}/estimate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Calculation request failed.');
  }
  return res.json();
}

/**
 * Admin Endpoint: Fetch full config for editing
 */
export async function fetchAdminConfig(credentials) {
  const token = btoa(`${credentials.username.trim()}:${credentials.password.trim()}`);
  const res = await fetch(`${API_BASE}/admin/config`, {
    headers: {
      'Authorization': `Basic ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}: Authentication failed`);
  }
  return res.json();
}

/**
 * Admin Endpoint: Update config rates and questions
 */
export async function updateAdminConfig(config, credentials) {
  const token = btoa(`${credentials.username.trim()}:${credentials.password.trim()}`);
  const res = await fetch(`${API_BASE}/admin/config`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${token}`
    },
    body: JSON.stringify(config)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to update config.');
  }
  return res.json();
}

/**
 * Admin Endpoint: Fetch captured leads
 */
export async function fetchAdminLeads(credentials) {
  const token = btoa(`${credentials.username.trim()}:${credentials.password.trim()}`);
  const res = await fetch(`${API_BASE}/admin/leads`, {
    headers: {
      'Authorization': `Basic ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}: Authentication failed`);
  }
  return res.json();
}