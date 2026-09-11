import React from 'react';
import { formatDateTime } from '../../utils/dateUtils';
import { formatCurrency } from '../../utils/formatCurrency';
import { CheckCircle2, Circle } from 'lucide-react';

const PaymentHistory = ({ payments, totalAmount, paidAmount }) => {
  const remaining = totalAmount - paidAmount;

  if (!payments || payments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="text-sm">No payment history found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative border-l-2 border-gray-100 ml-3 pl-6 space-y-6">
        {payments.map((payment, index) => (
          <div key={index} className="relative">
            <div className="absolute -left-[35px] top-1 bg-white">
              <CheckCircle2 className="w-6 h-6 text-green-500 bg-white" />
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-gray-900">{formatCurrency(payment.amount)}</p>
                  <p className="text-xs text-gray-500">{formatDateTime(payment.date)}</p>
                </div>
                <span className="px-2.5 py-1 bg-gray-200 text-gray-700 rounded-md text-xs font-semibold">
                  {payment.method}
                </span>
              </div>
              {payment.remarks && (
                <p className="text-sm text-gray-600 mt-2 bg-white px-3 py-2 rounded-lg border border-gray-100">
                  <span className="font-medium">Remarks:</span> {payment.remarks}
                </p>
              )}
            </div>
          </div>
        ))}

        {remaining > 0 && (
          <div className="relative">
            <div className="absolute -left-[35px] top-1 bg-white">
              <Circle className="w-6 h-6 text-gray-300 bg-white" />
            </div>
            <div className="border border-dashed border-gray-300 rounded-xl p-4 bg-white opacity-60">
              <p className="font-medium text-gray-600">Pending Balance: {formatCurrency(remaining)}</p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-bnk-bg rounded-xl p-4 flex justify-between items-center text-sm">
        <div className="text-gray-600">
          Total Paid: <span className="font-bold text-green-600 ml-1">{formatCurrency(paidAmount)}</span>
        </div>
        <div className="text-gray-600">
          Remaining: <span className="font-bold text-red-600 ml-1">{formatCurrency(remaining)}</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
