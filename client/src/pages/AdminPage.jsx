// client/src/pages/AdminPage.jsx
import React, { useState, useEffect } from 'react';
import { fetchAdminConfig, fetchAdminLeads } from '../services/api';
import ConfigEditor from '../components/owner/ConfigEditor';
import LeadTable from '../components/owner/LeadTable';

export default function AdminPage() {
  const [credentials, setCredentials] = useState(null);
  const [loginInput, setLoginInput] = useState({ username: '', password: '' });
  const [activeTab, setActiveTab] = useState('leads'); // 'leads' | 'config'
  const [config, setConfig] = useState(null);
  const [leads, setLeads] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadAdminData = async (creds) => {
    setLoading(true);
    setError(null);
    try {
      const [cfg, lds] = await Promise.all([
        fetchAdminConfig(creds),
        fetchAdminLeads(creds)
      ]);
      setConfig(cfg);
      setLeads(lds);
      setCredentials(creds);
    } catch (err) {
      setError(err.message || 'Invalid credentials or failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    loadAdminData(loginInput);
  };

  if (!credentials) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 bg-white border rounded-xl shadow-sm">
        <h1 className="text-xl font-bold text-slate-800 mb-4">Owner Panel Login</h1>
        {error && <div className="p-2 mb-4 bg-red-50 text-red-600 text-sm rounded">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Username</label>
            <input
              type="text"
              required
              value={loginInput.username}
              onChange={(e) => setLoginInput({ ...loginInput, username: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              required
              value={loginInput.password}
              onChange={(e) => setLoginInput({ ...loginInput, password: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Log In'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto my-8 p-6">
      <header className="flex justify-between items-center pb-4 border-b">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Owner Dashboard</h1>
          <p className="text-sm text-slate-500">
            Active Config: v{config?.config_version} | {config?.business?.name}
          </p>
        </div>
        <button
          onClick={() => setCredentials(null)}
          className="text-sm text-red-600 hover:underline"
        >
          Log Out
        </button>
      </header>

      <div className="flex gap-4 border-b my-6">
        <button
          onClick={() => setActiveTab('leads')}
          className={`pb-2 px-1 font-medium ${
            activeTab === 'leads' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500'
          }`}
        >
          Captured Leads ({leads.length})
        </button>
        <button
          onClick={() => setActiveTab('config')}
          className={`pb-2 px-1 font-medium ${
            activeTab === 'config' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500'
          }`}
        >
          Pricing & Configuration
        </button>
      </div>

      {activeTab === 'leads' ? (
        <LeadTable leads={leads} />
      ) : (
        <ConfigEditor
          config={config}
          credentials={credentials}
          onSaveSuccess={(updated) => setConfig(updated)}
        />
      )}
    </div>
  );
}