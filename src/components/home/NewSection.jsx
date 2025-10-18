"use client";

import React, { useCallback, useEffect, useState, useRef } from "react";
import { RxArrowTopRight } from "react-icons/rx";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";
import { useParams, useNavigate, Link } from "react-router-dom";
import TitleAnimation from "../common/AnimatedTitle";
import { getBlogs, getBlogBySlug, getHomepageBlogSection } from "../../Api/api";

export default function BlogsSection() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [isWide, setIsWide] = useState(
    typeof window !== "undefined" ? window.innerWidth > 700 : false
  );
  const [blogs, setBlogs] = useState([]);
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeLang, setActiveLang] = useState("en");

  const [blogInfo, setBlogInfo] = useState({
    blogTitle: { en: "BLOGS", vi: "BLOG" },
    blogDescription: {
      en: "Discover the latest insights, stories, and updates from our team.",
      vi: "Khám phá những câu chuyện, thông tin và cập nhật mới nhất từ đội ngũ của chúng tôi.",
    },
  });

  // Detect and track current language (en / vi)
  useEffect(() => {
    const detectLanguage = () => {
      if (typeof document === "undefined") return "en";
      return document.body.classList.contains("vi-mode") ? "vi" : "en";
    };

    setActiveLang(detectLanguage());

    const observer = new MutationObserver(() => {
      setActiveLang(detectLanguage());
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const pick = (obj, key) => obj?.[key] ?? obj?.en ?? obj?.vi ?? "";

  // Handle resize
  useEffect(() => {
    const handleResize = () => setIsWide(window.innerWidth > 700);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch blogs or single blog
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

  // Fetch homepage blog section info
  useEffect(() => {
    getHomepageBlogSection().then((data) => {
      if (data) setBlogInfo(data);
    });
  }, []);

  // Single Blog View
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

  // Blog List Carousel (pure JS version)
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

        <div className="col-span-12 md:col-span-9 overflow-x-hidden relative md:mt-0 mt-6">
          <div className="absolute inset-y-0 right-0 w-[92%] bg-[#0E2F47] rounded-[36px] md:rounded-l-[48px]" />
          <div className="relative">
            <BlogsCarousel blogs={blogs} activeLang={activeLang} pick={pick} />
          </div>
        </div>
      </div>
    </section>
  );
}

function BlogsCarousel({ blogs, activeLang, pick }) {
  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleSlides = 3;

  const clonesBefore = blogs.slice(-visibleSlides);
  const clonesAfter = blogs.slice(0, visibleSlides);
  const slides = [...clonesBefore, ...blogs, ...clonesAfter];
  const startIndex = clonesBefore.length;

  // ✅ Initialize position
  useEffect(() => {
    const container = containerRef.current;
    if (!container || blogs.length === 0) return;
    const slideWidth = container.offsetWidth / visibleSlides;
    setCurrentIndex(startIndex);
    container.style.transition = "none";
    container.style.transform = `translateX(-${startIndex * slideWidth}px)`;
  }, [blogs.length]);

  // ✅ Move on index change
  useEffect(() => {
    const container = containerRef.current;
    if (!container || blogs.length === 0) return;
    const slideWidth = container.offsetWidth / visibleSlides;
    container.style.transition = "transform 0.5s ease";
    container.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
  }, [currentIndex]);

  // ✅ Infinite loop logic
  useEffect(() => {
    const container = containerRef.current;
    if (!container || blogs.length === 0) return;

    const handleTransitionEnd = () => {
      const total = blogs.length;
      const slideWidth = container.offsetWidth / visibleSlides;

      if (currentIndex >= startIndex + total) {
        container.style.transition = "none";
        setCurrentIndex(startIndex);
        container.style.transform = `translateX(-${startIndex * slideWidth}px)`;
      } else if (currentIndex < startIndex) {
        const newIndex = startIndex + total - 1;
        container.style.transition = "none";
        setCurrentIndex(newIndex);
        container.style.transform = `translateX(-${newIndex * slideWidth}px)`;
      }
    };

    container.addEventListener("transitionend", handleTransitionEnd);
    return () => container.removeEventListener("transitionend", handleTransitionEnd);
  }, [currentIndex, blogs.length]);

  // ✅ Buttons
  const nextSlide = () => setCurrentIndex((prev) => prev + 1);
  const prevSlide = () => setCurrentIndex((prev) => prev - 1);

  // ✅ Center detection
  const getCenterIndex = () => {
    const centerPos = currentIndex + Math.floor(visibleSlides / 2);
    return ((centerPos - startIndex) % blogs.length + blogs.length) % blogs.length;
  };
  const centerIndex = getCenterIndex();

  return (
    <div className="relative pt-20 pb-10 px-2 md:px-6">
      <div className="w-full flex justify-center">
        <div
          ref={containerRef}
          className="flex items-stretch transition-transform duration-500 ease-in-out"
          style={{
            width: `${(slides.length / visibleSlides) * 100}%`,
          }}
        >
          {slides.map((b, i) => {
            const title = pick(b.title, activeLang);
            const excerpt = pick(b.excerpt, activeLang);
            const image =
              b.coverImage?.url ||
              "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop";
            const link = `/blogs/${b.slug}`;
            const realIndex = (i - startIndex + blogs.length) % blogs.length;
            const isCenter = realIndex === centerIndex;

            return (
              <div
                key={`${b._id || i}`}
                className={`flex-shrink-0 px-2 md:px-3 transition-transform duration-500`}
                style={{
                  width: `${100 / visibleSlides}%`,
                  transform: isCenter ? "scale(1.04)" : "scale(0.97)",
                  transformOrigin: "center center",
                  zIndex: isCenter ? 2 : 1,
                }}
              >
                <article className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
                  <div className="w-full h-44 md:h-52 lg:h-56 ">
                    <img
                      src={image}
                      alt={title}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  <div className="p-4 flex flex-col justify-between flex-grow">
                    <div>
                      <h3 className="text-[15px] font-semibold leading-snug text-slate-900 line-clamp-2 min-h-[42px]">
                        {title}
                      </h3>
                      <p className="mt-2 text-xs text-slate-600 line-clamp-2 min-h-[32px]">
                        {excerpt}
                      </p>
                    </div>
                    <Link
                      to={link}
                      className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-[#0F3A56]"
                    >
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-[#1276BD] text-white text-[14px]">
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

      {/* Arrows */}
      <div className="mt-6 flex justify-center gap-3">
        <button
          onClick={prevSlide}
          className="grid h-10 w-10 place-items-center rounded-full bg-white ring-1 ring-black/5 shadow hover:shadow-md"
          aria-label="Prev"
        >
          <HiOutlineChevronLeft className="text-xl" />
        </button>
        <button
          onClick={nextSlide}
          className="grid h-10 w-10 place-items-center rounded-full bg-white ring-1 ring-black/5 shadow hover:shadow-md"
          aria-label="Next"
        >
          <HiOutlineChevronRight className="text-xl" />
        </button>
      </div>
    </div>
  );
}

