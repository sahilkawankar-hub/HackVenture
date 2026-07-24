import { useNavigate } from "react-router-dom";

/** Static marketplace items — placeholder until API is connected. */
const items = [
  {
    id: "1",
    name: "Coffee Table",
    price: "$45",
    color: "from-amber-100 to-orange-100",
    icon: "table_restaurant",
  },
  {
    id: "2",
    name: "Hybrid Bike",
    price: "$210",
    color: "from-slate-100 to-blue-100",
    icon: "directions_bike",
  },
  {
    id: "3",
    name: "Bookshelf",
    price: "$30",
    color: "from-emerald-100 to-teal-100",
    icon: "bookmarks",
  },
];

/**
 * MarketplacePreviewCard — horizontal scroll strip of local items.
 * Routes to /marketplace.
 */
function MarketplacePreviewCard() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#eff4ff] rounded-2xl p-5 space-y-4 border border-[#c3c6d7]/30 hover:shadow-md transition-all">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#004ac6] text-[20px]">
            shopping_bag
          </span>
          <h4 className="text-[15px] font-semibold text-[#0b1c30]">Marketplace</h4>
        </div>
        <span className="px-2.5 py-0.5 bg-[#004ac6]/10 text-[#004ac6] rounded-full text-[9px] font-bold uppercase">
          8 New
        </span>
      </div>

      {/* Horizontal scroll items */}
      <div className="flex gap-3 overflow-x-auto pb-1 custom-scrollbar">
        {items.map((item) => (
          <button
            key={item.id}
            id={`marketplace-item-${item.id}`}
            onClick={() => navigate("/marketplace")}
            className="flex-shrink-0 w-28 space-y-2 text-left group"
          >
            <div
              className={`w-28 h-28 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center border border-[#c3c6d7]/20 group-hover:shadow-md transition-all`}
            >
              <span className="material-symbols-outlined text-[36px] text-[#434655]/50">
                {item.icon}
              </span>
            </div>
            <p className="text-[11px] font-bold text-[#0b1c30] truncate">
              {item.price} · {item.name}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

export default MarketplacePreviewCard;
