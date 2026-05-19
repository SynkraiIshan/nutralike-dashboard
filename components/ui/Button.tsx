'use client';
import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  loading?: boolean;
}

const variants: Record<string, string> = {
  primary:   'bg-[#314f2d] text-white hover:bg-[#3c5d39] active:scale-95 border border-[#314f2d]',
  secondary: 'bg-white text-[#314f2d] border border-[#314f2d] hover:bg-[#f2f6ef] active:scale-95',
  ghost:     'bg-transparent text-[#373737] hover:bg-[#f2f6ef] border border-transparent active:scale-95',
  danger:    'bg-white text-red-600 border border-red-300 hover:bg-red-50 active:scale-95',
};

const sizes: Record<string, string> = {
  sm: 'px-3 py-1.5 text-[12px] min-h-[32px]',
  md: 'px-4 py-2 text-[13px] min-h-[36px]',
  lg: 'px-5 py-2.5 text-[14px] min-h-[44px]',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  loading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-150 cursor-pointer',
        'disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#314f2d]/30',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
}
