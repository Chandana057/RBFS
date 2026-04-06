import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  FolderOpen, 
  Users, 
  Settings, 
  LogOut, 
  Menu,
  X,
  User as UserIcon,
  ShieldAlert,
  CalendarDays,
  FolderHeart,
  Activity,
  ShieldCheck
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { cn } from "../utils/cn";

export const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);

  const NAV_ITEMS = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard", roles: ["admin", "user"] },
    { label: "Files", icon: FolderOpen, path: "/files", roles: ["admin", "user"] },
    { label: "Shared with Me", icon: FolderHeart, path: "/shared", roles: ["admin", "user"] },
    { label: "Calendar", icon: CalendarDays, path: "/calendar", roles: ["admin", "user"] },
    { label: "Activity", icon: Activity, path: "/activity", roles: ["admin", "user"] },
    { label: "Security", icon: ShieldCheck, path: "/security", roles: ["admin", "user"] },
    { label: "Admin Panel", icon: ShieldAlert, path: "/admin", roles: ["admin"] },
    { label: "Settings", icon: Settings, path: "/settings", roles: ["admin", "user"] },
  ];

  const visibleNavItems = NAV_ITEMS.filter(item => item.roles.includes(user?.role));

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 glass-panel border-r ghost-border transition-transform duration-300 flex flex-col",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b ghost-border shrink-0">
          <Link to="/dashboard" className="text-xl font-bold font-manrope tracking-tighter flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-surface-container-lowest text-sm">S</span>
            </div>
            ShareVault
          </Link>
          <button className="lg:hidden text-on-surface-variant" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {visibleNavItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative group",
                  isActive 
                    ? "text-primary bg-primary/10" 
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50"
                )}
              >
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-primary/10 rounded-lg"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className="w-5 h-5 z-10" />
                <span className="z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t ghost-border shrink-0">
          <button 
            onClick={logout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-error hover:bg-error/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-16 shrink-0 border-b ghost-border flex items-center justify-between px-4 lg:px-8 bg-background/50 backdrop-blur-md z-30">
          <button 
            className="lg:hidden p-2 -ml-2 text-on-surface-variant hover:text-on-surface rounded-md focus:outline-none"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex-1" />

          {/* Profile Dropdown */}
          <div className="relative">
            <button 
              className="flex items-center gap-3 focus:outline-none"
              onClick={() => setProfileOpen(!isProfileOpen)}
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-on-surface leading-none">{user?.name}</p>
                <p className="text-xs text-on-surface-variant mt-1 capitalize">{user?.role}</p>
              </div>
              <img 
                src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest"} 
                alt={user?.name} 
                className="w-9 h-9 rounded-full bg-surface-container object-cover ghost-border"
              />
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-48 glass-card border ghost-border py-1 z-50 shadow-ambient"
                  >
                    <div className="px-4 py-2 border-b ghost-border sm:hidden">
                      <p className="text-sm font-medium text-on-surface"> {user?.name}</p>
                      <p className="text-xs text-on-surface-variant capitalize">{user?.role}</p>
                    </div>
                    <Link to="/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-variant/50 hover:text-on-surface" onClick={() => setProfileOpen(false)}>
                      <UserIcon className="w-4 h-4" />
                      Profile
                    </Link>
                    <button 
                      onClick={logout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-error hover:bg-error/10 text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
