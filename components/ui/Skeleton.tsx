export default function Skeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="animate-pulse space-y-0">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className={`flex items-center gap-4 px-4 py-3 ${i % 2 === 0 ? 'bg-white' : 'bg-[#f2f6ef]'}`}
        >
          <div className="h-3 bg-[#c3c3c3]/60 rounded w-8 flex-shrink-0" />
          <div className="h-3 bg-[#c3c3c3]/60 rounded flex-1" />
          <div className="h-3 bg-[#c3c3c3]/60 rounded w-16" />
          <div className="h-3 bg-[#c3c3c3]/60 rounded w-24" />
          <div className="h-3 bg-[#c3c3c3]/60 rounded w-20" />
          <div className="h-5 bg-[#c3c3c3]/60 rounded-full w-16" />
          <div className="h-3 bg-[#c3c3c3]/60 rounded w-12" />
        </div>
      ))}
    </div>
  );
}
