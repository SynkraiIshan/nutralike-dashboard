import { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftAddon?: ReactNode;
}

export default function Input({
  label,
  error,
  hint,
  leftAddon,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-[13px] font-medium text-[#373737]">
          {label}
          {props.required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        {leftAddon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555555] text-sm select-none">
            {leftAddon}
          </span>
        )}
        <input
          id={inputId}
          className={cn(
            'w-full py-2 px-3 text-sm border rounded-lg transition-colors',
            'text-[#0a0a0a] placeholder:text-[#a3a29e] bg-white',
            'focus:outline-none focus:ring-2 focus:ring-[#314f2d]/20 focus:border-[#314f2d]',
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
              : 'border-[#c3c3c3] hover:border-[#899f87]',
            leftAddon && 'pl-7',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-[12px] text-red-500">{error}</p>}
      {hint && !error && <p className="text-[12px] text-[#555555]">{hint}</p>}
    </div>
  );
}
