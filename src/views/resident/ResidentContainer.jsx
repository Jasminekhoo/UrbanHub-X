import React, { useState } from 'react';
import { useNightSafe } from '../../context/NightSafeContext';
import { ResidentHomeView } from './ResidentHomeView';
import { RouteComparisonView } from './RouteComparisonView';
import { JourneyPreviewView } from './JourneyPreviewView';
import { SafetyCentreView } from './SafetyCentreView';
import { HazardReportView } from './HazardReportView';
import { SettingsView } from './SettingsView';
import { 
  Home, 
  Compass, 
  AlertTriangle, 
  Shield, 
  Settings, 
  Smartphone, 
  Maximize2, 
  Minimize2,
  Sparkles
} from 'lucide-react';

export function ResidentContainer() {
  const { 
    residentTab, 
    setResidentTab, 
    journeyStatus, 
    storylineStep, 
    setIsStorylineDrawerOpen,
    heldBrightNode,
    navigateRole,
    resetDemoScenario 
  } = useNightSafe();
  const [phoneFrame, setPhoneFrame] = useState(true);

  // Render sub-view
  let content = <ResidentHomeView />;
  if (residentTab === 'routes') content = <RouteComparisonView />;
  else if (residentTab === 'journey') content = <JourneyPreviewView />;
  else if (['safety', 'duress-setup', 'duress-trigger', 'sos', 'checkpoints'].includes(residentTab)) {
    content = <SafetyCentreView />;
  } else if (['report', 'my-reports'].includes(residentTab)) {
    content = <HazardReportView />;
  } else if (residentTab === 'settings') {
    content = <SettingsView />;
  }

  return (
    <div className="py-4 px-2 sm:px-4 flex flex-col items-center justify-center min-h-screen bg-[#0D1726] text-[#172334]">
      {/* Subtle control bar above phone frame on desktop */}
      <div className="w-full max-w-[400px] mb-2 px-2 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5 font-semibold text-slate-300">
          <Smartphone className="w-3.5 h-3.5 text-[#2864A6]" />
          <span>NightSafe Loop · Mobile App</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsStorylineDrawerOpen(true)}
            className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 hover:text-amber-300 transition"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Pitch Guide</span>
          </button>
          <span className="text-slate-600">|</span>
          <button
            onClick={() => setPhoneFrame(!phoneFrame)}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 hover:bg-slate-700 text-[11px] text-slate-300 transition"
            title="Toggle phone chassis frame"
          >
            {phoneFrame ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
            <span>{phoneFrame ? 'Expand' : 'Phone'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Device Chassis Frame */}
      <div className={`relative transition-all duration-300 w-full ${
        phoneFrame 
          ? 'max-w-[400px] h-[850px] rounded-[46px] p-3.5 bg-slate-900 shadow-2xl border-4 border-slate-700' 
          : 'max-w-xl h-auto min-h-[750px] rounded-2xl p-4 bg-white shadow-xl border border-slate-700'
      }`}>
        {/* Dynamic Island / Speaker Notch on Phone Frame */}
        {phoneFrame && (
          <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-40 flex items-center justify-between px-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900"></span>
            <span className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse"></span>
          </div>
        )}

        {/* Screen Viewport with inner scrolling */}
        <div className={`relative w-full h-full overflow-y-auto bg-[#F5F7FA] flex flex-col ${
          phoneFrame ? 'rounded-[36px] pt-7' : 'rounded-xl'
        }`}>
          {/* In-App Mobile Top Header */}
          <div className="sticky top-0 z-30 bg-[#142B4A] text-white px-3.5 py-2.5 flex items-center justify-between shadow-sm border-b border-slate-700/80">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setResidentTab('home')}>
              <div className="w-7 h-7 rounded-lg bg-[#2864A6] flex items-center justify-center font-bold text-xs text-[#F4B942] border border-sky-400/30 shadow-inner">
                NL
              </div>
              <div>
                <div className="font-extrabold text-xs text-white leading-tight">NightSafe Loop</div>
                <div className="text-[10px] text-sky-200">Aina (Demo Resident)</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => navigateRole('login')}
                className="px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-sky-200 text-[10px] font-semibold border border-slate-700 transition"
                title="Switch Account / Roles"
              >
                Roles / Exit
              </button>
            </div>
          </div>

          {/* Held Bright Emergency Alert Banner (Inside Mobile Handset) */}
          {heldBrightNode && (
            <div className="bg-[#F4B942] text-slate-950 px-3 py-1.5 text-[11px] font-bold flex items-center justify-between border-b border-amber-500 shadow-sm animate-pulse z-20">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                <span>Nearby lamps held bright near {heldBrightNode}</span>
              </div>
              <button
                onClick={() => navigateRole('security', 'alert-detail')}
                className="underline text-[10px] font-extrabold ml-1 hover:text-red-900"
              >
                View Console →
              </button>
            </div>
          )}

          {/* Scrollable Main Content */}
          <div className="flex-1 px-4 pt-3">
            {content}
          </div>

          {/* Resident Bottom Navigation Bar (Fixed to bottom of screen viewport) */}
          <nav className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 flex items-center justify-around shadow-lg">
            <button
              onClick={() => setResidentTab('home')}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition ${
                residentTab === 'home' ? 'text-[#2864A6]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>

            <button
              onClick={() => setResidentTab('routes')}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition ${
                ['routes', 'journey'].includes(residentTab) ? 'text-[#2864A6]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Night Path</span>
            </button>

            <button
              onClick={() => setResidentTab('report')}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition ${
                ['report', 'my-reports'].includes(residentTab) ? 'text-[#2864A6]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Report</span>
            </button>

            <button
              onClick={() => setResidentTab('safety')}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition ${
                ['safety', 'duress-setup', 'duress-trigger', 'sos'].includes(residentTab) ? 'text-[#2864A6]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Safety</span>
            </button>

            <button
              onClick={() => setResidentTab('settings')}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition ${
                residentTab === 'settings' ? 'text-[#2864A6]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
