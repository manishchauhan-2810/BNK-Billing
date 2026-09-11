const mongoose = require('mongoose');

const chargeItemSchema = new mongoose.Schema({
  particular: { type: String, required: true },
  amount: { type: Number, required: true, min: 1 } // in paise
});

const billSchema = new mongoose.Schema({
  // NEW: distinguishes a physiotherapy bill from a CT scan (diagnostic) bill.
  // Both share the same invoice number series and the same collection, they
  // just render on a different letterhead / layout in the PDF.
  billType: {
    type: String,
    enum: ['PHYSIO', 'CTSCAN'],
    required: true,
    default: 'PHYSIO'
  },
  invoiceNumber: { type: String, required: true, unique: true },
  patient: {
    patientCode: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    phone: { type: String, trim: true },
    address: { type: String, required: true }
  },
  // For CTSCAN bills this doubles as "Referred By" hospital/doctor
  // (e.g. "S.N Hospital & Heart Center, Ranikhet").
  referredBy: { type: String, trim: true },
  registrationDate: { type: Date, default: Date.now },
  billDate: { type: Date, required: true, default: Date.now },
  numberOfDays: { type: Number, default: 0 },
  gstNumber: { type: String, required: true, default: '05BAYPY5535N1ZY' },
  diagnosis: { type: String, trim: true },
  treatments: { type: [String], default: [] },
  chargeItems: {
    type: [chargeItemSchema],
    validate: [arr => arr.length > 0, 'Bill must have at least one charge item.']
  },
  subTotal: { type: Number, required: true, min: 0 }, // in paise
  discount: { type: Number, default: 0, min: 0 }, // in paise
  totalAmount: { type: Number, required: true, min: 0 }, // subTotal - discount, in paise
  paidAmount: { type: Number, default: 0, min: 0 }, // in paise
  dueAmount: { type: Number, required: true, min: 0 }, // in paise
  status: {
    type: String,
    enum: ['PENDING', 'PARTIAL', 'PAID', 'CANCELLED'],
    required: true,
    default: 'PENDING'
  },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  cancelledBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
  cancelledAt: Date,
  cancellationReason: String
}, {
  timestamps: true
});

billSchema.index({ invoiceNumber: 1 });
billSchema.index({ 'patient.patientCode': 1 });
billSchema.index({ 'patient.name': 1 });
billSchema.index({ 'patient.phone': 1 });
billSchema.index({ status: 1 });
billSchema.index({ billType: 1 });
billSchema.index({ billDate: -1 });
billSchema.index({ createdAt: -1 });
billSchema.index({ dueAmount: 1, status: 1 });

module.exports = mongoose.model('Bill', billSchema);