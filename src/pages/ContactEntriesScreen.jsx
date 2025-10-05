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
      c.name.toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query) ||
      c.phone.toLowerCase().includes(query)
    );
  });

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-1 text-gray-800 dark:text-gray-100">{t.title}</h1>
      <p className="text-gray-600 mb-6 dark:text-gray-400">{t.subtitle}</p>

      <div className="mb-6 flex items-center gap-3">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.search}
            className="w-full pl-10 pr-3 py-2 border rounded-lg text-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-500 dark:text-gray-400">Loading contacts...</p>
      ) : filteredContacts.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">No contacts found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-lg shadow-sm divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-indigo-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Phone</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Company</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredContacts.map((c) => (
                <tr
                  key={c._id}
                  className="hover:bg-indigo-50 dark:hover:bg-gray-700 text-white cursor-pointer transition-colors"
                  onClick={() => setSelectedContact(c)}
                >
                  <td className="px-6 py-4 flex items-center gap-2">
                    <User size={18} className="text-indigo-500" /> {c.name}
                  </td>
                  <td className="px-6 py-4">{c.email}</td>
                  <td className="px-6 py-4">{c.phone}</td>
                  <td className="px-6 py-4">{c.company || "-"}</td>
                  <td className="px-6 py-4 flex justify-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(c._id);
                      }}
                      className="text-red-600 hover:text-red-800 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {selectedContact && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedContact(null)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg p-6 relative transform scale-100 transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-xl"
              onClick={() => setSelectedContact(null)}
            >
              ✖
            </button>
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">{selectedContact.name}</h2>

            <div className="space-y-2 text-gray-700 dark:text-gray-200">
              <p className="flex items-center gap-2"><Mail size={18} className="text-indigo-500" /> {selectedContact.email}</p>
              <p className="flex items-center gap-2"><Phone size={18} className="text-indigo-500" /> {selectedContact.phone}</p>
              {selectedContact.company && <p className="flex items-center gap-2"><Tag size={18} className="text-indigo-500" /> {selectedContact.company}</p>}
              {selectedContact.product && <p>Interested in: <span className="font-medium">{selectedContact.product}</span></p>}
              {selectedContact.message && <p className="mt-2">{selectedContact.message}</p>}
              {selectedContact.fileUrl && (
                <p className="mt-2">
                  File:{" "}
                  <a
                    href={`http://localhost:5000${selectedContact.fileUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 underline hover:text-indigo-800"
                  >
                    View/Download
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
