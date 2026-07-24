import React, { useState } from "react";
import {
  ShieldAlert,
  Users,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  FileText,
  Filter,
  MoreVertical,
  Download,
  Eye,
  Check,
  X,
  Radio,
  Sparkles,
  BarChart3,
} from "lucide-react";

interface AdminComplaint {
  id: string;
  title: string;
  category: string;
  reporter: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "Pending" | "In Progress" | "Resolved";
  date: string;
  department: string;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "Resident" | "HOA Board" | "Moderator" | "Admin";
  reputation: number;
  status: "Active" | "Flagged" | "Suspended";
  joinedDate: string;
}

interface ModerationPost {
  id: string;
  author: string;
  reason: string;
  confidence: number;
  contentSnippet: string;
  date: string;
}

const mockComplaints: AdminComplaint[] = [
  { id: "CE-9041", title: "Deep Pothole on Elm Street", category: "Road Damage", reporter: "Alex Johnson", severity: "high", status: "In Progress", date: "Jul 24, 10:15 AM", department: "Public Works" },
  { id: "CE-8920", title: "Burst Water Pipe near 5th Ave", category: "Water Leakage", reporter: "Marcus Vance", severity: "critical", status: "In Progress", date: "Jul 24, 09:30 AM", department: "Sanitation Dept" },
  { id: "CE-8102", title: "Overflowing Dumpster in Alley", category: "Waste Management", reporter: "Elena R.", severity: "medium", status: "Pending", date: "Jul 23, 04:20 PM", department: "Waste Services" },
  { id: "CE-7712", title: "Broken Streetlight Lamp #42", category: "Electrical", reporter: "Sarah Jenkins", severity: "low", status: "Resolved", date: "Jul 23, 02:00 PM", department: "Energy Bureau" },
];

const mockUsers: AdminUser[] = [
  { id: "U-1", name: "Alex Johnson", email: "alex.johnson@example.com", role: "Resident", reputation: 94, status: "Active", joinedDate: "Jan 2025" },
  { id: "U-2", name: "Sarah Jenkins", email: "sarah.j@example.com", role: "Moderator", reputation: 98, status: "Active", joinedDate: "Mar 2024" },
  { id: "U-3", name: "Marcus Vance", email: "marcus.vance@example.com", role: "Resident", reputation: 88, status: "Active", joinedDate: "Jun 2025" },
  { id: "U-4", name: "Anonymous Spammer", email: "spammer99@temp.net", role: "Resident", reputation: 12, status: "Flagged", joinedDate: "Jul 2026" },
];

const mockFlaggedPosts: ModerationPost[] = [
  { id: "MOD-1", author: "Anonymous Spammer", reason: "Potential Unsolicited Commercial Spam", confidence: 97.4, contentSnippet: "Earn $5000/day working from home! Click this link now...", date: "Jul 24, 11:00 AM" },
  { id: "MOD-2", author: "User #9012", reason: "Hate Speech / Inappropriate Content", confidence: 91.2, contentSnippet: "Aggressive argument post targeting specific neighbor...", date: "Jul 23, 08:15 PM" },
];

