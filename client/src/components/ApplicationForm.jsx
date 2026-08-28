import React, { useState } from 'react';

const EMPTY = {
  company: '',
  role: '',
  status: 'applied',
  location: '',
  salary: '',
  job_url: '',
  notes: '',
  applied_date: '',
};

export default function ApplicationForm({ initial, onSubmit, onClose }) {
  const [form, setForm] = useState(initial || EMPTY);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.company.trim() || !form.role.trim()) {
      setError('Company and role are required');
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4">
      <div className="card w-full max-w-lg p-6">
        <h2 className="mb-4 font-display text-lg font-semibold">
          {initial ? 'Edit application' : 'Add application'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-ink/60">Company *</label>
              <input
                name="company"
                value={form.company}
                onChange={handleChange}
                className="input-field"
                placeholder="Acme Inc."
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink/60">Role *</label>
              <input
                name="role"
                value={form.role}
                onChange={handleChange}
                className="input-field"
                placeholder="Frontend Engineer"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-ink/60">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="input-field">
                <option value="applied">Applied</option>
                <option value="interviewing">Interviewing</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
                <option value="withdrawn">Withdrawn</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink/60">Applied date</label>
              <input
                type="date"
                name="applied_date"
                value={form.applied_date || ''}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-ink/60">Location</label>
              <input
                name="location"
                value={form.location || ''}
                onChange={handleChange}
                className="input-field"
                placeholder="Remote"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink/60">Salary</label>
              <input
                name="salary"
                value={form.salary || ''}
                onChange={handleChange}
                className="input-field"
                placeholder="$120k - $150k"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-ink/60">Job posting URL</label>
            <input
              name="job_url"
              value={form.job_url || ''}
              onChange={handleChange}
              className="input-field"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-ink/60">Notes</label>
            <textarea
              name="notes"
              value={form.notes || ''}
              onChange={handleChange}
              rows={3}
              className="input-field"
              placeholder="Recruiter contact, interview prep notes..."
            />
          </div>

          {error && <p className="text-xs font-medium text-rose-600">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
