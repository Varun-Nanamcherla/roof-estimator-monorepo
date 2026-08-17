// client/src/components/estimator/EstimatorWizard.jsx
import React, { useState, useEffect } from 'react';
import { fetchPublicConfig, submitEstimate } from '../../services/api';
import QuestionField from '../dynamic/QuestionField';

export default function EstimatorWizard() {
  const [config, setConfig] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [contact, setContact] = useState({ name: '', email: '', phone: '' });
  const [estimate, setEstimate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPublicConfig()
      .then(setConfig)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleAnswerChange = (key, val) => {
    setAnswers((prev) => ({ ...prev, [key]: val }));
  };

  const handleNext = () => {
    if (currentStep < config.questions.length) {
      const activeQ = config.questions[currentStep];
      if (activeQ.required && answers[activeQ.key] === undefined) {
        alert('Please provide an answer before continuing.');
        return;
      }
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await submitEstimate({ contact, answers });
      setEstimate(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !config) return <div className="p-8 text-center">Loading estimator...</div>;
  if (error) return <div className="p-8 text-center text-red-600">Error: {error}</div>;

  const totalSteps = config.questions.length + 1; // questions + contact step

  return (
    <div className="max-w-xl mx-auto my-8 p-6 bg-white rounded-xl shadow-md border border-slate-100">
      <header className="mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold text-slate-900">{config.business.name}</h1>
        <p className="text-sm text-slate-500">{config.business.region} Roof Replacement Estimate</p>
      </header>

      {estimate ? (
        <div className="text-center py-6">
          <h2 className="text-xl font-medium text-slate-700 mb-2">Estimated Cost Range</h2>
          <div className="text-4xl font-extrabold text-blue-600 my-4">
            ${estimate.estimate_low.toLocaleString()} – ${estimate.estimate_high.toLocaleString()}
          </div>
          <p className="text-sm text-slate-500">
            Thank you, {contact.name}. We will follow up via email at {contact.email}.
          </p>
        </div>
      ) : currentStep < config.questions.length ? (
        <div>
          <QuestionField
            question={config.questions[currentStep]}
            value={answers[config.questions[currentStep].key]}
            onChange={handleAnswerChange}
          />
          <div className="flex justify-between mt-8">
            <button
              disabled={currentStep === 0}
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="px-4 py-2 border rounded-lg text-slate-600 disabled:opacity-30"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-800">Final Step: Your Details</h2>
          <div>
            <label className="block text-sm font-medium text-slate-700">Full Name</label>
            <input
              type="text"
              required
              value={contact.name}
              onChange={(e) => setContact({ ...contact, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Email Address</label>
            <input
              type="email"
              required
              value={contact.email}
              onChange={(e) => setContact({ ...contact, email: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Phone Number</label>
            <input
              type="tel"
              required
              value={contact.phone}
              onChange={(e) => setContact({ ...contact, phone: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg"
          >
            Calculate My Estimate
          </button>
        </form>
      )}
    </div>
  );
}