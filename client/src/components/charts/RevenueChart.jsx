import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatRupeeAmount, formatCompactRupees } from '../../utils/formatCurrency';

const RevenueChart = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-100 p-3 rounded-xl shadow-lg">
          <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
          <p className="text-lg font-bold text-bnk-primary">
            {formatRupeeAmount(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const hasData = data && data.length > 0;

  if (!hasData) {
    return (
      <div className="h-72 w-full mt-4 flex items-center justify-center text-sm text-gray-400">
        No revenue data yet.
      </div>
    );
  }

  return (
    <div className="h-72 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#123F37" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#123F37" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12 }}
            tickFormatter={(value) => formatCompactRupees(value)}
            dx={-10}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#123F37"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorRevenue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;