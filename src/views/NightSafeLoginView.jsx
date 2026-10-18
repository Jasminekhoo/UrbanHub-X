import React, { useState } from 'react';
import { useNightSafe } from '../context/NightSafeContext';
import { 
  Smartphone, 
  Shield, 
  Building2, 
  ArrowRight, 
  KeyRound, 
  Mail, 
  Sparkles, 
  Info, 
  RotateCcw,
  CheckCircle2
} from 'lucide-react';

export function NightSafeLoginView() {
  const { navigateRole, resetDemoScenario, setIsStorylineDrawerOpen } = useNightSafe();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleFormLogin = (e) => {
    e.preventDefault();
    setError('');

    const lower = email.trim().toLowerCase();
    if (lower.includes('security') || lower.includes('guard')) {
      navigateRole('security', 'overview');
    } else if (lower.includes('property') || lower.includes('manager') || lower.includes('admin')) {
      navigateRole('property', 'overview');
    } else {
      // Default to Resident
      navigateRole('resident', 'home');
    }
  };

  const fillAccount = (roleType) => {
    setError('');
    if (roleType === 'resident') {
      setEmail('aina@nightsafe.demo');
      setPassword('Resident2026!');
    } else if (roleType === 'security') {
      setEmail('security@nightsafe.demo');
      setPassword('GuardOps2026!');
    } else if (roleType === 'property') {
      setEmail('property@nightsafe.demo');
      setPassword('PropertyMgmt2026!');
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1726] text-white flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#2864A6]/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute -bottom-16 right-4 w-[300px] h-[300px] bg-[#F4B942]/10 rounded-full blur-[80px] pointer-events-none"></div>

      {/* Top Header Bar */}
      <header className="max-w-md w-full mx-auto flex items-center justify-between text-xs py-2 border-b border-slate-800/80 relative z-10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-slate-300 font-mono text-[11px]">SDP Hackathon 2026 · Track: People</span>
        </div>
        <button
          onClick={() => setIsStorylineDrawerOpen(true)}
          className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold text-[11px]"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Pitch Guide</span>
        </button>
      </header>

      {/* Main Login Chassis (Mobile-First Card) */}
      <main className="max-w-md w-full mx-auto my-auto py-6 relative z-10 space-y-6">
        {/* Brand & Wordmark */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#2864A6] border border-sky-400/40 shadow-xl mb-1">
            <span className="text-[#F4B942] font-black text-2xl tracking-tighter">NL</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">NightSafe Loop</h1>
          <p className="text-xs text-amber-300/90 font-medium">
            Better-lit journeys. Faster help. Smarter community improvements.
          </p>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-slate-400 text-[10px] font-mono">
            <Info className="w-3 h-3 text-amber-400" />
            <span>Prototype Demo · Role-Based Mobile Access</span>
          </div>
        </div>

        {/* 1-Click Fast Role Login Portals (Recommended for Pitch Demo) */}
        <div className="bg-[#142B4A]/80 backdrop-blur-md rounded-2xl border border-slate-700 p-4 space-y-3 shadow-xl">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
            One-Click Demo Portals
          </div>

          {/* Resident Button (Primary) */}
          <button
            onClick={() => navigateRole('resident', 'home')}
            className="w-full p-3.5 rounded-xl bg-gradient-to-r from-[#2864A6] to-[#1E3C66] hover:from-[#1E3C66] hover:to-[#2864A6] text-white font-bold text-xs shadow-md border border-sky-400/30 flex items-center justify-between group transition-all"
          >
            <div className="flex items-center gap-3 text-left">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#F4B942]">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <div className="font-extrabold text-sm text-white flex items-center gap-1.5">
                  <span>Resident Mobile App</span>
                  <span className="text-[9px] bg-emerald-500 text-slate-950 font-black px-1.5 py-0.2 rounded-full uppercase">
                    Main App
                  </span>
                </div>
                <div className="text-[11px] text-sky-200/80 font-normal">
                  Aina · Night routes, light corridor & duress PIN
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-sky-300 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Security & Property Secondary Demo Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => navigateRole('security', 'overview')}
              className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-red-400/50 text-left transition space-y-1 group"
            >
              <div className="flex items-center justify-between">
                <Shield className="w-4 h-4 text-[#C83E4D]" />
                <span className="text-[10px] text-slate-400 font-mono">Demo S1–S4</span>
              </div>
              <div className="font-bold text-xs text-white group-hover:text-red-300">
                Security Ops
              </div>
              <div className="text-[10px] text-slate-400 leading-tight">
                Alert AL-204 & patrol audit
              </div>
            </button>

            <button
              onClick={() => navigateRole('property', 'overview')}
              className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-emerald-400/50 text-left transition space-y-1 group"
            >
              <div className="flex items-center justify-between">
                <Building2 className="w-4 h-4 text-[#1F9D8B]" />
                <span className="text-[10px] text-slate-400 font-mono">Demo M1–M8</span>
              </div>
              <div className="font-bold text-xs text-white group-hover:text-teal-300">
                Property Intel
              </div>
              <div className="text-[10px] text-slate-400 leading-tight">
                RM 5K budget optimizer
              </div>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-[#0D1726] px-3 text-slate-500 font-bold tracking-wider">
              Or Sign In with Demo Account
            </span>
          </div>
        </div>

        {/* Form Login */}
        <form onSubmit={handleFormLogin} className="bg-white/5 border border-slate-800 p-4 rounded-2xl space-y-3 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aina@nightsafe.demo"
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-sky-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Password</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-sky-400"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-[#2864A6] hover:bg-[#1E3C66] text-white font-bold text-xs shadow transition"
          >
            Sign In to NightSafe Loop
          </button>

          {/* Quick fill chips */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
            <span>Quick Autofill:</span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => fillAccount('resident')}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-sky-300"
              >
                Resident
              </button>
              <button
                type="button"
                onClick={() => fillAccount('security')}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-red-300"
              >
                Security
              </button>
              <button
                type="button"
                onClick={() => fillAccount('property')}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-teal-300"
              >
                Property
              </button>
            </div>
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer className="max-w-md w-full mx-auto py-3 text-center text-[10px] text-slate-500 border-t border-slate-800/80 flex items-center justify-between">
        <span>NightSafe Loop · Sime Darby Property 2026</span>
        <button
          onClick={resetDemoScenario}
          className="text-slate-400 hover:text-white flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Demo</span>
        </button>
      </footer>
    </div>
  );
}
