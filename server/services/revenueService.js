const Payment = require('../models/Payment');
const mongoose = require('mongoose');

exports.getRevenueSummary = async () => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const startOfMonth = new Date(startOfToday.getFullYear(), startOfToday.getMonth(), 1);
  const startOfYear = new Date(startOfToday.getFullYear(), 0, 1);

  const [
    todayAgg,
    monthAgg,
    yearAgg,
    methodAgg
  ] = await Promise.all([
    Payment.aggregate([
      { $match: { paymentDate: { $gte: startOfToday } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]),
    Payment.aggregate([
      { $match: { paymentDate: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]),
    Payment.aggregate([
      { $match: { paymentDate: { $gte: startOfYear } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]),
    Payment.aggregate([
      { $group: { _id: '$method', total: { $sum: '$amount' } } }
    ])
  ]);

  const todayRevenue = (todayAgg.length > 0 ? todayAgg[0].total : 0) / 100;
  const monthlyRevenue = (monthAgg.length > 0 ? monthAgg[0].total : 0) / 100;
  const yearlyRevenue = (yearAgg.length > 0 ? yearAgg[0].total : 0) / 100;
  
  const methodBreakdown = methodAgg.map(m => ({
    method: m._id,
    total: m.total / 100
  }));

  return { todayRevenue, monthlyRevenue, yearlyRevenue, methodBreakdown };
};

exports.getRevenueChart = async () => {
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
  twelveMonthsAgo.setDate(1);
  twelveMonthsAgo.setHours(0, 0, 0, 0);

  const chartData = await Payment.aggregate([
    { $match: { paymentDate: { $gte: twelveMonthsAgo } } },
    { 
      $group: { 
        _id: { 
          year: { $year: '$paymentDate' }, 
          month: { $month: '$paymentDate' } 
        }, 
        total: { $sum: '$amount' } 
      } 
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  return chartData.map(data => ({
    month: `${monthNames[data._id.month - 1]} ${data._id.year}`,
    revenue: data.total / 100
  }));
};
