const express = require('express');
const billController = require('../controllers/billController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { createBillValidator, cancelBillValidator } = require('../validators/billValidator');
const { addPaymentValidator } = require('../validators/paymentValidator');

const router = express.Router();

router.use(protect);

router.get('/pending', billController.getPendingBills);
router.get('/ct-rates', billController.getCtScanRates);

router.route('/')
  .post(createBillValidator, validate, billController.createBill)
  .get(billController.getBills);

router.route('/:id')
  .get(billController.getBillById);

router.post('/:id/cancel', cancelBillValidator, validate, billController.cancelBill);

router.get('/:id/pdf', billController.generatePdf);

router.route('/:id/payments')
  .post(addPaymentValidator, validate, billController.addPayment)
  .get(billController.getPayments);

module.exports = router;