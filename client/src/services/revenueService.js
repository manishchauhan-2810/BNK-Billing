import api from './api';

export const revenueService = {
  // Returns { todayRevenue, monthlyRevenue, yearlyRevenue, methodBreakdown }
  // where methodBreakdown is an array: [{ method: 'CASH', total }, ...].
  // All figures are already in RUPEES — use formatRupeeAmount(), not
  // formatCurrency() (which expects paise).
  getRevenueSummary: async () => {
    const response = await api.get('/revenue/summary');
    return response.data.data;
  },
  // Returns [{ month: 'Jan 2026', revenue }] in RUPEES, oldest to newest.
  getRevenueChart: async () => {
    const response = await api.get('/revenue/chart');
    return response.data.data;
  }
};