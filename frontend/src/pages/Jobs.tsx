import React, { useState } from "react";
import {
  Briefcase,
  Search,
  PlusCircle,
  MapPin,
  Clock,
  DollarSign,
  UserCheck,
  X,
  CheckCircle,
  Send,
  Filter,
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  posterName: string;
  rate: string;
  type: "One-off" | "Part-time" | "Flexible" | "Full-time";
  category: "Pet Care" | "Gardening" | "Tutoring" | "Handyman" | "Childcare" | "Tech Support";
  distance: string;
  postedAgo: string;
  description: string;
  requirements: string[];
}

const initialJobs: Job[] = [
  {
    id: "JOB-101",
    title: "Neighborhood Dog Walker Needed",
    posterName: "Sarah Jenkins",
    rate: "$25 / hr",
    type: "Flexible",
    category: "Pet Care",
    distance: "2 blocks away",
    postedAgo: "3 hours ago",
    description: "Looking for an energetic neighbor to walk our 2 friendly Labradors 3 times a week around Greenwood Park.",
    requirements: ["Must love dogs", "Punctual & reliable", "Available weekday afternoons"],
  },
  {
    id: "JOB-102",
    title: "Backyard Garden Cleanup & Lawn Mowing",
    posterName: "Marcus Vance",
    rate: "$30 / hr",
    type: "One-off",
    category: "Gardening",
    distance: "0.5 miles away",
    postedAgo: "5 hours ago",
    description: "Need help clearing overgrown weeds, trimming hedges, and mowing front & back lawn this Saturday.",
    requirements: ["Lawn mower provided", "Able to lift 20 lbs", "3 hours estimated task time"],
  },
  {
    id: "JOB-103",
    title: "High School Math & Physics Tutor",
    posterName: "Dr. Aris Thorne",
    rate: "$45 / hr",
    type: "Part-time",
    category: "Tutoring",
    distance: "0.8 miles away",
    postedAgo: "1 day ago",
    description: "Seeking a tutor for 10th grade Algebra II and Physics. 2 sessions per week at community library.",
    requirements: ["STEM background or college student", "Patient teaching style", "References preferred"],
  },
  {
    id: "JOB-104",
    title: "Smart TV & Home Wi-Fi Setup Assistance",
    posterName: "Martha G.",
    rate: "$35 / hr",
    type: "One-off",
    category: "Tech Support",
    distance: "0.3 miles away",
    postedAgo: "2 days ago",
    description: "Help mounting a 55-inch TV and configuring mesh Wi-Fi routers in senior resident apartment.",
    requirements: ["Basic tech savvy", "Careful handling of electronics"],
  },
];

