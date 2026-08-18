// client/src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import EstimatorWizard from './components/estimator/EstimatorWizard';
import AdminPage from './pages/AdminPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
          <Link to="/" className="text-xl font-bold text-slate-800 hover:text-blue-600">
            Northline Roofing
          </Link>
          <Link to="/admin" className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-md border border-slate-200 hover:bg-slate-100">
            Owner Portal
          </Link>
        </nav>
        <main className="py-8 px-4 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<EstimatorWizard />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}