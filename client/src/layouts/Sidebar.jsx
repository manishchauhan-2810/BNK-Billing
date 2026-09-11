import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FilePlus, FileText, Clock, TrendingUp, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import bnkLogo from '../assets/BNKLOGO.png';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Create Bill', path: '/bills/create', icon: FilePlus },
    { name: 'Bill History', path: '/bills', icon: FileText },
    { name: 'Pending Payments', path: '/pending', icon: Clock },
    { name: 'Revenue', path: '/revenue', icon: TrendingUp },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`
        fixed top-0 left-0 h-screen w-[260px] bg-white border-r border-gray-100 z-30
        flex flex-col transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="h-16 flex items-center px-6 border-b border-gray-100 gap-2.5">
          <img src={bnkLogo} alt="BNK Physiotherapy" className="w-11 h-11 object-contain flex-shrink-0" />
          <div className="text-bnk-primary leading-none">
            <span className="text-lg font-bold tracking-tight">BNK </span>
            <span className="text-md font-semibold uppercase tracking-wider text-bnk-secondary">healthcare</span>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-bnk-secondary flex justify-self-center">Group</div>

          </div>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end
                onClick={() => { if (window.innerWidth < 768) toggleSidebar(); }}
                className={({ isActive }) => `
                  flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors
                  ${isActive
                    ? 'bg-bnk-primary text-white'
                    : 'text-gray-600 hover:bg-bnk-secondary/10 hover:text-bnk-primary'
                  }
                `}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-600 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;