import React from 'react';
import { SignIn } from '@workos-inc/authkit-react';
import { GlassCard } from '../components/ui/GlassCard';

export function SignInPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0A0A0F] px-4 py-20">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage:
            'radial-gradient(ellipse 80% 80% at 50% 50%, #000 20%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 80% 80% at 50% 50%, #000 20%, transparent 100%)',
        }}
      />

      <div
        className="pointer-events-none absolute left-[14%] top-[18%] h-80 w-80 rounded-full"
        style={{ background: 'rgba(34, 211, 238, 0.18)', filter: 'blur(128px)' }}
      />
      <div
        className="pointer-events-none absolute right-[12%] top-[26%] h-96 w-96 rounded-full"
        style={{ background: 'rgba(168, 85, 247, 0.16)', filter: 'blur(128px)' }}
      />
      <div
        className="pointer-events-none absolute bottom-[10%] left-1/2 h-80 w-80 -translate-x-1/2 rounded-full"
        style={{ background: 'rgba(245, 158, 11, 0.12)', filter: 'blur(128px)' }}
      />

      <GlassCard className="relative z-10 w-full max-w-[420px] border border-border-subtle bg-bg-card/80 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-[18px]">
        <div className="mb-8 text-center">
          <div className="mb-5 font-space text-3xl font-bold tracking-[0.24em] text-text-primary">
            NE<span className="text-accent-cyan">X</span>US
          </div>
          <h1 className="font-space text-3xl font-bold text-text-primary">
            Sign in to your builder profile
          </h1>
        </div>

        <div className="rounded-2xl border border-border-subtle bg-bg-surface/70 p-4">
          <SignIn />
        </div>
      </GlassCard>
    </div>
  );
}

export default SignInPage;
