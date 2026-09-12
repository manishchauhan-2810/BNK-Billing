const billService = require('../services/billService');
const paymentService = require('../services/paymentService');
const pdfService = require('../services/pdfService');

exports.createBill = async (req, res, next) => {
  try {
    const bill = await billService.createNewBill(req.body, req.user._id);
    res.status(201).json({
      success: true,
      message: 'Bill created successfully',
      data: bill
    });
  } catch (error) {
    next(error);
  }
};

exports.getBills = async (req, res, next) => {
  try {
    const result = await billService.getBills(req.query);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

exports.getBillById = async (req, res, next) => {
  try {
    const bill = await billService.getBillById(req.params.id);
    res.status(200).json({
      success: true,
      data: bill
    });
  } catch (error) {
    next(error);
  }
};

exports.cancelBill = async (req, res, next) => {
  try {
    const bill = await billService.cancelBill(req.params.id, req.user._id, req.body.reason);
    res.status(200).json({
      success: true,
      message: 'Bill cancelled successfully',
      data: bill
    });
  } catch (error) {
    next(error);
  }
};

exports.getPendingBills = async (req, res, next) => {
  try {
    const result = await billService.getPendingBills(req.query);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

exports.generatePdf = async (req, res, next) => {
  try {
    console.log('=================================');
    console.log('PDF REQUEST RECEIVED');
    console.log('Bill ID:', req.params.id);
    console.log('User:', req.user?._id);
    const bill = await billService.getBillById(req.params.id);
    console.log('Bill found:', bill.invoiceNumber);
    console.log('Starting PDF generation...');
    const pdfData = await pdfService.generatePdf(bill);
    // IMPORTANT:
    // Convert Puppeteer's Uint8Array into a Node.js Buffer
    const pdfBuffer = Buffer.from(pdfData);
    console.log('PDF Buffer created');
    console.log('PDF size:', pdfBuffer.length);
    res.status(200);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${bill.invoiceNumber}.pdf"`,
      'Content-Length': pdfBuffer.length,
      'Cache-Control': 'no-cache'
    });
    console.log('Sending PDF to client');
    res.end(pdfBuffer);
    console.log('PDF sent successfully');
    console.log('=================================');

  } catch (error) {
    console.error('=================================');
    console.error('PDF CONTROLLER ERROR');
    console.error('Name:', error.name);
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    console.error('=================================');

    next(error);
  }
};

exports.addPayment = async (req, res, next) => {
  try {
    const result = await paymentService.addPayment(req.params.id, req.body, req.user._id);
    res.status(201).json({
      success: true,
      message: 'Payment added successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

exports.getPayments = async (req, res, next) => {
  try {
    const payments = await paymentService.getPaymentsByBill(req.params.id);
    res.status(200).json({
      success: true,
      data: payments
    });
  } catch (error) {
    next(error);
  }
};

// NEW: powers the "select a procedure" dropdown on the CT Scan bill tab
// in the frontend, so rates don't have to be typed by hand.
exports.getCtScanRates = (req, res, next) => {
  try {
    const rates = billService.getCtScanRates();
    res.status(200).json({
      success: true,
      data: rates
    });
  } catch (error) {
    next(error);
  }
};