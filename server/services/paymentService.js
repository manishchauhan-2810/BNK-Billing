const mongoose = require('mongoose');
const Payment = require('../models/Payment');
const Bill = require('../models/Bill');
const AppError = require('../utils/AppError');

exports.addPayment = async (billId, paymentData, userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const bill = await Bill.findById(billId).session(session);
    
    if (!bill) {
      throw new AppError('Bill not found', 404);
    }

    if (bill.status === 'CANCELLED') {
      throw new AppError('Cannot add payment to cancelled invoice', 400);
    }

    if (bill.status === 'PAID') {
      throw new AppError('Invoice is already fully paid', 400);
    }

    const amountPaise = Math.round(paymentData.amount * 100);

    if (amountPaise > bill.dueAmount) {
      throw new AppError(`Payment cannot exceed remaining balance of ₹${bill.dueAmount / 100}`, 400);
    }

    const payment = new Payment({
      bill: bill._id,
      amount: amountPaise,
      method: paymentData.method,
      paymentDate: paymentData.paymentDate || new Date(),
      remarks: paymentData.remarks,
      receivedBy: userId
    });

    await payment.save({ session });

    const totalPaidData = await Payment.aggregate([
      { $match: { bill: bill._id } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]).session(session);

    const totalPaid = totalPaidData.length > 0 ? totalPaidData[0].total : 0;
    
    bill.paidAmount = totalPaid;
    bill.dueAmount = bill.totalAmount - totalPaid;

    if (bill.dueAmount === 0) {
      bill.status = 'PAID';
    } else if (bill.paidAmount > 0) {
      bill.status = 'PARTIAL';
    } else {
      bill.status = 'PENDING';
    }

    await bill.save({ session });
    await session.commitTransaction();
    session.endSession();

    return { payment, updatedBill: bill };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

exports.getPaymentsByBill = async (billId) => {
  return await Payment.find({ bill: billId })
    .sort({ paymentDate: 1 })
    .populate('receivedBy', 'name')
    .lean();
};
