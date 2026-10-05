import React from 'react';

export const Skeleton = ({ className = '', ...props }) => (
  <div
    className={`bg-slate-200/80 animate-pulse-subtle rounded-lg ${className}`}
    {...props}
  />
);

export const SkeletonCard = () => (
  <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs space-y-4">
    <div className="flex items-start justify-between">
      <div className="space-y-2 flex-1 pr-4">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
      </div>
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
    <div className="space-y-2 pt-2">
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-3 w-2/5" />
    </div>
    <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-8 w-16" />
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 5 }) => (
  <div className="w-full bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden">
    <div className="p-4 bg-slate-50 border-b border-slate-200/80 flex gap-4">
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-4 w-1/4" />
    </div>
    <div className="divide-y divide-slate-100">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 flex items-center justify-between gap-4">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/6" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      ))}
    </div>
  </div>
);

export default Skeleton;
