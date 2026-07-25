import React, { useState } from "react";
import {
  Users, Plus, Search, Lock, Globe, UserCheck,
  Check, X, MapPin
} from "lucide-react";
import { Community, JoinRequest } from "../types";
import { useAuth } from "../hooks/useAuth";
import { EmptyState } from "../components/common/EmptyState";

const DEMO_COMMUNITIES: Community[] = [
  {
    id: "c1",
    name: "Greenwood Heights HOA",
    description: "Official homeowners association community for Greenwood Heights residents. Neighborhood news, events, and maintenance updates.",
    cover_image_url: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80",
    logo_url: null,
    address: "Greenwood Heights, NY 11215",
    latitude: 40.6654,
    longitude: -73.9876,
    community_type: "neighborhood",
    join_policy: "approval_required",
    rules: "1. Be respectful to neighbors.\n2. No commercial spam.\n3. Verify residence upon joining.",
    tags: ["HOA", "Neighborhood", "Official"],
    max_members: 500,
    member_count: 342,
    is_active: true,
    created_by: "u_admin",
    created_at: new Date().toISOString(),
  },
  {
    id: "c2",
    name: "Greenwood Gardeners & Seed Swap",
    description: "For plant lovers, urban farmers, and community garden volunteers. We swap seeds, offer gardening advice, and host weekend cleanups.",
    cover_image_url: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80",
    logo_url: null,
    address: "South Pavilion Garden",
    latitude: 40.6680,
    longitude: -73.9850,
    community_type: "interest_based",
    join_policy: "public",
    rules: "Share extra seeds and keep discussions gardening-focused!",
    tags: ["Gardening", "Eco", "Volunteers"],
    max_members: 200,
    member_count: 128,
    is_active: true,
    created_by: "u_elena",
    created_at: new Date().toISOString(),
  },
  {
    id: "c3",
    name: "Oak Street Apartment Residents",
    description: "Private tenant association for 12-48 Oak Street apartment complex.",
    cover_image_url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
    logo_url: null,
    address: "12-48 Oak Street",
    latitude: 40.6630,
    longitude: -73.9890,
    community_type: "apartment_society",
    join_policy: "invite_only",
    rules: "Residents only.",
    tags: ["Apartment", "Private"],
    max_members: 80,
    member_count: 45,
    is_active: true,
    created_by: "u_sarah",
    created_at: new Date().toISOString(),
  },
];

const DEMO_REQUESTS: JoinRequest[] = [
  {
    id: "req-1",
    community_id: "c1",
    user_id: "u-99",
    message: "Hi! I just moved to 45 Elm St and would love to join the HOA group.",
    status: "pending",
    created_at: new Date().toISOString(),
    user: { display_name: "Daniel Craig", email: "daniel.c@example.com" },
  },
  {
    id: "req-2",
    community_id: "c1",
    user_id: "u-100",
    message: "Resident at 12 Maple Ave for 3 years.",
    status: "pending",
    created_at: new Date().toISOString(),
    user: { display_name: "Priya Sharma", email: "priya.s@example.com" },
  },
];

