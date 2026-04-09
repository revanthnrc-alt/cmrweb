import React from 'react';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="relative flex min-h-[calc(100vh-60px)] items-center justify-center overflow-hidden bg-[#0A0A0F] px-4 py-20">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute left-[15%] top-[20%] h-80 w-80 rounded-full bg-accent-cyan/12 blur-[128px]" />
      <div className="absolute right-[15%] top-[28%] h-96 w-96 rounded-full bg-accent-purple/10 blur-[128px]" />
      <div className="absolute bottom-[8%] left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-accent-amber/10 blur-[128px]" />

      <div className="relative z-10 w-full max-w-xl rounded-3xl border border-border-subtle bg-bg-card/85 px-8 py-12 text-center shadow-2xl backdrop-blur-xl">
        <div className="mb-4 font-space text-5xl font-bold text-text-primary sm:text-6xl">404</div>
        <h1 className="mb-3 font-space text-3xl font-bold text-text-primary">404 — Page Not Found</h1>
        <p className="mb-8 text-text-secondary">
          The page you were looking for drifted out of orbit. Let’s get you back to the club.
        </p>
        <Link
          to="/"
          className="inline-flex items-center rounded-full border border-accent-cyan/20 bg-accent-cyan/10 px-6 py-3 font-medium text-accent-cyan transition-colors hover:bg-accent-cyan/20"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
