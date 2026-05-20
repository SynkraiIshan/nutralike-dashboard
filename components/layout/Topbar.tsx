'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard':     'Dashboard',
  '/ingredients':   'Ingredient Management',
  '/quotations':    'Quotations',
  '/quotations/new': 'New Quotation',
  '/uploads':       'Upload Center',
  '/settings':      'Settings',
  '/reports':       'Reports & History',
};

interface TopbarProps {
  onMobileMenuClick: () => void;
}

export default function Topbar({ onMobileMenuClick }: TopbarProps) {
  const pathname = usePathname();

  const titleKey = Object.keys(PAGE_TITLES)
    .sort((a, b) => b.length - a.length)
    .find((key) => pathname === key || pathname.startsWith(key + '/'));

  const title = titleKey ? PAGE_TITLES[titleKey] : 'Nutralike Admin';

  return (
    <header className="h-16 bg-white border-b border-[#c3c3c3] flex items-center justify-between px-4 lg:px-6 flex-shrink-0 z-30">
      <div className="flex items-center gap-3">
        {/* Hamburger - mobile only */}
        <button
          onClick={onMobileMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-[#f2f6ef] text-[#373737] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="type-h3-20 text-[#0a0a0a] hidden sm:block">{title}</h1>
        <h1 className="text-base font-semibold text-[#0a0a0a] sm:hidden">{title}</h1>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        {/* Profile → User Management */}
        <Link
          href="/settings?tab=users"
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-[#f2f6ef] transition-colors cursor-pointer"
          aria-label="Open user management settings"
        >
          <div className="w-8 h-8 rounded-full bg-[#314f2d] flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
            KN
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-[#0a0a0a] leading-none">Kunal Nagani</p>
            <p className="text-xs text-[#555555] mt-0.5">Admin</p>
          </div>
        </Link>
      </div>
    </header>
  );
}
