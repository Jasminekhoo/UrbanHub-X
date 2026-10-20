import React, { useState } from 'react';
import { useNightSafe } from '../../context/NightSafeContext';
import { SchematicTownshipMap } from '../../components/SchematicTownshipMap';
import { 
  Shield, 
  ShieldAlert, 
  Bell, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  AlertTriangle, 
  Radio, 
  Filter, 
  Search, 
  FileText, 
  ChevronRight, 
  Lightbulb, 
  User, 
  History, 
  RotateCcw,
  Info,
  Smartphone
} from 'lucide-react';

export function SecurityDashboard() {
  const { 
    alerts, 
    acknowledgeAlert, 
    markResponseInProgress, 
    addAlertNote, 
    resolveAlert, 
    checkpointEvents, 
    securityTab, 
    setSecurityTab,
    selectedAlertId,
    setSelectedAlertId,
    hazards,
    activeLamps,
    heldBrightNode,
    showToast,
    navigateRole,
    resetDemoScenario
  } = useNightSafe();

  const [filterStatus, setFilterStatus] = useState('all');
  const [newNoteText, setNewNoteText] = useState('');
  const [showResolveModal, setShowResolveModal] = useState(false);

  // Selected alert object
  const activeAlert = alerts.find(a => a.id === selectedAlertId) || alerts[0];

  // Append an officer note to the active case audit trail (Screen S2)
  const handleAddNote = (e) => {
    e.preventDefault();
    const text = newNoteText.trim();
    if (!text || !activeAlert) return;
    addAlertNote(activeAlert.id, text);
    setNewNoteText('');
  };

  // Stats calculation
  const totalAlerts = alerts.length;
  const awaitingAck = alerts.filter(a => a.status === 'Awaiting security acknowledgement').length;
  const inProgress = alerts.filter(a => a.status === 'Response in progress' || a.status === 'Acknowledged').length;
  const resolved = alerts.filter(a => a.status === 'Resolved — demo').length;

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#172334] flex flex-col font-sans">
      {/* Top Demo Header Bar */}
      <header className="bg-[#142B4A] text-white px-4 py-2.5 border-b border-slate-700 flex flex-wrap items-center justify-between gap-3 shadow-md z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#C83E4D] text-white flex items-center justify-center font-bold text-sm shadow">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-white">NightSafe Loop · Security Operations</span>
              <span className="text-[10px] bg-red-950 text-red-300 px-2 py-0.5 rounded font-mono border border-red-700/60 uppercase">
                Demo Console
              </span>
            </div>
            <div className="text-[11px] text-slate-300">Simulated incident queue & checkpoint audit</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateRole('resident', 'home')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2864A6] hover:bg-[#1E3C66] text-white font-bold text-xs shadow transition"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>← Return to Resident App</span>
          </button>


          <button
            onClick={() => navigateRole('login')}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition"
          >
            Switch Role
          </button>

          <button
            onClick={resetDemoScenario}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition"
            title="Reset demo scenario"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
      {/* Left Sidebar */}
      <aside className="w-64 bg-[#142B4A] text-white flex flex-col justify-between p-4 border-r border-slate-700 shrink-0">
        <div className="space-y-6">
          {/* Console Identity */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#C83E4D] text-white flex items-center justify-center font-bold text-sm shadow">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight">Security Ops</h3>
                <span className="text-[10px] text-sky-300 font-mono">Demo Control Room</span>
              </div>
            </div>
            <div className="pt-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-700/60 uppercase tracking-wider inline-block">
                Simulated Data Only
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-semibold">
            <button
              onClick={() => setSecurityTab('overview')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition ${
                securityTab === 'overview'
                  ? 'bg-[#2864A6] text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Radio className="w-4 h-4" />
                <span>Command Overview</span>
              </div>
              {awaitingAck > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#C83E4D] text-white text-[10px] flex items-center justify-center animate-pulse">
                  {awaitingAck}
                </span>
              )}
            </button>

            <button
              onClick={() => setSecurityTab('alert-detail')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition ${
                securityTab === 'alert-detail'
                  ? 'bg-[#2864A6] text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-4 h-4" />
                <span>Alert Investigation</span>
              </div>
            </button>

            <button
              onClick={() => setSecurityTab('checkpoints')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition ${
                securityTab === 'checkpoints'
                  ? 'bg-[#2864A6] text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4" />
                <span>Checkpoint Stream</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">{checkpointEvents.length}</span>
            </button>

            <button
              onClick={() => setSecurityTab('history')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition ${
                securityTab === 'history'
                  ? 'bg-[#2864A6] text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <History className="w-4 h-4" />
                <span>Audit & Log Trail</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Guard Station Disclaimer */}
        <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300 space-y-1">
          <div className="font-semibold text-white flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-amber-400" />
            <span>Human-in-the-Loop</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">
            An alert does not imply physical guard arrival. Security officers manually audit last recorded checkpoints.
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 overflow-y-auto space-y-6">
        {/* Top KPI Cards (Screen S1) */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="text-xs font-semibold text-slate-500">Active Alert Signals</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{totalAlerts}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Discreet Duress & SOS</div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="text-xs font-semibold text-slate-500">Awaiting Acknowledgement</div>
            <div className={`text-2xl font-black mt-1 ${awaitingAck > 0 ? 'text-[#C83E4D]' : 'text-slate-900'}`}>
              {awaitingAck}
            </div>
            <div className="text-[11px] text-amber-600 mt-0.5 font-medium">Immediate Queue Priority</div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="text-xs font-semibold text-slate-500">Response In Progress</div>
            <div className="text-2xl font-black text-[#2864A6] mt-1">{inProgress}</div>
            <div className="text-[11px] text-sky-600 mt-0.5">Officers Assigned</div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="text-xs font-semibold text-slate-500">Resolved (Demo)</div>
            <div className="text-2xl font-black text-[#1F9D8B] mt-1">{resolved}</div>
            <div className="text-[11px] text-emerald-600 mt-0.5">Audited & Closed</div>
          </div>
        </div>

        {/* -------------------------------------------------------------
            SCREEN S1: SECURITY OVERVIEW (MAP + QUEUE)
           ------------------------------------------------------------- */}
        {securityTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 cols: Schematic Map */}
            <div className="lg:col-span-7 space-y-4">
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#C83E4D]" />
                    <span>Township Alert Pins & Checkpoint Topology</span>
                  </h3>
                  <span className="text-[11px] text-slate-500 font-mono">Real-time Node Map</span>
                </div>

                <SchematicTownshipMap
                  theme="day"
                  activeLamps={activeLamps}
                  heldBrightNode={heldBrightNode}
                  hazards={hazards}
                  alerts={alerts}
                  height="340px"
                  showLegend={true}
                />
              </div>
            </div>

            {/* Right 5 cols: Alert Queue */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-[#C83E4D]" />
                    <span>Incoming Alerts Queue</span>
                  </h3>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {alerts.length} Total
                  </span>
                </div>

                {alerts.length === 0 ? (
                  <div className="p-8 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                    <div className="text-xs font-bold text-slate-700">No Active Emergency Alerts</div>
                    <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                      Trigger the Duress PIN in the Resident App (or use the Storyline Pitch Guide) to simulate an incoming alert AL-204.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-[440px] overflow-y-auto">
                    {alerts.map((alert) => (
                      <div
                        key={alert.id}
                        onClick={() => {
                          setSelectedAlertId(alert.id);
                          setSecurityTab('alert-detail');
                        }}
                        className={`p-3 rounded-xl border cursor-pointer transition space-y-2 ${
                          alert.status === 'Awaiting security acknowledgement'
                            ? 'bg-red-50/60 border-red-300 ring-1 ring-red-300 shadow-sm'
                            : alert.status === 'Response in progress'
                            ? 'bg-sky-50/60 border-sky-300'
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${
                              alert.status === 'Awaiting security acknowledgement'
                                ? 'bg-[#C83E4D] animate-ping'
                                : alert.status === 'Response in progress'
                                ? 'bg-sky-600'
                                : 'bg-emerald-500'
                            }`}></span>
                            <span className="font-bold text-xs text-slate-900">{alert.id}</span>
                            <span className="text-[11px] font-semibold text-slate-600">• {alert.type}</span>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            alert.status === 'Awaiting security acknowledgement'
                              ? 'bg-red-100 text-[#C83E4D]'
                              : alert.status === 'Response in progress'
                              ? 'bg-sky-100 text-sky-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {alert.status}
                          </span>
                        </div>

                        <div className="text-xs text-slate-600">
                          <div>Resident: <strong>{alert.resident}</strong></div>
                          <div>Last Location: <strong>{alert.location}</strong></div>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                          <span>Received: {alert.alertReceived}</span>
                          <span className="text-[#2864A6] font-semibold flex items-center gap-0.5">
                            Inspect Details <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            SCREEN S2: ALERT DETAIL (DISCREET DURESS AL-204)
           ------------------------------------------------------------- */}
        {securityTab === 'alert-detail' && (
          <div className="space-y-4">
            {!activeAlert ? (
              <div className="p-8 rounded-xl bg-white border border-slate-200 text-center space-y-3">
                <ShieldAlert className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="font-bold text-sm text-slate-700">No Alert Selected</h4>
                <p className="text-xs text-slate-400">
                  Select an alert from the queue or trigger Duress PIN in Resident App.
                </p>
                <button
                  onClick={() => setSecurityTab('overview')}
                  className="px-4 py-2 rounded-lg bg-[#2864A6] text-white text-xs font-semibold"
                >
                  Return to Overview
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left 7 cols: Detailed Investigation Card */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b pb-3 border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base text-slate-900">{activeAlert.id}: {activeAlert.type}</span>
                          {activeAlert.isDuress && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                              Discreet PIN Signal
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">Security Case Investigation & Action Console</p>
                      </div>

                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        activeAlert.status === 'Awaiting security acknowledgement'
                          ? 'bg-red-100 text-[#C83E4D] border border-red-300 animate-pulse'
                          : activeAlert.status === 'Response in progress'
                          ? 'bg-sky-100 text-sky-800 border border-sky-300'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}>
                        {activeAlert.status}
                      </span>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Resident</span>
                        <div className="font-bold text-slate-900 mt-0.5">{activeAlert.resident}</div>
                        <div className="text-[11px] text-slate-500">ID: {activeAlert.residentId || 'RES-8821'}</div>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Last Available Checkpoint</span>
                        <div className="font-bold text-slate-900 mt-0.5">{activeAlert.lastCheckpoint}</div>
                        <div className="text-[11px] text-slate-500">Node: L-07 (Garden Junction)</div>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Reported Location</span>
                        <div className="font-bold text-slate-900 mt-0.5">{activeAlert.location}</div>
                        <div className="text-[10px] text-amber-700 italic">{activeAlert.locationFreshness}</div>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Lighting Response</span>
                        <div className="font-bold text-amber-600 mt-0.5 flex items-center gap-1">
                          <Lightbulb className="w-3.5 h-3.5" />
                          <span>Simulated Smart Lighting</span>
                        </div>
                        <div className="text-[11px] text-slate-500">{activeAlert.lightingResponse}</div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 flex flex-wrap gap-2">
                      <button
                        onClick={() => acknowledgeAlert(activeAlert.id)}
                        disabled={activeAlert.status !== 'Awaiting security acknowledgement'}
                        className="py-2 px-3.5 rounded-lg bg-[#2864A6] hover:bg-[#1E3C66] text-white text-xs font-bold shadow disabled:opacity-40 transition"
                      >
                        Acknowledge Alert
                      </button>

                      <button
                        onClick={() => markResponseInProgress(activeAlert.id)}
                        disabled={activeAlert.status === 'Resolved — demo' || activeAlert.status === 'Response in progress'}
                        className="py-2 px-3.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow disabled:opacity-40 transition"
                      >
                        Mark Response In Progress
                      </button>

                      <button
                        onClick={() => setShowResolveModal(true)}
                        disabled={activeAlert.status === 'Resolved — demo'}
                        className="py-2 px-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow disabled:opacity-40 transition"
                      >
                        Resolve Demo Alert
                      </button>

                      <button
                        onClick={() => setSecurityTab('overview')}
                        className="py-2 px-3.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-300 transition flex items-center gap-1.5"
                      >
                        <MapPin className="w-3.5 h-3.5 text-[#C83E4D]" />
                        <span>View Map Location</span>
                      </button>
                    </div>

                    {/* Operational Disclaimer Note */}
                    <div className="p-2.5 rounded-lg bg-slate-100 text-[10px] text-slate-500 leading-tight">
                      <strong>Audited Operational Boundary:</strong> The prototype coordinates last recorded sensor checkpoints with the security console. It does not promise guaranteed dispatch arrival times or replace 999 emergency services.
                    </div>
                  </div>

                  {/* Incident Notes Log */}
                  <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-[#2864A6]" />
                      <span>Incident Action Notes & Audit Trail</span>
                    </h4>

                    {activeAlert.notes && activeAlert.notes.length > 0 ? (
                      <div className="space-y-1.5">
                        {activeAlert.notes.map((note, idx) => (
                          <div key={idx} className="p-2 rounded bg-slate-50 border border-slate-200 text-xs text-slate-700">
                            {note}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400 italic">No notes logged yet for this case.</div>
                    )}

                    <form onSubmit={handleAddNote} className="flex gap-2 pt-1">
                      <input
                        type="text"
                        value={newNoteText}
                        onChange={(e) => setNewNoteText(e.target.value)}
                        placeholder="Add responder note (e.g., Patrol guard dispatched to L-07)..."
                        className="flex-1 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#2864A6]"
                      />
                      <button
                        type="submit"
                        className="py-1.5 px-3 rounded-lg bg-slate-800 text-white text-xs font-semibold"
                      >
                        Save Note
                      </button>
                    </form>
                  </div>
                </div>

                {/* Right 5 cols: Mini Map Context */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
                    <h4 className="text-xs font-bold text-slate-900">Incident Geolocation Context</h4>
                    <SchematicTownshipMap
                      theme="day"
                      activeLamps={activeLamps}
                      heldBrightNode={heldBrightNode}
                      hazards={hazards}
                      alerts={alerts}
                      height="260px"
                      showLegend={false}
                    />
                    <div className="text-[11px] text-slate-500">
                      Luminaires surrounding <strong>Near Lamp L-07</strong> maintained at high brightness in simulation to assist visual orientation.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* -------------------------------------------------------------
            SCREEN S3: CHECKPOINT EVENTS STREAM
           ------------------------------------------------------------- */}
        {securityTab === 'checkpoints' && (
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Checkpoint Telemetry & Pings</h3>
                <p className="text-xs text-slate-500">Logged pedestrian passage events across township nodes</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                Audited GPS Simulation
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider bg-slate-50">
                    <th className="py-2.5 px-3">Event ID</th>
                    <th className="py-2.5 px-3">Node</th>
                    <th className="py-2.5 px-3">Location Name</th>
                    <th className="py-2.5 px-3">Resident</th>
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {checkpointEvents.map((ev) => (
                    <tr key={ev.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-2 px-3 font-mono font-bold text-slate-700">{ev.id}</td>
                      <td className="py-2 px-3 font-semibold text-[#2864A6]">{ev.checkpointId}</td>
                      <td className="py-2 px-3 text-slate-800">{ev.checkpointName}</td>
                      <td className="py-2 px-3 text-slate-600">{ev.residentName}</td>
                      <td className="py-2 px-3 text-slate-500 font-mono text-[11px]">{ev.timestamp}</td>
                      <td className="py-2 px-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {ev.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-500">
              Note: Checkpoint telemetry verifies route progression. A missing check-in prompts a resident wellbeing confirmation, but is not automatically treated as evidence of a crime.
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            SCREEN S4: INCIDENT HISTORY & AUDIT LOG
           ------------------------------------------------------------- */}
        {securityTab === 'history' && (
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Incident History & Audit Log</h3>
                <p className="text-xs text-slate-500">Immutable chronological record of simulated emergency requests</p>
              </div>
              <span className="text-[11px] text-slate-400">Total Cases: {alerts.length}</span>
            </div>

            <div className="space-y-3">
              {alerts.length === 0 ? (
                <div className="text-xs text-slate-400 p-6 text-center italic">
                  No incident records logged yet. Trigger Duress PIN or SOS to create entries.
                </div>
              ) : (
                alerts.map((al) => (
                  <div key={al.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <span>{al.id} — {al.type}</span>
                      <span className="text-[10px] font-mono">{al.alertReceived}</span>
                    </div>
                    <div className="text-slate-600">Location: {al.location} · Status: <strong>{al.status}</strong></div>
                    {al.notes && al.notes.length > 0 && (
                      <div className="text-[11px] text-slate-500 pt-1">
                        Notes: {al.notes.join(' | ')}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      {/* Confirmation Modal for Resolving Alert */}
      {showResolveModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 space-y-4 shadow-2xl border border-slate-200 animate-scaleUp">
            <h4 className="font-bold text-sm text-slate-900">Resolve Demo Alert?</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Confirm resolution of simulated case <strong>{activeAlert?.id}</strong>. Nearby held-bright lights will return to normal corridor mode.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowResolveModal(false)}
                className="py-1.5 px-3 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resolveAlert(activeAlert.id);
                  setShowResolveModal(false);
                }}
                className="py-1.5 px-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow"
              >
                Confirm Resolve
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
