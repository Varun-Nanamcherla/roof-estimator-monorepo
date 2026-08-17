// client/src/services/api.js
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function fetchPublicConfig() {
  const res = await fetch(`${API_BASE}/config`);
  if (!res.ok) throw new Error('Failed to load estimator configuration.');
  return res.json();
}

export async function submitEstimate(payload) {
  const res = await fetch(`${API_BASE}/estimate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Calculation request failed.');
  return res.json();
}

export async function fetchAdminConfig(credentials) {
  const res = await fetch(`${API_BASE}/admin/config`, {
    headers: {
      'Authorization': `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`
    }
  });
  if (!res.ok) throw new Error('Authentication failed.');
  return res.json();
}

export async function updateAdminConfig(config, credentials) {
  const res = await fetch(`${API_BASE}/admin/config`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`
    }
  });
  if (!res.ok) throw new Error('Failed to update config.');
  return res.json();
}

export async function fetchAdminLeads(credentials) {
  const res = await fetch(`${API_BASE}/admin/leads`, {
    headers: {
      'Authorization': `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`
    }
  });
  if (!res.ok) throw new Error('Authentication failed.');
  return res.json();
}