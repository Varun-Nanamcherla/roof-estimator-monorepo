// client/src/components/owner/LeadTable.jsx
import React, { useState } from 'react';

export default function LeadTable({ leads }) {
  const [expandedId, setExpandedId] = useState(null);

  if (!leads || leads.length === 0) {
    return <p className="text-gray-500 py-4">No captured leads found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm border-collapse">
        <thead>
          <tr className="border-b bg-slate-50 text-slate-700">
            <th className="p-3">Captured</th>
            <th className="p-3">Customer</th>
            <th className="p-3">Contact</th>
            <th className="p-3">Estimate Range</th>
            <th className="p-3">Version</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => {
            const isExpanded = expandedId === (lead._id || lead.id);
            const answersObj = lead.answers instanceof Map 
              ? Object.fromEntries(lead.answers) 
              : lead.answers;

            return (
              <React.Fragment key={lead._id || lead.id}>
                <tr className="border-b hover:bg-slate-50/50">
                  <td className="p-3">
                    {new Date(lead.createdAt || lead.captured_at).toLocaleDateString()}
                  </td>
                  <td className="p-3 font-medium">{lead.name}</td>
                  <td className="p-3">
                    <div>{lead.email}</div>
                    <div className="text-xs text-slate-500">{lead.phone}</div>
                  </td>
                  <td className="p-3 font-semibold text-blue-600">
                    ${lead.estimate_low.toLocaleString()} – ${lead.estimate_high.toLocaleString()}
                  </td>
                  <td className="p-3 text-xs text-slate-500">v{lead.config_version}</td>
                  <td className="p-3">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : (lead._id || lead.id))}
                      className="text-xs text-blue-600 underline"
                    >
                      {isExpanded ? 'Hide' : 'View Answers'}
                    </button>
                  </td>
                </tr>
                {isExpanded && (
                  <tr className="bg-slate-50/80">
                    <td colSpan={6} className="p-4">
                      <div className="text-xs font-semibold text-slate-600 mb-1">Submitted Answers:</div>
                      <pre className="text-xs bg-white p-3 rounded border border-slate-200 overflow-x-auto">
                        {JSON.stringify(answersObj, null, 2)}
                      </pre>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}