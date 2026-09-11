import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IndianRupee, FileText, Clock, TrendingUp, Users, PlusCircle, ArrowRight } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';
import DataTable from '../components/ui/DataTable';
import StatusBadge from '../components/ui/StatusBadge';
import RevenueChart from '../components/charts/RevenueChart';
import { dashboardService } from '../services/dashboardService';
import { revenueService } from '../services/revenueService';
import { formatCurrency, formatRupeeAmount } from '../utils/formatCurrency';
import { formatDate } from '../utils/dateUtils';
import { CardSkeleton } from '../components/ui/LoadingSkeleton';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // The summary endpoint doesn't include chart data — pull that from
      // /revenue/chart in parallel instead of leaving it hard-coded.
      const [summary, chart] = await Promise.all([
        dashboardService.getDashboardSummary(),
        revenueService.getRevenueChart()
      ]);
      setData(summary);
      setChartData(chart);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
      toast.error('Could not load dashboard data');
      setData(null);
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { header: 'Invoice #', accessor: 'invoiceNumber', className: 'font-medium text-bnk-primary' },
    { header: 'Patient', accessor: 'patient', cell: (row) => row.patient?.name || '-' },
    { header: 'Date', accessor: 'billDate', cell: (row) => formatDate(row.billDate) },
    { header: 'Total', accessor: 'totalAmount', cell: (row) => formatCurrency(row.totalAmount) },
    { header: 'Status', accessor: 'status', cell: (row) => <StatusBadge status={row.status} /> },
    {
      header: 'Action',
      accessor: 'action',
      cell: (row) => (
        <button
          onClick={() => navigate(`/bills/${row._id}`)}
          className="text-bnk-secondary hover:text-bnk-primary font-medium text-sm transition-colors"
        >
          View
        </button>
      )
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your clinic's billing performance"
      />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <button onClick={() => navigate('/bills/create')} className="flex items-center justify-center space-x-2 bg-bnk-primary hover:bg-[#1a5a4d] text-white p-4 rounded-2xl shadow-sm transition-all group">
          <PlusCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="font-medium">Create New Bill</span>
        </button>
        <button onClick={() => navigate('/pending')} className="flex items-center justify-center space-x-2 bg-white border border-orange-200 text-orange-700 hover:bg-orange-50 p-4 rounded-2xl shadow-sm transition-all group">
          <Clock className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="font-medium">View Pending</span>
        </button>
        <button onClick={() => navigate('/bills')} className="flex items-center justify-center space-x-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 p-4 rounded-2xl shadow-sm transition-all group">
          <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="font-medium">Bill History</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Trend/growth percentages removed — the backend doesn't compute a
            comparison against a prior period, so showing "+5.2%" etc. was
            fabricated. Add real trend data server-side before reintroducing this. */}
        <StatCard title="Today's Revenue" value={formatRupeeAmount(data?.todayRevenue)} icon={IndianRupee} />
        <StatCard title="Monthly Revenue" value={formatRupeeAmount(data?.monthlyRevenue)} icon={TrendingUp} />
        <StatCard title="Outstanding Amount" value={formatRupeeAmount(data?.outstandingAmount)} icon={Clock} />
        <StatCard title="Bills Today" value={data?.billsToday || 0} icon={FileText} />
        <StatCard title="Pending Bills" value={data?.pendingBills || 0} icon={Users} />
        <StatCard title="Total Bills" value={data?.totalBills || 0} icon={FileText} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Revenue Overview</h2>
            <button onClick={() => navigate('/revenue')} className="text-sm font-medium text-bnk-secondary hover:text-bnk-primary flex items-center">
              Full Report <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          <RevenueChart data={chartData} />
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Recent Bills</h2>
          </div>
          <div className="flex-1 overflow-auto">
            <DataTable
              columns={columns}
              data={data?.recentBills || []}
              loading={false}
              emptyMessage="No bills generated yet."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;