const Bill = require('../models/Bill');
const Payment = require('../models/Payment');
const mongoose = require('mongoose');

exports.getDashboardSummary = async () => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const startOfMonth = new Date(startOfToday.getFullYear(), startOfToday.getMonth(), 1);

  const [
    todayRevenueAgg,
    monthlyRevenueAgg,
    billsToday,
    totalBills,
    pendingBills,
    outstandingAmountAgg,
    recentBills
  ] = await Promise.all([
    Payment.aggregate([
      { $match: { paymentDate: { $gte: startOfToday } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]),
    Payment.aggregate([
      { $match: { paymentDate: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]),
    Bill.countDocuments({ createdAt: { $gte: startOfToday }, status: { $ne: 'CANCELLED' } }),
    Bill.countDocuments({ status: { $ne: 'CANCELLED' } }),
    Bill.countDocuments({ dueAmount: { $gt: 0 }, status: { $ne: 'CANCELLED' } }),
    Bill.aggregate([
      { $match: { status: { $in: ['PENDING', 'PARTIAL'] } } },
      { $group: { _id: null, total: { $sum: '$dueAmount' } } }
    ]),
    Bill.find().sort({ createdAt: -1 }).limit(10).lean()
  ]);

  const todayRevenuePaise = todayRevenueAgg.length > 0 ? todayRevenueAgg[0].total : 0;
  const monthlyRevenuePaise = monthlyRevenueAgg.length > 0 ? monthlyRevenueAgg[0].total : 0;
  const outstandingAmountPaise = outstandingAmountAgg.length > 0 ? outstandingAmountAgg[0].total : 0;

  return {
    todayRevenue: todayRevenuePaise / 100,
    monthlyRevenue: monthlyRevenuePaise / 100,
    billsToday,
    totalBills,
    pendingBills,
    outstandingAmount: outstandingAmountPaise / 100,
    recentBills
  };
};
