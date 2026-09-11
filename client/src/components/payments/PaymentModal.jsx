import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { billService } from '../../services/billService';
import { rupeesToPaise } from '../../utils/formatCurrency';
import { preventWheelChange } from '../../utils/uiHelpers';

const PaymentModal = ({ isOpen, onClose, bill, onSuccess }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && bill) {
      reset({
        amount: (bill.totalAmount - bill.paidAmount) / 100, // prefill with remaining amount in rupees
        method: 'UPI',
        date: new Date().toISOString().split('T')[0],
        remarks: ''
      });
    }
  }, [isOpen, bill, reset]);

  if (!isOpen || !bill) return null;

  const remainingBalance = (bill.totalAmount - bill.paidAmount) / 100;

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await billService.addPayment(bill._id, {
        amount: parseFloat(data.amount), // backend converts rupees -> paise itself
        method: data.method,
        paymentDate: data.date,
        remarks: data.remarks
      });
      toast.success('Payment added successfully');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-2xl w-full max-w-md relative z-10 shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-lg font-semibold text-gray-900">Add Payment</h3>
          <span className="text-sm font-medium text-bnk-primary">{bill.invoiceNumber}</span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm flex justify-between items-center border border-blue-100">
            <div>
              <p className="font-medium">Remaining Balance</p>
              <p className="text-xs text-blue-600 mt-0.5">Total: ₹{bill.totalAmount / 100}</p>
            </div>
            <div className="text-lg font-bold">₹{remainingBalance}</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹) *</label>
            <input
              type="number"
              step="0.01"
              onWheel={preventWheelChange}
              className="no-spinner w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-bnk-secondary focus:border-bnk-secondary"
              {...register('amount', {
                required: 'Amount is required',
                min: { value: 1, message: 'Must be greater than 0' },
                max: { value: remainingBalance, message: 'Cannot exceed remaining balance' }
              })}
            />
            {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method *</label>
              <select
                {...register('method', { required: 'Method required' })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-bnk-secondary focus:border-bnk-secondary"
              >
                <option value="UPI">UPI</option>
                <option value="CASH">Cash</option>
                <option value="CARD">Card</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
              <input
                type="date"
                {...register('date', { required: 'Date required' })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-bnk-secondary focus:border-bnk-secondary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Remarks (Optional)</label>
            <input
              type="text"
              {...register('remarks')}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-bnk-secondary focus:border-bnk-secondary"
              placeholder="Transaction ID, etc."
            />
          </div>

          <div className="pt-4 flex justify-end space-x-3 border-t border-gray-100 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-bnk-primary hover:bg-[#1a5a4d] rounded-xl transition-colors disabled:opacity-70"
            >
              {loading ? 'Processing...' : 'Record Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;