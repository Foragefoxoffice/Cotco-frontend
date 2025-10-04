
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

// Mock data now simplified for list view
const pagesData = [
    { id: 1, title: { en: 'About Us', vn: 'Giới thiệu' }, slug: 'about-us', updatedAt: '2023-05-15' },
    { id: 2, title: { en: 'Contact Us', vn: 'Liên hệ' }, slug: 'contact-us', updatedAt: '2023-05-10' },
    { id: 3, title: { en: 'Privacy Policy', vn: 'Chính sách bảo mật' }, slug: 'privacy-policy', updatedAt: '2023-04-20' },
    { id: 4, title: { en: 'Terms and Conditions', vn: 'Điều khoản và điều kiện' }, slug: 'terms-and-conditions', updatedAt: '2023-04-15' },
  ];

const PagesScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPages = pagesData.filter(
    (page) =>
      page.title.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.title.vn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Pages</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage static content pages</p>
        </div>
        <Link
          to="/pages/new"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
        >
          <Plus size={18} className="mr-1" />
          Create Page
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Search pages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title (EN)</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Slug</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Last Updated</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredPages.map((page) => (
                <tr key={page.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 font-medium">{page.title.en}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-mono">{page.slug}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{page.updatedAt}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link to={`/pages/${page.slug}`} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"><Edit size={18} /></Link>
                      <button className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PagesScreen;