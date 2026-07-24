import React, { useState } from "react";
import {
  Sparkles,
  UploadCloud,
  Mic,
  MicOff,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Filter,
  Eye,
  ChevronRight,
  TrendingUp,
  Layers,
  Search,
} from "lucide-react";
import { ComplaintForm } from "../components/civic-eye/ComplaintForm";
import { IssueList } from "../components/civic-eye/IssueList";

interface TimelineItem {
  status: "Reported" | "AI Validated" | "Dispatched" | "Resolved";
  date: string;
  desc: string;
  completed: boolean;
}

interface IssueDetail {
  id: string;
  title: string;
  category: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "pending" | "in_progress" | "resolved";
  address: string;
  timeAgo: string;
  confidence: number;
  department: string;
  timeline: TimelineItem[];
  imageUrl?: string;
}

const mockIssues: IssueDetail[] = [
  {
    id: "CE-9041",
    title: "Deep Pothole on Elm Street",
    category: "Potholes & Road Damage",
    severity: "high",
    status: "in_progress",
    address: "12 Elm St, Greenwood Heights",
    timeAgo: "25 minutes ago",
    confidence: 96.8,
    department: "Public Works & Infrastructure",
    timeline: [
      { status: "Reported", date: "10:15 AM", desc: "Citizen uploaded photo via CivicEye AI", completed: true },
      { status: "AI Validated", date: "10:15 AM", desc: "YOLO v8 detected Asphalt Pothole (Depth ~8cm)", completed: true },
      { status: "Dispatched", date: "10:30 AM", desc: "Assigned to Maintenance Crew #4", completed: true },
      { status: "Resolved", date: "Estimated 4:00 PM", desc: "Patching in progress", completed: false },
    ],
  },
  {
    id: "CE-8920",
    title: "Burst Water Pipe near 5th Ave",
    category: "Water Leakage & Drainage",
    severity: "critical",
    status: "in_progress",
    address: "5th Ave & Park Rd Junction",
    timeAgo: "1 hour ago",
    confidence: 99.1,
    department: "Water & Sanitation Dept",
    timeline: [
      { status: "Reported", date: "09:30 AM", desc: "Reported by Alex Johnson", completed: true },
      { status: "AI Validated", date: "09:31 AM", desc: "AI flagged High Priority Water Main Leak", completed: true },
      { status: "Dispatched", date: "09:45 AM", desc: "Emergency Utility Valve Shutoff Team deployed", completed: true },
      { status: "Resolved", date: "Estimated 2:00 PM", desc: "Pipe replacement underway", completed: false },
    ],
  },
  {
    id: "CE-7712",
    title: "Broken Streetlight Lamp #42",
    category: "Streetlight & Electrical",
    severity: "low",
    status: "resolved",
    address: "88 Maple Ave",
    timeAgo: " Yesterday",
    confidence: 94.2,
    department: "Municipal Power & Lighting",
    timeline: [
      { status: "Reported", date: "Jul 23, 2:00 PM", desc: "Reported with voice complaint", completed: true },
      { status: "AI Validated", date: "Jul 23, 2:00 PM", desc: "Bulb burnout verified", completed: true },
      { status: "Dispatched", date: "Jul 23, 4:00 PM", desc: "Technician assigned", completed: true },
      { status: "Resolved", date: "Jul 23, 6:30 PM", desc: "LED fixture replaced", completed: true },
    ],
  },
];

