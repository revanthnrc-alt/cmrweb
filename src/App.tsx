import React from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthKitProvider } from '@workos-inc/authkit-react';

import { ConvexClientProvider } from './providers/ConvexClientProvider';
import { Navbar } from './components/layout/Navbar.jsx';
import { AuthGuard } from './components/auth/AuthGuard';
import { AdminGuard } from './components/auth/AdminGuard';
import { ToastProvider } from './components/ui/Toast';
import { PageLoader } from './components/ui/PageLoader';
import { useCurrentUser } from './hooks/useCurrentUser';
import { HomePage } from './pages/HomePage';
import { ChallengesPage } from './pages/ChallengesPage';
import { ChallengeDetailPage } from './pages/ChallengeDetailPage';
import { EventsPage } from './pages/EventsPage';
import { TeamPage } from './pages/TeamPage';
import { GalleryPage } from './pages/GalleryPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';
import { SignInPage } from './pages/SignInPage';
import { NotFoundPage } from './pages/NotFoundPage';

function hasRealEnvValue(value: unknown) {
  return (
    typeof value === 'string' &&
    value.trim().length > 0 &&
    !value.includes('your_')
  );
}

function ConfigErrorScreen() {
  const issues = [
    !hasRealEnvValue(import.meta.env.VITE_CONVEX_URL) && 'Set VITE_CONVEX_URL in .env.local',
    !hasRealEnvValue(import.meta.env.VITE_WORKOS_CLIENT_ID) &&
      'Set VITE_WORKOS_CLIENT_ID in .env.local',
  ].filter(Boolean);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0A0A0F] px-4">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute left-[18%] top-[20%] h-72 w-72 rounded-full bg-accent-cyan/15 blur-[120px]" />
      <div className="absolute right-[14%] top-[30%] h-80 w-80 rounded-full bg-accent-purple/12 blur-[120px]" />
      <div className="absolute bottom-[12%] left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-accent-amber/10 blur-[120px]" />

      <div className="relative z-10 w-full max-w-2xl rounded-3xl border border-border-subtle bg-bg-card/85 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-6 font-space text-3xl font-bold tracking-[0.22em] text-text-primary">
          NE<span className="text-accent-cyan">X</span>US
        </div>
        <h1 className="mb-3 font-space text-3xl font-bold text-text-primary">
          Local setup needs one more step
        </h1>
        <p className="mb-6 text-text-secondary">
          The app started, but one or more required frontend environment variables are
          still placeholders. Replace them with the real values below and restart Vite.
        </p>

        <div className="mb-6 rounded-2xl border border-border-subtle bg-bg-surface/80 p-5">
          <div className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-accent-amber">
            Missing Config
          </div>
          <ul className="space-y-2 text-sm text-text-primary">
            {issues.map((issue) => (
              <li key={issue} className="rounded-xl bg-white/5 px-3 py-2">
                {issue}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-border-subtle bg-black/30 p-5 font-mono text-sm text-text-secondary">
          <div>VITE_CONVEX_URL=https://precious-warthog-406.convex.cloud</div>
          <div>VITE_WORKOS_CLIENT_ID=your_real_workos_client_id</div>
        </div>
      </div>
    </div>
  );
}

function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-base text-text-primary selection:bg-accent-cyan/30">
      <Navbar />
      <main className="pt-[60px]">{children}</main>
    </div>
  );
}

function RouteLoaderGate({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { isLoading } = useCurrentUser();
  const shouldGate =
    isLoading &&
    location.pathname !== '/' &&
    location.pathname !== '/challenges' &&
    location.pathname !== '/events' &&
    location.pathname !== '/gallery' &&
    location.pathname !== '/projects' &&
    location.pathname !== '/team' &&
    !location.pathname.startsWith('/challenges/');

  if (shouldGate) {
    return <PageLoader message="Syncing your builder profile..." />;
  }

  return <>{children}</>;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <RouteLoaderGate>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Routes location={location}>
            <Route path="/" element={<AppShell><HomePage /></AppShell>} />
            <Route path="/challenges" element={<AppShell><ChallengesPage /></AppShell>} />
            <Route path="/challenges/:id" element={<AppShell><ChallengeDetailPage /></AppShell>} />
            <Route path="/events" element={<AppShell><EventsPage /></AppShell>} />
            <Route path="/team" element={<AppShell><TeamPage /></AppShell>} />
            <Route path="/gallery" element={<AppShell><GalleryPage /></AppShell>} />
            <Route path="/projects" element={<AppShell><ProjectsPage /></AppShell>} />
            <Route
              path="/profile/:id"
              element={
                <AppShell>
                  <AuthGuard>
                    <ProfilePage />
                  </AuthGuard>
                </AppShell>
              }
            />
            <Route
              path="/admin"
              element={
                <AppShell>
                  <AdminGuard>
                    <AdminPage />
                  </AdminGuard>
                </AppShell>
              }
            />
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </RouteLoaderGate>
  );
}

export default function App() {
  if (import.meta.env.DEV && import.meta.env.VITE_DEBUG_BOOT === 'true') {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#0A0A0F',
          color: '#F0F0FF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Inter, sans-serif',
          padding: '24px',
        }}
      >
        <div
          style={{
            maxWidth: '720px',
            width: '100%',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '24px',
            background: 'rgba(22,22,30,0.88)',
            padding: '32px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          }}
        >
          <div style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '0.18em', marginBottom: '12px' }}>
            NE<span style={{ color: '#00D9FF' }}>X</span>US
          </div>
          <h1 style={{ fontSize: '28px', margin: 0, marginBottom: '12px' }}>Debug Boot Screen</h1>
          <p style={{ margin: 0, color: '#8B8BA7', lineHeight: 1.6 }}>
            React and Vite are rendering correctly. The next blocker is inside the app providers
            or route tree, not the browser connection.
          </p>
        </div>
      </div>
    );
  }

  if (
    !hasRealEnvValue(import.meta.env.VITE_CONVEX_URL) ||
    !hasRealEnvValue(import.meta.env.VITE_WORKOS_CLIENT_ID)
  ) {
    return <ConfigErrorScreen />;
  }

  return (
    <AuthKitProvider clientId={import.meta.env.VITE_WORKOS_CLIENT_ID}>
      <ConvexClientProvider>
        <ToastProvider>
          <BrowserRouter>
            <AnimatedRoutes />
          </BrowserRouter>
        </ToastProvider>
      </ConvexClientProvider>
    </AuthKitProvider>
  );
}
