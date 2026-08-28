import React from 'react';

const STATUS_STYLES = {
  applied: 'bg-blue-50 text-blue-700 border-blue-200',
  interviewing: 'bg-amber-50 text-amber-700 border-amber-200',
  offer: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-rose-50 text-rose-700 border-rose-200',
  withdrawn: 'bg-gray-100 text-gray-600 border-gray-200',
};

export default function ApplicationCard({ application, onEdit, onDelete, onStatusChange }) {
  const { company, role, status, location, salary, job_url, applied_date } = application;

  return (
    <div className="card flex flex-col gap-3 p-5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-display text-base font-semibold text-ink">{role}</h3>
          <p className="text-sm text-ink/60">{company}</p>
        </div>
        <span
          className={`rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[status]}`}
        >
          {status}
        </span>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink/50">
        {location && <span>📍 {location}</span>}
        {salary && <span>💰 {salary}</span>}
        {applied_date && <span>📅 Applied {applied_date}</span>}
      </div>

      {job_url && (
        <a
          href={job_url}
          target="_blank"
          rel="noreferrer"
          className="text-xs font-medium text-accent hover:underline"
        >
          View job posting →
        </a>
      )}

      <div className="mt-2 flex items-center justify-between gap-2 border-t border-slateline pt-3">
        <select
          value={status}
          onChange={(e) => onStatusChange(application.id, e.target.value)}
          className="input-field w-auto text-xs"
        >
          <option value="applied">Applied</option>
          <option value="interviewing">Interviewing</option>
          <option value="offer">Offer</option>
          <option value="rejected">Rejected</option>
          <option value="withdrawn">Withdrawn</option>
        </select>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(application)}
            className="text-xs font-semibold text-ink/60 hover:text-accent"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(application.id)}
            className="text-xs font-semibold text-ink/60 hover:text-rose-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
