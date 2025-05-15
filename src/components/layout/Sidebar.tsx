import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Library, 
  Calendar, 
  Bell, 
  Bookmark, 
  History, 
  Award, 
  Settings, 
  ChevronsLeft,
  ChevronsRight,
  Users
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleSidebar }) => {
  const { user, logout } = useAuth();
  
  return (
    <aside 
      className={`bg-white shadow-soft flex flex-col border-r border-neutral-200 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="p-4 flex items-center justify-between border-b border-neutral-200">
        <div className={`flex items-center ${isCollapsed ? 'justify-center w-full' : ''}`}>
          <div className="flex items-center justify-center w-8 h-8 bg-primary-600 text-white rounded-md">
            <span className="text-lg font-bold">S</span>
          </div>
          {!isCollapsed && <span className="ml-3 font-semibold text-lg">ScreenShare</span>}
        </div>
        <button 
          onClick={toggleSidebar}
          className={`text-neutral-500 hover:text-neutral-700 p-1 rounded-md ${isCollapsed ? 'absolute right-2' : ''}`}
        >
          {isCollapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
        </button>
      </div>

      {!isCollapsed && (
        <div className="px-4 py-3 border-b border-neutral-200">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-primary-200 flex items-center justify-center text-primary-700 font-semibold">
            {user?.name ? user.name.charAt(0).toUpperCase() : ''}
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium">{user?.name}</div>
              <div className="text-xs text-neutral-500">{user?.email}</div>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        <NavLink to="/" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
          <Home size={isCollapsed ? 20 : 18} />
          {!isCollapsed && <span>Home</span>}
        </NavLink>
        <NavLink to="/" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
          <Library size={isCollapsed ? 20 : 18} />
          {!isCollapsed && <span>My Library</span>}
        </NavLink>
        <NavLink to="/meetings" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
          <Calendar size={isCollapsed ? 20 : 18} />
          {!isCollapsed && (
            <div className="flex items-center justify-between w-full">
              <span>Meetings</span>
              <span className="bg-primary-100 text-primary-800 text-xs px-2 py-0.5 rounded-full">New</span>
            </div>
          )}
        </NavLink>
        <NavLink to="/notifications" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
          <Bell size={isCollapsed ? 20 : 18} />
          {!isCollapsed && (
            <div className="flex items-center justify-between w-full">
              <span>Notifications</span>
              <span className="bg-accent-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">4</span>
            </div>
          )}
        </NavLink>
        <NavLink to="/watch-later" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
          <Bookmark size={isCollapsed ? 20 : 18} />
          {!isCollapsed && <span>Watch Later</span>}
        </NavLink>
        <NavLink to="/history" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
          <History size={isCollapsed ? 20 : 18} />
          {!isCollapsed && <span>History</span>}
        </NavLink>
        <NavLink to="/earn" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
          <Award size={isCollapsed ? 20 : 18} />
          {!isCollapsed && (
            <div className="flex items-center justify-between w-full">
              <span>Earn free videos</span>
              <span className="bg-primary-100 text-primary-800 text-xs px-2 py-0.5 rounded-full">New</span>
            </div>
          )}
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
          <Settings size={isCollapsed ? 20 : 18} />
          {!isCollapsed && <span>Settings</span>}
        </NavLink>
      </nav>

      <div className="p-4 border-t border-neutral-200">
        {!isCollapsed && (
          <div className="mb-2">
            <button className="sidebar-item w-full justify-start">
              <Users size={18} />
              <span>Spaces</span>
            </button>
          </div>
        )}
        <button 
          onClick={logout}
          className="btn btn-secondary w-full flex items-center justify-center"
        >
          {isCollapsed ? <span>🚪</span> : <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;