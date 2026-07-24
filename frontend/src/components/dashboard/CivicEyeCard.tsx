import { useNavigate } from "react-router-dom";

/**
 * CivicEyeCard — featured bento card for the CivicEye AI module.
 * Spans 8 of 12 columns on desktop, full width on mobile.
 */
function CivicEyeCard() {
  const navigate = useNavigate();

  return (
    <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl p-8 shadow-sm border border-[#c3c6d7]/50 flex flex-col md:flex-row gap-8 items-center relative overflow-hidden group hover:shadow-md transition-all">
      {/* Background icon watermark */}
      <div className="absolute top-0 right-0 p-8 pointer-events-none opacity-[0.06]">
        <span className="material-symbols-outlined text-[120px] text-[#004ac6]">
          psychology
        </span>
      </div>

      {/* Left — content */}
      <div className="flex-1 space-y-5 relative z-10">
        {/* Badges */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="px-3 py-1 bg-[#004ac6] text-white rounded-full text-[10px] font-bold tracking-wider uppercase">
            CivicEye AI
          </span>
          <div className="flex items-center gap-1.5 text-[#006c49] text-sm font-semibold">
            <span className="material-symbols-outlined text-[16px]">trending_up</span>
            Community Health: 92/100
          </div>
        </div>

        <h3 className="text-[28px] md:text-[32px] font-bold text-[#0b1c30] leading-tight">
          Detect &amp; Fix Neighborhood&nbsp;Issues instantly with AI.
        </h3>
        <p className="text-base text-[#434655] leading-relaxed max-w-lg">
          CivicEye uses real-time computer vision to prioritize community
          repairs. Upload a photo to start.
        </p>

        {/* Action buttons */}
        <div className="flex gap-3 pt-2 flex-wrap">
          <button
            id="civic-eye-upload-btn"
            onClick={() => navigate("/civic-eye")}
            className="bg-[#004ac6] text-white px-6 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 hover:shadow-lg hover:bg-[#2563eb] transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">upload</span>
            Upload Image
          </button>
          <button
            id="civic-eye-nearby-btn"
            onClick={() => navigate("/civic-eye")}
            className="bg-[#e5eeff] text-[#434655] px-6 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-[#dce9ff] transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">map</span>
            View Nearby
          </button>
        </div>
      </div>

      {/* Right — AI preview image with shimmer */}
      <div className="w-full md:w-60 h-60 rounded-2xl relative overflow-hidden shadow-inner bg-[#e5eeff] flex-shrink-0">
        {/* Gradient placeholder mimicking the street scan image */}
        <div className="w-full h-full bg-gradient-to-br from-[#dce9ff] via-[#e5eeff] to-[#c0c1ff] flex items-center justify-center">
          <span
            className="material-symbols-outlined text-[80px] text-[#004ac6]/20"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            location_city
          </span>
        </div>

        {/* AI shimmer overlay */}
        <div className="absolute inset-0 ai-shimmer opacity-40 pointer-events-none" />

        {/* Scanning status badge */}
        <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-[#004ac6]/15">
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="material-symbols-outlined text-[#004ac6] text-[16px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified
            </span>
            <span className="text-[10px] font-bold text-[#0b1c30] uppercase tracking-wide">
              AI Scanning Active
            </span>
          </div>
          <div className="h-1 w-full bg-[#e5eeff] rounded-full overflow-hidden">
            <div className="h-full bg-[#004ac6] w-[75%] rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CivicEyeCard;
