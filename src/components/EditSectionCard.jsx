
import React, { useState } from 'react';
import { ChevronDown, Plus, Eye, X, ArrowUp, ArrowDown } from 'lucide-react';
import TranslationTabs from './TranslationTabs';
import PreviewModal from './modals/PreviewModal';
import WysiwygEditor from './WysiwygEditor';

const toSnakeCase = (str) => {
  return str.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
};


const EditSectionCard = ({ section: initialSection, index, totalSections, onMoveUp, onMoveDown }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [section, setSection] = useState(initialSection);
  const [activeLanguage, setActiveLanguage] = useState('en');
  const [showPreview, setShowPreview] = useState(false);
  const [showAddField, setShowAddField] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState('text');
  
  const inputClasses = "block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500";


  const handleInputChange = (fieldName, value) => {
    const updatedFields = section.fields.map(field => {
      if (field.name === fieldName) {
        if (typeof field.value === 'object') {
          return { ...field, value: { ...field.value, [activeLanguage]: value } };
        }
        return { ...field, value };
      }
      return field;
    });
    setSection({ ...section, fields: updatedFields });
  };
  
  const handleAddField = () => {
    if (!newFieldName.trim()) return alert('Field name cannot be empty.');
    const snakeCaseName = toSnakeCase(newFieldName);
    if (section.fields.some(f => f.name === snakeCaseName)) return alert('Field name already exists.');
    
    const newField = {
      name: snakeCaseName,
      type: newFieldType,
      value: newFieldType === 'image' ? '' : { en: '', vn: '' }
    };

    setSection({ ...section, fields: [...section.fields, newField] });
    setNewFieldName('');
    setNewFieldType('text');
    setShowAddField(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Saving section ${section.id}`, section);
    // In a real app, an API call would be made here
  };

  const renderField = (field) => {
    const value = typeof field.value === 'object' ? field.value[activeLanguage] : field.value;

    switch (field.type) {
      case 'image':
        return (
          <div className="flex items-start space-x-4">
            {(field.value) && <img src={field.value} alt="preview" className="w-24 h-24 object-cover rounded-md border dark:border-gray-600" />}
            <input
              type="text"
              className={`mt-1 ${inputClasses}`}
              placeholder="Enter image URL"
              value={field.value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
            />
          </div>
        );
      case 'markdown':
        return (
           <WysiwygEditor
              value={value}
              onChange={(content) => handleInputChange(field.name, content)}
            />
        );
      case 'textarea':
        return (
          <textarea
            rows={4}
            className={`mt-1 ${inputClasses}`}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
          />
        );
      case 'text':
      default:
        return (
          <input
            type="text"
            className={`mt-1 ${inputClasses}`}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
          />
        );
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
        <div className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50" onClick={() => setIsOpen(!isOpen)}>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{section.title}</h3>
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
                <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onMoveUp(); }}
                    disabled={index === 0}
                    className="p-1 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Move section up"
                >
                    <ArrowUp size={16} />
                </button>
                <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onMoveDown(); }}
                    disabled={index === totalSections - 1}
                    className="p-1 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Move section down"
                >
                    <ArrowDown size={16} />
                </button>
            </div>
            <ChevronDown size={20} className={`text-gray-500 dark:text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </div>
        {isOpen && (
          <form onSubmit={handleSubmit}>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <TranslationTabs activeLanguage={activeLanguage} setActiveLanguage={setActiveLanguage} />
              <div className="mt-6 space-y-6">
                {section.fields.map(field => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{field.name.replace(/_/g, ' ')}</label>
                    {renderField(field)}
                  </div>
                ))}
              </div>
            </div>
            
            {showAddField && (
              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t dark:border-gray-700">
                <h4 className="text-sm font-medium mb-2 dark:text-gray-200">Add New Field</h4>
                <div className="flex flex-col md:flex-row gap-4">
                  <input
                    type="text"
                    placeholder="Field Name (e.g., 'Button Text')"
                    value={newFieldName}
                    onChange={(e) => setNewFieldName(e.target.value)}
                    className={`flex-grow ${inputClasses}`}
                  />
                  <select
                    value={newFieldType}
                    onChange={(e) => setNewFieldType(e.target.value)}
                    className={inputClasses}
                  >
                    <option value="text">Text</option>
                    <option value="textarea">Textarea</option>
                    <option value="markdown">Markdown</option>
                    <option value="image">Image URL</option>
                  </select>
                   <div className="flex items-center space-x-2">
                      <button type="button" onClick={handleAddField} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm">Add</button>
                      <button type="button" onClick={() => setShowAddField(false)} className="px-4 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-500 text-sm">Cancel</button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div>
                <button type="button" onClick={() => setShowAddField(!showAddField)} className="flex items-center px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <Plus size={16} className="mr-1" /> Add Field
                </button>
              </div>
              <div className="flex items-center space-x-2">
                 <button type="button" onClick={() => setShowPreview(true)} className="flex items-center px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <Eye size={16} className="mr-1" /> Preview
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Save Section</button>
              </div>
            </div>
          </form>
        )}
      </div>
      {showPreview && <PreviewModal section={section} onClose={() => setShowPreview(false)} />}
    </>
  );
};

export default EditSectionCard;