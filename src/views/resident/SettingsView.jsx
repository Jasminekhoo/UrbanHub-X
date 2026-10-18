import React, { useState } from 'react';
import { useNightSafe } from '../../context/NightSafeContext';
import { 
  Sliders, 
  Eye, 
  Bell, 
  MapPin, 
  Lock, 
  ShieldCheck, 
  Info, 
  StopCircle,
  Sparkles
} from 'lucide-react';

export function SettingsView() {
  const { 
    journeyStatus, 
    endJourney, 
    checkinsEnabled, 
    setCheckinsEnabled, 
    showToast 
  } = useNightSafe();

  const [textSize, setTextSize] = useState('normal'); // 'normal' | 'large'
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [locationPermission, setLocationPermission] = useState('active_only');

  const handleToggleContrast = () => {
    setHighContrast(!highContrast);
    showToast(!highContrast ? 'High contrast visual mode enabled.' : 'Standard contrast mode restored.', 'info');
  };

  const handleToggleMotion = () => {
    setReducedMotion(!reducedMotion);
    showToast(!reducedMotion ? 'Reduced motion animation mode enabled.' : 'Standard animation mode active.', 'info');
  };

  return (
    <div className="space-y-4 pb-20">
      <div>
        <h2 className="text-base font-bold text-slate-900">Accessibility & Privacy Settings</h2>
        <p className="text-xs text-slate-500">Customize display, motion, and privacy limits</p>
      </div>

      {/* Active journey stop box */}
      {journeyStatus === 'in_progress' && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-950 space-y-2">
          <div className="font-bold flex items-center justify-between">
            <span>Simulated Journey Active</span>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
          </div>
          <p className="text-[11px] text-amber-900 leading-snug">
            Location simulation is currently active. You can end journey tracking at any time.
          </p>
          <button
            onClick={endJourney}
            className="w-full py-2 px-3 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-1.5"
          >
            <StopCircle className="w-3.5 h-3.5 text-red-400" />
            <span>End Journey / Stop Simulated Location Sharing</span>
          </button>
        </div>
      )}

      {/* Accessibility options */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
          <Eye className="w-4 h-4 text-[#2864A6]" />
          <span>Visual & Motion Accessibility</span>
        </h3>

        <div className="space-y-2.5 text-xs text-slate-700">
          <div className="flex items-center justify-between py-1 border-b border-slate-100">
            <div>
              <div className="font-semibold text-slate-800">High Contrast Mode</div>
              <div className="text-[11px] text-slate-400">Enhance edge contrast and text sharpness</div>
            </div>
            <input
              type="checkbox"
              checked={highContrast}
              onChange={handleToggleContrast}
              className="w-4 h-4 text-[#2864A6] rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-100">
            <div>
              <div className="font-semibold text-slate-800">Reduced Motion</div>
              <div className="text-[11px] text-slate-400">Limit pulse effects and map transitions</div>
            </div>
            <input
              type="checkbox"
              checked={reducedMotion}
              onChange={handleToggleMotion}
              className="w-4 h-4 text-[#2864A6] rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between py-1">
            <div>
              <div className="font-semibold text-slate-800">Text Display Size</div>
              <div className="text-[11px] text-slate-400">Scale UI typography</div>
            </div>
            <div className="flex gap-1 text-[11px] font-bold">
              <button
                onClick={() => setTextSize('normal')}
                className={`px-2 py-1 rounded border ${textSize === 'normal' ? 'bg-[#2864A6] text-white' : 'bg-slate-50 text-slate-600'}`}
              >
                100%
              </button>
              <button
                onClick={() => setTextSize('large')}
                className={`px-2 py-1 rounded border ${textSize === 'large' ? 'bg-[#2864A6] text-white' : 'bg-slate-50 text-slate-600'}`}
              >
                125%
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Limits */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
          <Lock className="w-4 h-4 text-[#2864A6]" />
          <span>Privacy & Location Boundaries</span>
        </h3>

        <div className="space-y-2 text-xs text-slate-600">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-bold text-slate-800">Strict Journey-Only Location Policy</div>
            <p className="text-[11px] text-slate-500 leading-snug">
              NightSafe Loop only shares checkpoint coordinates when a night journey is actively underway. No continuous 24/7 background geolocation occurs.
            </p>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="font-semibold text-slate-800">Automated Check-in Pings</span>
            <input
              type="checkbox"
              checked={checkinsEnabled}
              onChange={(e) => setCheckinsEnabled(e.target.checked)}
              className="w-4 h-4 text-[#2864A6] rounded cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Demo Account & Role Switcher */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#2864A6]" />
          <span>Demo Profile & Role Switcher</span>
        </h3>

        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Current User:</span>
            <span className="font-bold text-[#142B4A]">Aina (Demo Resident)</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Account Type:</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-[#2864A6]">Resident Handset</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1 text-xs font-semibold">
          <button
            onClick={() => navigateRole('security', 'overview')}
            className="py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center gap-1.5 transition"
          >
            <span>Security Console</span>
          </button>
          <button
            onClick={() => navigateRole('property', 'overview')}
            className="py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center gap-1.5 transition"
          >
            <span>Property Intel</span>
          </button>
        </div>

        <button
          onClick={() => navigateRole('login')}
          className="w-full py-2.5 px-3 rounded-lg bg-[#142B4A] hover:bg-[#1E3C66] text-white text-xs font-bold transition flex items-center justify-center gap-1.5"
        >
          <span>Sign Out / Switch Account</span>
        </button>
      </div>

      {/* Disclaimer */}
      <div className="p-3 rounded-xl bg-slate-100 text-[10px] text-slate-500 leading-relaxed">
        <span className="font-semibold">Notice:</span> Hackathon demo prototype. Does not collect personal data, IC number, or real-world addresses.
      </div>
    </div>
  );
}
