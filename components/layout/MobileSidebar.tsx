'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { X, LayoutDashboard, Package, FileText, Upload, Users, Settings, BarChart2, LogOut } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard',   href: '/dashboard',   icon: LayoutDashboard },
  { label: 'Ingredients', href: '/ingredients', icon: Package },
  { label: 'Quotations',  href: '/quotations',  icon: FileText },
  { label: 'Uploads',     href: '/uploads',     icon: Upload },
  { label: 'Clients',     href: '/clients',     icon: Users },
  { label: 'Settings',    href: '/settings',    icon: Settings },
  { label: 'Reports',     href: '/reports',     icon: BarChart2 },
];

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ background: 'linear-gradient(180deg, #314f2d 0%, #3c5d39 100%)' }}
      >
        {/* Logo header */}
        <div className="px-5 border-b border-white/10 flex items-center justify-between h-[70px]">
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
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-3 overflow-y-auto">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={[
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 cursor-pointer',
                  isActive ? 'text-white' : 'text-white/90 hover:text-white hover:bg-white/5',
                ].join(' ')}
                style={isActive ? { background: 'linear-gradient(90deg, #7c9f43, #597a3e)' } : {}}
              >
                <Icon size={20} className={isActive ? 'text-white' : 'text-[#899f87]'} />
                <span className="text-[15px] font-medium">{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-5 border-t border-white/10 pt-4">
          <button 
            onClick={() => {
              document.cookie = 'nutralike_auth=; path=/; max-age=0; samesite=lax';
              window.location.href = '/login';
            }}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all duration-150 cursor-pointer"
          >
            <LogOut size={18} className="text-[#899f87]" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
