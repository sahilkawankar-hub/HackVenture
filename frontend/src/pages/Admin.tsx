import { useState, useEffect, useCallback } from "react";
import {
  ShieldAlert, CheckCircle2, FileText,
  Download, Shield, MapPin, RefreshCw, Loader2
} from "lucide-react";
import { useToast } from "../components/common/Toast";
import {
  getAdminStats,
  getAdminComplaints,
  getAdminUsers,
  updateComplaintStatus,
  updateUserStatus,
  AdminStats,
} from "../api/admin";

interface AdminComplaint {
  id: string;
  title: string;
  category: string;
  reporter: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "Pending" | "In Progress" | "Resolved";
  date: string;
  department: string;
  description?: string;
  image_urls?: string[];
  address?: string;
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

function Admin() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"analytics" | "complaints" | "users" | "heatmap">("analytics");
  const [complaints, setComplaints] = useState<AdminComplaint[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [isLoadingComplaints, setIsLoadingComplaints] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [stats, setStats] = useState<AdminStats>({
    today_reports: 0,
    open_reports: 0,
    resolved_reports: 0,
    critical_issues: 0,
    monthly_reports: 0,
    resolution_rate: 0,
    avg_resolution_hours: 0,
    active_users: 0,
  });

  // ── Fetch Stats ───────────────────────────────────────────────────────────
  const fetchStats = useCallback(() => {
    getAdminStats()
      .then(setStats)
      .catch(() => {}); // Silently use defaults if backend is unavailable
  }, []);

  // ── Fetch Complaints ──────────────────────────────────────────────────────
  const fetchComplaints = useCallback(async () => {
    setIsLoadingComplaints(true);
    try {
      const filter = statusFilter !== "All" ? statusFilter : undefined;
      const data = await getAdminComplaints({ status: filter, limit: 100 });
      const mapped: AdminComplaint[] = data.map((item) => ({
        id: String(item.id ?? ""),
        title: String(item.title ?? "Untitled"),
        category: String(item.category ?? "General"),
        reporter: String(item.reporter ?? "Unknown"),
        severity: (String(item.severity ?? "medium").toLowerCase() as AdminComplaint["severity"]),
        status: (item.status as AdminComplaint["status"]) ?? "Pending",
        date: String(item.date ?? ""),
        department: String(item.department ?? "Public Works"),
        description: item.description ? String(item.description) : undefined,
        image_urls: Array.isArray(item.image_urls) ? (item.image_urls as string[]) : [],
        address: item.address ? String(item.address) : undefined,
      }));
      setComplaints(mapped);
    } catch {
      // Keep existing complaints on failure
    } finally {
      setIsLoadingComplaints(false);
    }
  }, [statusFilter]);

  // ── Fetch Users ───────────────────────────────────────────────────────────
  const fetchUsers = useCallback(async () => {
    setIsLoadingUsers(true);
    try {
      const data = await getAdminUsers();
      const mapped: AdminUser[] = data.map((item) => ({
        id: String(item.id ?? ""),
        name: String(item.name ?? "User"),
        email: String(item.email ?? ""),
        role: (item.role as AdminUser["role"]) ?? "Resident",
        reputation: Number(item.reputation ?? 90),
        status: (item.status as AdminUser["status"]) ?? "Active",
        joinedDate: String(item.joinedDate ?? ""),
      }));
      setUsers(mapped);
    } catch {
      // Keep existing users on failure
    } finally {
      setIsLoadingUsers(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Load complaints when tab or filter changes
  useEffect(() => {
    if (activeTab === "complaints") {
      fetchComplaints();
    }
  }, [activeTab, fetchComplaints]);

  // Load users when tab changes
  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers();
    }
  }, [activeTab, fetchUsers]);

  // ── Status Updates ────────────────────────────────────────────────────────
  const handleStatusChange = async (id: string, newStatus: AdminComplaint["status"]) => {
    // Optimistic update
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
    setUpdatingId(id);
    try {
      await updateComplaintStatus(id, newStatus);
      toast(`Complaint ${id} updated to "${newStatus}"`, "success");
      // Refresh stats since counts may have changed
      fetchStats();
    } catch {
      // Revert optimistic update on failure
      fetchComplaints();
      toast(`Failed to update complaint ${id}`, "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleUserStatusChange = async (id: string, newStatus: AdminUser["status"]) => {
    // Optimistic update
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u))
    );
    setUpdatingId(id);
    try {
      const apiStatus = newStatus.toLowerCase() as "active" | "suspended" | "flagged";
      await updateUserStatus(id, apiStatus);
      toast(`User status updated to "${newStatus}"`, "info");
    } catch {
      fetchUsers();
      toast(`Failed to update user status`, "error");
    } finally {
      setUpdatingId(null);
    }
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
            <button
              onClick={() => { fetchStats(); fetchComplaints(); fetchUsers(); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all bg-white dark:bg-slate-800 hover:bg-slate-50"
              style={{ borderColor: "var(--border-color)", color: "var(--text-primary)" }}
            >
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
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
            <p className="text-[11px] text-emerald-600 font-semibold">Live from database</p>
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
            <p className="text-[11px] text-emerald-600 font-semibold">
              {stats.resolution_rate >= 90 ? "Target > 90% reached" : "Working toward 90%"}
            </p>
          </div>
        </div>

        {/* ── Tabs Bar ──────────────────────────────────────────────────── */}
        <div className="card p-2 flex gap-1 overflow-x-auto">
          {[
            { id: "analytics",  label: "Analytics & Resolution Rate" },
            { id: "complaints", label: `Complaint Queue (${stats.open_reports + stats.resolved_reports || complaints.length})` },
            { id: "users",      label: `User Moderation (${users.length || stats.active_users})` },
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
                  <p className="text-xs text-[#94a3b8]">Average fix turnaround: {stats.avg_resolution_hours}h</p>
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
                  { label: "Jul", height: `${Math.min(100, Math.max(20, stats.resolution_rate))}%` },
                ].map((bar, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="w-full bg-[#2563eb] rounded-t-lg transition-all group-hover:bg-[#1d4ed8]" style={{ height: bar.height }} />
                    <span className="text-[10px] font-bold text-[#94a3b8]">{bar.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 card p-6 space-y-4">
              <h3 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>Issue Summary</h3>
              <div className="space-y-3 text-xs">
                {[
                  { name: "Total Reports", count: stats.monthly_reports, pct: 100, color: "bg-[#2563eb]" },
                  { name: "Open / In Progress", count: stats.open_reports, pct: stats.monthly_reports ? Math.round(stats.open_reports / stats.monthly_reports * 100) : 0, color: "bg-amber-500" },
                  { name: "Resolved", count: stats.resolved_reports, pct: stats.monthly_reports ? Math.round(stats.resolved_reports / stats.monthly_reports * 100) : 0, color: "bg-emerald-500" },
                  { name: "Critical", count: stats.critical_issues, pct: stats.monthly_reports ? Math.round(stats.critical_issues / stats.monthly_reports * 100) : 0, color: "bg-red-500" },
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
              <div className="flex items-center gap-2 flex-wrap">
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
              {isLoadingComplaints && (
                <span className="flex items-center gap-1.5 text-xs text-[#94a3b8]">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading…
                </span>
              )}
            </div>

            {filteredComplaints.length === 0 && !isLoadingComplaints ? (
              <div className="p-12 text-center text-sm text-[#94a3b8]">
                <ShieldAlert className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-semibold">No complaints found</p>
                <p className="text-xs mt-1">Reports submitted by users will appear here in real-time.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-[#94a3b8] font-bold border-b" style={{ borderColor: "var(--border-color)" }}>
                    <tr>
                      <th className="p-4">ID & Title</th>
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
                          {c.address && (
                            <p className="text-[10px] text-[#94a3b8] flex items-center gap-0.5 mt-0.5">
                              <MapPin className="w-2.5 h-2.5" /> {c.address}
                            </p>
                          )}
                        </td>
                        <td className="p-4 font-medium" style={{ color: "var(--text-primary)" }}>{c.category}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            c.severity === "critical" ? "bg-red-100 text-red-700"
                            : c.severity === "high" ? "bg-amber-100 text-amber-700"
                            : c.severity === "medium" ? "bg-orange-100 text-orange-700"
                            : "bg-emerald-100 text-emerald-700"
                          }`}>
                            {c.severity}
                          </span>
                        </td>
                        <td className="p-4 font-semibold" style={{ color: "var(--text-primary)" }}>{c.department}</td>
                        <td className="p-4">
                          <span className={`badge ${
                            c.status === "Resolved" ? "badge-green"
                            : c.status === "In Progress" ? "badge-blue"
                            : "badge-red"
                          }`}>{c.status}</span>
                        </td>
                        <td className="p-4">
                          {updatingId === c.id ? (
                            <Loader2 className="w-4 h-4 animate-spin text-[#2563eb]" />
                          ) : (
                            <select
                              value={c.status}
                              onChange={(e) => handleStatusChange(c.id, e.target.value as any)}
                              className="input-base py-1 px-2 text-xs w-auto"
                            >
                              <option value="Pending">Pending</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Resolved">Resolved</option>
                            </select>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── User Moderation View ──────────────────────────────────────── */}
        {activeTab === "users" && (
          <div className="card overflow-hidden">
            {isLoadingUsers && (
              <div className="p-4 flex items-center gap-2 text-xs text-[#94a3b8]">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading users…
              </div>
            )}
            {users.length === 0 && !isLoadingUsers ? (
              <div className="p-12 text-center text-sm text-[#94a3b8]">
                <p className="font-semibold">No users found</p>
                <p className="text-xs mt-1">Registered users will appear here.</p>
              </div>
            ) : (
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
                          <p className="text-[10px] text-[#94a3b8]">Joined: {u.joinedDate}</p>
                        </td>
                        <td className="p-4 font-semibold" style={{ color: "var(--text-primary)" }}>{u.role}</td>
                        <td className="p-4 font-bold text-emerald-600">{u.reputation}/100</td>
                        <td className="p-4">
                          <span className={`badge ${u.status === "Active" ? "badge-green" : u.status === "Flagged" ? "badge-amber" : "badge-red"}`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="p-4">
                          {updatingId === u.id ? (
                            <Loader2 className="w-4 h-4 animate-spin text-[#2563eb]" />
                          ) : (
                            <select
                              value={u.status}
                              onChange={(e) => handleUserStatusChange(u.id, e.target.value as any)}
                              className="input-base py-1 px-2 text-xs w-auto"
                            >
                              <option value="Active">Active</option>
                              <option value="Flagged">Flagged</option>
                              <option value="Suspended">Suspended</option>
                            </select>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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
                <p className="text-[11px] text-[#94a3b8]">{stats.monthly_reports} total reports across {stats.active_users} active citizens</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Admin;
