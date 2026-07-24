import React, { useState } from "react";
import {
  MessageSquare,
  Heart,
  Share2,
  PlusCircle,
  Search,
  Pin,
  Image as ImageIcon,
  Sparkles,
  Send,
  User,
  X,
  Filter,
} from "lucide-react";

interface Comment {
  id: string;
  author: string;
  avatar?: string;
  text: string;
  timeAgo: string;
}

interface Post {
  id: string;
  author: string;
  role: string;
  avatarBg: string;
  timeAgo: string;
  category: "Announcement" | "Discussion" | "Question" | "Event";
  title: string;
  content: string;
  imageUrl?: string;
  likes: number;
  isLiked?: boolean;
  comments: Comment[];
  isPinned?: boolean;
}

const initialPosts: Post[] = [
  {
    id: "post-1",
    author: "Greenwood HOA Board",
    role: "Official Board",
    avatarBg: "bg-[#004ac6]",
    timeAgo: "2 hours ago",
    category: "Announcement",
    title: "Annual Community Pool Maintenance & Summer Party",
    content:
      "The main swimming pool will be closed for seasonal maintenance tomorrow from 8 AM to 2 PM. Join us this Saturday at 5 PM for the Summer Kickoff BBQ!",
    imageUrl:
      "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80",
    likes: 28,
    isLiked: false,
    isPinned: true,
    comments: [
      { id: "c1", author: "Marcus Vance", text: "Great news! Will there be vegetarian options at the BBQ?", timeAgo: "1 hour ago" },
      { id: "c2", author: "Greenwood HOA Board", text: "Yes Marcus! Veggie burgers & fresh salads provided.", timeAgo: "45 mins ago" },
    ],
  },
  {
    id: "post-2",
    author: "Sarah Jenkins",
    role: "Resident · Level 4",
    avatarBg: "bg-purple-600",
    timeAgo: "4 hours ago",
    category: "Question",
    title: "Found set of brass keys near North Park playground",
    content:
      "Has anyone lost a set of brass keys with a blue leather keychain? I left them with the security guard at the gatehouse.",
    likes: 14,
    isLiked: true,
    comments: [
      { id: "c3", author: "David Miller", text: "Those might be mine! I'll check with security now, thanks Sarah!", timeAgo: "2 hours ago" },
    ],
  },
  {
    id: "post-3",
    author: "Elena Rostova",
    role: "Community Organizer",
    avatarBg: "bg-emerald-600",
    timeAgo: "1 day ago",
    category: "Event",
    title: "Weekend Community Garden Cleanup & Seed Swap",
    content:
      "Bring your gloves and extra vegetable seeds! We are building 4 new raised beds near the South Pavilion this Sunday morning at 9:00 AM.",
    imageUrl:
      "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80",
    likes: 42,
    isLiked: false,
    comments: [],
  },
];

