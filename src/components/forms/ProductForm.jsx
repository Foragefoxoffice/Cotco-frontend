
import React, { useState, useRef } from 'react';
import { X, Upload } from 'lucide-react';
import TranslationTabs from '../TranslationTabs';

const ProductForm = ({ product, onClose, onSave }) => {
  const [activeLanguage, setActiveLanguage] = useState('en');
  const fileInputRef = useRef(null);
  
  const inputClasses = "block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";


  const [formData, setFormData] = useState({
    title: product?.title || { en: '', vn: '' },
    description: product?.description || { en: '', vn: '' },
    specifications: product?.specifications || { en: '', vn: '' },
    image: product?.image || '',
  });

  const handleChange = (field, value) => {
    if (['title', 'description', 'specifications'].includes(field)) {
      setFormData(prev => ({
        ...prev,
        [field]: {
          ...prev[field],
          [activeLanguage]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };
  
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange('image', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{product ? 'Edit Product' : 'Create New Product'}</h2>
        <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"><X size={24} /></button>
      </div>
      <TranslationTabs activeLanguage={activeLanguage} setActiveLanguage={setActiveLanguage} />
      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
          <input
            type="text" id="title"
            className={`mt-1 ${inputClasses}`}
            value={formData.title[activeLanguage]}
            onChange={(e) => handleChange('title', e.target.value)} required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
          <textarea
            id="description" rows={4}
            className={`mt-1 ${inputClasses}`}
            value={formData.description[activeLanguage]}
            onChange={(e) => handleChange('description', e.target.value)}
          ></textarea>
        </div>
        
        {/* Specifications Table */}
        <div>
          <label htmlFor="specifications" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Specifications Table</label>
          <textarea
            id="specifications" rows={6}
            className={`mt-1 ${inputClasses} font-mono text-sm`}
            value={formData.specifications[activeLanguage]}
            onChange={(e) => handleChange('specifications', e.target.value)}
            placeholder="Use Markdown for the table, e.g.&#10;| Feature    | Detail     |&#10;|------------|------------|&#10;| Color      | White      |"
          ></textarea>
           <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Use Markdown for the table.
          </p>
        </div>
        
        {/* Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image</label>
          <div className="mt-1 flex items-center space-x-4">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden">
              {formData.image ? (
                <img src={formData.image} alt="Product Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs text-gray-500 dark:text-gray-400">Preview</span>
              )}
            </div>
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
              ref={fileInputRef}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 rounded-md hover:bg-indigo-200 dark:hover:bg-indigo-900 text-sm font-medium flex items-center"
            >
              <Upload size={16} className="mr-2" />
              Upload Image
            </button>
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Upload an image of the product.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-500">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">{product ? 'Update Product' : 'Create Product'}</button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;