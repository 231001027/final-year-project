import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Home,
  FolderKanban,
  BookOpen,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  User,
  GraduationCap,
} from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const studentNavItems: NavItem[] = [
  { label: 'Dashboard', path: '/student/dashboard', icon: <Home className="w-5 h-5" /> },
  { label: 'Available Topics', path: '/student/topics', icon: <FolderKanban className="w-5 h-5" /> },
  { label: 'My Project', path: '/student/my-project', icon: <BookOpen className="w-5 h-5" /> },
  { label: 'Profile', path: '/student/profile', icon: <User className="w-5 h-5" /> },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = studentNavItems;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getPageTitle = () => {
    const currentItem = navItems.find((item) => item.path === location.pathname);
    return currentItem?.label || 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-5 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-teal-500 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white">ProjectPortal</span>
            </div>
            <button
              className="lg:hidden p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User info */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center text-white font-semibold">
                {(user as any)?.team_name?.[0] || 'T'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                  {(user as any)?.team_name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {(user as any)?.team_id}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Bottom actions */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 transition-colors"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between h-full px-4 lg:px-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
                {getPageTitle()}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium">
                Student
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