function CommunityPage() {
  const { user } = useAuth();
  const [communities, setCommunities] = useState<Community[]>(DEMO_COMMUNITIES);
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>(DEMO_REQUESTS);
  const [activeTab, setActiveTab] = useState<"explore" | "my_communities" | "create" | "requests">("explore");
  const [searchQuery, setSearchQuery] = useState("");
  const [myCommunityIds, setMyCommunityIds] = useState<string[]>(["c1"]);

  // Create Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<Community["community_type"]>("neighborhood");
  const [policy, setPolicy] = useState<Community["join_policy"]>("public");
  const [address, setAddress] = useState("");
  const [rules, setRules] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [createSuccess, setCreateSuccess] = useState(false);

  const handleJoinToggle = (commId: string) => {
    if (myCommunityIds.includes(commId)) {
      setMyCommunityIds((prev) => prev.filter((id) => id !== commId));
    } else {
      setMyCommunityIds((prev) => [...prev, commId]);
    }
  };

  const handleApproveRequest = (reqId: string) => {
    setJoinRequests((prev) => prev.filter((r) => r.id !== reqId));
  };

  const handleRejectRequest = (reqId: string) => {
    setJoinRequests((prev) => prev.filter((r) => r.id !== reqId));
  };

  const handleCreateCommunity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newComm: Community = {
      id: `c-${Date.now()}`,
      name,
      description,
      cover_image_url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
      logo_url: null,
      address,
      latitude: 40.665,
      longitude: -73.987,
      community_type: type,
      join_policy: policy,
      rules,
      tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
      max_members: 500,
      member_count: 1,
      is_active: true,
      created_by: user?.id || "demo-user",
      created_at: new Date().toISOString(),
    };

    setCommunities([newComm, ...communities]);
    setMyCommunityIds([...myCommunityIds, newComm.id]);
    setCreateSuccess(true);
    setTimeout(() => {
      setCreateSuccess(false);
      setActiveTab("my_communities");
      setName("");
      setDescription("");
      setAddress("");
      setRules("");
      setTagsInput("");
    }, 1500);
  };

  const filteredCommunities = communities.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === "my_communities") {
      return matchesSearch && myCommunityIds.includes(c.id);
    }
    return matchesSearch;
  });

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base)" }}>
      <div className="p-7 max-w-6xl mx-auto space-y-6">

        {/* ── Header & Action ────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>
              Community Hub
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
              Join neighborhood associations, apartment groups, and local interest clubs.
            </p>
          </div>

          <button
            onClick={() => setActiveTab("create")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold text-white transition-all shadow-md active:scale-95 shrink-0"
            style={{
              background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
              boxShadow: "0 4px 16px rgba(37,99,235,0.3)",
            }}
          >
            <Plus className="w-4 h-4" />
            Create Community
          </button>
        </div>

        {/* ── Navigation Tabs & Search ───────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 card p-3">
          {/* Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
            <button
              onClick={() => setActiveTab("explore")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === "explore"
                  ? "bg-[#2563eb] text-white shadow-sm"
                  : "text-[#475569] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              Explore ({communities.length})
            </button>
            <button
              onClick={() => setActiveTab("my_communities")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === "my_communities"
                  ? "bg-[#2563eb] text-white shadow-sm"
                  : "text-[#475569] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              My Communities ({myCommunityIds.length})
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all relative ${
                activeTab === "requests"
                  ? "bg-[#2563eb] text-white shadow-sm"
                  : "text-[#475569] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              Join Requests
              {joinRequests.length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 bg-red-500 text-white rounded-full text-[10px] font-bold">
                  {joinRequests.length}
                </span>
              )}
            </button>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search communities..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs outline-none"
              style={{
                background: "var(--bg-input)",
                border: "1px solid var(--border-color)",
                color: "var(--text-primary)",
              }}
            />
          </div>
        </div>

        {/* ── Main View Content ─────────────────────────────────────────── */}
        {activeTab === "create" ? (
          <div className="card p-6 max-w-2xl mx-auto space-y-5">
            <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: "var(--border-color)" }}>
              <div>
                <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Create New Community</h3>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  Set up a hub for your neighborhood, society, or shared interests.
                </p>
              </div>
              <button
                onClick={() => setActiveTab("explore")}
                className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-[#94a3b8]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {createSuccess ? (
              <div className="py-12 text-center space-y-3 animate-fade-in">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Community Created!</h4>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  You are now the Owner of this community.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCreateCommunity} className="space-y-4">
                <div>
                  <label className="text-xs font-bold block mb-1" style={{ color: "var(--text-primary)" }}>
                    Community Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Greenwood Heights HOA or Maple Street Gardeners"
                    className="input-base"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold block mb-1" style={{ color: "var(--text-primary)" }}>
                      Community Type
                    </label>
                    <select
                      value={type}
                      onChange={(e: any) => setType(e.target.value)}
                      className="input-base"
                    >
                      <option value="neighborhood">Neighborhood</option>
                      <option value="apartment_society">Apartment / Society</option>
                      <option value="interest_based">Interest-Based</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold block mb-1" style={{ color: "var(--text-primary)" }}>
                      Join Policy
                    </label>
                    <select
                      value={policy}
                      onChange={(e: any) => setPolicy(e.target.value)}
                      className="input-base"
                    >
                      <option value="public">Public (Anyone can join)</option>
                      <option value="approval_required">Approval Required</option>
                      <option value="invite_only">Invite Only</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold block mb-1" style={{ color: "var(--text-primary)" }}>
                    Location / Address (Optional)
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Greenwood Heights, NY"
                    className="input-base"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold block mb-1" style={{ color: "var(--text-primary)" }}>
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What is this community about? Who should join?"
                    className="input-base"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold block mb-1" style={{ color: "var(--text-primary)" }}>
                    Rules & Guidelines (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={rules}
                    onChange={(e) => setRules(e.target.value)}
                    placeholder="e.g. 1. Be respectful. 2. No commercial advertising."
                    className="input-base"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold block mb-1" style={{ color: "var(--text-primary)" }}>
                    Tags (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="e.g. HOA, Garden, Safety"
                    className="input-base"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab("explore")}
                    className="px-4 py-2 rounded-xl text-xs font-semibold border text-[#475569] dark:text-slate-300"
                    style={{ borderColor: "var(--border-color)" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-[#2563eb] text-white text-xs font-bold hover:bg-[#1d4ed8] shadow-sm"
                  >
                    Create Community
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : activeTab === "requests" ? (
          <div className="space-y-4">
            <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
              Pending Join Requests ({joinRequests.length})
            </h3>
            {joinRequests.length === 0 ? (
              <EmptyState
                icon={<UserCheck className="w-8 h-8" />}
                title="No pending requests"
                description="All membership join requests have been processed."
              />
            ) : (
              <div className="space-y-3">
                {joinRequests.map((req) => (
                  <div key={req.id} className="card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-[#2563eb] font-bold text-sm flex items-center justify-center">
                        {(req.user?.display_name || "U")[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{req.user?.display_name}</p>
                        <p className="text-xs text-[#94a3b8]">{req.user?.email}</p>
                        {req.message && (
                          <p className="text-xs mt-1 italic text-[#475569] dark:text-slate-300">"{req.message}"</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleApproveRequest(req.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button
                        onClick={() => handleRejectRequest(req.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 text-xs font-bold flex items-center gap-1.5 transition-all"
                      >
                        <X className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Grid of Communities */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCommunities.map((comm) => {
              const isMember = myCommunityIds.includes(comm.id);
              return (
                <div key={comm.id} className="card overflow-hidden flex flex-col justify-between group hover:shadow-lg transition-all">
                  {/* Cover */}
                  <div className="h-36 relative bg-slate-200 dark:bg-slate-800">
                    {comm.cover_image_url ? (
                      <img src={comm.cover_image_url} alt={comm.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full gradient-civic flex items-center justify-center text-white/20">
                        <Users className="w-12 h-12" />
                      </div>
                    )}
                    {/* Policy Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 bg-black/50 backdrop-blur-md text-white rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                        {comm.join_policy === "public" ? <Globe className="w-3 h-3 text-emerald-400" /> : <Lock className="w-3 h-3 text-amber-400" />}
                        {comm.join_policy.replace("_", " ")}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-base font-extrabold line-clamp-1" style={{ color: "var(--text-primary)" }}>
                        {comm.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-[#94a3b8]">
                        <MapPin className="w-3.5 h-3.5 text-[#2563eb]" />
                        <span>{comm.address || "Hyperlocal"}</span>
                        <span>·</span>
                        <span className="font-semibold text-emerald-600">{comm.member_count} members</span>
                      </div>
                      <p className="text-xs mt-2.5 line-clamp-2 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                        {comm.description}
                      </p>

                      {/* Tags */}
                      {comm.tags && comm.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {comm.tags.map((tag) => (
                            <span key={tag} className="badge badge-gray text-[10px]">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer / Join CTA */}
                    <div className="pt-3 border-t flex items-center justify-between" style={{ borderColor: "var(--border-color)" }}>
                      <span className="text-[11px] font-medium text-[#94a3b8]">
                        {comm.community_type.replace("_", " ").toUpperCase()}
                      </span>
                      <button
                        onClick={() => handleJoinToggle(comm.id)}
                        className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          isMember
                            ? "bg-slate-100 dark:bg-slate-800 text-[#475569] dark:text-slate-300 hover:bg-red-50 hover:text-red-600"
                            : "bg-[#2563eb] text-white hover:bg-[#1d4ed8] shadow-sm"
                        }`}
                      >
                        {isMember ? "Joined ✓" : comm.join_policy === "approval_required" ? "Request Join" : "Join Community"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}

export default CommunityPage;
