import api from './api';

export const dashboardService = {
  // Returns { todayRevenue, monthlyRevenue, billsToday, totalBills,
  // pendingBills, outstandingAmount, recentBills } — note revenue/outstanding
  // figures here are already in RUPEES (the backend divides by 100 before
  // sending), unlike Bill documents which are in paise. Use
  // formatRupeeAmount() from utils/formatCurrency.js to display these, not
  // formatCurrency().
  getDashboardSummary: async () => {
    const response = await api.get('/dashboard/summary');
    return response.data.data;
  }
};