'use client';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
}: SearchBarProps) {
  return (
    <div className={`relative min-w-0 overflow-visible ${className}`}>
      <Search
        size={16}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a3a29e] pointer-events-none z-10"
        aria-hidden
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 text-sm bg-[#f2f6ef] border border-[#c3c3c3] rounded-lg
          focus:outline-none focus:border-[#314f2d] focus:ring-2 focus:ring-[#314f2d]/10
          text-[#373737] placeholder:text-[#a3a29e] transition-colors"
      />
    </div>
  );
}
