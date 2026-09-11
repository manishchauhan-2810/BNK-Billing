const { body } = require('express-validator');

exports.addPaymentValidator = [
  body('amount').isNumeric().custom(value => value > 0).withMessage('Payment amount must be a positive number'),
  body('method').isIn(['CASH', 'UPI', 'CARD', 'BANK_TRANSFER']).withMessage('Valid payment method is required'),
  body('paymentDate').optional().isISO8601().toDate().withMessage('Valid payment date is required'),
  body('remarks').optional().isString().trim()
];