function Jobs() {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // Modals
  const [showApplyModal, setShowApplyModal] = useState<boolean>(false);
  const [showPostModal, setShowPostModal] = useState<boolean>(false);
  const [appliedSuccess, setAppliedSuccess] = useState<boolean>(false);

  // Application Form State
  const [applicantNote, setApplicantNote] = useState("");

  // New Job Form State
  const [newTitle, setNewTitle] = useState("");
  const [newRate, setNewRate] = useState("");
  const [newCategory, setNewCategory] = useState<Job["category"]>("Pet Care");
  const [newType, setNewType] = useState<Job["type"]>("Flexible");
  const [newDescription, setNewDescription] = useState("");

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedSuccess(true);
    setTimeout(() => {
      setAppliedSuccess(false);
      setShowApplyModal(false);
      setSelectedJob(null);
    }, 2000);
  };

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newRate) return;

    const created: Job = {
      id: `JOB-${Date.now().toString().slice(-3)}`,
      title: newTitle,
      posterName: "Alex Johnson",
      rate: newRate.startsWith("$") ? newRate : `$${newRate}`,
      type: newType,
      category: newCategory,
      distance: "Greenwood Heights",
      postedAgo: "Just now",
      description: newDescription,
      requirements: ["Friendly local resident", "Clear communication"],
    };

    setJobs([created, ...jobs]);
    setShowPostModal(false);
    setNewTitle("");
    setNewRate("");
    setNewDescription("");
  };

  const filteredJobs = jobs.filter((j) => {
    const matchesCat = activeCategory === "All" || j.category === activeCategory;
    const matchesType = typeFilter === "All" || j.type === typeFilter;
    const matchesSearch =
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesType && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] p-6 max-w-7xl mx-auto space-y-8">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0b1c30] tracking-tight">Local Jobs &amp; Gigs</h1>
          <p className="text-sm text-[#434655] mt-1">
            Connect with neighbors for odd jobs, tutoring, pet sitting, and neighborhood tasks.
          </p>
        </div>

        <button
          onClick={() => setShowPostModal(true)}
          className="bg-[#004ac6] hover:bg-[#2563eb] text-white px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95 shrink-0"
        >
          <PlusCircle className="w-5 h-5" />
          Post a Job / Gig
        </button>
      </div>

      {/* ── Search & Filters Bar ────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#c3c6d7]/40 shadow-sm">
        {/* Search */}
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737686]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dog walker, tutor, garden..."
            className="w-full pl-10 pr-4 py-2 bg-[#e5eeff] border-none rounded-xl text-xs text-[#0b1c30] placeholder:text-[#737686] focus:ring-2 focus:ring-[#004ac6]/20 transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar w-full lg:w-auto">
          {["All", "Pet Care", "Gardening", "Tutoring", "Handyman", "Childcare", "Tech Support"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? "bg-[#004ac6] text-white shadow-sm"
                  : "bg-[#e5eeff] text-[#434655] hover:bg-[#d3e4fe]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-1.5 p-1 bg-[#e5eeff] rounded-xl text-xs font-semibold w-full lg:w-auto">
          {["All", "One-off", "Flexible", "Part-time"].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                typeFilter === t ? "bg-[#004ac6] text-white shadow-sm font-bold" : "text-[#434655]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ── Job Cards Grid ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-2xl border border-[#c3c6d7]/40 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-[#004ac6] bg-[#004ac6]/10 px-2.5 py-0.5 rounded-full">
                    {job.category}
                  </span>
                  <h3 className="text-lg font-bold text-[#0b1c30] mt-1">{job.title}</h3>
                </div>
                <span className="text-base font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                  {job.rate}
                </span>
              </div>

              <p className="text-xs text-[#434655] leading-relaxed line-clamp-3">{job.description}</p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-[#434655] pt-1">
                <span className="flex items-center gap-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-red-500" />
                  {job.distance}
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#004ac6]" />
                  {job.postedAgo}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#f8f9ff] border border-[#c3c6d7]/30 text-[11px] font-bold text-[#0b1c30]">
                  {job.type}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#c3c6d7]/30 flex items-center justify-between">
              <span className="text-xs font-semibold text-[#0b1c30]">Poster: {job.posterName}</span>
              <button
                onClick={() => setSelectedJob(job)}
                className="px-4 py-2 bg-[#004ac6] text-white text-xs font-bold rounded-xl hover:bg-[#2563eb] transition-all shadow-sm"
              >
                View &amp; Apply
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Job Details Modal ───────────────────────────────────────────── */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg space-y-5 shadow-2xl border border-[#c3c6d7]/50 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center border-b border-[#c3c6d7]/30 pb-3">
              <div>
                <span className="text-xs font-bold text-[#004ac6] bg-[#004ac6]/10 px-2.5 py-0.5 rounded-full">
                  {selectedJob.category}
                </span>
                <h3 className="text-xl font-bold text-[#0b1c30] mt-1">{selectedJob.title}</h3>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-[#434655]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <p className="text-emerald-800 font-semibold">Compensation</p>
                <p className="text-lg font-black text-emerald-700 mt-0.5">{selectedJob.rate}</p>
              </div>
              <div className="p-3 bg-[#f8f9ff] rounded-xl border border-[#c3c6d7]/30">
                <p className="text-[#434655] font-semibold">Job Commitment</p>
                <p className="text-sm font-bold text-[#0b1c30] mt-0.5">{selectedJob.type}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <p className="font-bold text-[#0b1c30] mb-1">Job Description</p>
                <p className="text-[#434655] leading-relaxed">{selectedJob.description}</p>
              </div>

              <div>
                <p className="font-bold text-[#0b1c30] mb-1.5">Requirements</p>
                <ul className="space-y-1 text-[#434655]">
                  {selectedJob.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#004ac6]" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-[#c3c6d7]/30 flex justify-end gap-3">
              <button
                onClick={() => setSelectedJob(null)}
                className="px-4 py-2.5 rounded-xl border border-[#c3c6d7] text-xs font-semibold text-[#434655]"
              >
                Close
              </button>
              <button
                onClick={() => setShowApplyModal(true)}
                className="px-6 py-2.5 bg-[#004ac6] text-white text-xs font-bold rounded-xl hover:bg-[#2563eb] shadow-md"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Apply Modal ─────────────────────────────────────────────────── */}
      {showApplyModal && selectedJob && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md space-y-5 shadow-2xl border border-[#c3c6d7]/50">
            <div className="flex justify-between items-center border-b border-[#c3c6d7]/30 pb-3">
              <h3 className="text-lg font-bold text-[#0b1c30]">Apply for {selectedJob.title}</h3>
              <button onClick={() => setShowApplyModal(false)} className="p-1 rounded-full hover:bg-slate-100">
                <X className="w-5 h-5 text-[#434655]" />
              </button>
            </div>

            {appliedSuccess ? (
              <div className="p-6 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-base text-emerald-900">Application Sent!</h4>
                <p className="text-xs text-emerald-700">
                  {selectedJob.posterName} has received your application and will message you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-[#0b1c30] mb-1 block">Introductory Note</label>
                  <textarea
                    value={applicantNote}
                    onChange={(e) => setApplicantNote(e.target.value)}
                    rows={4}
                    placeholder="Introduce yourself and mention your experience..."
                    className="w-full p-3 bg-[#f8f9ff] border border-[#c3c6d7] rounded-xl text-xs text-[#0b1c30]"
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-[#c3c6d7] font-semibold text-[#434655]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#004ac6] text-white font-bold hover:bg-[#2563eb] shadow-md flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Submit Application
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── Post Job Modal ──────────────────────────────────────────────── */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg space-y-5 shadow-2xl border border-[#c3c6d7]/50">
            <div className="flex justify-between items-center border-b border-[#c3c6d7]/30 pb-3">
              <h3 className="text-lg font-bold text-[#0b1c30]">Post a Job or Gig</h3>
              <button onClick={() => setShowPostModal(false)} className="p-1 rounded-full hover:bg-slate-100">
                <X className="w-5 h-5 text-[#434655]" />
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#0b1c30] mb-1 block">Job Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Lawn Mowing or Math Tutor Needed"
                  className="w-full p-3 bg-[#f8f9ff] border border-[#c3c6d7] rounded-xl text-xs text-[#0b1c30]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#0b1c30] mb-1 block">Rate / Pay</label>
                  <input
                    type="text"
                    value={newRate}
                    onChange={(e) => setNewRate(e.target.value)}
                    placeholder="e.g. $25 / hr"
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
                    <option value="Pet Care">Pet Care</option>
                    <option value="Gardening">Gardening</option>
                    <option value="Tutoring">Tutoring</option>
                    <option value="Handyman">Handyman</option>
                    <option value="Childcare">Childcare</option>
                    <option value="Tech Support">Tech Support</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#0b1c30] mb-1 block">Job Commitment</label>
                <select
                  value={newType}
                  onChange={(e: any) => setNewType(e.target.value)}
                  className="w-full p-3 bg-[#f8f9ff] border border-[#c3c6d7] rounded-xl text-xs font-semibold text-[#0b1c30]"
                >
                  <option value="Flexible">Flexible</option>
                  <option value="One-off">One-off</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Full-time">Full-time</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-[#0b1c30] mb-1 block">Description &amp; Details</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={3}
                  placeholder="Provide scope of work, timing, equipment needed..."
                  className="w-full p-3 bg-[#f8f9ff] border border-[#c3c6d7] rounded-xl text-xs text-[#0b1c30]"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#c3c6d7] font-semibold text-[#434655]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#004ac6] text-white font-bold hover:bg-[#2563eb] shadow-md"
                >
                  Post Job Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Jobs;
