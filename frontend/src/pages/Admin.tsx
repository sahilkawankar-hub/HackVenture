import { useState, useEffect } from "react";
import {
  ShieldAlert, CheckCircle2, FileText,
  Download, Shield, MapPin
} from "lucide-react";
import { useToast } from "../components/common/Toast";
import { getAdminStats, AdminStats } from "../api/admin";

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
  { id: "U-4", name: "Spammer Account", email: "spammer99@temp.net", role: "Resident", reputation: 12, status: "Flagged", joinedDate: "Jul 2026" },
];

function Admin() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"analytics" | "complaints" | "users" | "heatmap">("analytics");
  const [complaints, setComplaints] = useState<AdminComplaint[]>(mockComplaints);
  const [users, setUsers] = useState<AdminUser[]>(mockUsers);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [stats, setStats] = useState<AdminStats>({
    today_reports: 12,
    open_reports: 28,
    resolved_reports: 142,
    critical_issues: 3,
    monthly_reports: 184,
    resolution_rate: 92.4,
    avg_resolution_hours: 18.4,
    active_users: 2341,
  });

  useEffect(() => {
    getAdminStats().then(setStats).catch(() => {});
  }, []);

  const handleStatusChange = (id: string, newStatus: AdminComplaint["status"]) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
    toast(`Complaint ${id} status updated to ${newStatus}`, "success");
  };

  const handleUserStatusChange = (id: string, newStatus: AdminUser["status"]) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u))
    );
    toast(`User status updated to ${newStatus}`, "info");
  };

  const filteredComplaints = complaints.filter(
    (c) => statusFilter === "All" || c.status === statusFilter
  );

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base)" }}>
      <div className="p-7 max-w-7xl mx-auto space-y-6">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge badge-[#2563eb]">
                <Shield className="w-3.5 h-3.5" /> Governance Control
              </span>
            </div>
            <h1 className="text-[28px] font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>
              Admin Command Dashboard
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
              Municipal dispatch, complaint routing, user moderation, and resolution analytics.
            </p>
          </div>

          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all bg-white dark:bg-slate-800 hover:bg-slate-50" style={{ borderColor: "var(--border-color)", color: "var(--text-primary)" }}>
              <Download className="w-4 h-4" /> Export Report CSV
            </button>
          </div>
        </div>

        {/* ── KPI Cards Grid ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#94a3b8]">Today's Reports</span>
              <FileText className="w-4 h-4 text-[#2563eb]" />
            </div>
            <p className="text-3xl font-black" style={{ color: "var(--text-primary)" }}>{stats.today_reports}</p>
            <p className="text-[11px] text-emerald-600 font-semibold">+18% vs yesterday</p>
          </div>

          <div className="card p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#94a3b8]">Open Reports</span>
              <ShieldAlert className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-3xl font-black text-amber-600">{stats.open_reports}</p>
            <p className="text-[11px] text-[#94a3b8]">Pending department dispatch</p>
          </div>

          <div className="card p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#94a3b8]">Critical Issues</span>
              <ShieldAlert className="w-4 h-4 text-red-500 animate-pulse" />
            </div>
            <p className="text-3xl font-black text-red-600">{stats.critical_issues}</p>
            <p className="text-[11px] text-red-500 font-semibold">Immediate action required</p>
          </div>

          <div className="card p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#94a3b8]">Resolution Rate</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-3xl font-black text-emerald-600">{stats.resolution_rate}%</p>
            <p className="text-[11px] text-emerald-600 font-semibold">Target &gt; 90% reached</p>
          </div>
        </div>

        {/* ── Tabs Bar ──────────────────────────────────────────────────── */}
        <div className="card p-2 flex gap-1 overflow-x-auto">
          {[
            { id: "analytics",  label: "Analytics & Resolution Rate" },
            { id: "complaints", label: `Complaint Queue (${complaints.length})` },
            { id: "users",      label: `User Moderation (${users.length})` },
            { id: "heatmap",    label: "Geographic Heatmap" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === t.id
                  ? "bg-[#2563eb] text-white shadow-sm"
                  : "text-[#475569] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Analytics View ────────────────────────────────────────────── */}
        {activeTab === "analytics" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>Monthly Issue Resolution Velocity</h3>
                  <p className="text-xs text-[#94a3b8]">Average fix turnaround: 18.4 Hours</p>
                </div>
                <span className="badge badge-green">+15% Turnaround Speed</span>
              </div>
              <div className="h-64 flex items-end justify-between gap-3 pt-8 pb-2 px-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
                {[
                  { label: "Jan", height: "45%" },
                  { label: "Feb", height: "60%" },
                  { label: "Mar", height: "55%" },
                  { label: "Apr", height: "75%" },
                  { label: "May", height: "80%" },
                  { label: "Jun", height: "92%" },
                  { label: "Jul", height: "95%" },
                ].map((bar, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="w-full bg-[#2563eb] rounded-t-lg transition-all group-hover:bg-[#1d4ed8]" style={{ height: bar.height }} />
                    <span className="text-[10px] font-bold text-[#94a3b8]">{bar.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 card p-6 space-y-4">
              <h3 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>Complaints by Department</h3>
              <div className="space-y-3 text-xs">
                {[
                  { name: "Public Works (Roads)", count: 42, pct: 45, color: "bg-[#2563eb]" },
                  { name: "Water & Sanitation", count: 28, pct: 30, color: "bg-cyan-500" },
                  { name: "Power & Electrical", count: 14, pct: 15, color: "bg-amber-500" },
                  { name: "Parks & Recreation", count: 9, pct: 10, color: "bg-emerald-500" },
                ].map((dept, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between font-semibold" style={{ color: "var(--text-primary)" }}>
                      <span>{dept.name}</span>
                      <span>{dept.count} ({dept.pct}%)</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full ${dept.color}`} style={{ width: `${dept.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Complaints Table ─────────────────────────────────────────── */}
        {activeTab === "complaints" && (
          <div className="card overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: "var(--border-color)" }}>
              <div className="flex items-center gap-2">
                {["All", "Pending", "In Progress", "Resolved"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      statusFilter === s ? "bg-[#2563eb] text-white" : "bg-slate-100 dark:bg-slate-800 text-[#475569]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-[#94a3b8] font-bold border-b" style={{ borderColor: "var(--border-color)" }}>
                  <tr>
                    <th className="p-4">ID &amp; Title</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Severity</th>
                    <th className="p-4">Assigned Dept</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: "var(--border-color)" }}>
                  {filteredComplaints.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                      <td className="p-4">
                        <span className="font-bold text-[#2563eb]">{c.id}</span>
                        <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{c.title}</p>
                        <span className="text-[10px] text-[#94a3b8]">By {c.reporter} · {c.date}</span>
                      </td>
                      <td className="p-4 font-medium" style={{ color: "var(--text-primary)" }}>{c.category}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          c.severity === "critical" ? "bg-red-100 text-red-700" : c.severity === "high" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                        }`}>
                          {c.severity}
                        </span>
                      </td>
                      <td className="p-4 font-semibold" style={{ color: "var(--text-primary)" }}>{c.department}</td>
                      <td className="p-4">
                        <span className="badge badge-blue">{c.status}</span>
                      </td>
                      <td className="p-4">
                        <select
                          value={c.status}
                          onChange={(e) => handleStatusChange(c.id, e.target.value as any)}
                          className="input-base py-1 px-2 text-xs w-auto"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── User Moderation View ──────────────────────────────────────── */}
        {activeTab === "users" && (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-[#94a3b8] font-bold border-b" style={{ borderColor: "var(--border-color)" }}>
                  <tr>
                    <th className="p-4">User</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Reputation</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Moderation Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: "var(--border-color)" }}>
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                      <td className="p-4">
                        <p className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>{u.name}</p>
                        <p className="text-[10px] text-[#94a3b8]">{u.email}</p>
                      </td>
                      <td className="p-4 font-semibold" style={{ color: "var(--text-primary)" }}>{u.role}</td>
                      <td className="p-4 font-bold text-emerald-600">{u.reputation}/100</td>
                      <td className="p-4">
                        <span className={`badge ${u.status === "Active" ? "badge-green" : "badge-red"}`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <select
                          value={u.status}
                          onChange={(e) => handleUserStatusChange(u.id, e.target.value as any)}
                          className="input-base py-1 px-2 text-xs w-auto"
                        >
                          <option value="Active">Active</option>
                          <option value="Flagged">Flagged</option>
                          <option value="Suspended">Suspended</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Geographic Heatmap View ───────────────────────────────────── */}
        {activeTab === "heatmap" && (
          <div className="card p-6 space-y-4">
            <h3 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>City-Wide Geographic Defect Density Heatmap</h3>
            <div className="h-96 rounded-2xl map-grid-bg relative flex items-center justify-center border" style={{ background: "var(--bg-input)", borderColor: "var(--border-color)" }}>
              <div className="absolute top-1/3 left-1/2 w-48 h-48 bg-red-500/20 rounded-full blur-2xl animate-pulse" />
              <div className="absolute bottom-1/4 left-1/3 w-36 h-36 bg-amber-500/20 rounded-full blur-xl" />
              <div className="p-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-md text-center text-xs space-y-1">
                <MapPin className="w-6 h-6 text-[#2563eb] mx-auto" />
                <p className="font-bold" style={{ color: "var(--text-primary)" }}>Geographic Cluster Analysis Active</p>
                <p className="text-[11px] text-[#94a3b8]">Density Peak: Elm Street &amp; 5th Ave Intersection</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Admin;
