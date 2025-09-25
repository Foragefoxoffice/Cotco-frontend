
import React, { useState } from 'react';
import TranslationTabs from '../components/TranslationTabs';

const GlobalSettingsScreen = () => {
  const [activeLanguage, setActiveLanguage] = useState('en');

  const [settings, setSettings] = useState({
    site_logo: 'https://picsum.photos/seed/logo/200/80',
    company_name: { en: 'COTCO Vietnam', vn: 'COTCO Việt Nam' },
    address_footer: { en: '123 Textile Street, Ho Chi Minh City, Vietnam', vn: '123 Đường Dệt May, Thành phố Hồ Chí Minh, Việt Nam' },
    phone_footer: '+84 28 1234 5678',
    email_footer: 'info@cotco.com',
    facebook_link: 'https://facebook.com/cotco',
    linkedin_link: 'https://linkedin.com/company/cotco',
    copyright_text: { en: '© 2023 COTCO Vietnam. All rights reserved.', vn: '© 2023 COTCO Việt Nam. Bảo lưu mọi quyền.' },
  });

  const handleChange = (field, value) => {
    const translatableFields = ['company_name', 'address_footer', 'copyright_text'];
    if (translatableFields.includes(field)) {
      setSettings(prev => ({
        ...prev,
        [field]: {
          ...prev[field],
          [activeLanguage]: value,
        },
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Saving settings:', settings);
  };
  
  const inputClasses = "mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";
  const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300";


  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Global Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Configure site-wide settings, footer, and header</p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6">
          <TranslationTabs activeLanguage={activeLanguage} setActiveLanguage={setActiveLanguage} />
          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div>
              <label htmlFor="site_logo" className={labelClasses}>Site Logo</label>
              <div className="mt-1 flex items-center">
                <div className="h-20 w-40 overflow-hidden bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600"><img src={settings.site_logo} alt="Site Logo" className="h-full w-full object-contain" /></div>
                <button type="button" className="ml-4 px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">Change Logo</button>
              </div>
            </div>
            <div>
              <label htmlFor="company_name" className={labelClasses}>Company Name</label>
              <input type="text" id="company_name" className={inputClasses} value={settings.company_name[activeLanguage]} onChange={(e) => handleChange('company_name', e.target.value)} />
            </div>
            <div>
              <label htmlFor="address_footer" className={labelClasses}>Footer Address</label>
              <input type="text" id="address_footer" className={inputClasses} value={settings.address_footer[activeLanguage]} onChange={(e) => handleChange('address_footer', e.target.value)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone_footer" className={labelClasses}>Footer Phone</label>
                <input type="text" id="phone_footer" className={inputClasses} value={settings.phone_footer} onChange={(e) => handleChange('phone_footer', e.target.value)} />
              </div>
              <div>
                <label htmlFor="email_footer" className={labelClasses}>Footer Email</label>
                <input type="email" id="email_footer" className={inputClasses} value={settings.email_footer} onChange={(e) => handleChange('email_footer', e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="facebook_link" className={labelClasses}>Facebook Link</label>
                <input type="url" id="facebook_link" className={inputClasses} value={settings.facebook_link} onChange={(e) => handleChange('facebook_link', e.target.value)} />
              </div>
              <div>
                <label htmlFor="linkedin_link" className={labelClasses}>LinkedIn Link</label>
                <input type="url" id="linkedin_link" className={inputClasses} value={settings.linkedin_link} onChange={(e) => handleChange('linkedin_link', e.target.value)} />
              </div>
            </div>
            <div>
              <label htmlFor="copyright_text" className={labelClasses}>Copyright Text</label>
              <input type="text" id="copyright_text" className={inputClasses} value={settings.copyright_text[activeLanguage]} onChange={(e) => handleChange('copyright_text', e.target.value)} />
            </div>
            <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Save Settings</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GlobalSettingsScreen;