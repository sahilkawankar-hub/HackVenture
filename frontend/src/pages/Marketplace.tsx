import React, { useState } from "react";
import {
  ShoppingBag,
  Search,
  PlusCircle,
  MapPin,
  Tag,
  Star,
  Bookmark,
  X,
  Phone,
  MessageCircle,
  UserCheck,
  ChevronRight,
  Filter,
} from "lucide-react";

interface Product {
  id: string;
  title: string;
  price: number;
  category: "Furniture" | "Vehicles" | "Electronics" | "Clothing" | "Garden" | "Books";
  condition: "Like New" | "Good" | "Fair";
  distance: string;
  sellerName: string;
  sellerRating: number;
  imageUrl: string;
  description: string;
  isBookmarked?: boolean;
}

const initialProducts: Product[] = [
  {
    id: "M-101",
    title: "Vintage Mahogany Wood Coffee Table",
    price: 45,
    category: "Furniture",
    condition: "Like New",
    distance: "0.2 miles away",
    sellerName: "Alex R.",
    sellerRating: 4.9,
    imageUrl:
      "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80",
    description:
      "Solid mahogany wood coffee table with soft finish and shelf drawer. Moving out sale!",
  },
  {
    id: "M-102",
    title: "Modern Charcoal Hybrid Commuter Bike",
    price: 210,
    category: "Vehicles",
    condition: "Good",
    distance: "0.5 miles away",
    sellerName: "Carlos M.",
    sellerRating: 4.8,
    imageUrl:
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80",
    description:
      "Lightweight aluminum frame, 21-speed Shimano gears, newly tuned brakes.",
  },
  {
    id: "M-103",
    title: "4K UHD Smart Monitor 27-inch",
    price: 180,
    category: "Electronics",
    condition: "Like New",
    distance: "0.8 miles away",
    sellerName: "Jessica T.",
    sellerRating: 5.0,
    imageUrl:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
    description:
      "Ultra HD IPS panel with USB-C hub built-in. Comes with original stand and box.",
  },
  {
    id: "M-104",
    title: "Teak Patio Lounge Chair & Cushion",
    price: 65,
    category: "Garden",
    condition: "Good",
    distance: "0.4 miles away",
    sellerName: "Elena R.",
    sellerRating: 4.7,
    imageUrl:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
    description: "Weather-resistant teak wood patio chair with washable outdoor cushion.",
  },
];

