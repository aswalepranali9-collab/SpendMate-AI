import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  PlusCircle,
  Sun,
  Moon,
  LogOut,
  User,
  Menu,
  CreditCard,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { NotificationDropdown } from './NotificationDropdown';

export const Navbar = ({ onOpenQuickAdd, onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#060913]/80 backdrop-blur-2xl shadow-lg shadow-black/20">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Side: Brand & Mobile Sidebar Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 shadow-lg shadow-indigo-500/25 ring-1 ring-white/20 group-hover:scale-105 transition transform">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-white">
                  SpendMate<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">AI</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                  PRO
                </span>
              </div>
              <span className="hidden sm:inline-block text-[10px] text-slate-400 -mt-0.5 font-medium">
                Wealth Intelligence
              </span>
            </div>
          </Link>
        </div>

        {/* Right Side: Quick Add, Notifications, Theme, User Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Add Button */}
          <button
            onClick={onOpenQuickAdd}
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 transition transform active:scale-95 ring-1 ring-white/10"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Record Entry</span>
          </button>

          {/* Compact Add for mobile */}
          <button
            onClick={onOpenQuickAdd}
            className="sm:hidden p-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md"
            title="Record Entry"
          >
            <PlusCircle className="w-5 h-5" />
          </button>

          {/* Notification Bell Dropdown */}
          <NotificationDropdown />

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700 transition"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-800/80 transition ring-1 ring-indigo-500/30"
            >
              <img
                src={
                  user?.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80'
                }
                alt={user?.name || 'User'}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/50"
              />
              <span className="hidden md:inline-block text-xs font-bold text-slate-200 pr-1">
                {user?.name?.split(' ')[0] || 'Account'}
              </span>
            </button>

            {profileOpen && (
              <div
                className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0D121F] border border-slate-700/90 shadow-2xl py-2 z-50 backdrop-blur-2xl"
                onMouseLeave={() => setProfileOpen(false)}
              >
                <div className="px-4 py-2.5 border-b border-slate-800">
                  <p className="text-xs font-bold text-white">{user?.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                </div>

                <Link
                  to="/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition"
                >
                  <User className="w-4 h-4 text-indigo-400" />
                  <span>Profile & Preferences</span>
                </Link>

                <Link
                  to="/budgets"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition"
                >
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  <span>Budget Setup</span>
                </Link>

                <div className="border-t border-slate-800 my-1" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
