import React, { useState, useEffect } from "react";
import { Search, PlusCircle, Sparkles, MapPin, X } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { LostFoundItem } from "../types";
import { getLostFoundItems, reportLostFound } from "../api/lostFound";

const DEMO_ITEMS: LostFoundItem[] = [
  {
    id: "LF-101",
    user_id: "u-1",
    community_id: "c1",
    item_type: "lost",
    title: "Golden Retriever Puppy ('Barnaby')",
    description: "8-month-old Golden Retriever puppy with blue collar and tag. Very friendly!",
    category: "Pets",
    image_urls: ["https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80"],
    location_description: "Greenwood Heights North Lawn",
    latitude: 40.6654,
    longitude: -73.9876,
    status: "active",
    date_lost_found: "Jul 24, 2026",
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "LF-102",
    user_id: "u-2",
    community_id: "c1",
    item_type: "found",
    title: "Golden Retriever with Blue Collar",
    description: "Found sitting patiently on lawn bench near 14th Ave. Wearing a light blue collar.",
    category: "Pets",
    image_urls: ["https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80"],
    location_description: "Near 14th Ave Park Bench",
    latitude: 40.6650,
    longitude: -73.9870,
    status: "active",
    date_lost_found: "Jul 24, 2026",
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "LF-103",
    user_id: "u-3",
    community_id: "c1",
    item_type: "found",
    title: "Silver Keychain & Honda Car Fob",
    description: "Found set of 3 keys with silver Honda car remote on playground bench.",
    category: "Keys",
    image_urls: null,
    location_description: "North Playground Bench",
    latitude: 40.6680,
    longitude: -73.9850,
    status: "active",
    date_lost_found: "Jul 23, 2026",
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

function LostFound() {
  const { user } = useAuth();
  const [items, setItems] = useState<LostFoundItem[]>(DEMO_ITEMS);
  const [typeFilter, setTypeFilter] = useState<"ALL" | "LOST" | "FOUND">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [itemType, setItemType] = useState<"lost" | "found">("lost");
  const [category] = useState("Pets");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    getLostFoundItems()
      .then((res) => {
        if (res.items && res.items.length > 0) setItems(res.items);
      })
      .catch(() => {});
  }, []);

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const newItem: LostFoundItem = {
      id: `LF-${Date.now()}`,
      user_id: user?.id || "demo-user",
      community_id: "c1",
      item_type: itemType,
      title,
      description,
      category,
      image_urls: null,
      location_description: location,
      latitude: 40.665,
      longitude: -73.987,
      status: "active",
      date_lost_found: new Date().toLocaleDateString(),
      created_at: new Date().toISOString(),
    };

    setItems([newItem, ...items]);
    setShowModal(false);
    setTitle("");
    setDescription("");
    setLocation("");

    try {
      await reportLostFound({
        community_id: "c1",
        item_type: itemType,
        title,
        description,
        category,
        location_description: location,
      });
    } catch {}
  };

  const filteredItems = items.filter((item) => {
    const matchesType = typeFilter === "ALL" || item.item_type.toUpperCase() === typeFilter;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base)" }}>
      <div className="p-7 max-w-6xl mx-auto space-y-6">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>
              Lost &amp; Found AI Hub
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
              Report lost pets or found items. AI similarity matching automatically connects owners.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold text-white transition-all shadow-md active:scale-95 shrink-0"
            style={{
              background: "linear-gradient(135deg, #0891b2, #06b6d4)",
              boxShadow: "0 4px 16px rgba(6,182,212,0.3)",
            }}
          >
            <PlusCircle className="w-5 h-5" />
            Report Lost / Found
          </button>
        </div>

        {/* ── AI Match Banner ────────────────────────────────────────────── */}
        <div className="p-4 rounded-2xl border bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-blue-500/10 border-cyan-300 dark:border-cyan-800 flex items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-600 text-white rounded-xl shadow-sm">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-cyan-700 dark:text-cyan-400 uppercase tracking-wider">
                AI Vision Match Detected (98% Confidence)
              </p>
              <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                Golden Retriever 'Barnaby' matches 'Found Dog near 14th Ave'
              </p>
            </div>
          </div>
          <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-xl shadow-sm whitespace-nowrap">
            Inspect Match
          </button>
        </div>

        {/* ── Search & Filter ────────────────────────────────────────────── */}
        <div className="card p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search lost or found items..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs outline-none"
              style={{
                background: "var(--bg-input)",
                border: "1px solid var(--border-color)",
                color: "var(--text-primary)",
              }}
            />
          </div>

          <div className="flex items-center gap-1">
            {(["ALL", "LOST", "FOUND"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  typeFilter === t
                    ? "bg-[#06b6d4] text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-[#475569] dark:text-slate-400"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* ── Item Grid ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => (
            <div key={item.id} className="card p-5 space-y-3 flex flex-col justify-between hover:shadow-md transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                    item.item_type.toUpperCase() === "LOST"
                      ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                      : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                  }`}>
                    {item.item_type}
                  </span>
                  <span className="text-[11px] text-[#94a3b8]">{item.date_lost_found}</span>
                </div>

                <h3 className="font-bold text-base" style={{ color: "var(--text-primary)" }}>{item.title}</h3>
                <p className="text-xs mt-1 leading-relaxed line-clamp-2" style={{ color: "var(--text-secondary)" }}>{item.description}</p>

                {item.image_urls && item.image_urls.length > 0 && (
                  <div className="mt-3 rounded-xl overflow-hidden h-36 bg-slate-100 dark:bg-slate-800">
                    <img src={item.image_urls[0]} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="pt-3 border-t space-y-2 text-xs" style={{ borderColor: "var(--border-color)" }}>
                <div className="flex items-center gap-1.5 text-[#94a3b8]">
                  <MapPin className="w-3.5 h-3.5 text-[#06b6d4]" />
                  <span>{item.location_description || "Greenwood Park"}</span>
                </div>

                <button className="w-full py-2 rounded-xl bg-cyan-50 dark:bg-cyan-900/20 text-[#06b6d4] font-bold text-xs hover:bg-cyan-100 transition-colors">
                  Contact Finder / Owner
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ── Report Modal ───────────────────────────────────────────────── */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl border" style={{ borderColor: "var(--border-color)" }}>
              <div className="flex justify-between items-center border-b pb-3" style={{ borderColor: "var(--border-color)" }}>
                <h3 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>Report Lost or Found Item</h3>
                <button onClick={() => setShowModal(false)} className="p-1 text-[#94a3b8]"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleReport} className="space-y-3">
                <div className="flex gap-3">
                  {(["lost", "found"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setItemType(t)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                        itemType === t ? "bg-[#06b6d4] text-white shadow-sm" : "bg-slate-100 text-[#475569]"
                      }`}
                    >
                      {t} ITEM
                    </button>
                  ))}
                </div>

                <div>
                  <label className="text-xs font-bold block mb-1" style={{ color: "var(--text-primary)" }}>Item Title *</label>
                  <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Golden Retriever Puppy" className="input-base" />
                </div>

                <div>
                  <label className="text-xs font-bold block mb-1" style={{ color: "var(--text-primary)" }}>Location Description</label>
                  <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Near playground bench" className="input-base" />
                </div>

                <div>
                  <label className="text-xs font-bold block mb-1" style={{ color: "var(--text-primary)" }}>Description</label>
                  <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe color, tags, distinguishing features..." className="input-base" />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl text-xs font-semibold border text-[#475569]" style={{ borderColor: "var(--border-color)" }}>Cancel</button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-[#06b6d4] text-white text-xs font-bold hover:bg-cyan-700 shadow-sm">Submit Report</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default LostFound;
