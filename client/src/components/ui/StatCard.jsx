import React from 'react';

const StatCard = ({ title, value, icon: Icon, trend }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="w-12 h-12 rounded-xl bg-bnk-secondary/10 flex items-center justify-center text-bnk-primary">
          {Icon && <Icon className="w-6 h-6" />}
        </div>
        {trend && (
          <div className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
