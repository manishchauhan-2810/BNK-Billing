import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, FileText, Download, Banknote } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import DataTable from '../components/ui/DataTable';
import StatusBadge from '../components/ui/StatusBadge';
import SearchBar from '../components/ui/SearchBar';
import FilterBar from '../components/ui/FilterBar';
import Pagination from '../components/ui/Pagination';
import PaymentModal from '../components/payments/PaymentModal';
import { billService, downloadBillPdf } from '../services/billService';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate, getDateRange } from '../utils/dateUtils';
import toast from 'react-hot-toast';

const BillHistoryPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [bills, setBills] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [billTypeFilter, setBillTypeFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedBill, setSelectedBill] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const { start, end } = getDateRange(dateFilter);
      const res = await billService.getBills({
        page,
        limit: 10,
        search: search || undefined,
        status: statusFilter || undefined,
        billType: billTypeFilter || undefined,
        dateFrom: start || undefined,
        dateTo: end || undefined
      });
      setBills(res.bills || []);
      setTotalPages(res.totalPages || 1);
      setTotalItems(res.total || 0);
    } catch (error) {
      console.error('Failed to fetch bills', error);
      toast.error('Failed to fetch bills');
      setBills([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, statusFilter, billTypeFilter, dateFilter]);

  const handleDownloadPdf = async (e, row) => {
    e.stopPropagation();
    try {
      toast.loading('Preparing PDF...', { id: 'pdf-dl' });
      await downloadBillPdf(row._id, row.invoiceNumber);
      toast.success('Downloaded', { id: 'pdf-dl' });
    } catch (error) {
      toast.error('Failed to download PDF', { id: 'pdf-dl' });
    }
  };

  const columns = [
    { header: 'Bill Number', accessor: 'invoiceNumber', className: 'font-semibold text-bnk-primary' },
    { header: 'Patient Name', accessor: 'patient', cell: (row) => row.patient?.name || '-' },
    { header: 'Phone', accessor: 'phone', cell: (row) => row.patient?.phone || '-' },
    {
      header: 'Type',
      accessor: 'billType',
      cell: (row) => (
        <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${row.billType === 'CTSCAN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
          {row.billType === 'CTSCAN' ? 'CT Scan' : 'Physio'}
        </span>
      )
    },
    { header: 'Total', accessor: 'totalAmount', cell: (row) => formatCurrency(row.totalAmount) },
    { header: 'Paid', accessor: 'paidAmount', cell: (row) => formatCurrency(row.paidAmount) },
    { header: 'Due', accessor: 'dueAmount', cell: (row) => formatCurrency(row.dueAmount) },
    { header: 'Status', accessor: 'status', cell: (row) => <StatusBadge status={row.status} /> },
    { header: 'Date', accessor: 'billDate', cell: (row) => formatDate(row.billDate) },
    {
      header: 'Actions',
      accessor: 'action',
      cell: (row) => (
        <div className="flex space-x-2" onClick={e => e.stopPropagation()}>
          <button onClick={() => navigate(`/bills/${row._id}`)} className="p-1 text-gray-500 hover:text-bnk-primary transition-colors" title="View">
            <FileText className="w-4 h-4" />
          </button>
          <button onClick={(e) => handleDownloadPdf(e, row)} className="p-1 text-gray-500 hover:text-bnk-primary transition-colors" title="Download">
            <Download className="w-4 h-4" />
          </button>
          {['PENDING', 'PARTIAL'].includes(row.status) && (
            <button onClick={() => { setSelectedBill(row); setIsPaymentModalOpen(true); }} className="p-1 text-green-600 hover:text-green-800 transition-colors" title="Add Payment">
              <Banknote className="w-4 h-4" />
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bill History"
        subtitle="View and manage all generated invoices"
        action={
          <button onClick={() => navigate('/bills/create')} className="flex items-center bg-bnk-primary hover:bg-[#1a5a4d] text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
            <PlusCircle className="w-4 h-4 mr-2" /> New Bill
          </button>
        }
      />

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <SearchBar onSearch={(v) => { setSearch(v); setPage(1); }} placeholder="Search bills..." />
          <FilterBar
            onFilterChange={(key, val) => {
              if (key === 'status') setStatusFilter(val);
              if (key === 'date') setDateFilter(val);
              if (key === 'billType') setBillTypeFilter(val);
              setPage(1);
            }}
            filters={[
              {
                key: 'billType',
                label: 'All Types',
                value: billTypeFilter,
                options: [
                  { value: 'PHYSIO', label: 'Physiotherapy' },
                  { value: 'CTSCAN', label: 'CT Scan' }
                ]
              },
              {
                key: 'status',
                label: 'All Status',
                value: statusFilter,
                options: [
                  { value: 'PAID', label: 'Paid' },
                  { value: 'PARTIAL', label: 'Partial' },
                  { value: 'PENDING', label: 'Pending' },
                  { value: 'CANCELLED', label: 'Cancelled' }
                ]
              },
              {
                key: 'date',
                label: 'All Time',
                value: dateFilter,
                options: [
                  { value: 'Today', label: 'Today' },
                  { value: 'This Week', label: 'This Week' },
                  { value: 'This Month', label: 'This Month' }
                ]
              }
            ]}
          />
        </div>

        <DataTable
          columns={columns}
          data={bills}
          loading={loading}
          emptyMessage="No bills found matching your criteria."
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
        onSuccess={fetchBills}
      />
    </div>
  );
};

export default BillHistoryPage;