import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: boolean;
}

export default function Card({ children, className, padding = true }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-[#c3c3c3] shadow-sm',
        padding && 'p-6',
        className
      )}
    >
      {children}
    </div>
  );
}
