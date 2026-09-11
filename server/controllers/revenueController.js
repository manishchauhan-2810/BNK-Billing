const revenueService = require('../services/revenueService');

exports.getRevenueSummary = async (req, res, next) => {
  try {
    const summary = await revenueService.getRevenueSummary();
    res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    next(error);
  }
};

exports.getRevenueChart = async (req, res, next) => {
  try {
    const chartData = await revenueService.getRevenueChart();
    res.status(200).json({
      success: true,
      data: chartData
    });
  } catch (error) {
    next(error);
  }
};
