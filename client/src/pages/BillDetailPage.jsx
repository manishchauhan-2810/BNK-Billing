import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Printer, Banknote, Ban } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import StatusBadge from '../components/ui/StatusBadge';
import PaymentHistory from '../components/payments/PaymentHistory';
import PaymentModal from '../components/payments/PaymentModal';
import ConfirmModal from '../components/ui/ConfirmModal';
import { billService, downloadBillPdf } from '../services/billService';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/dateUtils';
import { amountToWords } from '../utils/amountToWords';
import { CardSkeleton } from '../components/ui/LoadingSkeleton';
import toast from 'react-hot-toast';

const BillDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [bill, setBill] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const fetchBill = async () => {
    try {
      setLoading(true);
      const data = await billService.getBillById(id);
      setBill(data);
    } catch (error) {
      toast.error('Failed to load bill details');
      navigate('/bills');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const openCancelModal = () => {
    const reason = window.prompt('Enter a reason for cancelling this bill:');
    if (!reason || !reason.trim()) {
      if (reason !== null) toast.error('A cancellation reason is required');
      return;
    }
    setCancelReason(reason.trim());
    setIsCancelModalOpen(true);
  };

  const handleCancel = async () => {
    try {
      await billService.cancelBill(id, cancelReason);
      toast.success('Bill cancelled successfully');
      fetchBill();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel bill');
    }
  };

  const handleDownload = async () => {
    try {
      toast.loading('Preparing PDF...', { id: 'pdf-dl' });
      await downloadBillPdf(bill._id, bill.invoiceNumber);
      toast.success('Downloaded', { id: 'pdf-dl' });
    } catch (error) {
      toast.error('Failed to download PDF', { id: 'pdf-dl' });
    }
  };

  const handlePrint = async () => {
    try {
      const blob = await billService.getBillPdf(bill._id);
      const url = window.URL.createObjectURL(blob);
      const printWindow = window.open(url);
      if (printWindow) {
        printWindow.onload = () => printWindow.print();
      } else {
        toast.error('Please allow pop-ups to print');
      }
    } catch (error) {
      toast.error('Failed to open PDF for printing');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (!bill) return null;

  const canAddPayment = ['PENDING', 'PARTIAL'].includes(bill.status);
  const canCancel = bill.status !== 'CANCELLED';

  return (
    <div className="max-w-5xl mx-auto pb-12 space-y-6">
      <div className="flex items-center space-x-4 mb-2">
        <button onClick={() => navigate('/bills')} className="text-gray-500 hover:text-bnk-primary transition-colors p-2 rounded-lg hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Bill Details</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header Strip */}
        <div className="bg-bnk-primary px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center text-white">
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <h2 className="text-xl font-bold">{bill.invoiceNumber}</h2>
              <StatusBadge status={bill.status} />
            </div>
            <p className="text-bnk-secondary text-sm">Generated on {formatDate(bill.billDate)}</p>
          </div>
          <div className="flex space-x-2 mt-4 sm:mt-0">
            <button onClick={handlePrint} className="flex items-center space-x-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors">
              <Printer className="w-4 h-4" /> <span>Print</span>
            </button>
            <button onClick={handleDownload} className="flex items-center space-x-1 px-3 py-1.5 bg-white text-bnk-primary hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors shadow-sm">
              <Download className="w-4 h-4" /> <span>Download PDF</span>
            </button>
          </div>
        </div>

        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Patient Details</p>
                <h3 className="font-bold text-gray-900 text-lg">{bill.patient?.name}</h3>
                <p className="text-sm text-gray-600">{bill.patient?.gender}, {bill.patient?.age} Yrs</p>
                <p className="text-sm text-gray-600">{bill.patient?.phone}</p>
                <p className="text-sm text-gray-600 mt-1">{bill.patient?.address}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Treatment Info</p>
                {bill.registrationDate && <p className="text-sm text-gray-600"><span className="font-medium">Reg Date:</span> {formatDate(bill.registrationDate)}</p>}
                {bill.referredBy && <p className="text-sm text-gray-600"><span className="font-medium">Referred By:</span> {bill.referredBy}</p>}
                {bill.diagnosis && <p className="text-sm text-gray-600 mt-2"><span className="font-medium">Diagnosis:</span><br />{bill.diagnosis}</p>}
              </div>
            </div>

            {bill.treatments && bill.treatments.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Treatments Applied</p>
                <div className="flex flex-wrap gap-2">
                  {bill.treatments.map(t => (
                    <span key={t} className="px-3 py-1 bg-bnk-secondary/10 text-bnk-primary rounded-lg text-sm font-medium border border-bnk-secondary/20">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Charges Breakdown</p>
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-4 text-sm font-semibold text-gray-700">Particulars</th>
                      <th className="py-3 px-4 text-sm font-semibold text-gray-700 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(bill.chargeItems || []).map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-3 px-4 text-sm text-gray-800">{item.particular}</td>
                        <td className="py-3 px-4 text-sm text-gray-800 text-right font-medium">{formatCurrency(item.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex flex-col items-end space-y-2">
                <div className="w-64 flex justify-between text-sm text-gray-600 px-4">
                  <span>Subtotal</span>
                  <span>{formatCurrency(bill.subTotal)}</span>
                </div>
                {bill.discount > 0 && (
                  <div className="w-64 flex justify-between text-sm text-red-600 px-4">
                    <span>Discount</span>
                    <span>- {formatCurrency(bill.discount)}</span>
                  </div>
                )}
                <div className="w-72 flex justify-between text-lg font-bold text-gray-900 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                  <span>Grand Total</span>
                  <span>{formatCurrency(bill.totalAmount)}</span>
                </div>
                <div className="w-full mt-2">
                  <p className="text-xs text-gray-500 text-right">Amount in words: <span className="font-medium italic text-bnk-primary">{amountToWords(bill.totalAmount / 100)}</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar / Payments */}
          <div className="md:border-l md:border-gray-100 md:pl-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Payment Status</h3>

            <PaymentHistory
              payments={bill.payments}
              totalAmount={bill.totalAmount}
              paidAmount={bill.paidAmount}
            />

            <div className="mt-8 space-y-3">
              {canAddPayment && (
                <button
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="w-full flex justify-center items-center space-x-2 bg-bnk-primary hover:bg-[#1a5a4d] text-white py-2.5 rounded-xl text-sm font-medium transition-colors"
                >
                  <Banknote className="w-4 h-4" /> <span>Add Payment</span>
                </button>
              )}
              {canCancel && (
                <button
                  onClick={openCancelModal}
                  className="w-full flex justify-center items-center space-x-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 py-2.5 rounded-xl text-sm font-medium transition-colors"
                >
                  <Ban className="w-4 h-4" /> <span>Cancel Bill</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        bill={bill}
        onSuccess={fetchBill}
      />

      <ConfirmModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleCancel}
        title="Cancel Bill"
        message={`Are you sure you want to cancel this bill? Reason: "${cancelReason}". This action cannot be undone. Any payments recorded will be kept in history but the bill status will be marked as CANCELLED.`}
        confirmText="Yes, Cancel Bill"
        isDestructive={true}
      />
    </div>
  );
};

export default BillDetailPage;