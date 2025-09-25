
import React, { useState, useRef, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import TranslationTabs from '../TranslationTabs';
import { slugify } from '../../utils/helpers';

const ProductCategoryForm = ({ category, onClose, onSave }) => {
  const [activeLanguage, setActiveLanguage] = useState('en');
  const fileInputRef = useRef(null);
  
  const isCreating = !category;

  const [formData, setFormData] = useState({
    name: category?.name || { en: '', vn: '' },
    slug: category?.slug || '',
    description: category?.description || { en: '', vn: '' },
    image: category?.image || '',
  });

  useEffect(() => {
    if (isCreating && formData.name.en) {
      setFormData(prev => ({ ...prev, slug: slugify(prev.name.en) }));
    }
  }, [formData.name.en, isCreating]);

  const handleChange = (field, value) => {
    if (['name', 'description'].includes(field)) {
      setFormData(prev => ({
        ...prev,
        [field]: {
          ...prev[field],
          [activeLanguage]: value,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange('image', reader.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };
  
  const inputClasses = "mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";
  const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{category ? 'Edit Category' : 'Create New Category'}</h2>
        <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"><X size={24} /></button>
      </div>
      <TranslationTabs activeLanguage={activeLanguage} setActiveLanguage={setActiveLanguage} />
      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div>
          <label htmlFor="name" className={labelClasses}>Category Name</label>
          <input type="text" id="name" className={inputClasses} value={formData.name[activeLanguage]} onChange={e => handleChange('name', e.target.value)} required />
        </div>
        <div>
          <label htmlFor="slug" className={labelClasses}>Slug</label>
          <input type="text" id="slug" className={inputClasses} value={formData.slug} onChange={e => handleChange('slug', e.target.value)} required />
        </div>
        <div>
          <label htmlFor="description" className={labelClasses}>Description</label>
          <textarea id="description" rows={3} className={inputClasses} value={formData.description[activeLanguage]} onChange={e => handleChange('description', e.target.value)}></textarea>
        </div>
        <div>
          <label className={labelClasses}>Image</label>
          <div className="mt-1 flex items-center space-x-4">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden">
              {formData.image ? <img src={formData.image} alt="Preview" className="w-full h-full object-cover" /> : <span className="text-xs text-gray-500 dark:text-gray-400">Preview</span>}
            </div>
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageChange} />
            <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 rounded-md hover:bg-indigo-200 dark:hover:bg-indigo-900 text-sm font-medium flex items-center"><Upload size={16} className="mr-2" /> Upload Image</button>
          </div>
        </div>
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-500">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">{category ? 'Update' : 'Create'}</button>
        </div>
      </form>
    </div>
  );
};

export default ProductCategoryForm;