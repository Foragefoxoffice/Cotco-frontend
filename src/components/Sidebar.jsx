
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Package,
  Newspaper,
  Phone,
  Settings,
  ChevronRight,
  Cpu
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const getInitialMenuState = () => ({
    pages: location.pathname.startsWith('/pages'),
    products: location.pathname.startsWith('/products'),
    news: location.pathname.startsWith('/news'),
  });

  const [openMenus, setOpenMenus] = React.useState(getInitialMenuState);

  React.useEffect(() => {
    setOpenMenus(getInitialMenuState());
  }, [location.pathname]);
  
  const toggleMenu = (key) => {
    setOpenMenus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const menuItems = [
    { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { 
      label: 'Pages', 
      icon: <FileText size={20} />, 
      key: 'pages',
      subItems: [
        { path: '/admin/pages', label: 'All Pages' },
        { path: '/admin/pages/homepage', label: 'Homepage' },
      ] 
    },
    { 
      label: 'Products', 
      icon: <Package size={20} />, 
      key: 'products',
      subItems: [
        { path: '/admin/products', label: 'Categories' },
      ]
    },
    { path: '/admin/machines', icon: <Cpu size={20} />, label: 'Machines' },
    { 
      label: 'News', 
      icon: <Newspaper size={20} />, 
      key: 'news',
      subItems: [
        { path: '/admin/news', label: 'All Articles' },
        { path: '/admin/news/categories', label: 'Categories' },
      ]
    },
    { path: '/admin/contact', icon: <Phone size={20} />, label: 'Contact' },
    { path: '/admin/settings', icon: <Settings size={20} />, label: 'Global Settings' },
  ];

  // FIX: Made the className prop optional with a default value to fix type errors where it was not provided.
  const NavLink = ({ to, children, className = '' }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`flex items-center px-4 py-2 text-sm rounded-md transition-colors duration-200 ${
          isActive
            ? 'bg-indigo-50 dark:bg-gray-700 text-indigo-600 dark:text-white font-medium'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
        } ${className}`}
      >
        {children}
      </Link>
    );
  };

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Orchid CMS</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">COTCO Admin</p>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul>
          {menuItems.map((item) => (
            <li key={item.key || item.path} className="px-2 py-1">
              {item.subItems ? (
                <>
                  <button
                    onClick={() => toggleMenu(item.key)}
                    className={`flex items-center justify-between w-full px-4 py-2 text-sm rounded-md text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${location.pathname.startsWith(`/${item.key}`) && 'font-medium'}`}
                  >
                    <div className="flex items-center">
                      <span className="mr-3">{item.icon}</span>
                      {item.label}
                    </div>
                    <ChevronRight size={16} className={`transition-transform ${openMenus[item.key] ? 'rotate-90' : ''}`} />
                  </button>
                  {openMenus[item.key] && (
                    <ul className="pl-6 mt-1 space-y-1">
                      {item.subItems.map(subItem => (
                        <li key={subItem.path}>
                          <NavLink to={subItem.path}>{subItem.label}</NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <NavLink to={item.path}>
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">Orchid CMS v1.0.0</p>
      </div>
    </div>
  );
};

export default Sidebar;