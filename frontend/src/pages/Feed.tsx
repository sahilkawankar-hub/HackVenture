import React, { useState, useEffect } from "react";
import {
  MessageSquare, Heart, Share2, PlusCircle, Search, Pin,
  Send, X
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { Post, Comment } from "../types";
import { getFeedPosts, createPost, likePost, addComment } from "../api/feed";
import { timeAgo, getInitials } from "../lib/utils";

// Demo Stories
const STORIES = [
  { id: "s1", name: "Greenwood HOA", avatar: "GH", bg: "gradient-civic" },
  { id: "s2", name: "Sarah Jenkins", avatar: "SJ", bg: "gradient-purple" },
  { id: "s3", name: "Elena Rostova", avatar: "ER", bg: "gradient-success" },
  { id: "s4", name: "Dr. Thorne", avatar: "DT", bg: "gradient-warm" },
  { id: "s5", name: "Marcus Vance", avatar: "MV", bg: "gradient-danger" },
];

const INITIAL_POSTS: Post[] = [
  {
    id: "post-1",
    author_id: "u-1",
    community_id: "c1",
    content: "The main swimming pool will be closed for seasonal maintenance tomorrow from 8 AM to 2 PM. Join us this Saturday at 5 PM for the Summer Kickoff BBQ!",
    title: "Annual Community Pool Maintenance & Summer Party",
    media_urls: ["https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80"],
    category: "Announcement",
    hashtags: ["PoolMaintenance", "SummerBBQ", "HOAUps"],
    like_count: 28,
    comment_count: 2,
    is_pinned: true,
    created_at: new Date(Date.now() - 7200000).toISOString(),
    updated_at: new Date().toISOString(),
    author: { display_name: "Greenwood HOA Board" },
  },
  {
    id: "post-2",
    author_id: "u-2",
    community_id: "c1",
    content: "Has anyone lost a set of brass keys with a blue leather keychain near North Park playground? I left them with the security guard at the gatehouse.",
    title: "Found set of brass keys near North Park playground",
    media_urls: null,
    category: "Question",
    hashtags: ["LostKeys", "NorthPark"],
    like_count: 14,
    comment_count: 1,
    is_pinned: false,
    created_at: new Date(Date.now() - 14400000).toISOString(),
    updated_at: new Date().toISOString(),
    author: { display_name: "Sarah Jenkins" },
  },
  {
    id: "post-3",
    author_id: "u-3",
    community_id: "c1",
    content: "Bring your gloves and extra vegetable seeds! We are building 4 new raised beds near the South Pavilion this Sunday morning at 9:00 AM.",
    title: "Weekend Community Garden Cleanup & Seed Swap",
    media_urls: ["https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80"],
    category: "Event",
    hashtags: ["GardenCleanup", "SeedSwap", "GreenwoodEco"],
    like_count: 42,
    comment_count: 0,
    is_pinned: false,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date().toISOString(),
    author: { display_name: "Elena Rostova" },
  },
];

function Feed() {
  const { user } = useAuth();
  const authorName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Community Member";

  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [openCommentsFor, setOpenCommentsFor] = useState<string | null>("post-1");

  // New Post Form State
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState<"Announcement" | "Discussion" | "Question" | "Event">("Discussion");
  const [newHashtags, setNewHashtags] = useState("");
  const [postImageFile] = useState<File | null>(null);

  // Comment input per post
  const [commentsMap, setCommentsMap] = useState<Record<string, Comment[]>>({
    "post-1": [
      { id: "c1", post_id: "post-1", author_id: "u-4", content: "Great news! Will there be vegetarian options at the BBQ?", created_at: new Date(Date.now() - 3600000).toISOString(), author: { display_name: "Marcus Vance" } },
      { id: "c2", post_id: "post-1", author_id: "u-1", content: "Yes Marcus! Veggie burgers & fresh salads provided.", created_at: new Date(Date.now() - 1800000).toISOString(), author: { display_name: "Greenwood HOA Board" } },
    ],
  });
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});

  useEffect(() => {
    getFeedPosts()
      .then((res) => {
        if (res.items && res.items.length > 0) setPosts(res.items);
      })
      .catch(() => {});
  }, []);

  const handleLikeToggle = async (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return { ...p, like_count: p.like_count + 1 };
        }
        return p;
      })
    );
    try {
      await likePost(postId);
    } catch {}
  };

  const handleAddComment = async (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    const newCommentObj: Comment = {
      id: `c-${Date.now()}`,
      post_id: postId,
      author_id: user?.id || "demo-user",
      content: text,
      created_at: new Date().toISOString(),
      author: { display_name: authorName },
    };

    setCommentsMap((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newCommentObj],
    }));

    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, comment_count: p.comment_count + 1 } : p))
    );

    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
    try {
      await addComment(postId, text);
    } catch {}
  };

  const handleCreatePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    const tagsArr = newHashtags.split(",").map((t) => t.trim().replace(/^#/, "")).filter(Boolean);

    const createdPostObj: Post = {
      id: `post-${Date.now()}`,
      author_id: user?.id || "demo-user",
      community_id: "c1",
      title: newTitle || null,
      content: newContent,
      media_urls: postImageFile ? [URL.createObjectURL(postImageFile)] : null,
      category: newCategory,
      hashtags: tagsArr,
      like_count: 0,
      comment_count: 0,
      is_pinned: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      author: { display_name: authorName },
    };

    setPosts([createdPostObj, ...posts]);
    setNewTitle("");
    setNewContent("");
    setNewHashtags("");
    setShowCreateModal(false);

    try {
      await createPost({
        community_id: "c1",
        title: newTitle,
        content: newContent,
        category: newCategory,
        hashtags: tagsArr,
      }, postImageFile || undefined);
    } catch {}
  };

  const filteredPosts = posts.filter((p) => {
    const matchesCat = activeCategory === "All" || p.category === activeCategory;
    const matchesSearch =
      (p.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base)" }}>
      <div className="p-7 max-w-4xl mx-auto space-y-6">

        {/* ── Top Header & Actions ───────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>
              Community Feed
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
              Stay updated with local news, announcements, events, and neighbor discussions.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm text-white transition-all shadow-md active:scale-95 shrink-0"
            style={{
              background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
              boxShadow: "0 4px 16px rgba(37,99,235,0.3)",
            }}
          >
            <PlusCircle className="w-5 h-5" />
            Create Post
          </button>
        </div>

        {/* ── Stories Row ────────────────────────────────────────────────── */}
        <div className="card p-4 space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#94a3b8]">Community Highlights</p>
          <div className="flex items-center gap-4 overflow-x-auto custom-scrollbar pb-1">
            {STORIES.map((story) => (
              <div key={story.id} className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group">
                <div className={`w-14 h-14 rounded-full ${story.bg} text-white flex items-center justify-center font-bold text-sm shadow-md ring-2 ring-white dark:ring-slate-900 group-hover:scale-105 transition-transform`}>
                  {story.avatar}
                </div>
                <span className="text-[11px] font-medium text-center truncate max-w-[70px]" style={{ color: "var(--text-primary)" }}>
                  {story.name.split(" ")[0]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Search & Category Filters ───────────────────────────────────── */}
        <div className="card p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search feed..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs outline-none"
              style={{
                background: "var(--bg-input)",
                border: "1px solid var(--border-color)",
                color: "var(--text-primary)",
              }}
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {["All", "Announcement", "Discussion", "Question", "Event"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? "bg-[#2563eb] text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-[#475569] dark:text-slate-400 hover:text-[#2563eb]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── Pinned Banner ─────────────────────────────────────────────── */}
        {posts.some((p) => p.is_pinned) && (
          <div className="p-4 rounded-2xl border bg-amber-50/80 dark:bg-amber-900/15 border-amber-200 dark:border-amber-800 flex items-start gap-3 shadow-xs">
            <Pin className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="badge badge-amber mb-1">Pinned Announcement</span>
              <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                {posts.find((p) => p.is_pinned)?.title}
              </p>
              <p className="text-xs text-[#475569] dark:text-slate-300 mt-1 leading-relaxed">
                {posts.find((p) => p.is_pinned)?.content}
              </p>
            </div>
          </div>
        )}

        {/* ── Feed List ───────────────────────────────────────────────────── */}
        <div className="space-y-4">
          {filteredPosts.map((post) => {
            const author = post.author?.display_name || "Resident";
            const initials = getInitials(author);
            const comments = commentsMap[post.id] || [];

            return (
              <div key={post.id} className="card p-6 space-y-4 hover:shadow-md transition-all">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1d4ed8] to-[#6366f1] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                      {initials}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{author}</h4>
                      <p className="text-[11px] text-[#94a3b8]">{timeAgo(post.created_at)}</p>
                    </div>
                  </div>
                  {post.category && (
                    <span className="badge badge-blue">{post.category}</span>
                  )}
                </div>

                {/* Content */}
                <div>
                  {post.title && (
                    <h3 className="text-base font-extrabold mb-1.5" style={{ color: "var(--text-primary)" }}>{post.title}</h3>
                  )}
                  <p className="text-xs sm:text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{post.content}</p>
                </div>

                {/* Media */}
                {post.media_urls && post.media_urls.length > 0 && (
                  <div className="rounded-xl overflow-hidden max-h-80 bg-slate-100 dark:bg-slate-800">
                    <img src={post.media_urls[0]} alt={post.title || "Post attachment"} className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Hashtags */}
                {post.hashtags && post.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {post.hashtags.map((tag) => (
                      <span key={tag} className="text-xs font-semibold text-[#2563eb] hover:underline cursor-pointer">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Bar */}
                <div className="flex items-center justify-between pt-3 border-t text-xs" style={{ borderColor: "var(--border-color)" }}>
                  <div className="flex items-center gap-6">
                    <button
                      onClick={() => handleLikeToggle(post.id)}
                      className="flex items-center gap-1.5 font-semibold text-[#475569] dark:text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                      <span>{post.like_count}</span>
                    </button>
                    <button
                      onClick={() => setOpenCommentsFor(openCommentsFor === post.id ? null : post.id)}
                      className="flex items-center gap-1.5 font-semibold text-[#475569] dark:text-slate-300 hover:text-[#2563eb] transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{post.comment_count + comments.length} Comments</span>
                    </button>
                  </div>
                  <button className="flex items-center gap-1.5 font-semibold text-[#94a3b8] hover:text-[#2563eb] transition-colors">
                    <Share2 className="w-4 h-4" /> Share
                  </button>
                </div>

                {/* Comments Section */}
                {openCommentsFor === post.id && (
                  <div className="pt-3 border-t space-y-3 p-3 rounded-xl" style={{ background: "var(--bg-input)", borderColor: "var(--border-color)" }}>
                    <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                      {comments.length === 0 ? (
                        <p className="text-xs italic text-[#94a3b8]">No comments yet. Be the first to comment!</p>
                      ) : (
                        comments.map((c) => (
                          <div key={c.id} className="bg-white dark:bg-slate-800 p-2.5 rounded-xl text-xs space-y-0.5 border" style={{ borderColor: "var(--border-color)" }}>
                            <div className="flex justify-between">
                              <span className="font-bold" style={{ color: "var(--text-primary)" }}>{c.author?.display_name || "Resident"}</span>
                              <span className="text-[10px] text-[#94a3b8]">{timeAgo(c.created_at)}</span>
                            </div>
                            <p style={{ color: "var(--text-secondary)" }}>{c.content}</p>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        value={commentInputs[post.id] || ""}
                        onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                        onKeyDown={(e) => e.key === "Enter" && handleAddComment(post.id)}
                        placeholder="Write a comment..."
                        className="flex-1 input-base py-1.5 text-xs"
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        className="p-2 bg-[#2563eb] text-white rounded-xl hover:bg-[#1d4ed8]"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Create Post Modal ───────────────────────────────────────────── */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl border" style={{ borderColor: "var(--border-color)" }}>
              <div className="flex justify-between items-center border-b pb-3" style={{ borderColor: "var(--border-color)" }}>
                <h3 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>Create Community Post</h3>
                <button onClick={() => setShowCreateModal(false)} className="p-1 text-[#94a3b8] hover:text-[#0f1f3d]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreatePostSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold block mb-1" style={{ color: "var(--text-primary)" }}>Post Category</label>
                  <select
                    value={newCategory}
                    onChange={(e: any) => setNewCategory(e.target.value)}
                    className="input-base"
                  >
                    <option value="Discussion">Discussion</option>
                    <option value="Announcement">Announcement</option>
                    <option value="Question">Question</option>
                    <option value="Event">Event</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold block mb-1" style={{ color: "var(--text-primary)" }}>Post Title (Optional)</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Lost set of keys near playground"
                    className="input-base"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold block mb-1" style={{ color: "var(--text-primary)" }}>Content *</label>
                  <textarea
                    rows={4}
                    required
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Share updates, questions, or neighborhood news..."
                    className="input-base"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold block mb-1" style={{ color: "var(--text-primary)" }}>Hashtags (Comma-separated)</label>
                  <input
                    type="text"
                    value={newHashtags}
                    onChange={(e) => setNewHashtags(e.target.value)}
                    placeholder="e.g. HOA, Garden, Safety"
                    className="input-base"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold border text-[#475569]"
                    style={{ borderColor: "var(--border-color)" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#2563eb] text-white text-xs font-bold hover:bg-[#1d4ed8] shadow-sm"
                  >
                    Publish Post
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Feed;
