import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-slateline bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent font-display text-sm font-bold text-white">
            JT
          </div>
          <span className="font-display text-lg font-semibold">JobTrack</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-ink/60 sm:inline">
            {user?.name}
          </span>
          <button onClick={logout} className="btn-secondary">
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
