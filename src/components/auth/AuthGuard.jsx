import React from 'react';
import { Navigate } from 'react-router-dom';
import { LoaderCircle } from 'lucide-react';
import { useCurrentUser } from '../../hooks/useCurrentUser';

function GuardSpinner() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-bg-base">
      <div className="flex items-center gap-3 rounded-2xl border border-border-subtle bg-bg-surface px-5 py-4 text-text-secondary">
        <LoaderCircle className="animate-spin text-accent-cyan" size={20} />
        <span className="text-sm font-medium">Checking your session...</span>
      </div>
    </div>
  );
}

export function AuthGuard({ children }) {
  const { isLoading, isAuthenticated } = useCurrentUser();

  if (isLoading) {
    return <GuardSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  return children;
}

export default AuthGuard;
