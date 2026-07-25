import React, { useState, useEffect } from "react";
import { Search, PlusCircle, MapPin, X, CheckCircle, Send } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { JobPosting } from "../types";
import { getJobs, createJob, applyForJob } from "../api/jobs";

const DEMO_JOBS: JobPosting[] = [
  {
    id: "JOB-101",
    poster_id: "u-1",
    community_id: "c1",
    title: "Neighborhood Dog Walker Needed",
    description: "Looking for an energetic neighbor to walk our 2 friendly Labradors 3 times a week around Greenwood Park.",
    job_type: "freelance",
    category: "Pet Care",
    pay_range: "$25 / hr",
    location: "2 blocks away",
    requirements: ["Must love dogs", "Punctual & reliable", "Available weekday afternoons"],
    status: "open",
    application_count: 4,
    is_saved: false,
    created_at: new Date(Date.now() - 10800000).toISOString(),
    expires_at: null,
    poster: { display_name: "Sarah Jenkins" },
  },
  {
    id: "JOB-102",
    poster_id: "u-2",
    community_id: "c1",
    title: "Backyard Garden Cleanup & Lawn Mowing",
    description: "Need help clearing overgrown weeds, trimming hedges, and mowing front & back lawn this Saturday.",
    job_type: "one_time",
    category: "Gardening",
    pay_range: "$30 / hr",
    location: "0.5 miles away",
    requirements: ["Lawn mower provided", "Able to lift 20 lbs", "3 hours estimated task time"],
    status: "open",
    application_count: 2,
    is_saved: true,
    created_at: new Date(Date.now() - 18000000).toISOString(),
    expires_at: null,
    poster: { display_name: "Marcus Vance" },
  },
  {
    id: "JOB-103",
    poster_id: "u-3",
    community_id: "c1",
    title: "High School Math & Physics Tutor",
    description: "Seeking a tutor for 10th grade Algebra II and Physics. 2 sessions per week at community library.",
    job_type: "part_time",
    category: "Tutoring",
    pay_range: "$45 / hr",
    location: "0.8 miles away",
    requirements: ["STEM background or college student", "Patient teaching style", "References preferred"],
    status: "open",
    application_count: 7,
    is_saved: false,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    expires_at: null,
    poster: { display_name: "Dr. Aris Thorne" },
  },
];

const CATEGORIES = ["All", "Pet Care", "Gardening", "Tutoring", "Handyman", "Tech Support"];

function Jobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobPosting[]>(DEMO_JOBS);
  const [category, setCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [applyCover, setApplyCover] = useState("");
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [payRange, setPayRange] = useState("");
  const [cat, setCat] = useState("Pet Care");
  const [type] = useState<"full_time" | "part_time" | "freelance" | "one_time">("one_time");
  const [description, setDescription] = useState("");
  const [reqsInput, setReqsInput] = useState("");

  useEffect(() => {
    getJobs()
      .then((res) => {
        if (res.items && res.items.length > 0) setJobs(res.items);
      })
      .catch(() => {});
  }, []);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    setAppliedSuccess(true);
    setTimeout(() => {
      setAppliedSuccess(false);
      setSelectedJob(null);
      setApplyCover("");
    }, 1800);

    try {
      await applyForJob(selectedJob.id, applyCover);
    } catch {}
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    const reqs = reqsInput.split(",").map((r) => r.trim()).filter(Boolean);

    const newJob: JobPosting = {
      id: `JOB-${Date.now()}`,
      poster_id: user?.id || "demo-user",
      community_id: "c1",
      title,
      description,
      job_type: type,
      category: cat,
      pay_range: payRange,
      location: "Greenwood Heights",
      requirements: reqs,
      status: "open",
      application_count: 0,
      is_saved: false,
      created_at: new Date().toISOString(),
      expires_at: null,
      poster: { display_name: user?.user_metadata?.full_name || "You" },
    };

    setJobs([newJob, ...jobs]);
    setShowCreateModal(false);
    setTitle("");
    setPayRange("");
    setDescription("");
    setReqsInput("");

    try {
      await createJob({
        community_id: "c1",
        title,
        description,
        job_type: type,
        category: cat,
        pay_range: payRange,
        requirements: reqs,
      });
    } catch {}
  };

  const filteredJobs = jobs.filter((j) => {
    const matchesCat = category === "All" || j.category === category;
    const matchesSearch =
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base)" }}>
      <div className="p-7 max-w-6xl mx-auto space-y-6">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>
              Hyperlocal Job Board
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
              Find gigs, tutoring, gardening, and micro-jobs within your neighborhood.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold text-white transition-all shadow-md active:scale-95 shrink-0"
            style={{
              background: "linear-gradient(135deg, #d97706, #f59e0b)",
              boxShadow: "0 4px 16px rgba(245,158,11,0.3)",
            }}
          >
            <PlusCircle className="w-5 h-5" />
            Post a Job
          </button>
        </div>

        {/* ── Filter & Search ────────────────────────────────────────────── */}
        <div className="card p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search local jobs..."
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
                    ? "bg-[#f59e0b] text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-[#475569] dark:text-slate-400 hover:text-[#f59e0b]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* ── Job Grid ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredJobs.map((job) => (
            <div key={job.id} className="card p-5 space-y-4 flex flex-col justify-between hover:shadow-md transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="badge badge-amber">{job.job_type.replace("_", " ").toUpperCase()}</span>
                  <span className="text-base font-extrabold text-amber-600">{job.pay_range || "Negotiable"}</span>
                </div>

                <h3 className="font-bold text-base" style={{ color: "var(--text-primary)" }}>{job.title}</h3>
                <p className="text-xs line-clamp-2 leading-relaxed" style={{ color: "var(--text-secondary)" }}>{job.description}</p>

                {job.requirements && job.requirements.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]">Requirements:</p>
                    <ul className="text-xs space-y-0.5" style={{ color: "var(--text-secondary)" }}>
                      {job.requirements.slice(0, 2).map((r, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-amber-500" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t flex items-center justify-between text-xs" style={{ borderColor: "var(--border-color)" }}>
                <div className="flex items-center gap-1 text-[#94a3b8]">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>{job.location || "Nearby"}</span>
                </div>

                <button
                  onClick={() => setSelectedJob(job)}
                  className="px-4 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 font-bold hover:bg-amber-100 transition-colors"
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ── Apply Modal ───────────────────────────────────────────────── */}
        {selectedJob && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl border" style={{ borderColor: "var(--border-color)" }}>
              <div className="flex justify-between items-center border-b pb-3" style={{ borderColor: "var(--border-color)" }}>
                <h3 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>Apply for {selectedJob.title}</h3>
                <button onClick={() => setSelectedJob(null)} className="p-1 text-[#94a3b8]"><X className="w-5 h-5" /></button>
              </div>

              {appliedSuccess ? (
                <div className="py-8 text-center space-y-2">
                  <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
                  <p className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>Application Sent!</p>
                  <p className="text-xs text-[#94a3b8]">{selectedJob.poster?.display_name || "The employer"} will review your note.</p>
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold block mb-1" style={{ color: "var(--text-primary)" }}>Cover Note to Employer</label>
                    <textarea
                      rows={4}
                      value={applyCover}
                      onChange={(e) => setApplyCover(e.target.value)}
                      placeholder="Introduce yourself, mention your availability and relevant experience..."
                      className="input-base"
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <button type="button" onClick={() => setSelectedJob(null)} className="px-4 py-2 rounded-xl text-xs font-semibold border text-[#475569]" style={{ borderColor: "var(--border-color)" }}>Cancel</button>
                    <button type="submit" className="px-5 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 shadow-sm flex items-center gap-1.5">
                      <Send className="w-3.5 h-3.5" /> Submit Application
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ── Create Modal ───────────────────────────────────────────────── */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl border" style={{ borderColor: "var(--border-color)" }}>
              <div className="flex justify-between items-center border-b pb-3" style={{ borderColor: "var(--border-color)" }}>
                <h3 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>Post a Neighborhood Job</h3>
                <button onClick={() => setShowCreateModal(false)} className="p-1 text-[#94a3b8]"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleCreateJob} className="space-y-3">
                <div>
                  <label className="text-xs font-bold block mb-1" style={{ color: "var(--text-primary)" }}>Job Title *</label>
                  <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Dog Walker Needed" className="input-base" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold block mb-1" style={{ color: "var(--text-primary)" }}>Pay Rate</label>
                    <input type="text" value={payRange} onChange={(e) => setPayRange(e.target.value)} placeholder="$25 / hr" className="input-base" />
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
                  <label className="text-xs font-bold block mb-1" style={{ color: "var(--text-primary)" }}>Description *</label>
                  <textarea rows={3} required value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the job duties, schedule, and expectations..." className="input-base" />
                </div>
                <div>
                  <label className="text-xs font-bold block mb-1" style={{ color: "var(--text-primary)" }}>Requirements (Comma-separated)</label>
                  <input type="text" value={reqsInput} onChange={(e) => setReqsInput(e.target.value)} placeholder="e.g. Punctual, Own equipment" className="input-base" />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 rounded-xl text-xs font-semibold border text-[#475569]" style={{ borderColor: "var(--border-color)" }}>Cancel</button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 shadow-sm">Publish Job</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Jobs;
