import React from 'react';

export default function StatCard({ label, value, accentClass }) {
  return (
    <div className="card p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-ink/50">{label}</p>
      <p className={`mt-1 font-display text-2xl font-semibold ${accentClass || 'text-ink'}`}>
        {value}
      </p>
    </div>
  );
}
