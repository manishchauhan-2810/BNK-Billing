import React from 'react';
import { X } from 'lucide-react';
import { amountToWords } from '../../utils/amountToWords';
import { formatDate } from '../../utils/dateUtils';

const CLINIC_TITLES = {
  PHYSIO: { name: 'BNK PHYSIOTHERAPY', tagline: 'Specialized Care & Rehabilitation' },
  CTSCAN: { name: 'BNK DIAGNOSTIC CENTRE', tagline: 'Ranikhet' }
};

const BillPreview = ({ isOpen, onClose, onConfirm, data, isSubmitting }) => {
  if (!isOpen || !data) return null;

  const clinic = CLINIC_TITLES[data.billType] || CLINIC_TITLES.PHYSIO;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl flex flex-col max-h-[90vh] relative z-10">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Bill Preview</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto flex-1 font-sans">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-gray-200 pb-6 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-bnk-primary">{clinic.name}</h1>
              <p className="text-sm text-gray-500 mt-1">{clinic.tagline}</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold text-gray-900 uppercase tracking-widest">INVOICE</h2>
              <p className="text-sm text-gray-600 mt-1">Date: {formatDate(data.billDate)}</p>
              <p className="text-sm text-gray-600">Reg Date: {formatDate(data.registrationDate)}</p>
            </div>
          </div>

          {/* Patient Info */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Bill To:</p>
              <p className="font-bold text-gray-900">{data.patientName}</p>
              <p className="text-sm text-gray-600">{data.gender}, {data.age} Yrs</p>
              <p className="text-sm text-gray-600">{data.phone}</p>
              <p className="text-sm text-gray-600 break-words">{data.address}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Details:</p>
              {data.referredBy && <p className="text-sm text-gray-600"><span className="font-medium">Ref By:</span> {data.referredBy}</p>}
              {data.numberOfDays && <p className="text-sm text-gray-600"><span className="font-medium">Therapy Days:</span> {data.numberOfDays}</p>}
            </div>
          </div>

          {/* Diagnosis & Treatment */}
          <div className="mb-8">
            {data.diagnosis && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Diagnosis:</p>
                <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded-lg">{data.diagnosis}</p>
              </div>
            )}
            {data.treatments?.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Treatments:</p>
                <div className="flex flex-wrap gap-2">
                  {data.treatments.map(t => (
                    <span key={t} className="text-xs bg-bnk-secondary/10 text-bnk-primary px-2 py-1 rounded-md border border-bnk-secondary/20">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Charges */}
          <table className="w-full mb-6 text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 text-xs font-semibold text-gray-700 uppercase border-y border-gray-300">Particulars</th>
                <th className="py-2 px-4 text-xs font-semibold text-gray-700 uppercase border-y border-gray-300 text-right w-32">Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, i) => (
                <tr key={i}>
                  <td className="py-3 px-4 text-sm text-gray-800 border-b border-gray-100">{item.particular || '-'}</td>
                  <td className="py-3 px-4 text-sm text-gray-800 border-b border-gray-100 text-right">₹{parseFloat(item.amount || 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-between items-end">
            <div className="max-w-xs">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Amount in Words:</p>
              <p className="text-sm font-medium text-bnk-primary italic">{amountToWords(data.grandTotal)}</p>
            </div>
            <div className="w-64">
              <div className="flex justify-between py-1 text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">₹{data.subtotal.toFixed(2)}</span>
              </div>
              {data.discount > 0 && (
                <div className="flex justify-between py-1 text-sm text-red-600">
                  <span>Discount:</span>
                  <span>- ₹{data.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between py-2 text-base font-bold border-t border-b border-gray-200 my-2">
                <span>Grand Total:</span>
                <span>₹{data.grandTotal.toFixed(2)}</span>
              </div>
              {data.paidAmount > 0 && (
                <>
                  <div className="flex justify-between py-1 text-sm text-green-600">
                    <span>Paid ({data.paymentMethod}):</span>
                    <span>₹{data.paidAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1 text-sm text-gray-900 font-semibold bg-gray-50 px-2 rounded mt-1">
                    <span>Balance Due:</span>
                    <span>₹{(data.grandTotal - data.paidAmount).toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 flex justify-end space-x-3 bg-gray-50 rounded-b-2xl">
          <button onClick={onClose} className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-xl transition-colors">
            Edit Information
          </button>
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="px-6 py-2.5 text-sm font-medium text-white bg-bnk-primary hover:bg-[#1a5a4d] shadow-sm rounded-xl transition-colors disabled:opacity-60"
          >
            {isSubmitting ? 'Saving...' : 'Confirm & Save Bill'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillPreview;