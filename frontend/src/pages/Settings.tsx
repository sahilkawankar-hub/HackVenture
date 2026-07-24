import React, { useState } from "react";
import {
  User,
  Bell,
  Lock,
  ShieldCheck,
  Building,
  CheckCircle2,
  Save,
  Moon,
  Smartphone,
  Eye,
  Key,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

function Settings() {
  const { user } = useAuth();

  // Profile Form State
  const [name, setName] = useState("Alex Johnson");
  const [email, setEmail] = useState(user?.email || "alex.johnson@example.com");
  const [phone, setPhone] = useState("+1 (555) 234-5678");
  const [neighborhood, setNeighborhood] = useState("Greenwood Heights");
  const [bio, setBio] = useState("Long-time resident passionate about community wellness and green spaces.");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Toggle States
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [sosAlerts, setSosAlerts] = useState(true);
  const [feedActivity, setFeedActivity] = useState(false);

  // Privacy States
  const [publicProfile, setPublicProfile] = useState(true);
  const [showLocation, setShowLocation] = useState(true);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] p-6 max-w-7xl mx-auto space-y-8">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#0b1c30] tracking-tight">Account &amp; Community Settings</h1>
        <p className="text-sm text-[#434655] mt-1">
          Manage your personal profile, notification preferences, privacy, and community membership.
        </p>
      </div>

      {/* ── Profile Summary Card ────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-[#004ac6] via-[#2563eb] to-[#3e3fcc] text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-white text-[#004ac6] flex items-center justify-center text-2xl font-black shadow-lg border-4 border-white/20 shrink-0">
            AJ
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-extrabold">{name}</h2>
              <span className="bg-emerald-400 text-emerald-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                Verified Resident
              </span>
            </div>
            <p className="text-xs text-white/80">{neighborhood} · HOA Member Zone 4</p>
            <p className="text-xs text-white/60">{email}</p>
          </div>
        </div>

        {/* Reputation Score Badges */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-center">
            <p className="text-[10px] uppercase font-bold text-white/70">Reputation Score</p>
            <p className="text-xl font-black text-amber-300">94 / 100</p>
          </div>
          <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-center">
            <p className="text-[10px] uppercase font-bold text-white/70">Resident Rank</p>
            <p className="text-xl font-black text-white">Level 4</p>
          </div>
        </div>
      </div>

      {/* ── Settings Grid ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Edit Profile Section */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-[#c3c6d7]/50 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#c3c6d7]/30 pb-3">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-[#004ac6]" />
              <h3 className="text-base font-bold text-[#0b1c30]">Personal Details</h3>
            </div>
            {savedSuccess && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Profile Saved!
              </span>
            )}
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-[#0b1c30] mb-1 block">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 bg-[#f8f9ff] border border-[#c3c6d7] rounded-xl text-xs text-[#0b1c30] font-semibold"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-[#0b1c30] mb-1 block">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 bg-[#f8f9ff] border border-[#c3c6d7] rounded-xl text-xs text-[#0b1c30] font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-[#0b1c30] mb-1 block">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-[#f8f9ff] border border-[#c3c6d7] rounded-xl text-xs text-[#0b1c30] font-semibold"
                required
              />
            </div>

            <div>
              <label className="font-bold text-[#0b1c30] mb-1 block">Neighborhood / HOA Zone</label>
              <input
                type="text"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full p-3 bg-[#f8f9ff] border border-[#c3c6d7] rounded-xl text-xs text-[#0b1c30] font-semibold"
              />
            </div>

            <div>
              <label className="font-bold text-[#0b1c30] mb-1 block">Bio / Community Intro</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full p-3 bg-[#f8f9ff] border border-[#c3c6d7] rounded-xl text-xs text-[#0b1c30]"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#004ac6] text-white text-xs font-bold rounded-xl hover:bg-[#2563eb] shadow-md flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* Notifications & Privacy Side Panel */}
        <div className="lg:col-span-5 space-y-6">
          {/* Notifications Toggles */}
          <div className="bg-white p-6 rounded-3xl border border-[#c3c6d7]/50 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-[#c3c6d7]/30 pb-3">
              <Bell className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-bold text-[#0b1c30]">Notifications</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 bg-[#f8f9ff] rounded-2xl">
                <div>
                  <p className="font-bold text-[#0b1c30]">Emergency SOS Alerts</p>
                  <p className="text-[11px] text-[#434655]">Immediate loud push alerts for SOS broadcasts</p>
                </div>
                <input
                  type="checkbox"
                  checked={sosAlerts}
                  onChange={(e) => setSosAlerts(e.target.checked)}
                  className="w-4 h-4 accent-red-600 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-[#f8f9ff] rounded-2xl">
                <div>
                  <p className="font-bold text-[#0b1c30]">CivicEye Progress Updates</p>
                  <p className="text-[11px] text-[#434655]">Status changes on your reported issues</p>
                </div>
                <input
                  type="checkbox"
                  checked={pushNotifs}
                  onChange={(e) => setPushNotifs(e.target.checked)}
                  className="w-4 h-4 accent-[#004ac6] rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-[#f8f9ff] rounded-2xl">
                <div>
                  <p className="font-bold text-[#0b1c30]">Weekly Email Digest</p>
                  <p className="text-[11px] text-[#434655]">Summary of events and marketplace deals</p>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotifs}
                  onChange={(e) => setEmailNotifs(e.target.checked)}
                  className="w-4 h-4 accent-[#004ac6] rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Privacy & Security Settings */}
          <div className="bg-white p-6 rounded-3xl border border-[#c3c6d7]/50 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-[#c3c6d7]/30 pb-3">
              <Lock className="w-5 h-5 text-[#3e3fcc]" />
              <h3 className="text-base font-bold text-[#0b1c30]">Privacy &amp; Security</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 bg-[#f8f9ff] rounded-2xl">
                <div>
                  <p className="font-bold text-[#0b1c30]">Public Resident Profile</p>
                  <p className="text-[11px] text-[#434655]">Allow verified neighbors to view bio</p>
                </div>
                <input
                  type="checkbox"
                  checked={publicProfile}
                  onChange={(e) => setPublicProfile(e.target.checked)}
                  className="w-4 h-4 accent-[#004ac6] rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-[#f8f9ff] rounded-2xl">
                <div>
                  <p className="font-bold text-[#0b1c30]">Show Geotag on Maps</p>
                  <p className="text-[11px] text-[#434655]">Approximate location for reported issues</p>
                </div>
                <input
                  type="checkbox"
                  checked={showLocation}
                  onChange={(e) => setShowLocation(e.target.checked)}
                  className="w-4 h-4 accent-[#004ac6] rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
