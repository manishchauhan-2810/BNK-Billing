import React, { useState } from 'react';
import { Menu, User, LogOut } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Topbar = ({ toggleSidebar }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Map paths to titles
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Dashboard';
    if (path.includes('/bills/create')) return 'Create Bill';
    if (path.match(/\/bills\/\w+/)) return 'Bill Details';
    if (path.includes('/bills')) return 'Bill History';
    if (path.includes('/pending')) return 'Pending Payments';
    if (path.includes('/revenue')) return 'Revenue Analytics';
    return '';
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 z-10 sticky top-0">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="mr-4 p-2 -ml-2 rounded-lg text-gray-500 hover:bg-gray-100 md:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold text-bnk-primary hidden sm:block">
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-700">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500">{user?.role === 'admin' ? 'Administrator' : 'Receptionist'}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-bnk-secondary/20 text-bnk-primary flex items-center justify-center font-semibold border border-bnk-secondary/30">
              {getInitials(user?.name)}
            </div>
          </button>

          {dropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setDropdownOpen(false)}
              ></div>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-1 z-20 border border-gray-100">
                <div className="px-4 py-2 sm:hidden border-b border-gray-100 mb-1">
                  <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
                <button
                  onClick={() => { setDropdownOpen(false); logout(); }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
