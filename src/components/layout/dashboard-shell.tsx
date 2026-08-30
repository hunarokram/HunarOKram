"use client";

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Palette,
  CalendarCheck,
  Users,
  Calendar,
  Star,
  BarChart3,
  Globe,
  Settings,
  CreditCard,
  Menu,
  X,
  Compass,
  LogOut
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

interface DashboardShellProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Experiences', href: '/experiences', icon: Palette },
  { name: 'Bookings', href: '/bookings', icon: CalendarCheck },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Reviews', href: '/reviews', icon: Star },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Website', href: '/website', icon: Globe },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Subscription', href: '/subscription', icon: CreditCard },
];

export function DashboardShell({ children }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const currentPath = usePathname();
  const { user, logoutAsync } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutAsync();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-warm-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-warm-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 flex-col bg-white border-r border-warm-200 transition-transform duration-300 ease-in-out lg:static lg:flex lg:translate-x-0",
          sidebarOpen ? "translate-x-0 flex" : "-translate-x-full hidden lg:flex"
        )}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-warm-100">
          <Link href="/dashboard" className="flex items-center gap-2 text-brand-600">
            <img src="/logo.jpg" alt="HunarOKram Logo" className="w-6 h-6 object-contain" />
            <span className="text-xl font-display font-bold text-warm-900">HunarOKram</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 -mr-2 text-warm-500 hover:text-warm-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = currentPath === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors group relative",
                  isActive
                    ? "bg-brand-50 text-brand-600"
                    : "text-warm-600 hover:bg-warm-50 hover:text-warm-900"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-brand-600 rounded-r-full" />
                )}
                <item.icon
                  className={cn(
                    "w-5 h-5 shrink-0",
                    isActive ? "text-brand-600" : "text-warm-400 group-hover:text-warm-600"
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-warm-100">
          <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-warm-50 border border-warm-200/50">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
                <span className="text-brand-700 font-semibold">{user?.email?.charAt(0).toUpperCase() || 'U'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-warm-900 truncate">{user?.email || 'User'}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500" />
                  <p className="text-xs text-warm-500 font-medium">Online</p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleLogout}
              className="p-2 text-warm-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between h-16 px-4 bg-white border-b border-warm-200">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 text-warm-500 hover:text-warm-700 rounded-lg hover:bg-warm-50"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-4">
            <button onClick={handleLogout} className="text-warm-500 hover:text-red-600">
              <LogOut className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
              <span className="text-brand-700 font-semibold text-xs">{user?.email?.charAt(0).toUpperCase() || 'U'}</span>
            </div>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
}
