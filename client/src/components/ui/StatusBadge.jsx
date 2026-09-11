import React from 'react';

const StatusBadge = ({ status }) => {
  const getStatusStyles = () => {
    switch (status?.toUpperCase()) {
      case 'PAID':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'PARTIAL':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'PENDING':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles()}`}>
      {status || 'UNKNOWN'}
    </span>
  );
};

export default StatusBadge;
