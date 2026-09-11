import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import DataTable from '../components/ui/DataTable';
import SearchBar from '../components/ui/SearchBar';
import Pagination from '../components/ui/Pagination';
import PaymentModal from '../components/payments/PaymentModal';
import { billService } from '../services/billService';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/dateUtils';
import toast from 'react-hot-toast';

const PendingPaymentsPage = () => {
  const [loading, setLoading] = useState(true);
  const [bills, setBills] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState('');
  const [selectedBill, setSelectedBill] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const fetchPendingBills = async () => {
    try {
      setLoading(true);
      const res = await billService.getPendingBills({ page, limit: 10, search: search || undefined });
      setBills(res.bills || []);
      setTotalPages(res.totalPages || 1);
      setTotalItems(res.total || 0);
    } catch (error) {
      console.error('Failed to fetch pending bills', error);
      toast.error('Failed to fetch pending bills');
      setBills([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingBills();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);

  const handleAddPayment = (bill) => {
    setSelectedBill(bill);
    setIsPaymentModalOpen(true);
  };

  const columns = [
    { header: 'Patient', accessor: 'patient', cell: (row) => row.patient?.name || '-', className: 'font-medium text-gray-900' },
    { header: 'Invoice #', accessor: 'invoiceNumber', className: 'text-gray-500' },
    { header: 'Phone', accessor: 'phone', cell: (row) => row.patient?.phone || '-' },
    { header: 'Total Amount', accessor: 'totalAmount', cell: (row) => formatCurrency(row.totalAmount) },
    { header: 'Paid', accessor: 'paidAmount', cell: (row) => formatCurrency(row.paidAmount), className: 'text-green-600' },
    {
      header: 'Due',
      accessor: 'dueAmount',
      cell: (row) => formatCurrency(row.dueAmount),
      className: 'font-bold text-red-600'
    },
    { header: 'Bill Date', accessor: 'billDate', cell: (row) => formatDate(row.billDate) },
    {
      header: 'Action',
      accessor: 'action',
      cell: (row) => (
        <button
          onClick={() => handleAddPayment(row)}
          className="bg-bnk-secondary/10 text-bnk-primary hover:bg-bnk-secondary/20 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
        >
          Add Payment
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pending Payments"
        subtitle="Manage and track outstanding balances"
      />

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <SearchBar onSearch={(v) => { setSearch(v); setPage(1); }} placeholder="Search patient or invoice..." />
        </div>

        <DataTable
          columns={columns}
          data={bills}
          loading={loading}
          emptyIcon={Clock}
          emptyMessage="All payments are cleared! 🎉"
        />

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={10}
          onPageChange={setPage}
        />
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        bill={selectedBill}
        onSuccess={fetchPendingBills}
      />
    </div>
  );
};

export default PendingPaymentsPage;