/**
 * RecommendedCard — AI-personalized event recommendation card.
 * Tertiary container colour with RSVP CTA (placeholder — no backend call).
 * Spans 4 of 12 columns on desktop.
 */
function RecommendedCard() {
  return (
    <div className="col-span-12 lg:col-span-4 bg-[#585be6] text-white rounded-2xl p-7 shadow-sm flex flex-col justify-between overflow-hidden relative">
      {/* Decorative blur blob */}
      <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-4">
        <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">
          Recommended For You
        </p>
        <h3 className="text-[22px] font-bold leading-tight">
          Summer Park Yoga
        </h3>
        <p className="text-[13px] leading-relaxed opacity-90">
          Based on your interest in "Wellness" and "Weekend Mornings", we
          thought you'd love the Saturday meetup at Greenwood Park.
        </p>

        {/* Event card */}
        <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl border border-white/10">
          <div className="w-12 h-12 bg-white text-[#585be6] rounded-lg flex items-center justify-center font-bold text-xs text-center leading-tight flex-shrink-0">
            JUN
            <br />
            15
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-semibold">Greenwood Park</p>
            <p className="text-[11px] opacity-80">8:00 AM · 42 attending</p>
          </div>
        </div>
      </div>

      {/* RSVP button */}
      <button
        id="rsvp-yoga-btn"
        className="mt-6 w-full bg-white text-[#585be6] py-3 rounded-xl text-sm font-bold hover:bg-white/90 transition-all relative z-10 active:scale-95"
      >
        RSVP Now
      </button>
    </div>
  );
}

export default RecommendedCard;
