
import React from 'react';
import { X } from 'lucide-react';

const PreviewModal = ({ section, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4 border-b dark:border-gray-700 pb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{section.title} - Preview</h2>
            <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
              <X size={24} />
            </button>
          </div>
          <div className="space-y-4">
            {section.fields.map(field => (
              <div key={field.name}>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 capitalize mb-1">{field.name.replace(/_/g, ' ')}</h3>
                {(() => {
                  const value = typeof field.value === 'object' ? field.value.en : field.value; // Previewing in English for simplicity
                  switch (field.type) {
                    case 'image':
                      return value ? <img src={value} alt="Preview" className="mt-2 rounded-md border dark:border-gray-600 max-w-xs" /> : <p className="text-gray-400 italic">No image URL</p>;
                    case 'markdown':
                      return <div className="prose prose-sm dark:prose-invert max-w-none p-2 border dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700/50" dangerouslySetInnerHTML={{ __html: value }} />;
                    case 'textarea':
                      return <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{value}</p>;
                    case 'text':
                    default:
                      return <p className="text-gray-800 dark:text-gray-200">{value}</p>;
                  }
                })()}
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t dark:border-gray-700 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;