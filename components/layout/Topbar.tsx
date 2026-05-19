'use client';
import { usePathname } from 'next/navigation';
import { Bell, Search, Menu } from 'lucide-react';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard':     'Dashboard',
  '/ingredients':   'Ingredient Management',
  '/quotations':    'Quotations',
  '/quotations/new': 'New Quotation',
  '/uploads':       'Upload Center',
  '/clients':       'Clients',
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
        {/* Search - hidden on small mobile */}
        <div className="relative hidden sm:block">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a3a29e]" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-2 text-sm bg-[#f2f6ef] border border-[#c3c3c3] rounded-lg w-44 lg:w-52
              focus:outline-none focus:border-[#314f2d] focus:ring-2 focus:ring-[#314f2d]/10
              text-[#373737] placeholder:text-[#a3a29e] transition-colors"
          />
        </div>

        {/* Bell */}
        <button className="relative p-2 rounded-lg hover:bg-[#f2f6ef] transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer">
          <Bell size={18} className="text-[#373737]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ff8800]" />
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-[#314f2d] flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
            KN
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-[#0a0a0a] leading-none">Kunal Nagani</p>
            <p className="text-xs text-[#555555] mt-0.5">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
