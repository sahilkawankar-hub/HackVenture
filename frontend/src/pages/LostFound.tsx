import React, { useState } from "react";
import {
  Search,
  PlusCircle,
  Sparkles,
  MapPin,
  Clock,
  Phone,
  Tag,
  X,
  CheckCircle2,
  AlertCircle,
  Filter,
  Eye,
} from "lucide-react";

interface Item {
  id: string;
  type: "LOST" | "FOUND";
  title: string;
  category: "Pets" | "Keys" | "Electronics" | "Wallets" | "Other";
  location: string;
  date: string;
  description: string;
  contactName: string;
  contactPhone: string;
  imageUrl?: string;
  matchScore?: number;
  matchItemTitle?: string;
}

const initialItems: Item[] = [
  {
    id: "LF-101",
    type: "LOST",
    title: "Golden Retriever Puppy ('Barnaby')",
    category: "Pets",
    location: "Greenwood Heights North Lawn",
    date: "Jul 24, 2026",
    description: "8-month-old Golden Retriever puppy with blue collar and tag. Very friendly!",
    contactName: "Alex Johnson",
    contactPhone: "+1 (555) 234-5678",
    imageUrl:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80",
    matchScore: 98,
    matchItemTitle: "Found: Golden Retriever with Blue Collar",
  },
  {
    id: "LF-102",
    type: "FOUND",
    title: "Golden Retriever with Blue Collar",
    category: "Pets",
    location: "Near 14th Ave Park Bench",
    date: "Jul 24, 2026",
    description: "Found sitting patiently on lawn bench. Wearing a light blue collar.",
    contactName: "David Miller",
    contactPhone: "+1 (555) 987-6543",
    imageUrl:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "LF-103",
    type: "FOUND",
    title: "Silver Keychain & Car Fob",
    category: "Keys",
    location: "North Playground Bench",
    date: "Jul 23, 2026",
    description: "Found set of 3 keys with silver Honda car remote.",
    contactName: "Sarah Jenkins",
    contactPhone: "+1 (555) 456-7890",
  },
  {
    id: "LF-104",
    type: "LOST",
    title: "Black Leather Wallet & ID",
    category: "Wallets",
    location: "Greenwood Park Jogging Track",
    date: "Jul 22, 2026",
    description: "Lost black bi-fold wallet containing driver license and transit pass.",
    contactName: "Marcus Vance",
    contactPhone: "+1 (555) 321-6549",
  },
];

