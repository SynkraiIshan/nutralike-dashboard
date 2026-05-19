'use client';
import { ReactNode } from 'react';

interface TabsProps {
  tabs: { id: string; label: string; icon?: ReactNode }[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export default function Tabs({ tabs, activeTab, onChange, className = '' }: TabsProps) {
  return (
    <div className={`flex border-b border-[#c3c3c3] ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={[
            'flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all duration-150',
            'focus:outline-none border-b-2 -mb-px',
            activeTab === tab.id
              ? 'border-[#314f2d] text-[#314f2d]'
              : 'border-transparent text-[#555555] hover:text-[#373737] hover:border-[#c3c3c3]',
          ].join(' ')}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
