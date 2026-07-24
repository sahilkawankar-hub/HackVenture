import WelcomeHero from "../components/dashboard/WelcomeHero";
import CivicEyeCard from "../components/dashboard/CivicEyeCard";
import RecommendedCard from "../components/dashboard/RecommendedCard";
import IssueMapCard from "../components/dashboard/IssueMapCard";
import CommunityFeedCard from "../components/dashboard/CommunityFeedCard";
import MarketplacePreviewCard from "../components/dashboard/MarketplacePreviewCard";
import AiMatchesCard from "../components/dashboard/AiMatchesCard";
import LocalJobsCard from "../components/dashboard/LocalJobsCard";
import AiToast from "../components/dashboard/AiToast";

/**
 * Home / Dashboard page — CiviLink AI Stitch design.
 *
 * Layout (12-column bento grid):
 *   Row 1  : WelcomeHero (full width)
 *   Row 2  : CivicEyeCard (8 col) | RecommendedCard (4 col)
 *   Row 3  : IssueMapCard (8 col) | CommunityFeedCard (4 col)
 *   Row 4  : Quick previews — Marketplace | AI Matches | Local Jobs (3-col each)
 */
function Home() {
  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      <div className="p-8 max-w-7xl mx-auto space-y-8">

        {/* ── Row 1: Welcome ─────────────────────────────────────────────── */}
        <WelcomeHero />

        {/* ── Rows 2 & 3: Bento Grid ─────────────────────────────────────── */}
        <div className="bento-grid">

          {/* Row 2 */}
          <CivicEyeCard />
          <RecommendedCard />

          {/* Row 3 */}
          <IssueMapCard />
          <CommunityFeedCard />

          {/* ── Row 4: Quick previews ─────────────────────────────────────── */}
          <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <MarketplacePreviewCard />
            <AiMatchesCard />
            <LocalJobsCard />
          </div>

        </div>

        {/* Bottom spacer */}
        <div className="h-8" />
      </div>

      {/* ── Floating AI Toast ─────────────────────────────────────────────── */}
      <AiToast />
    </div>
  );
}

export default Home;
