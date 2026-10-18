import React, { useState } from 'react';
import { useNightSafe } from '../../context/NightSafeContext';
import { 
  AlertTriangle, 
  MapPin, 
  Camera, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Filter, 
  Plus,
  Info,
  ChevronRight
} from 'lucide-react';

export function HazardReportView() {
  const { 
    hazards, 
    submitHazardReport, 
    residentTab, 
    setResidentTab, 
    showToast 
  } = useNightSafe();

  const [category, setCategory] = useState("Lighting deficiency / faulty streetlight");
  const [location, setLocation] = useState("Junction L-04 (Central Boulevard)");
  const [affectedNode, setAffectedNode] = useState("L-04");
  const [severity, setSeverity] = useState("High");
  const [description, setDescription] = useState("Lamp is not providing consistent illumination along pedestrian walkway.");
  const [photoAttached, setPhotoAttached] = useState(false);
  const [submittedReport, setSubmittedReport] = useState(null);

  const locations = [
    { label: "Junction L-04 (Central Boulevard)", node: "L-04" },
    { label: "Garden Shortcut Path (Lamp L-06)", node: "L-06" },
    { label: "Central Transit Stop Approach (Lamp L-08)", node: "L-08" },
    { label: "North Avenue Pedestrian Walkway (Lamp L-03)", node: "L-03" },
    { label: "Community Residence Entrance (Lamp L-01)", node: "L-01" }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim()) {
      showToast('Please provide a brief description of the issue.', 'error');
      return;
    }

    const created = submitHazardReport({
      category,
      location,
      affectedNode,
      severity,
      description
    });

    setSubmittedReport(created);
  };

  // Local state for R10 tab & filter
  const [historyTab, setHistoryTab] = useState('reports'); // 'reports' | 'journeys'
  const [reportStatusFilter, setReportStatusFilter] = useState('all');
  const [selectedReportId, setSelectedReportId] = useState(null);

  // -------------------------------------------------------------
  // SCREEN R10: MY REPORTS & HISTORY
  // -------------------------------------------------------------
  if (residentTab === 'my-reports') {
    const filteredReports = hazards.filter(h => {
      if (reportStatusFilter === 'all') return true;
      return h.status.toLowerCase() === reportStatusFilter.toLowerCase();
    });

    const mockJourneyHistory = [
      {
        id: "JH-101",
        date: "Today",
        route: "Route A — Main Avenue",
        startTime: "8:35 PM",
        endTime: "8:44 PM",
        duration: "9 min",
        checkpointsRecorded: "L-01 → L-02 → L-03 → L-04 → L-08",
        status: "Completed Safely"
      },
      {
        id: "JH-102",
        date: "Yesterday",
        route: "Route B — Garden Shortcut",
        startTime: "9:10 PM",
        endTime: "9:18 PM",
        duration: "8 min",
        checkpointsRecorded: "L-01 → L-05 → L-06 → L-07 → L-08",
        status: "Completed (Check-in logged)"
      }
    ];

    return (
      <div className="space-y-4 pb-20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">My Reports & History</h2>
            <p className="text-xs text-slate-500">Tracked observations and pedestrian walks</p>
          </div>
          <button
            onClick={() => setResidentTab('report')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#2864A6] text-white text-xs font-semibold shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Report</span>
          </button>
        </div>

        {/* Tab switch between Reports and Journey History */}
        <div className="flex rounded-lg bg-slate-100 p-1 text-xs font-semibold border border-slate-200">
          <button
            onClick={() => setHistoryTab('reports')}
            className={`flex-1 py-1.5 rounded-md transition ${historyTab === 'reports' ? 'bg-white text-[#2864A6] shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Hazard Reports ({hazards.length})
          </button>
          <button
            onClick={() => setHistoryTab('journeys')}
            className={`flex-1 py-1.5 rounded-md transition ${historyTab === 'journeys' ? 'bg-white text-[#2864A6] shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Journey History (2)
          </button>
        </div>

        {/* Reports Tab */}
        {historyTab === 'reports' && (
          <div className="space-y-3">
            {/* Status Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] pb-1">
              {['all', 'Reported', 'Under verification', 'Verified', 'In progress', 'Resolved'].map((st) => (
                <button
                  key={st}
                  onClick={() => setReportStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-full whitespace-nowrap transition capitalize font-semibold ${
                    reportStatusFilter === st
                      ? 'bg-[#2864A6] text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="space-y-2.5">
              {filteredReports.map((h) => {
                const isSelected = selectedReportId === h.id;
                return (
                  <div
                    key={h.id}
                    onClick={() => setSelectedReportId(isSelected ? null : h.id)}
                    className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2 cursor-pointer hover:border-[#2864A6] transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-900">{h.id}: {h.title}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        h.status === 'Verified' || h.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : h.status === 'In progress'
                          ? 'bg-sky-100 text-[#2864A6]'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {h.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-snug">{h.description}</p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {h.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {h.timestamp}
                      </span>
                    </div>

                    {/* Expandable Report Detail Drawer */}
                    {isSelected && (
                      <div className="mt-2.5 pt-2.5 border-t border-slate-200 bg-slate-50/80 -mx-3.5 -mb-3.5 p-3 rounded-b-xl text-xs space-y-1.5 animate-fadeIn">
                        <div className="text-[10px] font-bold uppercase text-slate-400">Audit & Management Verification:</div>
                        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                          <div>Source: <strong>{h.source}</strong></div>
                          <div>Confidence: <strong>{h.evidenceConfidence}</strong></div>
                          <div>Severity: <strong>{h.severity}</strong></div>
                          <div>Assigned Action: <strong>{h.pairedInterventionId ? `Package ${h.pairedInterventionId}` : 'Under Review'}</strong></div>
                        </div>
                        <div className="text-[10px] text-slate-400 italic pt-1">
                          Updates sync dynamically with Property Management decisions.
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Journey History Tab */}
        {historyTab === 'journeys' && (
          <div className="space-y-2.5">
            {mockJourneyHistory.map((jh) => (
              <div key={jh.id} className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>{jh.route}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {jh.status}
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  Time: {jh.date} · {jh.startTime} to {jh.endTime} ({jh.duration})
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-200 text-[11px] text-slate-600 font-mono">
                  Checkpoints: {jh.checkpointsRecorded}
                </div>
                <div className="text-[10px] text-slate-400">
                  Telemetry archived under strict journey-only privacy policy.
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // SCREEN R9: HAZARD REPORT FORM
  // -------------------------------------------------------------
  return (
    <div className="space-y-4 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">Report an Environmental Hazard</h2>
          <p className="text-xs text-slate-500">Report lighting, pathway, or sightline defects</p>
        </div>
        <button
          onClick={() => setResidentTab('my-reports')}
          className="text-xs font-semibold text-[#2864A6] hover:underline"
        >
          My Reports ({hazards.length})
        </button>
      </div>

      {submittedReport ? (
        <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-300 text-center space-y-3 shadow-sm animate-fadeIn">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-emerald-950">Report Submitted Successfully</h3>
          <div className="text-xs text-emerald-900 space-y-1">
            <p>Report ID: <strong className="font-mono">{submittedReport.id}</strong></p>
            <p>Status: <strong>Reported — Awaiting Property Verification</strong></p>
            <p className="text-[11px] text-emerald-800">
              This report is now visible in the Property Management Intelligence console queue.
            </p>
          </div>

          <div className="pt-2 flex gap-2">
            <button
              onClick={() => setSubmittedReport(null)}
              className="flex-1 py-2 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold"
            >
              Submit Another Report
            </button>
            <button
              onClick={() => setResidentTab('my-reports')}
              className="py-2 px-3 rounded-lg bg-white border border-emerald-300 text-emerald-900 text-xs font-semibold"
            >
              View Feed
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
          {/* Category */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-500 uppercase">Hazard Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium focus:outline-none"
            >
              <option value="Lighting deficiency / faulty streetlight">Lighting deficiency / faulty streetlight</option>
              <option value="Obstructed sightline">Obstructed sightline (vegetation/structures)</option>
              <option value="Damaged / discontinuous pedestrian path">Damaged / discontinuous pedestrian path</option>
              <option value="Other environmental concern">Other environmental concern</option>
            </select>
          </div>

          {/* Location Node */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-500 uppercase">Location / Schematic Node</label>
            <select
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                const match = locations.find(l => l.label === e.target.value);
                if (match) setAffectedNode(match.node);
              }}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium focus:outline-none"
            >
              {locations.map(loc => (
                <option key={loc.label} value={loc.label}>{loc.label}</option>
              ))}
            </select>
          </div>

          {/* Severity */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-500 uppercase">Perceived Severity</label>
            <div className="grid grid-cols-3 gap-2">
              {['Low', 'Medium', 'High'].map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setSeverity(s)}
                  className={`py-1.5 rounded-lg text-xs font-semibold border transition ${
                    severity === s
                      ? s === 'High'
                        ? 'bg-red-50 border-red-500 text-red-700'
                        : s === 'Medium'
                        ? 'bg-amber-50 border-amber-500 text-amber-700'
                        : 'bg-emerald-50 border-emerald-500 text-emerald-700'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-500 uppercase">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#2864A6]"
              placeholder="Describe condition, lighting deficit, or pavement irregularity..."
            />
          </div>

          {/* Photo attachment placeholder */}
          <div 
            onClick={() => {
              setPhotoAttached(!photoAttached);
              showToast(photoAttached ? 'Demo photo removed' : 'Simulated demo photo attached (inspection audit tag)', 'info');
            }}
            className="p-3 rounded-lg border border-dashed border-slate-300 hover:border-slate-400 bg-slate-50 cursor-pointer text-center text-xs text-slate-600 flex items-center justify-center gap-2 transition"
          >
            <Camera className="w-4 h-4 text-slate-400" />
            <span>{photoAttached ? '✓ Photo Attached: img_junction_l04.jpg' : 'Attach Demo Photo (Optional)'}</span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-[#2864A6] hover:bg-[#1E3C66] text-white text-xs font-semibold shadow transition"
          >
            Submit Hazard Report
          </button>

          <div className="p-2.5 rounded-lg bg-slate-100 text-[10px] text-slate-500 leading-snug">
            Privacy notice: Reports do not collect your identity, phone number, or home address. Demo data is simulated.
          </div>
        </form>
      )}
    </div>
  );
}
