"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { RxArrowTopRight } from "react-icons/rx";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";
import { useParams, useNavigate, Link } from "react-router-dom";
import TitleAnimation from "../common/AnimatedTitle";
import { getBlogs, getBlogBySlug, getHomepageBlogSection } from "../../Api/api";



export default function BlogsSection() {

  
  const { slug } = useParams();
  const navigate = useNavigate();

  const [emblaRef, embla] = useEmblaCarousel({
    loop: true,
    align: "center",
    containScroll: "trimSnaps",
    slidesToScroll: 1,
  });

  const [isWide, setIsWide] = useState(
    typeof window !== "undefined" ? window.innerWidth > 700 : false
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const [blogs, setBlogs] = useState([]);
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeLang, setActiveLang] = useState("en");

  // 🆕 Blog info (from homepage.blogSection)
  const [blogInfo, setBlogInfo] = useState({
    blogTitle: { en: "BLOGS", vi: "BLOG" },
    blogDescription: {
      en: "Discover the latest insights, stories, and updates from our team.",
      vi: "Khám phá những câu chuyện, thông tin và cập nhật mới nhất từ đội ngũ của chúng tôi.",
    },
  });

  // ✅ Detect and track current language (en / vi)
  useEffect(() => {
    const detectLanguage = () => {
      if (typeof document === "undefined") return "en";
      return document.body.classList.contains("vi-mode") ? "vi" : "en";
    };

    setActiveLang(detectLanguage());

    const observer = new MutationObserver(() => {
      setActiveLang(detectLanguage());
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // ✅ Helper for picking language
  const pick = (obj, key) => obj?.[key] ?? obj?.en ?? obj?.vi ?? "";

  // ✅ Handle resize
  useEffect(() => {
    const handleResize = () => setIsWide(window.innerWidth > 700);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Embla select events
  const onSelect = useCallback(() => {
    if (!embla) return;
    setSelectedIndex(embla.selectedScrollSnap());
    setCanPrev(embla.canScrollPrev());
    setCanNext(embla.canScrollNext());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    onSelect();
    embla.on("select", onSelect);
    embla.on("reInit", onSelect);
    return () => {
      embla.off("select", onSelect);
      embla.off("reInit", onSelect);
    };
  }, [embla, onSelect]);

  const scrollPrev = useCallback(() => embla && embla.scrollPrev(), [embla]);
  const scrollNext = useCallback(() => embla && embla.scrollNext(), [embla]);

  // ✅ Fetch blogs or single blog
  useEffect(() => {
    setLoading(true);
    if (slug) {
      getBlogBySlug(slug)
        .then((res) => setBlog(res.data?.data || res.data))
        .finally(() => setLoading(false));
    } else {
      getBlogs()
        .then((res) => {
          const items = res.data?.data || res.data || [];
          setBlogs(items);
        })
        .finally(() => setLoading(false));
    }
  }, [slug]);

  // ✅ Fetch homepage blogSection info
  useEffect(() => {
    getHomepageBlogSection().then((data) => {
      if (data) setBlogInfo(data);
    });
  }, []);

  // ✅ Single Blog View
  if (slug) {
    if (loading) return <p className="text-center py-20">Loading...</p>;
    if (!blog) return <p className="text-center py-20">Blog not found</p>;

    return (
      <section className="bg-white overflow-x-hidden">
        <div
          className={`gap-10 items-start mr-0 p-6 md:py-20 ${
            isWide ? "page-width grid grid-cols-12" : ""
          }`}
        >
          {/* ---------- Left column ---------- */}
          <div className="col-span-12 md:col-span-3 h-full grid place-content-center">
            <TitleAnimation
              text={pick(blogInfo.blogTitle, activeLang)}
              className="heading"
              align="heading text-center md:text-left"
              delay={0.05}
              stagger={0.05}
              once={true}
            />
            <p className="mt-4 text-slate-600 text-center md:text-left leading-relaxed max-w-sm">
              {pick(blogInfo.blogDescription, activeLang)}
            </p>
          </div>

          {/* ---------- Right column ---------- */}
          <div className="col-span-12 md:col-span-9 relative md:mt-0 mt-6">
            <div className="absolute inset-y-0 right-0 w-[92%] bg-[#0E2F47] rounded-[36px] md:rounded-l-[48px]" />

            <div className="relative pt-20 pb-10 px-4 md:px-6">
              <article className="rounded-2xl bg-white ring-1 ring-black/5 overflow-hidden p-6 shadow-md relative z-20">
                {blog.coverImage?.url && (
                  <img
                    src={blog.coverImage.url}
                    alt={blog.coverImage.alt || pick(blog.title, activeLang)}
                    className="h-60 w-full rounded-xl object-cover mb-6"
                  />
                )}

                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                  {pick(blog.title, activeLang)}
                </h1>
                <p className="mt-2 text-slate-600">
                  {pick(blog.excerpt, activeLang)}
                </p>

                <div className="mt-6 space-y-6">
                  {blog.blocks?.map((block, i) => {
                    if (block.type === "richtext") {
                      return (
                        <div
                          key={i}
                          className="prose prose-slate max-w-none"
                          dangerouslySetInnerHTML={{
                            __html: pick(block.content, activeLang),
                          }}
                        />
                      );
                    }
                    if (block.type === "image") {
                      return (
                        <img
                          key={i}
                          src={block.content?.url}
                          alt={block.content?.alt || ""}
                          className="rounded-xl w-full"
                        />
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => navigate("/blog")}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#0F3A56]"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-[#1276BD] text-white text-[16px]">
                    <RxArrowTopRight />
                  </span>
                  {activeLang === "vi" ? "Quay lại Blog" : "Back to Blogs"}
                </button>
              </article>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ✅ Blog List Carousel
  if (loading) {
    return <p className="text-center py-20">Loading...</p>;
  }

  return (
    <section className="bg-white overflow-x-hidden">
      <div
        className={`gap-10 items-start mr-0 p-6 md:py-20 ${
          isWide ? "page-width grid grid-cols-12" : ""
        }`}
      >
        {/* ---------- Left column ---------- */}
        <div className="col-span-12 md:col-span-3 h-full grid place-content-center">
          <TitleAnimation
            text={pick(blogInfo.blogTitle, activeLang) || "BLOGS"}
            className="heading"
            align="heading text-center md:text-left"
            delay={0.05}
            stagger={0.05}
            once={true}
          />
          <p className="mt-4 text-slate-600 text-center md:text-left leading-relaxed max-w-sm">
            {pick(blogInfo.blogDescription, activeLang)}
          </p>
        </div>

        {/* ---------- Right column: Carousel ---------- */}
        <div className="col-span-12 md:col-span-9 overflow-x-hidden relative md:mt-0 mt-6">
          <div className="absolute inset-y-0 right-0 w-[92%] bg-[#0E2F47] rounded-[36px] md:rounded-l-[48px]" />

          <div className="relative pt-20 pb-10 pl-2 pr-2 md:pl-6 md:pr-6 overflow-hidden">
            {/* Arrows */}
            <div className="absolute top-5 md:top-2 right-6 z-30 flex gap-2">
              <button
                onClick={scrollPrev}
                disabled={!canPrev}
                className={`grid h-10 w-10 place-items-center rounded-full bg-white ring-1 ring-black/5 shadow ${
                  !canPrev ? "cursor-not-allowed opacity-40" : "hover:shadow-md"
                }`}
                aria-label="Previous"
              >
                <HiOutlineChevronLeft className="text-xl" />
              </button>
              <button
                onClick={scrollNext}
                disabled={!canNext}
                className={`grid h-10 w-10 place-items-center rounded-full bg-white ring-1 ring-black/5 shadow ${
                  !canNext ? "cursor-not-allowed opacity-40" : "hover:shadow-md"
                }`}
                aria-label="Next"
              >
                <HiOutlineChevronRight className="text-xl" />
              </button>
            </div>

            {/* Carousel */}
            <div ref={emblaRef}>
              <div className="flex gap-3 md:gap-3">
                {blogs.map((b, i) => {
                  const isActive = selectedIndex === i;
                  const title = pick(b.title, activeLang);
                  const excerpt = pick(b.excerpt, activeLang);
                  const image =
                    b.coverImage?.url ||
                    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop";
                  const link = `/blogs/${b.slug}`;

                  return (
                    <div
                      key={b._id || i}
                      className="flex-none basis-8/12 lg:basis-1/3"
                    >
                      <article
                        className={[
                          "origin-center rounded-2xl bg-white ring-1 ring-black/5 overflow-hidden p-4 shadow-md transition-transform duration-300 will-change-transform",
                          isActive ? "scale-100 z-20" : "scale-90 z-10",
                        ].join(" ")}
                      >
                        <img
                          src={image}
                          alt={title}
                          className="h-44 w-full rounded-xl object-cover md:h-56 lg:h-60"
                        />
                        <div className="py-4">
                          <h3 className="text-[18px] font-semibold leading-snug text-slate-900">
                            {title}
                          </h3>
                          <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                            {excerpt}
                          </p>
                          <Link
                            to={link}
                            className={[
                              "mt-4 inline-flex items-center gap-2 text-sm font-medium",
                              isActive ? "text-[#0F3A56]" : "text-[#0F3A56]/80",
                            ].join(" ")}
                          >
                            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#1276BD] text-white text-[16px]">
                              <RxArrowTopRight />
                            </span>
                            {activeLang === "vi" ? "Xem thêm" : "Learn More"}
                          </Link>
                        </div>
                      </article>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dots */}
            <div className="mt-6 flex justify-center gap-2 pr-2 relative z-20">
              {blogs.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    selectedIndex === i ? "w-6 bg-white" : "w-3 bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
