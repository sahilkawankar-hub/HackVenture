import React, { useState } from "react";
import {
  User,
  Bell,
  Lock,
  CheckCircle2,
  Save,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

function Settings() {
  const { user } = useAuth();
  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Resident";
  const initials = displayName.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();

  // Profile Form State
  const [name, setName] = useState(displayName);
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("+1 (555) 234-5678");
  const [neighborhood, setNeighborhood] = useState("Greenwood Heights");
  const [bio, setBio] = useState("Long-time resident passionate about community wellness and green spaces.");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Toggle States
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [sosAlerts, setSosAlerts] = useState(true);

  // Privacy States
  const [publicProfile, setPublicProfile] = useState(true);
  const [showLocation, setShowLocation] = useState(true);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto space-y-8" style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>Account &amp; Community Settings</h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
          Manage your personal profile, notification preferences, privacy, and community membership.
        </p>
      </div>

      {/* ── Profile Summary Card ────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-[#004ac6] via-[#2563eb] to-[#3e3fcc] text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-white text-[#004ac6] flex items-center justify-center text-2xl font-black shadow-lg border-4 border-white/20 shrink-0">
            {initials}
          </div>
          <div>
            <h2 className="text-2xl font-extrabold">{displayName}</h2>
            <p className="text-[#eff6ff]/80 text-sm">{email}</p>
            <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold backdrop-blur-sm border border-white/20">
              <span>Verified Neighbor</span> · <span>Greenwood Heights</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Settings Grid ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (Profile Info) */}
        <div className="lg:col-span-7 card p-6 space-y-6">
          <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: "var(--border-color)" }}>
            <div className="flex items-center gap-2 font-bold text-lg" style={{ color: "var(--text-primary)" }}>
              <User className="w-5 h-5 text-[#2563eb]" />
              Personal Profile
            </div>
            {savedSuccess && (
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full animate-fade-in">
                <CheckCircle2 className="w-4 h-4" /> Saved!
              </span>
            )}
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="text-xs font-bold block mb-1" style={{ color: "var(--text-primary)" }}>Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-base" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold block mb-1" style={{ color: "var(--text-primary)" }}>Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-base" />
              </div>
              <div>
                <label className="text-xs font-bold block mb-1" style={{ color: "var(--text-primary)" }}>Phone Number</label>
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="input-base" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold block mb-1" style={{ color: "var(--text-primary)" }}>Neighborhood</label>
              <input type="text" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} className="input-base" />
            </div>

            <div>
              <label className="text-xs font-bold block mb-1" style={{ color: "var(--text-primary)" }}>Bio</label>
              <textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)} className="input-base" />
            </div>

            <div className="pt-2 flex justify-end">
              <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-[#2563eb] text-white font-bold text-xs rounded-xl hover:bg-[#1d4ed8] shadow-sm transition-all">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* Right Column (Preferences & Security) */}
        <div className="lg:col-span-5 space-y-6">

          {/* Notifications Preferences */}
          <div className="card p-6 space-y-4">
            <div className="flex items-center gap-2 font-bold text-base border-b pb-3" style={{ color: "var(--text-primary)", borderColor: "var(--border-color)" }}>
              <Bell className="w-5 h-5 text-[#2563eb]" />
              Notification Preferences
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>Email Notifications</p>
                  <p className="text-[11px]" style={{ color: "var(--text-secondary)" }}>Receive status updates on reported civic issues</p>
                </div>
                <input type="checkbox" checked={emailNotifs} onChange={(e) => setEmailNotifs(e.target.checked)} className="w-4 h-4 text-[#2563eb] rounded" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>Push Notifications</p>
                  <p className="text-[11px]" style={{ color: "var(--text-secondary)" }}>Real-time alerts for lost items &amp; marketplace replies</p>
                </div>
                <input type="checkbox" checked={pushNotifs} onChange={(e) => setPushNotifs(e.target.checked)} className="w-4 h-4 text-[#2563eb] rounded" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-red-600">Emergency SOS Alerts</p>
                  <p className="text-[11px]" style={{ color: "var(--text-secondary)" }}>High priority alerts from neighbors in distress</p>
                </div>
                <input type="checkbox" checked={sosAlerts} onChange={(e) => setSosAlerts(e.target.checked)} className="w-4 h-4 text-red-600 rounded" />
              </div>
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="card p-6 space-y-4">
            <div className="flex items-center gap-2 font-bold text-base border-b pb-3" style={{ color: "var(--text-primary)", borderColor: "var(--border-color)" }}>
              <Lock className="w-5 h-5 text-[#2563eb]" />
              Privacy Settings
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>Public Resident Profile</p>
                  <p className="text-[11px]" style={{ color: "var(--text-secondary)" }}>Allow neighbors to see your name &amp; bio</p>
                </div>
                <input type="checkbox" checked={publicProfile} onChange={(e) => setPublicProfile(e.target.checked)} className="w-4 h-4 text-[#2563eb] rounded" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>Share Approximate Location</p>
                  <p className="text-[11px]" style={{ color: "var(--text-secondary)" }}>Help geotag civic reports accurately</p>
                </div>
                <input type="checkbox" checked={showLocation} onChange={(e) => setShowLocation(e.target.checked)} className="w-4 h-4 text-[#2563eb] rounded" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Settings;