function CivicEye() {
  const [activeView, setActiveView] = useState<"report" | "board" | "map" | "insights">("report");
  const [selectedIssue, setSelectedIssue] = useState<IssueDetail | null>(mockIssues[0]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [voiceText, setVoiceText] = useState("");

  const handleToggleRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
      setVoiceText("Listening... Say your issue description clearly.");
      setTimeout(() => {
        setVoiceText("Large crack and leaking fire hydrant near Oak Street park entrance.");
        setIsRecording(false);
      }, 3500);
    } else {
      setIsRecording(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] p-6 max-w-7xl mx-auto space-y-8">
      {/* ── Hero Banner ─────────────────────────────────────────────────── */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#004ac6] via-[#2563eb] to-[#3e3fcc] text-white p-8 md:p-10 shadow-xl overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold text-white">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>YOLO v8 Object Detection &amp; Computer Vision Active</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              CivicEye AI Issue Reporter
            </h1>
            <p className="text-sm sm:text-base text-white/85 leading-relaxed">
              Snap or upload photos of neighborhood issues. Our AI instantly classifies defect type, measures urgency score, and dispatches repairs to local authorities.
            </p>
          </div>

          {/* Action Tabs */}
          <div className="shrink-0 flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveView("report")}
              className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
                activeView === "report"
                  ? "bg-white text-[#004ac6] shadow-lg scale-105"
                  : "bg-white/15 hover:bg-white/25 text-white"
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              Report Issue
            </button>
            <button
              onClick={() => setActiveView("board")}
              className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
                activeView === "board"
                  ? "bg-white text-[#004ac6] shadow-lg scale-105"
                  : "bg-white/15 hover:bg-white/25 text-white"
              }`}
            >
              <Layers className="w-4 h-4" />
              Issue Board
            </button>
            <button
              onClick={() => setActiveView("map")}
              className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
                activeView === "map"
                  ? "bg-white text-[#004ac6] shadow-lg scale-105"
                  : "bg-white/15 hover:bg-white/25 text-white"
              }`}
            >
              <MapPin className="w-4 h-4" />
              Live Map
            </button>
            <button
              onClick={() => setActiveView("insights")}
              className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
                activeView === "insights"
                  ? "bg-white text-[#004ac6] shadow-lg scale-105"
                  : "bg-white/15 hover:bg-white/25 text-white"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              AI Insights
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-8 pt-6 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/15">
            <p className="text-[11px] font-medium text-white/75 uppercase tracking-wider">AI Accuracy</p>
            <p className="text-xl font-black text-white mt-0.5">96.8%</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/15">
            <p className="text-[11px] font-medium text-white/75 uppercase tracking-wider">Avg Detection</p>
            <p className="text-xl font-black text-emerald-300 mt-0.5">&lt; 0.8s</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/15">
            <p className="text-[11px] font-medium text-white/75 uppercase tracking-wider">Resolution Rate</p>
            <p className="text-xl font-black text-amber-300 mt-0.5">92.4%</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/15">
            <p className="text-[11px] font-medium text-white/75 uppercase tracking-wider">Defect Classes</p>
            <p className="text-xl font-black text-white mt-0.5">8 Classes</p>
          </div>
        </div>
      </div>

      {/* ── Main View Content ───────────────────────────────────────────── */}
      {activeView === "report" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-8 space-y-6">
            <ComplaintForm
              onSuccess={() => {
                setRefreshTrigger((prev) => prev + 1);
                setActiveView("board");
              }}
            />
          </div>

          {/* Voice & Assistant Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Voice Dictation Card */}
            <div className="bg-white p-6 rounded-2xl border border-[#c3c6d7]/50 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                  <Mic className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0b1c30]">Voice Reporter</h3>
                  <p className="text-xs text-[#434655]">Hands-free AI speech-to-text</p>
                </div>
              </div>

              <p className="text-xs text-[#434655] leading-relaxed">
                Click the microphone to describe the defect verbally. Our NLP engine auto-populates category &amp; severity.
              </p>

              <button
                onClick={handleToggleRecord}
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  isRecording
                    ? "bg-red-500 text-white animate-pulse"
                    : "bg-[#004ac6] text-white hover:bg-[#2563eb]"
                }`}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                {isRecording ? "Listening... (Click to stop)" : "Start Voice Complaint"}
              </button>

              {voiceText && (
                <div className="p-3 bg-[#e5eeff] rounded-xl border border-[#004ac6]/20">
                  <p className="text-[11px] font-bold text-[#004ac6] uppercase mb-1">Transcribed Text:</p>
                  <p className="text-xs text-[#0b1c30] italic font-medium">"{voiceText}"</p>
                </div>
              )}
            </div>

            {/* AI Auto Routing Info */}
            <div className="bg-white p-6 rounded-2xl border border-[#c3c6d7]/50 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-[#004ac6] font-bold text-sm">
                <ShieldCheck className="w-4 h-4" />
                Auto-Routing Protocol
              </div>
              <ul className="text-xs text-[#434655] space-y-2 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#004ac6] mt-1.5 shrink-0" />
                  Roads &amp; Potholes → Public Works Division
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#004ac6] mt-1.5 shrink-0" />
                  Water Pipe Leaks → Sanitation Emergency Unit
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#004ac6] mt-1.5 shrink-0" />
                  Power &amp; Lights → Municipal Energy Bureau
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeView === "board" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <IssueList refreshTrigger={refreshTrigger} />
          </div>

          {/* Timeline & Details Drawer */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-[#c3c6d7]/50 shadow-sm space-y-6 sticky top-20">
              <div className="flex justify-between items-center border-b border-[#c3c6d7]/40 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#004ac6] bg-[#004ac6]/10 px-2.5 py-0.5 rounded-full">
                    {selectedIssue?.id}
                  </span>
                  <h3 className="text-lg font-bold text-[#0b1c30] mt-1">{selectedIssue?.title}</h3>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
                  {selectedIssue?.status === "in_progress" ? "In Progress" : "Resolved"}
                </span>
              </div>

              {/* Department & Confidence */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-[#f8f9ff] rounded-xl border border-[#c3c6d7]/30">
                  <p className="text-[#434655] font-medium">Routed Department</p>
                  <p className="font-bold text-[#0b1c30] mt-0.5">{selectedIssue?.department}</p>
                </div>
                <div className="p-3 bg-[#f8f9ff] rounded-xl border border-[#c3c6d7]/30">
                  <p className="text-[#434655] font-medium">AI Confidence</p>
                  <p className="font-bold text-emerald-600 mt-0.5">{selectedIssue?.confidence}%</p>
                </div>
              </div>

              {/* Complaint Tracking Timeline */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#434655] flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#004ac6]" />
                  Resolution Timeline
                </h4>
                <div className="space-y-4 pl-2 border-l-2 border-[#004ac6]/20">
                  {selectedIssue?.timeline.map((step, idx) => (
                    <div key={idx} className="relative pl-5">
                      <span
                        className={`absolute -left-[9px] top-0.5 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center text-[10px] ${
                          step.completed ? "bg-[#004ac6] text-white" : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        ✓
                      </span>
                      <p className="text-xs font-bold text-[#0b1c30]">{step.status}</p>
                      <p className="text-[11px] text-[#434655]">{step.desc}</p>
                      <p className="text-[10px] text-[#434655]/60 mt-0.5">{step.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeView === "map" && (
        <div className="bg-white rounded-2xl border border-[#c3c6d7]/50 shadow-sm p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-[#0b1c30]">Community Issue Heatmap &amp; Map</h3>
              <p className="text-xs text-[#434655]">Real-time geotagged civic reports across Greenwood Heights</p>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">3 Critical</span>
              <span className="px-3 py-1 bg-[#004ac6]/10 text-[#004ac6] rounded-full text-xs font-bold">12 In Progress</span>
            </div>
          </div>

          <div className="h-[420px] rounded-2xl bg-[#e5eeff] relative overflow-hidden flex items-center justify-center border border-[#c3c6d7]/30">
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage: "linear-gradient(#c3c6d7 1px, transparent 1px), linear-gradient(90deg, #c3c6d7 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
            {/* Interactive Pins */}
            {mockIssues.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => setSelectedIssue(item)}
                className={`absolute cursor-pointer transition-transform hover:scale-125 ${
                  idx === 0 ? "top-20 left-1/3" : idx === 1 ? "top-40 right-1/4" : "bottom-24 left-1/2"
                }`}
              >
                <div className="p-2 rounded-full bg-white shadow-lg border-2 border-[#004ac6] flex items-center gap-1.5 px-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  <span className="text-xs font-bold text-[#0b1c30]">{item.title}</span>
                </div>
              </div>
            ))}
            <p className="text-xs text-[#004ac6] font-semibold bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              📍 Click pins to view resolution timeline
            </p>
          </div>
        </div>
      )}

      {activeView === "insights" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#c3c6d7]/50 shadow-sm space-y-3">
            <div className="p-3 rounded-xl bg-blue-50 text-[#004ac6] w-fit">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-[#0b1c30]">Top Issue Category</h4>
            <p className="text-2xl font-extrabold text-[#004ac6]">Roads &amp; Potholes</p>
            <p className="text-xs text-[#434655]">Accounting for 42% of total reports this month.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#c3c6d7]/50 shadow-sm space-y-3">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 w-fit">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-[#0b1c30]">Avg Fix Turnaround</h4>
            <p className="text-2xl font-extrabold text-emerald-600">18.4 Hours</p>
            <p className="text-xs text-[#434655]">15% faster than last quarter's baseline.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#c3c6d7]/50 shadow-sm space-y-3">
            <div className="p-3 rounded-xl bg-purple-50 text-purple-600 w-fit">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-[#0b1c30]">AI False Positive Rate</h4>
            <p className="text-2xl font-extrabold text-purple-600">&lt; 1.2%</p>
            <p className="text-xs text-[#434655]">Verified across 450+ validated image uploads.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default CivicEye;
