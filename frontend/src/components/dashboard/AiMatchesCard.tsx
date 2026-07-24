import { useNavigate } from "react-router-dom";

/**
 * AiMatchesCard — Lost & Found AI matching panel.
 * Shows static placeholder matches. Routes to /lost-found.
 */
function AiMatchesCard() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#eff4ff] rounded-2xl p-5 space-y-4 border border-[#c3c6d7]/30 hover:shadow-md transition-all">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#3e3fcc]">
          <span className="material-symbols-outlined text-[20px]">search_check</span>
          <h4 className="text-[15px] font-semibold">AI Matches</h4>
        </div>
        <span className="px-2.5 py-0.5 bg-[#3e3fcc]/10 text-[#3e3fcc] rounded-full text-[9px] font-bold uppercase">
          2 Matches
        </span>
      </div>

      {/* Match items */}
      <div className="space-y-2">
        {/* Match 1 — high confidence */}
        <button
          id="ai-match-dog-btn"
          onClick={() => navigate("/lost-found")}
          className="w-full flex items-center gap-3 bg-white p-2.5 rounded-xl border border-[#3e3fcc]/20 hover:border-[#3e3fcc]/50 transition-all group"
        >
          <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-amber-200 to-orange-200 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[22px] text-orange-500">
              pets
            </span>
          </div>
          <div className="flex-1 text-left overflow-hidden">
            <p className="text-[12px] font-bold text-[#0b1c30] truncate">
              Found: Golden Retriever
            </p>
            <p className="text-[10px] text-[#006c49] font-bold uppercase">
              98% Match to your 'Lost' post
            </p>
          </div>
          <span className="material-symbols-outlined text-[#3e3fcc] text-[16px] opacity-0 group-hover:opacity-100 transition-opacity">
            arrow_forward
          </span>
        </button>

        {/* Match 2 — lower confidence */}
        <button
          id="ai-match-keys-btn"
          onClick={() => navigate("/lost-found")}
          className="w-full flex items-center gap-3 bg-white p-2.5 rounded-xl border border-[#c3c6d7]/20 hover:border-[#c3c6d7]/50 opacity-70 hover:opacity-100 transition-all group"
        >
          <div className="w-11 h-11 rounded-lg bg-[#e5eeff] flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[22px] text-[#434655]">
              key
            </span>
          </div>
          <div className="flex-1 text-left overflow-hidden">
            <p className="text-[12px] font-bold text-[#0b1c30] truncate">
              Found: Silver Keychain
            </p>
            <p className="text-[10px] text-[#434655] font-bold uppercase">
              Check similarities
            </p>
          </div>
          <span className="material-symbols-outlined text-[#434655] text-[16px] opacity-0 group-hover:opacity-100 transition-opacity">
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  );
}

export default AiMatchesCard;
