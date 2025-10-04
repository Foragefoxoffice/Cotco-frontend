"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { RxArrowTopRight } from "react-icons/rx";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";
import { useParams, useNavigate } from "react-router-dom";
import TitleAnimation from "../common/AnimatedTitle";
import { getBlogBySlug, getBlogs } from "../../Api/api";

export default function NewsSection() {
  const { slug } = useParams(); // slug from /news/:slug
  const navigate = useNavigate();

  const [isWide, setIsWide] = useState(
    typeof window !== "undefined" ? window.innerWidth > 700 : false
  );

  // Blogs state
  const [blogs, setBlogs] = useState([]);
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  // Embla carousel
  const [emblaRef, embla] = useEmblaCarousel({
    loop: true,
    align: "center",
    containScroll: "trimSnaps",
    dragFree: false,
    skipSnaps: false,
    slidesToScroll: 1,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsWide(window.innerWidth > 700);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Embla select handler
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

  // Fetch blogs
  useEffect(() => {
    if (slug) {
      setLoading(true);
      getBlogBySlug(slug)
        .then((res) => setBlog(res)) // now res is blog object ✅
        .finally(() => setLoading(false));
    } else {
      setLoading(true);
      getBlogs()
        .then((res) => setBlogs(res)) // now res is array ✅
        .finally(() => setLoading(false));
    }
  }, [slug]);

  // ====== SINGLE BLOG VIEW ====== //
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
          {/* Left column */}
          <div className="col-span-12 md:col-span-3 h-full grid place-content-center">
            <TitleAnimation
              text={"BLOG"}
              className="heading"
              align="heading text-center md:text-left"
              delay={0.05}
              stagger={0.05}
              once={true}
            />
            <p className="mt-4 text-slate-600 text-center md:text-left leading-relaxed max-w-sm">
              {blog.excerpt?.en ||
                "Insights, stories, and updates from our team and community."}
            </p>
          </div>

          {/* Right column */}
          <div className="col-span-12 md:col-span-9 relative md:mt-0 mt-6">
            <div className="absolute inset-y-0 right-0 w-[92%] bg-[#0E2F47] rounded-[36px] md:rounded-l-[48px]" />

            <div className="relative pt-20 pb-10 pl-4 pr-4 md:pl-6 md:pr-6">
              <article className="origin-center rounded-2xl bg-white ring-1 ring-black/5 overflow-hidden p-6 shadow-md relative z-20">
                {blog.coverImage?.url && (
                  <img
                    src={blog.coverImage.url}
                    alt={blog.coverImage.alt || blog.title?.en}
                    className="h-60 w-full rounded-xl object-cover mb-6"
                  />
                )}

                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                  {blog.title?.en}
                </h1>
                <p className="mt-2 text-slate-600">{blog.excerpt?.en}</p>

                {/* Blocks */}
                <div className="mt-6 space-y-6">
                  {blog.blocks?.map((block, i) => {
                    if (block.type === "richtext") {
                      return (
                        <div
                          key={i}
                          className="prose prose-slate max-w-none"
                          dangerouslySetInnerHTML={{
                            __html: block.content?.en || "",
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
                  onClick={() => navigate("/news")}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#0F3A56]"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-[#1276BD] text-white text-[16px]">
                    <RxArrowTopRight />
                  </span>
                  Back to News
                </button>
              </article>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ====== BLOG LIST (CAROUSEL) ====== //
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
        {/* Left column */}
        <div className="col-span-12 md:col-span-3 h-full grid place-content-center">
          <TitleAnimation
            text={"NEWS"}
            className="heading"
            align="heading text-center md:text-left"
            delay={0.05}
            stagger={0.05}
            once={true}
          />
          <p className="mt-4 text-slate-600 text-center md:text-left leading-relaxed max-w-sm">
            Conveniently located and surrounded by natural beauty, it's the
            perfect spot for our celebration.
          </p>
        </div>

        {/* Right column: carousel */}
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

            {/* Embla viewport */}
            <div ref={emblaRef}>
              <div className="flex gap-3 md:gap-3">
                {blogs.map((n, i) => {
                  const isActive = selectedIndex === i;
                  return (
                    <div
                      key={n._id}
                      className="flex-none basis-8/12 lg:basis-1/3"
                    >
                      <article
                        className={[
                          "origin-center rounded-2xl bg-white ring-1 ring-black/5 overflow-hidden p-4 shadow-md transition-transform duration-300 will-change-transform",
                          isActive ? "scale-100 z-20" : "scale-90 z-10",
                        ].join(" ")}
                      >
                        {n.coverImage?.url && (
                          <img
                            src={n.coverImage.url}
                            alt={n.coverImage.alt || n.title?.en}
                            className="h-44 w-full rounded-xl object-cover md:h-56 lg:h-60"
                          />
                        )}
                        <div className="py-4">
                          <h3 className="text-[18px] font-semibold leading-snug text-slate-900">
                            {n.title?.en}
                          </h3>
                          <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                            {n.excerpt?.en}
                          </p>
                          <button
                            onClick={() => navigate(`/blogs/${n.slug}`)}
                            className={[
                              "mt-4 inline-flex items-center gap-2 text-sm font-medium",
                              isActive ? "text-[#0F3A56]" : "text-[#0F3A56]/80",
                            ].join(" ")}
                          >
                            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#1276BD] text-white text-[16px]">
                              <RxArrowTopRight />
                            </span>
                            Learn More
                          </button>
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
