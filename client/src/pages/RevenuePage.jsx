import React, { useState, useEffect } from 'react';
import { IndianRupee } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';
import RevenueChart from '../components/charts/RevenueChart';
import { revenueService } from '../services/revenueService';
import { formatRupeeAmount } from '../utils/formatCurrency';
import { CardSkeleton } from '../components/ui/LoadingSkeleton';
import toast from 'react-hot-toast';

const METHOD_COLORS = {
  UPI: 'bg-green-500',
  CASH: 'bg-blue-500',
  CARD: 'bg-purple-500',
  BANK_TRANSFER: 'bg-orange-500'
};

const METHOD_LABELS = {
  UPI: 'UPI',
  CASH: 'Cash',
  CARD: 'Card',
  BANK_TRANSFER: 'Bank Transfer'
};

const RevenuePage = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      const [summary, chart] = await Promise.all([
        revenueService.getRevenueSummary(),
        revenueService.getRevenueChart()
      ]);
      setData({ ...summary, chartData: chart });
    } catch (error) {
      console.error('Failed to fetch revenue data', error);
      toast.error('Could not load revenue data');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <CardSkeleton /><CardSkeleton /><CardSkeleton />
        </div>
      </div>
    );
  }

  // Backend returns methodBreakdown as [{ method: 'CASH', total }, ...] —
  // build a lookup and compute REAL percentages instead of the old
  // hard-coded 45% / 30% / 20% / 5% widths.
  const breakdown = data?.methodBreakdown || [];
  const methodTotal = breakdown.reduce((sum, m) => sum + (m.total || 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Revenue Analytics"
        subtitle="Detailed financial performance tracking"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard title="Today's Revenue" value={formatRupeeAmount(data?.todayRevenue)} icon={IndianRupee} />
        <StatCard title="This Month's Revenue" value={formatRupeeAmount(data?.monthlyRevenue)} icon={IndianRupee} />
        <StatCard title="This Year's Revenue" value={formatRupeeAmount(data?.yearlyRevenue)} icon={IndianRupee} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
        <div className="lg:col-span-3 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Revenue Trend (Last 12 Months)</h2>
          <RevenueChart data={data?.chartData || []} />
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Payment Methods</h2>
          {breakdown.length === 0 ? (
            <p className="text-sm text-gray-400">No payments recorded yet.</p>
          ) : (
            <div className="space-y-6">
              {breakdown.map((m) => {
                const pct = methodTotal > 0 ? Math.round((m.total / methodTotal) * 100) : 0;
                return (
                  <div key={m.method}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-gray-600">{METHOD_LABELS[m.method] || m.method}</span>
                      <span className="font-bold text-gray-900">{formatRupeeAmount(m.total)}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className={`${METHOD_COLORS[m.method] || 'bg-gray-400'} h-2 rounded-full transition-all`}
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RevenuePage;