function Marketplace() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<number>(500);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // Form State
  const [newTitle, setNewTitle] = useState("");
  const [newPrice, setNewPrice] = useState<number>(0);
  const [newCategory, setNewCategory] = useState<Product["category"]>("Furniture");
  const [newCondition, setNewCondition] = useState<Product["condition"]>("Like New");
  const [newDescription, setNewDescription] = useState("");

  const handleBookmarkToggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isBookmarked: !p.isBookmarked } : p))
    );
  };

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || newPrice <= 0) return;

    const created: Product = {
      id: `M-${Date.now().toString().slice(-3)}`,
      title: newTitle,
      price: newPrice,
      category: newCategory,
      condition: newCondition,
      distance: "0.1 miles away",
      sellerName: "Alex Johnson",
      sellerRating: 5.0,
      imageUrl:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
      description: newDescription,
    };

    setProducts([created, ...products]);
    setShowCreateModal(false);
    setNewTitle("");
    setNewPrice(0);
    setNewDescription("");
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = p.price <= maxPrice;
    return matchesCategory && matchesSearch && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] p-6 max-w-7xl mx-auto space-y-8">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0b1c30] tracking-tight">Neighborhood Marketplace</h1>
          <p className="text-sm text-[#434655] mt-1">
            Buy and sell secondhand goods locally within Greenwood Heights. Zero platform fees.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-[#004ac6] hover:bg-[#2563eb] text-white px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95 shrink-0"
        >
          <PlusCircle className="w-5 h-5" />
          Create Listing
        </button>
      </div>

      {/* ── Search & Filters Bar ────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#c3c6d7]/40 shadow-sm">
        {/* Search Input */}
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737686]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tables, bikes, monitors..."
            className="w-full pl-10 pr-4 py-2 bg-[#e5eeff] border-none rounded-xl text-xs text-[#0b1c30] placeholder:text-[#737686] focus:ring-2 focus:ring-[#004ac6]/20 transition-all"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar w-full lg:w-auto">
          {["All", "Furniture", "Vehicles", "Electronics", "Clothing", "Garden", "Books"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? "bg-[#004ac6] text-white shadow-sm"
                  : "bg-[#e5eeff] text-[#434655] hover:bg-[#d3e4fe]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Max Price Slider */}
        <div className="flex items-center gap-3 text-xs w-full lg:w-auto bg-[#f8f9ff] px-3 py-1.5 rounded-xl border border-[#c3c6d7]/30">
          <span className="font-semibold text-[#434655]">Max Price:</span>
          <input
            type="range"
            min="10"
            max="500"
            step="10"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-24 accent-[#004ac6]"
          />
          <span className="font-bold text-[#004ac6]">${maxPrice}</span>
        </div>
      </div>

      {/* ── Product Grid ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            onClick={() => setSelectedProduct(product)}
            className="bg-white rounded-2xl border border-[#c3c6d7]/40 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              {/* Media Image */}
              <div className="h-48 bg-[#e5eeff] relative overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Price tag badge */}
                <span className="absolute top-3 left-3 bg-[#004ac6] text-white font-extrabold px-3 py-1 rounded-full text-xs shadow-md">
                  ${product.price}
                </span>

                {/* Bookmark button */}
                <button
                  onClick={(e) => handleBookmarkToggle(product.id, e)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm text-[#434655] hover:text-red-500 transition-colors shadow-sm"
                >
                  <Bookmark
                    className={`w-4 h-4 ${product.isBookmarked ? "fill-red-500 text-red-500" : ""}`}
                  />
                </button>
              </div>

              {/* Card Details */}
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#004ac6] font-bold bg-[#004ac6]/10 px-2 py-0.5 rounded-full">
                    {product.category}
                  </span>
                  <span className="text-[#434655] font-semibold">{product.condition}</span>
                </div>

                <h3 className="text-sm font-bold text-[#0b1c30] group-hover:text-[#004ac6] transition-colors line-clamp-1">
                  {product.title}
                </h3>

                <p className="text-xs text-[#434655] line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Seller & Distance Footer */}
            <div className="px-4 pb-4 pt-2 border-t border-[#c3c6d7]/20 flex items-center justify-between text-xs text-[#434655]">
              <div className="flex items-center gap-1 font-semibold">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>{product.sellerRating}</span>
                <span className="text-[#0b1c30] ml-1">{product.sellerName}</span>
              </div>
              <span className="text-[11px] font-medium text-[#434655]">{product.distance}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Product Details Modal ───────────────────────────────────────── */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg space-y-5 shadow-2xl border border-[#c3c6d7]/50 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center border-b border-[#c3c6d7]/30 pb-3">
              <div>
                <span className="text-xs font-bold text-[#004ac6] bg-[#004ac6]/10 px-2.5 py-0.5 rounded-full">
                  {selectedProduct.category}
                </span>
                <h3 className="text-xl font-bold text-[#0b1c30] mt-1">{selectedProduct.title}</h3>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-[#434655]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="h-60 rounded-2xl overflow-hidden bg-slate-100 relative">
              <img src={selectedProduct.imageUrl} alt={selectedProduct.title} className="w-full h-full object-cover" />
              <span className="absolute bottom-3 left-3 bg-[#004ac6] text-white text-lg font-black px-4 py-1 rounded-full shadow-lg">
                ${selectedProduct.price}
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#f8f9ff] rounded-xl border border-[#c3c6d7]/30">
                  <p className="text-[#434655] font-medium">Condition</p>
                  <p className="font-bold text-[#0b1c30] mt-0.5">{selectedProduct.condition}</p>
                </div>
                <div className="p-3 bg-[#f8f9ff] rounded-xl border border-[#c3c6d7]/30">
                  <p className="text-[#434655] font-medium">Proximity</p>
                  <p className="font-bold text-[#0b1c30] mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                    {selectedProduct.distance}
                  </p>
                </div>
              </div>

              <div>
                <p className="font-bold text-[#0b1c30] mb-1">Item Description</p>
                <p className="text-[#434655] leading-relaxed">{selectedProduct.description}</p>
              </div>

              {/* Seller Profile Box */}
              <div className="p-4 bg-[#e5eeff] rounded-2xl border border-[#004ac6]/20 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-[#004ac6] uppercase">Verified Seller</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-bold text-[#0b1c30] text-sm">{selectedProduct.sellerName}</span>
                    <span className="flex items-center text-xs text-amber-600 font-bold">
                      ★ {selectedProduct.sellerRating}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => alert(`Contact request sent to ${selectedProduct.sellerName}!`)}
                  className="px-4 py-2 bg-[#004ac6] text-white font-bold rounded-xl flex items-center gap-2 hover:bg-[#2563eb]"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat with Seller
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Create Listing Modal ────────────────────────────────────────── */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg space-y-5 shadow-2xl border border-[#c3c6d7]/50">
            <div className="flex justify-between items-center border-b border-[#c3c6d7]/30 pb-3">
              <h3 className="text-lg font-bold text-[#0b1c30]">Sell an Item</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-[#434655]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateListing} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#0b1c30] mb-1 block">Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Teak Outdoor Dining Table"
                  className="w-full p-3 bg-[#f8f9ff] border border-[#c3c6d7] rounded-xl text-xs text-[#0b1c30]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#0b1c30] mb-1 block">Price ($)</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    placeholder="45"
                    className="w-full p-3 bg-[#f8f9ff] border border-[#c3c6d7] rounded-xl text-xs text-[#0b1c30]"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-[#0b1c30] mb-1 block">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e: any) => setNewCategory(e.target.value)}
                    className="w-full p-3 bg-[#f8f9ff] border border-[#c3c6d7] rounded-xl text-xs font-semibold text-[#0b1c30]"
                  >
                    <option value="Furniture">Furniture</option>
                    <option value="Vehicles">Vehicles</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Garden">Garden</option>
                    <option value="Books">Books</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#0b1c30] mb-1 block">Condition</label>
                <select
                  value={newCondition}
                  onChange={(e: any) => setNewCondition(e.target.value)}
                  className="w-full p-3 bg-[#f8f9ff] border border-[#c3c6d7] rounded-xl text-xs font-semibold text-[#0b1c30]"
                >
                  <option value="Like New">Like New</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-[#0b1c30] mb-1 block">Description</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={3}
                  placeholder="Describe dimensions, pickup spot, reason for selling..."
                  className="w-full p-3 bg-[#f8f9ff] border border-[#c3c6d7] rounded-xl text-xs text-[#0b1c30]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#c3c6d7] font-semibold text-[#434655] hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#004ac6] text-white font-bold hover:bg-[#2563eb] shadow-md"
                >
                  Post Marketplace Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Marketplace;
