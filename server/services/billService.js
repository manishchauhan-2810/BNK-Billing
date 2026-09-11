const mongoose = require('mongoose');
const Bill = require('../models/Bill');
const Payment = require('../models/Payment');
const Counter = require('../models/Counter');
const AppError = require('../utils/AppError');

exports.createNewBill = async (billData, userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // billType defaults to PHYSIO so existing frontend calls that don't send
    // it yet keep working unchanged.
    const billType = billData.billType === 'CTSCAN' ? 'CTSCAN' : 'PHYSIO';

    const invoiceNumSeq = await Counter.getNextSequence('invoiceNumber');
    const actualInvoiceNum = invoiceNumSeq === 1 ? 2790 : 2790 + invoiceNumSeq - 1;
    const invoiceNumber = `BNKBILL-${actualInvoiceNum}`;

    const patientCodeSeq = await Counter.getNextSequence('patientCode');
    const actualPatientCodeNum = patientCodeSeq === 1 ? 18766 : 18766 + patientCodeSeq - 1;
    const patientCode = `BNK-${String(actualPatientCodeNum).padStart(5, '0')}`;

    let subTotalPaise = 0;
    const chargeItemsPaise = billData.chargeItems.map(item => {
      const amountPaise = Math.round(item.amount * 100);
      subTotalPaise += amountPaise;
      return { particular: item.particular, amount: amountPaise };
    });

    const discountPaise = billData.discount ? Math.round(billData.discount * 100) : 0;

    if (discountPaise > subTotalPaise) {
      throw new AppError('Discount cannot exceed subtotal', 400);
    }

    const totalAmountPaise = subTotalPaise - discountPaise;
    let paidAmountPaise = 0;
    let dueAmountPaise = totalAmountPaise;
    let status = 'PENDING';

    if (billData.initialPayment && billData.initialPayment.amount > 0) {
      paidAmountPaise = Math.round(billData.initialPayment.amount * 100);

      if (paidAmountPaise > totalAmountPaise) {
        throw new AppError('Initial payment cannot exceed total amount', 400);
      }

      dueAmountPaise = totalAmountPaise - paidAmountPaise;
      if (dueAmountPaise === 0) {
        status = 'PAID';
      } else if (paidAmountPaise > 0) {
        status = 'PARTIAL';
      }
    }

    const newBill = new Bill({
      billType,
      invoiceNumber,
      patient: { ...billData.patient, patientCode },
      referredBy: billData.referredBy,
      registrationDate: billData.registrationDate,
      billDate: billData.billDate,
      numberOfDays: billData.numberOfDays,
      diagnosis: billData.diagnosis,
      // Treatments (EMG, IFT, Traction, etc.) only apply to physio bills.
      // CT scan bills simply leave this empty and rely on chargeItems.
      treatments: billType === 'PHYSIO' ? (billData.treatments || []) : [],
      chargeItems: chargeItemsPaise,
      subTotal: subTotalPaise,
      discount: discountPaise,
      totalAmount: totalAmountPaise,
      paidAmount: paidAmountPaise,
      dueAmount: dueAmountPaise,
      status,
      createdBy: userId
    });

    await newBill.save({ session });

    if (paidAmountPaise > 0) {
      const payment = new Payment({
        bill: newBill._id,
        amount: paidAmountPaise,
        method: billData.initialPayment.method,
        paymentDate: billData.billDate,
        receivedBy: userId,
        remarks: 'Initial Payment'
      });
      await payment.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    return newBill;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

exports.getBills = async (query) => {
  const { search, status, billType, dateFrom, dateTo, page = 1, limit = 10, sort = '-createdAt' } = query;
  const filter = {};

  if (search) {
    filter.$or = [
      { invoiceNumber: { $regex: search, $options: 'i' } },
      { 'patient.name': { $regex: search, $options: 'i' } },
      { 'patient.phone': { $regex: search, $options: 'i' } },
      { 'patient.patientCode': { $regex: search, $options: 'i' } }
    ];
  }

  if (status) {
    filter.status = status;
  }

  // NEW: lets the frontend's two tabs (Physiotherapy / CT Scan) each show
  // only their own bills, e.g. GET /api/bills?billType=CTSCAN
  if (billType) {
    filter.billType = billType;
  }

  if (dateFrom || dateTo) {
    filter.billDate = {};
    if (dateFrom) filter.billDate.$gte = new Date(dateFrom);
    if (dateTo) filter.billDate.$lte = new Date(dateTo);
  }

  const skip = (page - 1) * limit;

  const [bills, total] = await Promise.all([
    Bill.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('createdBy', 'name')
      .lean(),
    Bill.countDocuments(filter)
  ]);

  return { bills, total, page: parseInt(page), totalPages: Math.ceil(total / limit) };
};

exports.getBillById = async (id) => {
  const bill = await Bill.findById(id).populate('createdBy', 'name').lean();
  if (!bill) throw new AppError('Bill not found', 404);

  const payments = await Payment.find({ bill: id }).populate('receivedBy', 'name').sort('paymentDate').lean();

  return { ...bill, payments };
};

exports.cancelBill = async (billId, userId, reason) => {
  const bill = await Bill.findById(billId);
  if (!bill) throw new AppError('Bill not found', 404);

  if (bill.status === 'CANCELLED') {
    throw new AppError('Bill is already cancelled', 400);
  }

  bill.status = 'CANCELLED';
  bill.cancelledAt = new Date();
  bill.cancelledBy = userId;
  bill.cancellationReason = reason;

  await bill.save();
  return bill;
};

exports.getPendingBills = async (query) => {
  const { page = 1, limit = 10, search, billType } = query;
  const filter = { dueAmount: { $gt: 0 }, status: { $ne: 'CANCELLED' } };

  if (billType) {
    filter.billType = billType;
  }

  if (search) {
    filter.$or = [
      { invoiceNumber: { $regex: search, $options: 'i' } },
      { 'patient.name': { $regex: search, $options: 'i' } },
      { 'patient.phone': { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (page - 1) * limit;

  const [bills, total, summary] = await Promise.all([
    Bill.find(filter).sort('-createdAt').skip(skip).limit(parseInt(limit)).lean(),
    Bill.countDocuments(filter),
    Bill.aggregate([
      { $match: filter },
      { $group: { _id: null, totalOutstanding: { $sum: '$dueAmount' } } }
    ])
  ]);

  const totalOutstanding = summary.length > 0 ? summary[0].totalOutstanding : 0;

  return { bills, total, page: parseInt(page), totalPages: Math.ceil(total / limit), totalOutstanding };
};

// NEW: static reference rates for the CT scan "pick a procedure" dropdown.
exports.getCtScanRates = () => {
  return require('../constants/ctScanRates');
};