function LostFound() {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [typeFilter, setTypeFilter] = useState<"ALL" | "LOST" | "FOUND">("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);

  // New Item Form State
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<"LOST" | "FOUND">("LOST");
  const [newCategory, setNewCategory] = useState<Item["category"]>("Pets");
  const [newLocation, setNewLocation] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPhone, setNewPhone] = useState("");

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newLocation) return;

    const created: Item = {
      id: `LF-${Date.now().toString().slice(-4)}`,
      type: newType,
      title: newTitle,
      category: newCategory,
      location: newLocation,
      date: "Just now",
      description: newDescription,
      contactName: "Alex Johnson",
      contactPhone: newPhone || "+1 (555) 000-1122",
    };

    setItems([created, ...items]);
    setShowUploadModal(false);
    setNewTitle("");
    setNewLocation("");
    setNewDescription("");
  };

  const filteredItems = items.filter((item) => {
    const matchesType = typeFilter === "ALL" || item.type === typeFilter;
    const matchesCat = categoryFilter === "All" || item.category === categoryFilter;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesCat && matchesSearch;
  });

  const aiMatchPair = items.find((i) => i.matchScore && i.matchScore > 90);

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] p-6 max-w-7xl mx-auto space-y-8">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0b1c30] tracking-tight">Lost &amp; Found AI</h1>
          <p className="text-sm text-[#434655] mt-1">
            Report lost items or post found belongings. Computer vision auto-matches photos.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-[#004ac6] hover:bg-[#2563eb] text-white px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95 shrink-0"
        >
          <PlusCircle className="w-5 h-5" />
          Report Lost or Found Item
        </button>
      </div>

      {/* ── AI Match Suggestion Banner ──────────────────────────────────── */}
      {aiMatchPair && (
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-[#3e3fcc] text-white rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-bold text-purple-200">
              <Sparkles className="w-4 h-4 text-purple-300 animate-pulse" />
              AI Match Alert · {aiMatchPair.matchScore}% Visual Similarity
            </div>
            <h3 className="text-xl font-extrabold">High Match Found!</h3>
            <p className="text-xs text-purple-100/90 leading-relaxed max-w-xl">
              Your lost item "<span className="font-bold underline">{aiMatchPair.title}</span>" matches a recent post: "
              <span className="font-bold underline">{aiMatchPair.matchItemTitle}</span>".
            </p>
          </div>

          <button
            onClick={() => setSelectedItem(aiMatchPair)}
            className="relative z-10 px-6 py-3 bg-white text-[#3e3fcc] rounded-2xl font-bold text-xs sm:text-sm shadow-lg hover:bg-purple-50 transition-all active:scale-95 shrink-0"
          >
            Review Match
          </button>
        </div>
      )}

      {/* ── Search & Filter Controls ────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#c3c6d7]/40 shadow-sm">
        {/* Type Toggle */}
        <div className="flex items-center p-1 bg-[#e5eeff] rounded-xl text-xs font-bold w-full md:w-auto">
          {(["ALL", "LOST", "FOUND"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-lg transition-all ${
                typeFilter === type
                  ? "bg-[#004ac6] text-white shadow-sm"
                  : "text-[#434655] hover:text-[#0b1c30]"
              }`}
            >
              {type === "ALL" ? "All Items" : type === "LOST" ? "Lost Items" : "Found Items"}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737686]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items, keys, pets..."
            className="w-full pl-10 pr-4 py-2 bg-[#e5eeff] border-none rounded-xl text-xs text-[#0b1c30] placeholder:text-[#737686] focus:ring-2 focus:ring-[#004ac6]/20 transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar w-full md:w-auto">
          {["All", "Pets", "Keys", "Electronics", "Wallets", "Other"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                categoryFilter === cat
                  ? "bg-[#004ac6] text-white shadow-sm"
                  : "bg-[#e5eeff] text-[#434655] hover:bg-[#d3e4fe]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Item Grid ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="bg-white rounded-2xl border border-[#c3c6d7]/40 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              {/* Media preview */}
              <div className="h-44 bg-[#e5eeff] relative overflow-hidden flex items-center justify-center border-b border-[#c3c6d7]/30">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="text-center p-4">
                    <Tag className="w-12 h-12 text-[#004ac6]/30 mx-auto mb-1" />
                    <span className="text-xs text-[#434655] font-semibold">{item.category}</span>
                  </div>
                )}

                {/* Status Badge */}
                <span
                  className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm ${
                    item.type === "LOST" ? "bg-red-500 text-white" : "bg-emerald-500 text-white"
                  }`}
                >
                  {item.type}
                </span>
              </div>

              {/* Card Details */}
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#004ac6] bg-[#004ac6]/10 px-2.5 py-0.5 rounded-full">
                    {item.category}
                  </span>
                  <span className="text-[11px] text-[#434655] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.date}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#0b1c30] group-hover:text-[#004ac6] transition-colors leading-tight">
                  {item.title}
                </h3>

                <p className="text-xs text-[#434655] line-clamp-2 leading-relaxed">{item.description}</p>

                <div className="flex items-center gap-1.5 text-xs text-[#434655] font-medium pt-1">
                  <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span className="truncate">{item.location}</span>
                </div>
              </div>
            </div>

            <div className="px-5 pb-5 pt-2 border-t border-[#c3c6d7]/20 flex items-center justify-between text-xs">
              <span className="font-semibold text-[#0b1c30]">{item.contactName}</span>
              <span className="text-[#004ac6] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                View &amp; Contact &rarr;
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Item Detail Modal ───────────────────────────────────────────── */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg space-y-6 shadow-2xl border border-[#c3c6d7]/50 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center border-b border-[#c3c6d7]/30 pb-3">
              <div>
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    selectedItem.type === "LOST" ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {selectedItem.type} ITEM
                </span>
                <h3 className="text-xl font-bold text-[#0b1c30] mt-1">{selectedItem.title}</h3>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-[#434655]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedItem.imageUrl && (
              <div className="h-56 rounded-2xl overflow-hidden bg-slate-100">
                <img src={selectedItem.imageUrl} alt={selectedItem.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#f8f9ff] rounded-xl border border-[#c3c6d7]/30">
                  <p className="text-[#434655] font-medium">Category</p>
                  <p className="font-bold text-[#0b1c30] mt-0.5">{selectedItem.category}</p>
                </div>
                <div className="p-3 bg-[#f8f9ff] rounded-xl border border-[#c3c6d7]/30">
                  <p className="text-[#434655] font-medium">Date Reported</p>
                  <p className="font-bold text-[#0b1c30] mt-0.5">{selectedItem.date}</p>
                </div>
              </div>

              <div className="p-3 bg-[#f8f9ff] rounded-xl border border-[#c3c6d7]/30">
                <p className="text-[#434655] font-medium">Location</p>
                <p className="font-bold text-[#0b1c30] mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-red-500" />
                  {selectedItem.location}
                </p>
              </div>

              <div>
                <p className="font-bold text-[#0b1c30] mb-1">Description</p>
                <p className="text-[#434655] leading-relaxed">{selectedItem.description}</p>
              </div>

              <div className="p-4 bg-[#e5eeff] rounded-2xl border border-[#004ac6]/20 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-[#004ac6] uppercase">Contact Person</p>
                  <p className="text-sm font-bold text-[#0b1c30]">{selectedItem.contactName}</p>
                </div>
                <a
                  href={`tel:${selectedItem.contactPhone}`}
                  className="px-4 py-2 bg-[#004ac6] text-white font-bold rounded-xl flex items-center gap-2 hover:bg-[#2563eb]"
                >
                  <Phone className="w-4 h-4" />
                  Call Contact
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Report Modal ────────────────────────────────────────────────── */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg space-y-5 shadow-2xl border border-[#c3c6d7]/50">
            <div className="flex justify-between items-center border-b border-[#c3c6d7]/30 pb-3">
              <h3 className="text-lg font-bold text-[#0b1c30]">Report Lost or Found Item</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-[#434655]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#0b1c30] mb-1 block">Report Type</label>
                  <select
                    value={newType}
                    onChange={(e: any) => setNewType(e.target.value)}
                    className="w-full p-3 bg-[#f8f9ff] border border-[#c3c6d7] rounded-xl text-xs font-semibold text-[#0b1c30]"
                  >
                    <option value="LOST">Lost Item</option>
                    <option value="FOUND">Found Item</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#0b1c30] mb-1 block">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e: any) => setNewCategory(e.target.value)}
                    className="w-full p-3 bg-[#f8f9ff] border border-[#c3c6d7] rounded-xl text-xs font-semibold text-[#0b1c30]"
                  >
                    <option value="Pets">Pets</option>
                    <option value="Keys">Keys</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Wallets">Wallets</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#0b1c30] mb-1 block">Item Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Black Leather Wallet or Golden Retriever"
                  className="w-full p-3 bg-[#f8f9ff] border border-[#c3c6d7] rounded-xl text-xs text-[#0b1c30]"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-[#0b1c30] mb-1 block">Location</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="Street address or park landmark"
                  className="w-full p-3 bg-[#f8f9ff] border border-[#c3c6d7] rounded-xl text-xs text-[#0b1c30]"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-[#0b1c30] mb-1 block">Contact Phone Number</label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full p-3 bg-[#f8f9ff] border border-[#c3c6d7] rounded-xl text-xs text-[#0b1c30]"
                />
              </div>

              <div>
                <label className="font-bold text-[#0b1c30] mb-1 block">Description</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={3}
                  placeholder="Provide distinguishing features, colors, collar tags..."
                  className="w-full p-3 bg-[#f8f9ff] border border-[#c3c6d7] rounded-xl text-xs text-[#0b1c30]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#c3c6d7] font-semibold text-[#434655] hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#004ac6] text-white font-bold hover:bg-[#2563eb] shadow-md"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default LostFound;
