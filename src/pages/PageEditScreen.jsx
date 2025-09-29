import React, { useMemo, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import EditSectionCard from "../components/EditSectionCard";
import { slugify } from "../utils/helpers";

// --- MOCK DATA for all pages ---
const pagesDatabase = [
  {
    id: 1,
    title: { en: "About Us", vn: "Giới thiệu" },
    slug: "about-us",
    updatedAt: "2023-05-15",
    sections: [
      {
        id: "about_hero",
        title: "Hero Section",
        fields: [
          {
            name: "heading",
            type: "text",
            value: { en: "Who We Are", vn: "Chúng tôi là ai" },
          },
          {
            name: "subheading",
            type: "textarea",
            value: {
              en: "Your trusted partner in textiles.",
              vn: "Đối tác tin cậy của bạn trong ngành dệt may.",
            },
          },
          {
            name: "banner_image",
            type: "image",
            value: "https://picsum.photos/seed/about/1200/400",
          },
        ],
      },
      {
        id: "about_content",
        title: "Main Content",
        fields: [
          {
            name: "content_body",
            type: "markdown",
            value: {
              en: "Detailed content about the company history...",
              vn: "Nội dung chi tiết về lịch sử công ty...",
            },
          },
        ],
      },
      {
        id: "about_seo",
        title: "SEO Settings",
        fields: [
          {
            name: "meta_title",
            type: "text",
            value: { en: "About COTCO", vn: "Về COTCO" },
          },
          {
            name: "meta_description",
            type: "textarea",
            value: {
              en: "Learn about our mission in the textile industry.",
              vn: "Tìm hiểu về sứ mệnh của chúng tôi trong ngành dệt may.",
            },
          },
        ],
      },
    ],
  },
  {
    id: 10,
    title: { en: "Homepage", vn: "Trang chủ" },
    slug: "homepage",
    updatedAt: "2023-06-01",
    sections: [
      {
        id: "home_hero",
        title: "Hero Section",
        fields: [
          {
            name: "main_heading",
            type: "text",
            value: {
              en: "Excellence in Every Thread",
              vn: "Sự xuất sắc trong từng sợi chỉ",
            },
          },
          {
            name: "subheading",
            type: "textarea",
            value: {
              en: "Global sourcing for quality textiles.",
              vn: "Nguồn cung ứng toàn cầu cho hàng dệt may chất lượng.",
            },
          },
          {
            name: "cta_button_text",
            type: "text",
            value: { en: "Our Products", vn: "Sản phẩm" },
          },
        ],
      },
      {
        id: "home_who_we_are",
        title: "Who We Are",
        fields: [
          {
            name: "heading",
            type: "text",
            value: {
              en: "Pioneering the Future of Textiles",
              vn: "Tiên phong tương lai ngành dệt",
            },
          },
          {
            name: "content",
            type: "textarea",
            value: {
              en: "For decades, we have been a cornerstone of the global textile market...",
              vn: "Trong nhiều thập kỷ, chúng tôi đã là nền tảng của thị trường dệt may toàn cầu...",
            },
          },
        ],
      },
      {
        id: "home_partners",
        title: "Proud Partners",
        fields: [
          {
            name: "heading",
            type: "text",
            value: {
              en: "Our Trusted Partners",
              vn: "Các đối tác tin cậy của chúng tôi",
            },
          },
          {
            name: "partner_logos",
            type: "image",
            value: "https://picsum.photos/seed/partners/800/100",
          },
        ],
      },
      {
        id: "home_seo",
        title: "SEO Settings",
        fields: [
          {
            name: "meta_title",
            type: "text",
            value: {
              en: "COTCO Vietnam - Global Textile Sourcing",
              vn: "COTCO Việt Nam - Nguồn cung ứng dệt may toàn cầu",
            },
          },
          {
            name: "meta_description",
            type: "textarea",
            value: {
              en: "High-quality cotton, fiber, and textile machinery from COTCO Vietnam.",
              vn: "Bông, sợi và máy móc dệt may chất lượng cao từ COTCO Việt Nam.",
            },
          },
        ],
      },
    ],
  },
];

// --- Blank Page Template ---
const blankPage = {
  id: 0,
  title: { en: "", vn: "" },
  slug: "",
  updatedAt: new Date().toISOString().split("T")[0],
  sections: [
    {
      id: "new_content",
      title: "Main Content",
      fields: [
        { name: "heading", type: "text", value: { en: "", vn: "" } },
        { name: "content_body", type: "markdown", value: { en: "", vn: "" } },
      ],
    },
    {
      id: "new_seo",
      title: "SEO Settings",
      fields: [
        { name: "meta_title", type: "text", value: { en: "", vn: "" } },
        {
          name: "meta_description",
          type: "textarea",
          value: { en: "", vn: "" },
        },
      ],
    },
  ],
};

// --- Page Edit Screen ---
const PageEditScreen = () => {
  const { pageSlug } = useParams();
  const isCreating = pageSlug === "new";

  const pageData = useMemo(() => {
    if (isCreating) return blankPage;
    return pagesDatabase.find((p) => p.slug === pageSlug);
  }, [pageSlug, isCreating]);

  const [page, setPage] = useState(pageData);
  const [activeLanguage, setActiveLanguage] = useState("en");

  useEffect(() => {
    if (isCreating && page && page.title.en) {
      setPage((p) => ({ ...p, slug: slugify(p.title.en) }));
    }
  }, [page?.title.en, isCreating]);

  if (!page) {
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-gray-700 dark:text-gray-300">
          Page Not Found
        </h1>
        <Link
          to="/admin/pages"
          className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <ArrowLeft size={16} className="mr-1" /> Back to All Pages
        </Link>
      </div>
    );
  }

  // --- Handlers ---
  const handleTitleChange = (lang, value) => {
    setPage((p) => ({ ...p, title: { ...p.title, [lang]: value } }));
  };

  const handleSlugChange = (value) => {
    setPage((p) => ({ ...p, slug: value }));
  };

  const handleMoveSection = (index, direction) => {
    if (!page) return;

    const newSections = [...page.sections];
    const otherIndex = direction === "up" ? index - 1 : index + 1;

    if (otherIndex < 0 || otherIndex >= newSections.length) return;

    // Swap
    [newSections[index], newSections[otherIndex]] = [
      newSections[otherIndex],
      newSections[index],
    ];

    setPage((p) => ({ ...p, sections: newSections }));
  };

  // --- Shared Classes ---
  const inputClasses =
    "block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";

  const labelClasses =
    "block text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link
            to="/admin/pages"
            className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-2"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to All Pages
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {isCreating ? "Create New Page" : `Editing: ${page.title.en}`}
          </h1>
        </div>

        <button
          onClick={() => console.log("Saving page", page)}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
        >
          <Save size={16} className="mr-2" />
          {isCreating ? "Publish Page" : "Save Changes"}
        </button>
      </div>

      {/* Page Info */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={`${labelClasses} mb-2`}>Page Title (EN)</label>
            <input
              type="text"
              className={inputClasses}
              value={page.title.en}
              onChange={(e) => handleTitleChange("en", e.target.value)}
            />
          </div>
          <div>
            <label className={`${labelClasses} mb-2`}>Page Title (VN)</label>
            <input
              type="text"
              className={inputClasses}
              value={page.title.vn}
              onChange={(e) => handleTitleChange("vn", e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4">
          <label className={labelClasses}>Slug</label>
          <div className="flex items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400 mr-1 hidden sm:inline">
              yourwebsite.com/
            </span>
            <input
              type="text"
              className={inputClasses}
              value={page.slug}
              onChange={(e) => handleSlugChange(slugify(e.target.value))}
            />
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {page.sections.map((section, index) => (
          <EditSectionCard
            key={section.id}
            section={section}
            index={index}
            totalSections={page.sections.length}
            onMoveUp={() => handleMoveSection(index, "up")}
            onMoveDown={() => handleMoveSection(index, "down")}
          />
        ))}
      </div>
    </div>
  );
};

export default PageEditScreen;
