import React from 'react';

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="animate-pulse w-full">
    <div className="h-12 bg-gray-100 rounded-t-xl mb-2"></div>
    {[...Array(rows)].map((_, i) => (
      <div key={i} className="h-16 bg-gray-50 rounded-lg mb-2"></div>
    ))}
  </div>
);

export const CardSkeleton = () => (
  <div className="animate-pulse bg-white p-6 rounded-2xl border border-gray-100">
    <div className="w-12 h-12 bg-gray-200 rounded-xl mb-4"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
    <div className="h-8 bg-gray-200 rounded w-3/4"></div>
  </div>
);