function Admin() {
  const [activeTab, setActiveTab] = useState<"analytics" | "complaints" | "users" | "moderation">("analytics");
  const [complaints, setComplaints] = useState<AdminComplaint[]>(mockComplaints);
  const [users, setUsers] = useState<AdminUser[]>(mockUsers);
  const [flaggedPosts, setFlaggedPosts] = useState<ModerationPost[]>(mockFlaggedPosts);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const handleStatusChange = (id: string, newStatus: AdminComplaint["status"]) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
  };

  const handleUserStatusChange = (id: string, newStatus: AdminUser["status"]) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u))
    );
  };

  const handleDismissMod = (id: string) => {
    setFlaggedPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const filteredComplaints = complaints.filter(
    (c) => statusFilter === "All" || c.status === statusFilter
  );

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] p-6 max-w-7xl mx-auto space-y-8">
      {/* ── Header & Action ─────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#004ac6]/10 text-[#004ac6] text-xs font-bold rounded-full mb-2">
            <ShieldAlert className="w-4 h-4" />
            Administrative Command &amp; Moderation Suite
          </div>
          <h1 className="text-3xl font-extrabold text-[#0b1c30] tracking-tight">Admin &amp; Community Governance</h1>
          <p className="text-sm text-[#434655] mt-1">
            Monitor community analytics, manage civic complaints, moderate flagged posts, and oversee user reputation.
          </p>
        </div>

        <button
          onClick={() => alert("Exporting community compliance report to CSV...")}
          className="bg-[#004ac6] hover:bg-[#2563eb] text-white px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95 shrink-0"
        >
          <Download className="w-4 h-4" />
          Export System Report
        </button>
      </div>

      {/* ── Tab Switcher ────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-[#c3c6d7]/40 pb-2 overflow-x-auto custom-scrollbar">
        {[
          { id: "analytics", label: "Analytics & Heatmap", icon: BarChart3 },
          { id: "complaints", label: "Complaint Management", icon: FileText },
          { id: "users", label: "User Management", icon: Users },
          { id: "moderation", label: "Content Moderation Queue", icon: Sparkles },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-[#004ac6] text-white shadow-sm"
                  : "bg-white text-[#434655] hover:bg-[#d3e4fe]/50 border border-[#c3c6d7]/30"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Tab 1: Analytics & Heatmap ──────────────────────────────────── */}
      {activeTab === "analytics" && (
        <div className="space-y-8">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-[#c3c6d7]/50 shadow-sm space-y-2">
              <p className="text-xs font-semibold text-[#434655]">Total Reports (This Month)</p>
              <p className="text-3xl font-extrabold text-[#004ac6]">428</p>
              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +12.4% vs last month
              </span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#c3c6d7]/50 shadow-sm space-y-2">
              <p className="text-xs font-semibold text-[#434655]">Resolution Rate</p>
              <p className="text-3xl font-extrabold text-emerald-600">94.2%</p>
              <span className="text-[11px] font-semibold text-[#434655]">Avg turn-around 18.4 hrs</span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#c3c6d7]/50 shadow-sm space-y-2">
              <p className="text-xs font-semibold text-[#434655]">Active SOS Alerts</p>
              <p className="text-3xl font-extrabold text-red-600">0</p>
              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> All units clear
              </span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#c3c6d7]/50 shadow-sm space-y-2">
              <p className="text-xs font-semibold text-[#434655]">Verified Residents</p>
              <p className="text-3xl font-extrabold text-[#3e3fcc]">1,280</p>
              <span className="text-[11px] font-semibold text-[#434655]">Greenwood Heights HOA</span>
            </div>
          </div>

          {/* Community Heatmap Preview */}
          <div className="bg-white p-6 rounded-3xl border border-[#c3c6d7]/50 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-[#c3c6d7]/30 pb-3">
              <div>
                <h3 className="text-lg font-bold text-[#0b1c30]">Community Defect Heatmap Density</h3>
                <p className="text-xs text-[#434655]">High density complaint clusters across city zones</p>
              </div>
              <span className="text-xs font-bold text-[#004ac6] bg-[#004ac6]/10 px-3 py-1 rounded-full">
                Live Geotag Grid
              </span>
            </div>

            <div className="h-80 bg-[#e5eeff] rounded-2xl relative overflow-hidden flex items-center justify-center border border-[#c3c6d7]/30">
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: "linear-gradient(#c3c6d7 1px, transparent 1px), linear-gradient(90deg, #c3c6d7 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />
              <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-red-500/30 rounded-full blur-xl animate-pulse" />
              <div className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-amber-500/30 rounded-full blur-2xl" />
              <div className="text-center relative z-10 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-[#c3c6d7]/30">
                <p className="text-xs font-bold text-[#0b1c30]">Zone 4 (Elm St &amp; 5th Ave) Hotspot</p>
                <p className="text-[11px] text-[#434655] mt-0.5">Primary Defect: Potholes &amp; Drainage</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab 2: Complaint Management ─────────────────────────────────── */}
      {activeTab === "complaints" && (
        <div className="bg-white p-6 rounded-3xl border border-[#c3c6d7]/50 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#c3c6d7]/30 pb-4">
            <h3 className="text-lg font-bold text-[#0b1c30]">Civic Complaints Directory</h3>

            {/* Filter pills */}
            <div className="flex items-center gap-1.5 p-1 bg-[#e5eeff] rounded-xl text-xs font-bold">
              {["All", "Pending", "In Progress", "Resolved"].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3.5 py-1.5 rounded-lg transition-all ${
                    statusFilter === st ? "bg-[#004ac6] text-white shadow-sm" : "text-[#434655]"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8f9ff] text-[#434655] uppercase text-[10px] font-bold border-b border-[#c3c6d7]/30">
                <tr>
                  <th className="p-3">ID &amp; Title</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Reporter</th>
                  <th className="p-3">Severity</th>
                  <th className="p-3">Assigned Dept</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c3c6d7]/20 font-medium">
                {filteredComplaints.map((c) => (
                  <tr key={c.id} className="hover:bg-[#f8f9ff] transition-colors">
                    <td className="p-3 font-bold text-[#0b1c30]">
                      <div>{c.title}</div>
                      <span className="text-[10px] text-[#004ac6]">{c.id}</span>
                    </td>
                    <td className="p-3 text-[#434655]">{c.category}</td>
                    <td className="p-3 text-[#0b1c30]">{c.reporter}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          c.severity === "critical"
                            ? "bg-red-100 text-red-700"
                            : c.severity === "high"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {c.severity}
                      </span>
                    </td>
                    <td className="p-3 text-[#434655]">{c.department}</td>
                    <td className="p-3">
                      <select
                        value={c.status}
                        onChange={(e: any) => handleStatusChange(c.id, e.target.value)}
                        className="p-1.5 bg-[#e5eeff] border border-[#c3c6d7] rounded-lg text-xs font-bold text-[#0b1c30]"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => alert(`Re-assigning department for ${c.id}`)}
                        className="px-3 py-1 bg-[#004ac6] text-white rounded-lg text-[11px] font-bold hover:bg-[#2563eb]"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Tab 3: User Management ──────────────────────────────────────── */}
      {activeTab === "users" && (
        <div className="bg-white p-6 rounded-3xl border border-[#c3c6d7]/50 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-[#0b1c30] border-b border-[#c3c6d7]/30 pb-3">
            Registered Community Members
          </h3>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8f9ff] text-[#434655] uppercase text-[10px] font-bold border-b border-[#c3c6d7]/30">
                <tr>
                  <th className="p-3">User Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Community Role</th>
                  <th className="p-3">Reputation</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Governance Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c3c6d7]/20 font-medium">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-[#f8f9ff] transition-colors">
                    <td className="p-3 font-bold text-[#0b1c30]">{u.name}</td>
                    <td className="p-3 text-[#434655]">{u.email}</td>
                    <td className="p-3 font-bold text-[#004ac6]">{u.role}</td>
                    <td className="p-3 font-bold text-emerald-600">{u.reputation} / 100</td>
                    <td className="p-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          u.status === "Active"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      {u.status === "Active" ? (
                        <button
                          onClick={() => handleUserStatusChange(u.id, "Flagged")}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-[11px] font-bold hover:bg-red-200"
                        >
                          Flag Account
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUserStatusChange(u.id, "Active")}
                          className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-[11px] font-bold hover:bg-emerald-200"
                        >
                          Restore Access
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Tab 4: Content Moderation ──────────────────────────────────── */}
      {activeTab === "moderation" && (
        <div className="bg-white p-6 rounded-3xl border border-[#c3c6d7]/50 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-[#c3c6d7]/30 pb-3">
            <div>
              <h3 className="text-lg font-bold text-[#0b1c30]">AI Automated Moderation Queue</h3>
              <p className="text-xs text-[#434655]">Posts flagged by NLP classifier for community review</p>
            </div>
            <span className="text-xs font-bold text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
              {flaggedPosts.length} Items Flagged
            </span>
          </div>

          <div className="space-y-4">
            {flaggedPosts.length === 0 ? (
              <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800 font-semibold text-xs">
                ✓ Moderation queue clean! No pending flagged posts.
              </div>
            ) : (
              flaggedPosts.map((post) => (
                <div key={post.id} className="p-5 bg-[#f8f9ff] rounded-2xl border border-[#c3c6d7]/30 space-y-3 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full uppercase">
                        {post.reason}
                      </span>
                      <p className="font-bold text-[#0b1c30] text-sm mt-1">Author: {post.author}</p>
                    </div>
                    <span className="text-xs font-bold text-purple-700">
                      AI Confidence: {post.confidence}%
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-[#c3c6d7]/20 italic text-[#434655]">
                    "{post.contentSnippet}"
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <button
                      onClick={() => handleDismissMod(post.id)}
                      className="px-4 py-1.5 bg-emerald-600 text-white rounded-xl font-bold flex items-center gap-1 hover:bg-emerald-700"
                    >
                      <Check className="w-3.5 h-3.5" /> Keep Post
                    </button>
                    <button
                      onClick={() => handleDismissMod(post.id)}
                      className="px-4 py-1.5 bg-red-600 text-white rounded-xl font-bold flex items-center gap-1 hover:bg-red-700"
                    >
                      <X className="w-3.5 h-3.5" /> Remove Post
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
