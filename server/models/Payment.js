const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  bill: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bill',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 1 // in paise
  },
  method: {
    type: String,
    enum: ['CASH', 'UPI', 'CARD', 'BANK_TRANSFER'],
    required: true
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  remarks: {
    type: String,
    trim: true
  },
  receivedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

paymentSchema.index({ bill: 1, createdAt: 1 });
paymentSchema.index({ paymentDate: 1 });
paymentSchema.index({ method: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
