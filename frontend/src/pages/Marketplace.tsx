import React, { useState, useEffect } from "react";
import {
  Search, PlusCircle, Star, Bookmark, X, MessageCircle, ShoppingBag
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { MarketplaceListing } from "../types";
import { getListings, createListing, wishlistListing } from "../api/marketplace";
import { EmptyState } from "../components/common/EmptyState";

const DEMO_PRODUCTS: MarketplaceListing[] = [
  {
    id: "M-101",
    seller_id: "u-1",
    community_id: "c1",
    title: "Vintage Mahogany Wood Coffee Table",
    description: "Solid mahogany wood coffee table with soft finish and shelf drawer. Moving out sale!",
    price: 3500,
    currency: "INR",
    category: "Furniture",
    condition: "like_new",
    image_urls: ["https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80"],
    status: "active",
    views_count: 142,
    is_wishlisted: false,
    created_at: new Date(Date.now() - 36000000).toISOString(),
    updated_at: new Date().toISOString(),
    seller: { display_name: "Alex R.", reputation_score: 4.9 },
  },
  {
    id: "M-102",
    seller_id: "u-2",
    community_id: "c1",
    title: "Modern Charcoal Hybrid Commuter Bike",
    description: "Lightweight aluminum frame, 21-speed Shimano gears, newly tuned brakes.",
    price: 15000,
    currency: "INR",
    category: "Vehicles",
    condition: "good",
    image_urls: ["https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80"],
    status: "active",
    views_count: 89,
    is_wishlisted: true,
    created_at: new Date(Date.now() - 72000000).toISOString(),
    updated_at: new Date().toISOString(),
    seller: { display_name: "Carlos M.", reputation_score: 4.8 },
  },
  {
    id: "M-103",
    seller_id: "u-3",
    community_id: "c1",
    title: "4K UHD Smart Monitor 27-inch",
    description: "Ultra HD IPS panel with USB-C hub built-in. Comes with original stand and box.",
    price: 14000,
    currency: "INR",
    category: "Electronics",
    condition: "like_new",
    image_urls: ["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80"],
    status: "active",
    views_count: 210,
    is_wishlisted: false,
    created_at: new Date(Date.now() - 108000000).toISOString(),
    updated_at: new Date().toISOString(),
    seller: { display_name: "Jessica T.", reputation_score: 5.0 },
  },
];

const CATEGORIES = ["All", "Furniture", "Vehicles", "Electronics", "Garden", "Clothing", "Books"];

function Marketplace() {
  const { user } = useAuth();
  const [products, setProducts] = useState<MarketplaceListing[]>(DEMO_PRODUCTS);
  const [category, setCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [cat, setCat] = useState("Furniture");
  const [condition] = useState<"new" | "like_new" | "good" | "fair">("like_new");
  const [description, setDescription] = useState("");

  useEffect(() => {
    getListings()
      .then((res) => {
        if (res.items && res.items.length > 0) setProducts(res.items);
      })
      .catch(() => {});
  }, []);

  const handleToggleBookmark = async (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_wishlisted: !p.is_wishlisted } : p))
    );
    try {
      await wishlistListing(id);
    } catch {}
  };

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price) return;

    const newProd: MarketplaceListing = {
      id: `M-${Date.now()}`,
      seller_id: user?.id || "demo-user",
      community_id: "c1",
      title,
      description,
      price: parseFloat(price),
      currency: "INR",
      category: cat,
      condition,
      image_urls: ["https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80"],
      status: "active",
      views_count: 1,
      is_wishlisted: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      seller: { display_name: user?.user_metadata?.full_name || "You", reputation_score: 5.0 },
    };

    setProducts([newProd, ...products]);
    setShowCreateModal(false);
    setTitle("");
    setPrice("");
    setDescription("");

    try {
      await createListing({
        community_id: "c1",
        title,
        description,
        price: parseFloat(price),
        category: cat,
        condition,
      });
    } catch {}
  };

  const filteredProducts = products.filter((p) => {
    const matchesCat = category === "All" || p.category === category;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base)" }}>
      <div className="p-7 max-w-6xl mx-auto space-y-6">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>
              Hyperlocal Marketplace
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
              Buy, sell, and trade with verified neighbors in Greenwood Heights.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold text-white transition-all shadow-md active:scale-95 shrink-0"
            style={{
              background: "linear-gradient(135deg, #059669, #10b981)",
              boxShadow: "0 4px 16px rgba(16,185,129,0.3)",
            }}
          >
            <PlusCircle className="w-5 h-5" />
            List an Item
          </button>
        </div>

        {/* ── Search & Filter Bar ────────────────────────────────────────── */}
        <div className="card p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items for sale..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs outline-none"
              style={{
                background: "var(--bg-input)",
                border: "1px solid var(--border-color)",
                color: "var(--text-primary)",
              }}
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  category === c
                    ? "bg-[#10b981] text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-[#475569] dark:text-slate-400 hover:text-[#10b981]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* ── Product Grid ──────────────────────────────────────────────── */}
        {filteredProducts.length === 0 ? (
          <EmptyState
            icon={<ShoppingBag className="w-8 h-8" />}
            title="No listings found"
            description="Be the first neighbor to list an item in this category!"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProducts.map((product) => (
              <div key={product.id} className="card overflow-hidden group hover:shadow-lg transition-all flex flex-col justify-between">
                {/* Image */}
                <div className="h-48 relative bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  {product.image_urls && product.image_urls.length > 0 ? (
                    <img src={product.image_urls[0]} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#94a3b8]">No Image</div>
                  )}
                  <button
                    onClick={() => handleToggleBookmark(product.id)}
                    className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-full text-slate-600 dark:text-slate-300 hover:text-red-500 transition-colors shadow-sm"
                  >
                    <Bookmark className={`w-4 h-4 ${product.is_wishlisted ? "fill-red-500 text-red-500" : ""}`} />
                  </button>
                  <span className="absolute bottom-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-md text-white rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {product.condition.replace("_", " ")}
                  </span>
                </div>

                {/* Details */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-extrabold text-sm line-clamp-1" style={{ color: "var(--text-primary)" }}>{product.title}</h3>
                      <span className="text-base font-black text-[#10b981]">₹{product.price.toLocaleString("en-IN")}</span>
                    </div>
                    <p className="text-xs mt-1 line-clamp-2" style={{ color: "var(--text-secondary)" }}>{product.description}</p>
                  </div>

                  <div className="pt-3 border-t flex items-center justify-between text-xs" style={{ borderColor: "var(--border-color)" }}>
                    <div className="flex items-center gap-1.5 text-[#94a3b8]">
                      <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{product.seller?.display_name || "Seller"}</span>
                      <span>·</span>
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>{product.seller?.reputation_score || 5.0}</span>
                    </div>

                    <button
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-[#10b981] font-bold hover:bg-emerald-100 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> Chat
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Create Listing Modal ───────────────────────────────────────── */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl border" style={{ borderColor: "var(--border-color)" }}>
              <div className="flex justify-between items-center border-b pb-3" style={{ borderColor: "var(--border-color)" }}>
                <h3 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>List an Item for Sale</h3>
                <button onClick={() => setShowCreateModal(false)} className="p-1 text-[#94a3b8]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateListing} className="space-y-3">
                <div>
                  <label className="text-xs font-bold block mb-1" style={{ color: "var(--text-primary)" }}>Item Title *</label>
                  <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Modern Coffee Table" className="input-base" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold block mb-1" style={{ color: "var(--text-primary)" }}>Price (₹) *</label>
                    <input type="number" required value={price} onChange={(e) => setPrice(e.target.value)} placeholder="45" className="input-base" />
                  </div>
                  <div>
                    <label className="text-xs font-bold block mb-1" style={{ color: "var(--text-primary)" }}>Category</label>
                    <select value={cat} onChange={(e) => setCat(e.target.value)} className="input-base">
                      {CATEGORIES.filter((c) => c !== "All").map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold block mb-1" style={{ color: "var(--text-primary)" }}>Description</label>
                  <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe item condition, pickup location..." className="input-base" />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 rounded-xl text-xs font-semibold border text-[#475569]" style={{ borderColor: "var(--border-color)" }}>Cancel</button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-[#10b981] text-white text-xs font-bold hover:bg-emerald-700 shadow-sm">Publish Listing</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Marketplace;
