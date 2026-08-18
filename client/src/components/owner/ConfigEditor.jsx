// client/src/components/owner/ConfigEditor.jsx
import React, { useState } from 'react';
import { updateAdminConfig } from '../../services/api';

export default function ConfigEditor({ config, credentials, onSaveSuccess }) {
  const [formData, setFormData] = useState(config);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  const handleToggleActive = (questionIndex) => {
    const updated = { ...formData };
    updated.questions[questionIndex].active = !updated.questions[questionIndex].active;
    setFormData(updated);
  };

  const handleOptionRateChange = (qIndex, optIndex, field, value) => {
    const updated = { ...formData };
    updated.questions[qIndex].options[optIndex][field] = Number(value);
    setFormData(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    setStatusMsg(null);
    try {
      const updated = await updateAdminConfig(formData, credentials);
      setStatusMsg('Configuration successfully updated and version incremented.');
      if (onSaveSuccess) onSaveSuccess(updated);
    } catch (err) {
      setStatusMsg(`Save failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {statusMsg && (
        <div className="p-3 bg-blue-50 text-blue-700 rounded text-sm font-medium">
          {statusMsg}
        </div>
      )}

      {formData.questions.map((q, qIndex) => (
        <div key={q.key} className="p-4 border rounded-lg bg-white shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <span className="font-semibold text-slate-800">{q.label}</span>
              <span className="ml-2 text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                {q.key}
              </span>
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={q.active}
                onChange={() => handleToggleActive(qIndex)}
                className="h-4 w-4 text-blue-600"
              />
              <span>Active</span>
            </label>
          </div>

          {q.options && q.options.length > 0 && (
            <div className="mt-3 space-y-2">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Options & Rates
              </div>
              {q.options.map((opt, optIndex) => (
                <div key={opt.value} className="flex items-center gap-4 text-sm bg-slate-50 p-2 rounded">
                  <span className="w-1/3 text-slate-700 truncate">{opt.label}</span>

                  {'rate_per_sqft' in opt && (
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-500">$/sqft:</span>
                      <input
                        type="number"
                        step="0.05"
                        value={opt.rate_per_sqft ?? ''}
                        onChange={(e) =>
                          handleOptionRateChange(qIndex, optIndex, 'rate_per_sqft', e.target.value)
                        }
                        className="w-24 px-2 py-1 border rounded bg-white"
                      />
                    </div>
                  )}

                  {'multiplier' in opt && (
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-500">Multiplier:</span>
                      <input
                        type="number"
                        step="0.01"
                        value={opt.multiplier ?? ''}
                        onChange={(e) =>
                          handleOptionRateChange(qIndex, optIndex, 'multiplier', e.target.value)
                        }
                        className="w-24 px-2 py-1 border rounded bg-white"
                      />
                    </div>
                  )}

                  {'tear_off_per_sqft' in opt && (
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-500">Tear-off $/sqft:</span>
                      <input
                        type="number"
                        step="0.05"
                        value={opt.tear_off_per_sqft ?? ''}
                        onChange={(e) =>
                          handleOptionRateChange(qIndex, optIndex, 'tear_off_per_sqft', e.target.value)
                        }
                        className="w-24 px-2 py-1 border rounded bg-white"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save Configuration Changes'}
      </button>
    </div>
  );
}