import React from 'react';

const FilterBar = ({ filters, onFilterChange }) => {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      {filters.map((filter) => (
        <div key={filter.key} className="flex items-center">
          <select
            value={filter.value}
            onChange={(e) => onFilterChange(filter.key, e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-200 focus:outline-none focus:ring-bnk-secondary focus:border-bnk-secondary sm:text-sm rounded-xl bg-white cursor-pointer"
          >
            <option value="" disabled>{filter.label}</option>
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};

export default FilterBar;
