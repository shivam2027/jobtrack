import React, { useEffect, useState, useCallback } from 'react';
import api from '../api/axios';
import StatCard from '../components/StatCard.jsx';
import ApplicationCard from '../components/ApplicationCard.jsx';
import ApplicationForm from '../components/ApplicationForm.jsx';

export default function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({ total: 0, applied: 0, interviewing: 0, offer: 0, rejected: 0 });
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingApp, setEditingApp] = useState(null);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    const params = {};
    if (statusFilter) params.status = statusFilter;
    if (search) params.search = search;
    const { data } = await api.get('/applications', { params });
    setApplications(data.applications);
    setLoading(false);
  }, [statusFilter, search]);

  const fetchStats = useCallback(async () => {
    const { data } = await api.get('/applications/stats');
    setStats(data.stats);
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleCreate = async (form) => {
    await api.post('/applications', form);
    setShowForm(false);
    fetchApplications();
    fetchStats();
  };

  const handleUpdate = async (form) => {
    await api.put(`/applications/${editingApp.id}`, form);
    setEditingApp(null);
    fetchApplications();
    fetchStats();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this application?')) return;
    await api.delete(`/applications/${id}`);
    fetchApplications();
    fetchStats();
  };

  const handleStatusChange = async (id, status) => {
    await api.put(`/applications/${id}`, { status });
    fetchApplications();
    fetchStats();
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Applications</h1>
          <p className="mt-1 text-sm text-ink/60">Track every role you apply to, in one place.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          + Add application
        </button>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
        <StatCard label="Total" value={stats.total} />
        <StatCard label="Applied" value={stats.applied} accentClass="text-blue-600" />
        <StatCard label="Interviewing" value={stats.interviewing} accentClass="text-amber-600" />
        <StatCard label="Offers" value={stats.offer} accentClass="text-emerald-600" />
        <StatCard label="Rejected" value={stats.rejected} accentClass="text-rose-600" />
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by company or role..."
          className="input-field max-w-xs"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input-field w-auto"
        >
          <option value="">All statuses</option>
          <option value="applied">Applied</option>
          <option value="interviewing">Interviewing</option>
          <option value="offer">Offer</option>
          <option value="rejected">Rejected</option>
          <option value="withdrawn">Withdrawn</option>
        </select>
      </div>

      {loading ? (
        <p className="text-sm text-ink/50">Loading applications...</p>
      ) : applications.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="font-display text-lg font-semibold">No applications yet</p>
          <p className="mt-1 text-sm text-ink/60">
            Add your first job application to start tracking your search.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {applications.map((app) => (
            <ApplicationCard
              key={app.id}
              application={app}
              onEdit={setEditingApp}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      {showForm && <ApplicationForm onSubmit={handleCreate} onClose={() => setShowForm(false)} />}
      {editingApp && (
        <ApplicationForm
          initial={editingApp}
          onSubmit={handleUpdate}
          onClose={() => setEditingApp(null)}
        />
      )}
    </main>
  );
}
