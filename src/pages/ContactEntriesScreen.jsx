import React, { useState, useEffect } from "react";
import { User, Mail, Phone, Tag, Trash2, Search } from "lucide-react";
import { getAllContacts, deleteContact } from "../Api/api";
import { CommonToaster } from "../Common/CommonToaster";

const ContactEntriesScreen = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);

  const t = {
    title: "Contact Entries",
    subtitle: "Manage all contact submissions",
    search: "Search by name, email, or phone...",
    deleteConfirm: "Are you sure you want to delete this entry?",
    deleteSuccess: "Contact deleted successfully",
    deleteFail: "Failed to delete contact",
    loadFail: "Failed to load contacts",
  };

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

  const filteredContacts = contacts.filter((c) => {
    const query = searchQuery.toLowerCase();
    return (
      c.name?.toLowerCase().includes(query) ||
      c.email?.toLowerCase().includes(query) ||
      c.phone?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen p-6 bg-[#171717] text-white">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-1 text-white">{t.title}</h1>
      <p className="text-gray-400 mb-6">{t.subtitle}</p>

      {/* Search Bar */}
      <div className="mb-6 flex items-center gap-3">
        <div className="relative w-full md:w-72">
          <Search
            className="absolute left-3 top-2.5 text-gray-400"
            size={18}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.search}
            style={{
              backgroundColor: "#262626",
              border: "1px solid #2E2F2F",
              borderRadius: "8px",
              color: "#fff",
              padding: "10px 14px 10px 36px",
              fontSize: "14px",
              width: "100%",
              transition: "all 0.3s ease",
            }}
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-center text-gray-400">Loading contacts...</p>
      ) : filteredContacts.length === 0 ? (
        <p className="text-center text-gray-400">No contacts found</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-[#2E2F2F] shadow-sm">
          <table className="min-w-full divide-y divide-[#2E2F2F]">
            <thead>
              <tr className="bg-[#1F1F1F]">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">
                  Company
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.map((c) => (
                <tr
                  key={c._id}
                  className="hover:bg-[#2A2A2A] transition-colors cursor-pointer"
                  onClick={() => setSelectedContact(c)}
                >
                  <td className="px-6 py-4 flex items-center gap-2 text-white">
                    <User size={18} className="text-[#0085C8]" /> {c.name}
                  </td>
                  <td className="px-6 py-4 text-gray-300">{c.email}</td>
                  <td className="px-6 py-4 text-gray-300">{c.phone}</td>
                  <td className="px-6 py-4 text-gray-300">{c.company || "-"}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(c._id);
                      }}
                      style={{
                        backgroundColor: "#E74C3C",
                        border: "none",
                        borderRadius: "6px",
                        color: "#fff",
                        fontSize: "13px",
                        fontWeight: 500,
                        padding: "6px 10px",
                        transition: "all 0.3s ease",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.backgroundColor = "#FF6B5C")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.backgroundColor = "#E74C3C")
                      }
                    >
                      <Trash2 size={14} className="inline mr-1" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Contact Details Modal */}
      {selectedContact && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setSelectedContact(null)}
        >
          <div
            className="bg-[#171717] border border-[#2E2F2F] rounded-lg shadow-xl w-full max-w-lg p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
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
                  Interested in:{" "}
                  <span className="font-medium text-white">
                    {selectedContact.product}
                  </span>
                </p>
              )}
              {selectedContact.message && (
                <p className="mt-2 text-gray-300">
                  {selectedContact.message}
                </p>
              )}
              {selectedContact.fileUrl && (
                <p className="mt-2">
                  File:{" "}
                  <a
                    href={`http://localhost:5000${selectedContact.fileUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0085C8] underline hover:text-blue-400"
                  >
                    View / Download
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
