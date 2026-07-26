import { useNavigate } from "react-router-dom";

/** Static job listings — replace with API when backend is ready. */
const jobs = [
  {
    id: "1",
    title: "Dog Walker Needed",
    meta: "2 blocks away · ₹500/hr",
  },
  {
    id: "2",
    title: "Garden Help",
    meta: "0.5 mi · Flexible hours",
  },
];

/**
 * LocalJobsCard — quick preview of nearby job listings.
 * Routes to /jobs.
 */
function LocalJobsCard() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#eff4ff] rounded-2xl p-5 space-y-4 border border-[#c3c6d7]/30 hover:shadow-md transition-all">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#006c49]">
          <span className="material-symbols-outlined text-[20px]">work</span>
          <h4 className="text-[15px] font-semibold">Local Jobs</h4>
        </div>
        <button
          id="jobs-arrow-btn"
          onClick={() => navigate("/jobs")}
          className="text-[#434655] hover:text-[#0b1c30] transition-colors"
          aria-label="View all jobs"
        >
          <span className="material-symbols-outlined text-[18px]">
            arrow_forward_ios
          </span>
        </button>
      </div>

      {/* Job list */}
      <div className="space-y-2">
        {jobs.map((job) => (
          <button
            key={job.id}
            id={`job-item-${job.id}`}
            onClick={() => navigate("/jobs")}
            className="w-full p-3 bg-white rounded-xl border border-[#c3c6d7]/20 hover:border-[#006c49]/30 transition-all text-left group"
          >
            <p className="text-[14px] font-semibold text-[#0b1c30] group-hover:text-[#006c49] transition-colors">
              {job.title}
            </p>
            <p className="text-[11px] text-[#434655] mt-0.5">{job.meta}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

export default LocalJobsCard;
