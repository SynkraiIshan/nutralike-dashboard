'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Package, FileText, Upload,
  Settings, BarChart2, LogOut,
  ChevronLeft, ChevronRight,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard',   href: '/dashboard',   icon: LayoutDashboard },
  { label: 'Ingredients', href: '/ingredients', icon: Package },
  { label: 'Quotations',  href: '/quotations',  icon: FileText },
  { label: 'Uploads',     href: '/uploads',     icon: Upload },
  { label: 'Settings',    href: '/settings',    icon: Settings },
  { label: 'Reports',     href: '/reports',     icon: BarChart2 },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={[
        'flex-shrink-0 flex flex-col h-full hidden lg:flex relative transition-all duration-300',
        collapsed ? 'w-16' : 'w-60',
      ].join(' ')}
      style={{ background: 'linear-gradient(180deg, #314f2d 0%, #3c5d39 100%)' }}
    >
      {/* Logo */}
      <div className={['border-b border-white/10 flex items-center h-[70px]', collapsed ? 'px-0 justify-center' : 'px-5 justify-start'].join(' ')}>
        {collapsed ? (
          /* Icon-only */
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Nutralike"
              width={22}
              height={22}
              className="object-contain brightness-0 invert"
            />
          </div>
        ) : (
          /* Full logo + text */
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Nutralike"
                width={22}
                height={22}
                className="object-contain brightness-0 invert"
              />
            </div>
            <span className="text-white font-bold text-lg tracking-wider leading-none whitespace-nowrap">
              NUTRALIKE
            </span>
          </div>
        )}
      </div>

      {/* Collapse toggle button */}
      <button
        onClick={onToggle}
        className={[
          'absolute top-[52px] -right-3 z-50 cursor-pointer',
          'w-6 h-6 rounded-full border border-[#c3c3c3] bg-white shadow-md',
          'flex items-center justify-center text-[#314f2d]',
          'hover:bg-[#f2f6ef] transition-colors',
        ].join(' ')}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
      </button>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-3 overflow-y-auto overflow-x-hidden">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={[
                'flex items-center rounded-lg transition-all duration-150 cursor-pointer',
                collapsed ? 'justify-center px-0 py-2.5' : 'gap-3 px-3 py-2.5',
                isActive
                  ? 'text-white'
                  : 'text-white/90 hover:text-white hover:bg-white/5',
              ].join(' ')}
              style={isActive ? { background: 'linear-gradient(90deg, #7c9f43, #597a3e)' } : {}}
            >
              <Icon size={20} className={isActive ? 'text-white' : 'text-[#899f87]'} />
              {!collapsed && (
                <span className="text-[15px] font-medium whitespace-nowrap">{label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-2 pb-5 border-t border-white/10 pt-4">
        <button
          onClick={() => {
            document.cookie = 'nutralike_auth=; path=/; max-age=0; samesite=lax';
            window.location.href = '/login';
          }}
          title={collapsed ? 'Logout' : undefined}
          className={[
            'flex items-center w-full rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all duration-150 cursor-pointer',
            collapsed ? 'justify-center px-0 py-2.5' : 'gap-3 px-3 py-2.5',
          ].join(' ')}
        >
          <LogOut size={18} className="text-[#899f87]" />
          {!collapsed && <span className="text-sm font-medium whitespace-nowrap">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