function Feed() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [openCommentsFor, setOpenCommentsFor] = useState<string | null>("post-1");

  // New Post Form State
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState<"Announcement" | "Discussion" | "Question" | "Event">("Discussion");

  // Comment input state per post
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});

  const handleLikeToggle = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            likes: p.isLiked ? p.likes - 1 : p.likes + 1,
            isLiked: !p.isLiked,
          };
        }
        return p;
      })
    );
  };

  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const newComment: Comment = {
            id: `c-${Date.now()}`,
            author: "Alex Johnson",
            text,
            timeAgo: "Just now",
          };
          return { ...p, comments: [...p.comments, newComment] };
        }
        return p;
      })
    );

    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    const createdPost: Post = {
      id: `post-${Date.now()}`,
      author: "Alex Johnson",
      role: "Resident · Level 4",
      avatarBg: "bg-[#004ac6]",
      timeAgo: "Just now",
      category: newCategory,
      title: newTitle,
      content: newContent,
      likes: 0,
      isLiked: false,
      comments: [],
    };

    setPosts([createdPost, ...posts]);
    setNewTitle("");
    setNewContent("");
    setShowCreateModal(false);
  };

  const filteredPosts = posts.filter((p) => {
    const matchesCat = activeCategory === "All" || p.category === activeCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] p-6 max-w-7xl mx-auto space-y-8">
      {/* ── Top Header & Actions ───────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0b1c30] tracking-tight">Community Feed</h1>
          <p className="text-sm text-[#434655] mt-1">
            Stay updated with local news, announcements, events, and neighbor discussions.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-[#004ac6] hover:bg-[#2563eb] text-white px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95 shrink-0"
        >
          <PlusCircle className="w-5 h-5" />
          Create Post
        </button>
      </div>

      {/* ── Search & Category Filters ───────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#c3c6d7]/40 shadow-sm">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737686]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search discussions & announcements..."
            className="w-full pl-10 pr-4 py-2 bg-[#e5eeff] border-none rounded-xl text-xs text-[#0b1c30] placeholder:text-[#737686] focus:ring-2 focus:ring-[#004ac6]/20 transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar w-full sm:w-auto pb-1 sm:pb-0">
          {["All", "Announcement", "Discussion", "Question", "Event"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? "bg-[#004ac6] text-white shadow-sm"
                  : "bg-[#e5eeff] text-[#434655] hover:bg-[#d3e4fe]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Pinned Announcement Banner ─────────────────────────────────── */}
      {posts.some((p) => p.isPinned) && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/10 to-amber-500/5 border border-amber-300 rounded-2xl p-5 flex items-start gap-4 shadow-sm">
          <div className="p-2.5 bg-amber-500 text-white rounded-xl shrink-0 mt-0.5 shadow-sm">
            <Pin className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-full">
                Pinned Announcement
              </span>
            </div>
            <h3 className="text-base font-bold text-[#0b1c30]">
              {posts.find((p) => p.isPinned)?.title}
            </h3>
            <p className="text-xs text-[#434655] mt-1 leading-relaxed">
              {posts.find((p) => p.isPinned)?.content}
            </p>
          </div>
        </div>
      )}

      {/* ── Feed List ───────────────────────────────────────────────────── */}
      <div className="space-y-6">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-2xl border border-[#c3c6d7]/40 p-6 shadow-sm hover:shadow-md transition-all space-y-4"
          >
            {/* Post Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full ${post.avatarBg} text-white flex items-center justify-center font-bold text-xs shadow-sm`}
                >
                  {post.author.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-[#0b1c30]">{post.author}</h4>
                    <span className="text-[10px] bg-[#e5eeff] text-[#004ac6] px-2 py-0.5 rounded-full font-semibold">
                      {post.role}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#434655] mt-0.5">{post.timeAgo}</p>
                </div>
              </div>

              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  post.category === "Announcement"
                    ? "bg-red-100 text-red-700"
                    : post.category === "Event"
                    ? "bg-emerald-100 text-emerald-700"
                    : post.category === "Question"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {post.category}
              </span>
            </div>

            {/* Title & Body */}
            <div>
              <h3 className="text-base font-bold text-[#0b1c30] mb-1.5">{post.title}</h3>
              <p className="text-xs sm:text-sm text-[#434655] leading-relaxed">{post.content}</p>
            </div>

            {/* Media Attachment */}
            {post.imageUrl && (
              <div className="rounded-xl overflow-hidden max-h-80 bg-slate-100 border border-[#c3c6d7]/30">
                <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
              </div>
            )}

            {/* Actions Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-[#c3c6d7]/30 text-xs">
              <div className="flex items-center gap-6">
                {/* Like Button */}
                <button
                  onClick={() => handleLikeToggle(post.id)}
                  className={`flex items-center gap-1.5 font-semibold transition-colors ${
                    post.isLiked ? "text-red-500" : "text-[#434655] hover:text-red-500"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${post.isLiked ? "fill-current" : ""}`} />
                  <span>{post.likes}</span>
                </button>

                {/* Comment Button */}
                <button
                  onClick={() =>
                    setOpenCommentsFor(openCommentsFor === post.id ? null : post.id)
                  }
                  className="flex items-center gap-1.5 font-semibold text-[#434655] hover:text-[#004ac6] transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{post.comments.length} Comments</span>
                </button>
              </div>

              <button className="flex items-center gap-1.5 font-semibold text-[#434655] hover:text-[#004ac6] transition-colors">
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>

            {/* Comments Drawer */}
            {openCommentsFor === post.id && (
              <div className="pt-4 border-t border-[#c3c6d7]/20 space-y-4 bg-[#f8f9ff] p-4 rounded-xl">
                {/* Existing comments */}
                <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
                  {post.comments.length === 0 ? (
                    <p className="text-xs text-[#434655] italic">No comments yet. Be the first to comment!</p>
                  ) : (
                    post.comments.map((comment) => (
                      <div key={comment.id} className="bg-white p-3 rounded-xl border border-[#c3c6d7]/30 text-xs space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-[#0b1c30]">{comment.author}</span>
                          <span className="text-[10px] text-[#434655]">{comment.timeAgo}</span>
                        </div>
                        <p className="text-[#434655]">{comment.text}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Add comment input */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={commentInputs[post.id] || ""}
                    onChange={(e) =>
                      setCommentInputs({ ...commentInputs, [post.id]: e.target.value })
                    }
                    onKeyDown={(e) => e.key === "Enter" && handleAddComment(post.id)}
                    placeholder="Write a comment..."
                    className="flex-1 px-3.5 py-2 bg-white border border-[#c3c6d7] rounded-xl text-xs text-[#0b1c30] focus:ring-2 focus:ring-[#004ac6]/20"
                  />
                  <button
                    onClick={() => handleAddComment(post.id)}
                    className="p-2 bg-[#004ac6] text-white rounded-xl hover:bg-[#2563eb] transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Create Post Modal ───────────────────────────────────────────── */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg space-y-5 shadow-2xl border border-[#c3c6d7]/50">
            <div className="flex justify-between items-center border-b border-[#c3c6d7]/30 pb-3">
              <h3 className="text-lg font-bold text-[#0b1c30]">Create Community Post</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-[#434655]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#0b1c30] mb-1 block">Post Category</label>
                <select
                  value={newCategory}
                  onChange={(e: any) => setNewCategory(e.target.value)}
                  className="w-full p-3 bg-[#f8f9ff] border border-[#c3c6d7] rounded-xl text-xs font-semibold text-[#0b1c30]"
                >
                  <option value="Announcement">Announcement</option>
                  <option value="Discussion">Discussion</option>
                  <option value="Question">Question</option>
                  <option value="Event">Event</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#0b1c30] mb-1 block">Post Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="What's happening in Greenwood Heights?"
                  className="w-full p-3 bg-[#f8f9ff] border border-[#c3c6d7] rounded-xl text-xs text-[#0b1c30] focus:ring-2 focus:ring-[#004ac6]/20"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#0b1c30] mb-1 block">Content</label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={4}
                  placeholder="Share details, questions, or neighborhood updates..."
                  className="w-full p-3 bg-[#f8f9ff] border border-[#c3c6d7] rounded-xl text-xs text-[#0b1c30] focus:ring-2 focus:ring-[#004ac6]/20"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#c3c6d7] text-xs font-semibold text-[#434655] hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#004ac6] text-white text-xs font-bold hover:bg-[#2563eb] shadow-md"
                >
                  Publish Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Feed;
