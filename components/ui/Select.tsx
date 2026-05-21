import { SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  placeholder?: string;
  /** 'inline' places label beside the select on one line */
  labelPosition?: 'top' | 'inline';
}

export default function Select({
  label,
  options,
  error,
  placeholder,
  labelPosition = 'top',
  className,
  id,
  ...props
}: SelectProps) {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  const isInline = labelPosition === 'inline';

  return (
    <div
      className={cn(
        isInline ? 'flex flex-row items-center gap-2.5 min-w-0' : 'flex flex-col gap-1.5'
      )}
    >
      {label && (
        <label
          htmlFor={selectId}
          className={cn(
            'text-[13px] font-medium text-[#373737]',
            isInline && 'shrink-0 whitespace-nowrap'
          )}
        >
          {label}
          {props.required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <div className={cn('relative', isInline && 'flex-1 min-w-[10rem]')}>
        <select
          id={selectId}
          className={cn(
            'w-full py-2 pl-3 pr-8 text-sm border rounded-lg appearance-none transition-colors',
            'text-[#0a0a0a] bg-white cursor-pointer',
            'focus:outline-none focus:ring-2 focus:ring-[#314f2d]/20 focus:border-[#314f2d]',
            error
              ? 'border-red-400'
              : 'border-[#c3c3c3] hover:border-[#899f87]',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#555555] pointer-events-none"
        />
      </div>
      {error && <p className="text-[12px] text-red-500">{error}</p>}
    </div>
  );
}
