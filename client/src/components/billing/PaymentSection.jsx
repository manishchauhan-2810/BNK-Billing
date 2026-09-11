import React from 'react';
import { PAYMENT_METHODS } from '../../utils/constants';
import { preventWheelChange } from '../../utils/uiHelpers';

const PaymentSection = ({ grandTotal, paidAmount, setPaidAmount, paymentMethod, setPaymentMethod, remarks, setRemarks }) => {
  const validPaidAmount = Math.min(Math.max(parseFloat(paidAmount) || 0, 0), grandTotal);
  const remaining = grandTotal - validPaidAmount;

  let statusBadge = { label: 'PENDING', color: 'bg-red-100 text-red-700' };
  if (validPaidAmount >= grandTotal && grandTotal > 0) {
    statusBadge = { label: 'PAID', color: 'bg-green-100 text-green-700' };
  } else if (validPaidAmount > 0) {
    statusBadge = { label: 'PARTIAL', color: 'bg-orange-100 text-orange-700' };
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount Received (₹)</label>
          <input
            type="number"
            min="0"
            max={grandTotal}
            step="0.01"
            value={paidAmount}
            onChange={(e) => setPaidAmount(e.target.value)}
            onWheel={preventWheelChange}
            className="no-spinner w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-bnk-secondary focus:border-bnk-secondary"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-bnk-secondary focus:border-bnk-secondary bg-white"
          >
            {PAYMENT_METHODS.map(method => (
              <option key={method.value} value={method.value}>{method.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Payment Remarks</label>
          <input
            type="text"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-bnk-secondary focus:border-bnk-secondary"
            placeholder="e.g. UPI Ref Number"
          />
        </div>
      </div>

      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col justify-center">
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Bill Amount</span>
            <span className="font-medium text-gray-900">₹{grandTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Amount Received</span>
            <span className="font-medium text-green-600">₹{validPaidAmount.toFixed(2)}</span>
          </div>
          <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
            <span className="text-base font-semibold text-gray-900">Balance Due</span>
            <span className="text-lg font-bold text-red-600">₹{remaining.toFixed(2)}</span>
          </div>
          <div className="pt-4 flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500">Predicted Status</span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusBadge.color}`}>
              {statusBadge.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSection;