// src/pages/PostsPage.jsx
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { fetchPosts } from "../utils/strapiClient";

const PAGE_SIZE = 9;

// Pull the first bit of plain text from Strapi blocks
function firstTextFromContent(blocks = []) {
  for (const b of blocks) {
    if (b?.type === "paragraph" && Array.isArray(b.children)) {
      const t = b.children.map((c) => c.text).join(" ").trim();
      if (t) return t;
    }
  }
  return "";
}

// Handles both Strapi v5 (flat) and v4 (attributes) shapes
function normalizePost(raw) {
  const a = raw.attributes || raw; // v4 → .attributes ; v5 → flat

  // cover can be (v4) a.cover.data.attributes.url or (v5) a.cover.url or absent
  const rawCover =
    a?.cover?.data?.attributes?.url ??
    a?.cover?.url ??
    null;

  const base = (import.meta.env.VITE_STRAPI_URL || "").replace(/\/$/, "");
  const coverUrl = rawCover
    ? rawCover.startsWith("http") ? rawCover : `${base}${rawCover}`
    : "";

  return {
    id: raw.id || a.documentId,
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt || firstTextFromContent(a.content),
    // prefer system publishedAt; fall back to custom `publishedat` if present
    publishedAt: a.publishedAt || a.publishedat || a.published_at || null,
    coverUrl,
  };
}

function SkeletonCard() {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm animate-pulse">
      <div className="mb-3 h-44 w-full rounded-lg bg-slate-200" />
      <div className="h-5 w-3/4 bg-slate-200 rounded" />
      <div className="mt-2 h-4 w-1/3 bg-slate-200 rounded" />
      <div className="mt-3 h-4 w-full bg-slate-200 rounded" />
      <div className="mt-2 h-4 w-5/6 bg-slate-200 rounded" />
      <div className="mt-4 h-4 w-20 bg-slate-200 rounded" />
    </div>
  );
}

function PostCard({ post }) {
  const d = post.publishedAt ? new Date(post.publishedAt) : null;
  return (
    <article className="rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition">
      {post.coverUrl ? (
        <img
          src={`http://localhost:1337${post.coverUrl}`}
          alt={post.title}
          className="mb-3 h-44 w-full object-cover rounded-lg"
          loading="lazy"
        />
      ) : (
        <div className="mb-3 h-44 w-full rounded-lg bg-slate-100" />
      )}

      <h3 className="text-lg font-semibold line-clamp-2">{post.title}</h3>
      {d && (
        <p className="mt-1 text-xs text-slate-500">
          {d.toLocaleDateString()}
        </p>
      )}
      <p className="mt-2 text-sm text-slate-600 line-clamp-3">{post.excerpt}</p>

      <Link
        to={`/blog/${post.slug}`}
        className="mt-3 inline-block text-blue-600 font-medium"
      >
        Read →
      </Link>
    </article>
  );
}

function Pager({ page, pageCount, onChange }) {
  if (!pageCount || pageCount < 2) return null;
  const windowSize = 5;
  const start = Math.max(1, page - Math.floor(windowSize / 2));
  const end = Math.min(pageCount, start + windowSize - 1);
  const pages = [];
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <nav className="mt-8 flex items-center justify-center gap-2">
      <button
        className="px-3 py-1.5 rounded border text-sm disabled:opacity-50"
        disabled={page === 1}
        onClick={() => onChange(1)}
      >
        « First
      </button>
      <button
        className="px-3 py-1.5 rounded border text-sm disabled:opacity-50"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
      >
        ‹ Prev
      </button>

      {pages.map((p) => (
        <button
          key={p}
          className={`px-3 py-1.5 rounded border text-sm ${
            p === page ? "bg-slate-900 text-white border-slate-900" : ""
          }`}
          onClick={() => onChange(p)}
        >
          {p}
        </button>
      ))}

      <button
        className="px-3 py-1.5 rounded border text-sm disabled:opacity-50"
        disabled={page === pageCount}
        onClick={() => onChange(page + 1)}
      >
        Next ›
      </button>
      <button
        className="px-3 py-1.5 rounded border text-sm disabled:opacity-50"
        disabled={page === pageCount}
        onClick={() => onChange(pageCount)}
      >
        Last »
      </button>
    </nav>
  );
}

export default function PostsPage() {
  const [sp, setSp] = useSearchParams();
  const pageFromUrl = Number(sp.get("page") || 1);
  const qFromUrl = sp.get("q") || "";

  const [q, setQ] = useState(qFromUrl);
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const updateUrl = (next) => {
    const p = new URLSearchParams(sp);
    if (next.page) p.set("page", next.page);
    if (next.q !== undefined) {
      next.q ? p.set("q", next.q) : p.delete("q");
      p.set("page", "1");
    }
    setSp(p, { replace: false });
  };

  // debounce search input -> sync to URL
  useEffect(() => {
    const t = setTimeout(() => {
      if (q !== qFromUrl) updateUrl({ q });
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setErr("");

    // NOTE: fetchPosts already adds pagination/sort, and (optionally) search using `q`
    fetchPosts({ page: pageFromUrl, pageSize: PAGE_SIZE, q: qFromUrl })
      .then((res) => {
        if (!alive) return;
        setRows((res?.data || []).map(normalizePost));
        setMeta(res?.meta || null);
      })
      .catch((e) => {
        if (!alive) return;
        setErr(e.message || "Failed to load posts");
      })
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [pageFromUrl, qFromUrl]);

  const page = meta?.pagination?.page ?? pageFromUrl;
  const pageCount = meta?.pagination?.pageCount ?? 1;
  const total = meta?.pagination?.total ?? 0;

  return (
    <section className="mx-auto max-w-6xl p-6">
      <header className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Posts</h1>
          <p className="text-sm text-slate-600">
            {loading ? "Loading…" : `${total} post${total === 1 ? "" : "s"}`}
          </p>
        </div>
        <div className="w-full sm:w-80">
          <label className="block text-sm font-medium text-slate-700 mb-1">Search</label>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search title or excerpt…"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200"
          />
        </div>
      </header>

      {err && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {err}
        </div>
      )}

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-xl border bg-white p-10 text-center">
          <p className="text-slate-600">
            No posts found{qFromUrl ? ` for “${qFromUrl}”` : ""}.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          <Pager
            page={page}
            pageCount={pageCount}
            onChange={(p) => updateUrl({ page: String(p) })}
          />
        </>
      )}
    </section>
  );
}
