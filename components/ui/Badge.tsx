type BadgeVariant = 'success' | 'warning' | 'info' | 'danger' | 'neutral' | 'ai';

const VARIANTS: Record<BadgeVariant, string> = {
  success: 'bg-[#25d366]/10 text-[#1a9e4a] border border-[#25d366]/20',
  warning: 'bg-[#ff8800]/10 text-[#cc6e00] border border-[#ff8800]/20',
  info:    'bg-[#314f2d]/10 text-[#314f2d] border border-[#314f2d]/20',
  danger:  'bg-red-50 text-red-600 border border-red-200',
  neutral: 'bg-[#f2f6ef] text-[#555555] border border-[#c3c3c3]',
  ai:      'bg-[#7c9f43]/10 text-[#597a3e] border border-[#7c9f43]/30',
};

export default function Badge({
  label,
  variant = 'neutral',
}: {
  label: string;
  variant?: BadgeVariant;
}) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${VARIANTS[variant]}`}
    >
      {label}
    </span>
  );
}
