import WelcomeHero from "../components/dashboard/WelcomeHero";
import StatsGrid from "../components/dashboard/StatsGrid";
import QuickActions from "../components/dashboard/QuickActions";
import CivicEyeCard from "../components/dashboard/CivicEyeCard";
import IssueMapCard from "../components/dashboard/IssueMapCard";
import CommunityFeedCard from "../components/dashboard/CommunityFeedCard";
import MarketplacePreviewCard from "../components/dashboard/MarketplacePreviewCard";
import AiMatchesCard from "../components/dashboard/AiMatchesCard";
import LocalJobsCard from "../components/dashboard/LocalJobsCard";
import AIInsightsCard from "../components/dashboard/AIInsightsCard";

/**
 * Home / Dashboard page — CiviLink AI Premium Design.
 *
 * Layout:
 *   Row 1  : WelcomeHero (greeting, weather, health score)
 *   Row 2  : StatsGrid (4 stat cards)
 *   Row 3  : QuickActions (6 action cards)
 *   Row 4  : CivicEyeCard (8 col) | AIInsightsCard (4 col)
 *   Row 5  : IssueMapCard (8 col) | CommunityFeedCard (4 col)
 *   Row 6  : Marketplace | AI Matches | Local Jobs (4 col each)
 */
function Home() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base)" }}>
      <div className="p-7 max-w-[1280px] mx-auto space-y-7">

        {/* ── Row 1: Welcome Hero ───────────────────────────────────────── */}
        <WelcomeHero />

        {/* ── Bento Grid ───────────────────────────────────────────────── */}
        <div className="bento-grid">

          {/* Row 2: Stats ──────────────────────────────────────────────── */}
          <StatsGrid />

          {/* Row 3: Quick Actions ───────────────────────────────────────── */}
          <QuickActions />

          {/* Row 4: CivicEye + AI Insights ─────────────────────────────── */}
          <CivicEyeCard />
          <AIInsightsCard />

          {/* Row 5: Map + Community Feed ────────────────────────────────── */}
          <IssueMapCard />
          <CommunityFeedCard />

          {/* Row 6: Quick Previews ──────────────────────────────────────── */}
          <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-5">
            <MarketplacePreviewCard />
            <AiMatchesCard />
            <LocalJobsCard />
          </div>

        </div>

        {/* Bottom spacer */}
        <div className="h-6" />
      </div>
    </div>
  );
}

export default Home;
