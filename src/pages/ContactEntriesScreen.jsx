import React, { useState, useEffect } from "react";
import { User, Mail, Phone, Tag, Trash2, Search, Eye } from "lucide-react";
import { getAllContacts, deleteContact, markContactAsRead } from "../Api/api";
import { CommonToaster } from "../Common/CommonToaster";

const ContactEntriesScreen = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [contactsPerPage] = useState(10);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isVietnamese, setIsVietnamese] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".dropdown-container")) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);


  // 🌐 Detect language mode from navbar toggle (vi-mode)
  useEffect(() => {
    const checkLang = () =>
      setIsVietnamese(document.body.classList.contains("vi-mode"));
    checkLang();
    const observer = new MutationObserver(checkLang);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  // 🌍 Translations
  const t = {
    en: {
      title: "Contact Entries",
      subtitle: "Manage all contact submissions",
      search: "Search by name, email, or phone...",
      sortBy: "Sort by:",
      newest: "Newest",
      oldest: "Oldest",
      az: "A → Z",
      za: "Z → A",
      view: "View",
      deleteConfirm: "Are you sure you want to delete this entry?",
      deleteSuccess: "Contact deleted successfully ✅",
      deleteFail: "Failed to delete contact ❌",
      loadFail: "Failed to load contacts ❌",
      noData: "No contacts found",
      loading: "Loading contacts...",
      prev: "Prev",
      next: "Next",
      page: "Page",
    },
    vi: {
      title: "Danh sách liên hệ",
      subtitle: "Quản lý tất cả các yêu cầu liên hệ",
      search: "Tìm kiếm theo tên, email hoặc số điện thoại...",
      sortBy: "Sắp xếp theo:",
      newest: "Mới nhất",
      oldest: "Cũ nhất",
      az: "A → Z",
      za: "Z → A",
      view: "Xem",
      deleteConfirm: "Bạn có chắc chắn muốn xóa mục này không?",
      deleteSuccess: "Xóa liên hệ thành công ✅",
      deleteFail: "Xóa liên hệ thất bại ❌",
      loadFail: "Tải dữ liệu thất bại ❌",
      noData: "Không có liên hệ nào",
      loading: "Đang tải dữ liệu...",
      prev: "Trước",
      next: "Tiếp",
      page: "Trang",
    },
  }[isVietnamese ? "vi" : "en"];

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await getAllContacts();
      setContacts(res.data.data || []);
    } catch (err) {
      console.error(err);
      CommonToaster(t.loadFail, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm(t.deleteConfirm)) {
      try {
        await deleteContact(id);
        CommonToaster(t.deleteSuccess, "success");
        fetchContacts();
      } catch (err) {
        console.error(err);
        CommonToaster(t.deleteFail, "error");
      }
    }
  };

  const handleViewContact = async (contact) => {
    setSelectedContact(contact);
    if (!contact.isRead) {
      // Optimistically update local state to reflect read status instantly
      setContacts((prevContacts) =>
        prevContacts.map((c) =>
          c._id === contact._id ? { ...c, isRead: true } : c
        )
      );
      try {
        await markContactAsRead(contact._id);
      } catch (err) {
        console.error("Failed to mark contact as read", err);
        // Rollback if the API fails
        setContacts((prevContacts) =>
          prevContacts.map((c) =>
            c._id === contact._id ? { ...c, isRead: false } : c
          )
        );
      }
    }
  };

  // 🔍 Filter + Sort
  const filteredContacts = contacts
    .filter((c) => {
      const q = searchQuery.toLowerCase();
      return (
        c.name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.phone?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortOption === "newest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortOption === "oldest")
        return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortOption === "az") return a.name?.localeCompare(b.name);
      if (sortOption === "za") return b.name?.localeCompare(a.name);
      return 0;
    });

  // 📄 Pagination
  const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);
  const startIndex = (currentPage - 1) * contactsPerPage;
  const paginatedContacts = filteredContacts.slice(
    startIndex,
    startIndex + contactsPerPage
  );

  const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  return (
    <div className="min-h-screen p-6 bg-[#171717] rounded-2xl text-white">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-1 text-white">{t.title}</h1>
      <p className="text-gray-400 mb-6">{t.subtitle}</p>

      {/* Search & Sort */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
        {/* Search bar */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={t.search}
            className="bg-[#262626] border border-[#2E2F2F] rounded-full pl-9 pr-3 py-2 text-sm text-white w-full outline-none focus:ring-2 focus:ring-[#0085C8]"
          />
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">{t.sortBy}</span>
          <div className="relative dropdown-container">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDropdown((prev) => !prev);
              }}
              className="flex items-center justify-between w-48 px-4 py-3 text-sm rounded-full bg-[#1F1F1F] border border-[#2E2F2F] text-white hover:border-gray-500 transition-all cursor-pointer"
            >
              {sortOption === "oldest"
                ? t.oldest
                : sortOption === "newest"
                  ? t.newest
                  : sortOption === "az"
                    ? t.az
                    : t.za}

              <svg
                className={`ml-2 w-4 h-4 transform transition-transform ${showDropdown ? "rotate-180" : ""
                  }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#1F1F1F] border border-[#2E2F2F] shadow-lg z-10 animate-fadeIn">
                {[
                  { value: "newest", label: t.newest },
                  { value: "oldest", label: t.oldest },
                  { value: "az", label: t.az },
                  { value: "za", label: t.za },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortOption(option.value);
                      setShowDropdown(false);
                      setCurrentPage(1);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${sortOption === option.value
                      ? "bg-[#2E2F2F] text-white rounded-lg"
                      : "text-gray-300 hover:bg-[#2A2A2A] hover:text-white rounded-lg"
                      }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-center text-gray-400">{t.loading}</p>
      ) : paginatedContacts.length === 0 ? (
        <p className="text-center text-gray-400">{t.noData}</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-[#2E2F2F] shadow-sm">
          <table className="min-w-full divide-y divide-[#2E2F2F]">
            <thead className="bg-[#1F1F1F]">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">
                  {isVietnamese ? "Tên" : "Name"}
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">
                  {isVietnamese ? "Email" : "Email"}
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">
                  {isVietnamese ? "Số điện thoại" : "Phone"}
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">
                  {isVietnamese ? "Công ty" : "Company"}
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">
                  {isVietnamese ? "Trạng thái" : "Status"}
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-300">
                  {isVietnamese ? "Hành động" : "Actions"}
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedContacts.map((c) => (
                <tr
                  key={c._id}
                  className="hover:bg-[#2A2A2A] transition-colors border-b border-[#2E2F2F]"
                >
                  <td className="px-6 py-4 flex items-center gap-2 text-white">
                    <div className="relative">
                      <User size={18} className="text-[#0085C8]" />
                      {!c.isRead && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-[#1F1F1F]"></span>
                      )}
                    </div>
                    <span className={!c.isRead ? "font-bold text-white" : "text-gray-300"}>
                      {c.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-300">{c.email}</td>
                  <td className="px-6 py-4 text-gray-300">{c.phone}</td>
                  <td className="px-6 py-4 text-gray-300">
                    {c.company || "-"}
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${c.isRead ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {c.isRead ? (isVietnamese ? "Đã đọc" : "Read") : (isVietnamese ? "Chưa đọc" : "Unread")}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex items-center justify-center gap-2">
                    {/* 👁 View Button */}
                    <button
                      onClick={() => handleViewContact(c)}
                      className="bg-[#0085C8] hover:bg-[#009FE3] text-white p-2 rounded-md transition"
                      title={t.view}
                    >
                      <Eye size={16} />
                    </button>

                    {/* 🗑 Delete Button */}
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="bg-[#E74C3C] hover:bg-[#FF6B5C] text-white p-2 rounded-md transition"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-6">
          <button
            disabled={currentPage === 1}
            onClick={handlePrev}
            className="px-4 py-1.5 rounded-lg border border-[#2E2F2F] text-gray-300 hover:bg-[#2E2F2F] disabled:opacity-50"
          >
            {t.prev}
          </button>
          <span className="text-gray-400 text-sm">
            {t.page} {currentPage} / {totalPages || 1}
          </span>
          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={handleNext}
            className="px-4 py-1.5 rounded-lg border border-[#2E2F2F] text-gray-300 hover:bg-[#2E2F2F] disabled:opacity-50"
          >
            {t.next}
          </button>
        </div>
      )}

      {/* View Modal */}
      {selectedContact && (
        <div
          className="fixed inset-0 bg-black/50 bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setSelectedContact(null)}
        >
          <div
            className="bg-[#171717] border border-[#2E2F2F] rounded-lg shadow-xl w-full max-w-lg p-6 relative overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition cursor-pointer"
              onClick={() => setSelectedContact(null)}
            >
              ✖
            </button>

            <h2 className="text-xl font-semibold mb-4 text-white">
              {selectedContact.name}
            </h2>

            <div className="space-y-3 text-gray-300">
              <p className="flex items-center gap-2">
                <Mail size={18} className="text-[#0085C8]" />{" "}
                {selectedContact.email}
              </p>
              <p className="flex items-center gap-2">
                <Phone size={18} className="text-[#0085C8]" />{" "}
                {selectedContact.phone}
              </p>
              {selectedContact.company && (
                <p className="flex items-center gap-2">
                  <Tag size={18} className="text-[#0085C8]" />{" "}
                  {selectedContact.company}
                </p>
              )}
              {selectedContact.product && (
                <p>
                  {isVietnamese ? "Quan tâm đến:" : "Interested in:"}{" "}
                  <span className="font-medium text-white capitalize">
                    {selectedContact.product === "viscose" 
                      ? (isVietnamese ? "Xơ" : "Fiber") 
                      : selectedContact.product === "cotton" 
                        ? (isVietnamese ? "Bông" : "Cotton") 
                        : selectedContact.product === "machinery"
                          ? (isVietnamese ? "Máy móc" : "Machinery")
                          : selectedContact.product}
                  </span>
                </p>
              )}
              {selectedContact.message && (
                <p className="mt-2 text-gray-300">{selectedContact.message}</p>
              )}
              {selectedContact.fileUrl && (
                <p className="mt-2">
                  File:{" "}
                  <a
                    href={`${import.meta.env.VITE_API_URL.replace(/\/$/, "")}${selectedContact.fileUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0085C8] underline hover:text-blue-400"
                  >
                    {isVietnamese ? "Xem / Tải xuống" : "View / Download"}
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactEntriesScreen;
