const { body } = require('express-validator');

exports.createBillValidator = [
  body('billType').optional().isIn(['PHYSIO', 'CTSCAN']).withMessage('billType must be PHYSIO or CTSCAN'),
  body('patient.name').trim().notEmpty().withMessage('Patient name is required'),
  body('patient.age').isNumeric().withMessage('Patient age must be a number'),
  body('patient.gender').isIn(['Male', 'Female', 'Other']).withMessage('Valid gender is required'),
  body('patient.phone').optional().isString(),
  body('patient.address').trim().notEmpty().withMessage('Address is required'),
  body('billDate').isISO8601().toDate().withMessage('Valid bill date is required'),
  body('referredBy').optional().trim().isString(),
  body('registrationDate').optional().isISO8601().toDate().withMessage('Valid registration date is required'),
  body('numberOfDays').optional().isNumeric().withMessage('Number of days must be a number'),
  body('diagnosis').optional().trim().isString(),
  body('treatments').optional().isArray().withMessage('Treatments must be an array'),
  body('treatments.*').optional().trim().isString(),
  body('chargeItems').isArray({ min: 1 }).withMessage('At least one charge item is required'),
  body('chargeItems.*.particular').trim().notEmpty().withMessage('Charge item particular is required'),
  body('chargeItems.*.amount').isNumeric().custom(value => value > 0).withMessage('Charge item amount must be a positive number'),
  body('discount').optional().isNumeric().custom(value => value >= 0).withMessage('Discount must be a positive number or zero'),
  body('initialPayment').optional().isObject(),
  body('initialPayment.amount').if(body('initialPayment').exists()).isNumeric().custom(value => value > 0).withMessage('Initial payment amount must be positive'),
  body('initialPayment.method').if(body('initialPayment').exists()).isIn(['CASH', 'UPI', 'CARD', 'BANK_TRANSFER']).withMessage('Valid initial payment method is required')
];

exports.cancelBillValidator = [
  body('reason').trim().notEmpty().withMessage('Cancellation reason is required')
];