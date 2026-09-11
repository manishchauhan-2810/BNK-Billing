import React from 'react';
import { TableSkeleton } from './LoadingSkeleton';
import EmptyState from './EmptyState';

const DataTable = ({ columns, data, loading, emptyMessage, emptyIcon }) => {
  if (loading) return <TableSkeleton rows={5} />;
  
  if (!data || data.length === 0) {
    return <EmptyState title="No Data" message={emptyMessage || "There are no records to display."} icon={emptyIcon} />;
  }

  return (
    <div className="w-full overflow-x-auto bg-white rounded-2xl border border-gray-100 shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50/80 border-b border-gray-100">
            {columns.map((col, index) => (
              <th key={index} className={`py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider ${col.className || ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50/50 transition-colors">
              {columns.map((col, colIndex) => (
                <td key={colIndex} className={`py-4 px-6 text-sm text-gray-700 whitespace-nowrap ${col.className || ''}`}>
                  {col.cell ? col.cell(row) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
