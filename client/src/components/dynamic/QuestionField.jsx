// client/src/components/dynamic/QuestionField.jsx
import React from 'react';

export default function QuestionField({ question, value, onChange }) {
  if (!question || !question.active) return null;

  if (question.type === 'number') {
    return (
      <div className="space-y-2">
        <label className="block text-lg font-medium text-slate-800">
          {question.label} {question.unit ? `(${question.unit})` : ''}
        </label>
        <input
          type="number"
          min={question.min}
          max={question.max}
          value={value ?? ''}
          onChange={(e) => onChange(question.key, Number(e.target.value))}
          placeholder={`Enter value between ${question.min} - ${question.max}`}
          className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none"
          required={question.required}
        />
      </div>
    );
  }

  if (question.type === 'select') {
    return (
      <div className="space-y-3">
        <label className="block text-lg font-medium text-slate-800">
          {question.label}
        </label>
        <div className="grid gap-2">
          {question.options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(question.key, opt.value)}
              className={`text-left p-4 rounded-lg border transition ${
                value === opt.value
                  ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-semibold'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return null;
}