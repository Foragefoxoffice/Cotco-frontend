
import React, { useState } from 'react';
import { Package, Search, Plus, LayoutGrid, LayoutList, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCategoryForm from '../components/forms/ProductCategoryForm';

const initialProductCategories = [
    { id: 1, name: { en: 'Cotton', vn: 'Bông' }, slug: 'cotton', description: { en: 'Global cotton sourcing to power your production', vn: 'Nguồn cung ứng bông toàn cầu để cung cấp năng lượng cho sản xuất của bạn' }, products: 8, image: 'https://picsum.photos/seed/cotton/800/600' },
    { id: 2, name: { en: 'Fiber', vn: 'Sợi' }, slug: 'fiber', description: { en: 'Eco-friendly fibers for sustainable textiles', vn: 'Sợi thân thiện với môi trường cho ngành dệt may bền vững' }, products: 12, image: 'https://picsum.photos/seed/fiber/800/600' },
    { id: 3, name: { en: 'Machines', vn: 'Máy móc' }, slug: 'machines', description: { en: 'Advanced textile machinery for modern manufacturing', vn: 'Máy móc dệt may tiên tiến cho sản xuất hiện đại' }, products: 15, image: 'https://picsum.photos/seed/machines/800/600' },
];

const ProductsScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState('grid');
  const [categories, setCategories] = useState(initialProductCategories);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const handleCreate = () => {
    setEditingCategory(null);
    setShowForm(true);
  };
  
  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleDelete = (id) => {
      if (window.confirm('Are you sure you want to delete this category? This cannot be undone.')) {
          setCategories(cats => cats.filter(c => c.id !== id));
      }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  const handleSaveCategory = (categoryData) => {
    if (editingCategory) {
        setCategories(cats => cats.map(c => c.id === editingCategory.id ? { ...editingCategory, ...categoryData } : c));
    } else {
        const newCategory = {
            id: Math.max(0, ...categories.map(c => c.id)) + 1,
            products: 0,
            ...categoryData,
        };
        setCategories(cats => [newCategory, ...cats]);
    }
    handleCloseForm();
  };

  const filteredCategories = categories.filter(category =>
      category.name.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.en.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Product Categories</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage product categories and listings</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search size={18} className="text-gray-400" /></div>
            <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="Search product categories..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
              <button onClick={() => setView('grid')} className={`p-2 ${view === 'grid' ? 'bg-indigo-100 dark:bg-gray-700 text-indigo-700 dark:text-indigo-300' : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}><LayoutGrid size={16} /></button>
              <button onClick={() => setView('list')} className={`p-2 ${view === 'list' ? 'bg-indigo-100 dark:bg-gray-700 text-indigo-700 dark:text-indigo-300' : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}><LayoutList size={16} /></button>
            </div>
            <button onClick={handleCreate} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center">
              <Plus size={16} className="mr-1" /> New Category
            </button>
          </div>
        </div>
      </div>

      <div className="mb-4"><p className="text-sm text-gray-500 dark:text-gray-400">Showing {filteredCategories.length} of {categories.length} categories</p></div>

      {view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <div key={category.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md dark:hover:shadow-indigo-500/10 transition-shadow transform hover:-translate-y-1 duration-200 flex flex-col">
              <div className="h-48 overflow-hidden"><img src={category.image} alt={category.name.en} className="w-full h-full object-cover" /></div>
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{category.name.en}</h3>
                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium px-2.5 py-0.5 rounded">{category.products} items</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 h-10 flex-grow">{category.description.en}</p>
                <div className="flex justify-between items-center mt-auto">
                    <Link to={`/products/${category.slug}`} className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm">Manage Products</Link>
                    <div className="flex items-center space-x-2">
                        <button onClick={() => handleEdit(category)} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 p-1"><Edit size={16}/></button>
                        <button onClick={() => handleDelete(category.id)} className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-1"><Trash2 size={16}/></button>
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Products</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCategories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0"><img className="h-10 w-10 rounded object-cover" src={category.image} alt={category.name.en} /></div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{category.name.en}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{category.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300">{category.products} items</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end items-center space-x-2">
                        <Link to={`/products/${category.slug}`} className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300">Manage Products</Link>
                        <button onClick={() => handleEdit(category)} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 p-1"><Edit size={16}/></button>
                        <button onClick={() => handleDelete(category.id)} className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-1"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <ProductCategoryForm category={editingCategory} onClose={handleCloseForm} onSave={handleSaveCategory} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsScreen;