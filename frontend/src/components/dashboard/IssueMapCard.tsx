import { useNavigate } from "react-router-dom";

/**
 * IssueMapCard — interactive map preview with floating issue card.
 * Spans 8 of 12 columns on desktop. Map is a styled placeholder.
 */
function IssueMapCard() {
  const navigate = useNavigate();

  return (
    <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl shadow-sm border border-[#c3c6d7]/50 overflow-hidden flex flex-col h-[500px] hover:shadow-md transition-all">
      {/* Header */}
      <div className="px-5 py-4 flex justify-between items-center border-b border-[#c3c6d7]/40 flex-shrink-0">
        <div>
          <h3 className="text-[16px] font-semibold text-[#0b1c30]">Issue Map</h3>
          <p className="text-[11px] text-[#434655] mt-0.5">
            Real-time reports in Greenwood Heights
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <span className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-500 rounded-full text-[10px] font-bold">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
            3 High Priority
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 bg-[#004ac6]/10 text-[#004ac6] rounded-full text-[10px] font-bold">
            <span className="w-1.5 h-1.5 bg-[#004ac6] rounded-full" />
            12 Active Fixes
          </span>
        </div>
      </div>

      {/* Map area */}
      <div className="flex-1 relative bg-[#e5eeff] overflow-hidden">
        {/* Stylised map grid backdrop */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(#c3c6d7 1px, transparent 1px), linear-gradient(90deg, #c3c6d7 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Street overlays */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <div className="w-full h-[2px] bg-white" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <div className="h-full w-[2px] bg-white" />
        </div>

        {/* Map centre label */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center opacity-20">
            <span className="material-symbols-outlined text-[64px] text-[#004ac6]">
              map
            </span>
            <p className="text-xs text-[#004ac6] font-semibold">Greenwood Heights</p>
          </div>
        </div>

        {/* Issue marker dots */}
        <div className="absolute top-16 left-1/3 w-3 h-3 bg-red-500 rounded-full shadow-md animate-pulse" />
        <div className="absolute top-28 right-1/4 w-3 h-3 bg-red-500 rounded-full shadow-md animate-pulse" />
        <div className="absolute bottom-32 left-1/2 w-3 h-3 bg-[#004ac6] rounded-full shadow-md" />
        <div className="absolute bottom-20 right-1/3 w-3 h-3 bg-[#006c49] rounded-full shadow-md" />
        <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-[#004ac6] rounded-full shadow-md" />

        {/* Floating issue card */}
        <div className="absolute top-4 left-4 bg-white p-4 rounded-xl shadow-lg border border-[#c3c6d7]/30 max-w-[220px] animate-fade-in">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-red-50 text-red-500 rounded-lg flex-shrink-0">
              <span className="material-symbols-outlined text-[18px]">water_drop</span>
            </div>
            <div>
              <p className="text-[14px] font-semibold text-[#0b1c30] leading-tight">
                Water Main Leak
              </p>
              <p className="text-[11px] text-[#434655]">Reported 20m ago</p>
            </div>
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="px-2 py-0.5 bg-red-500 text-white rounded-full text-[9px] font-bold uppercase">
              High Priority
            </span>
            <span className="text-[11px] text-[#434655]">12 Elm St.</span>
          </div>
          <button
            id="map-view-details-btn"
            onClick={() => navigate("/civic-eye")}
            className="w-full py-2 bg-[#e5eeff] text-[#0b1c30] rounded-lg text-[11px] font-bold hover:bg-[#dce9ff] transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default IssueMapCard;
