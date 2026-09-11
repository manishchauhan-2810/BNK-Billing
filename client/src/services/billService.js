import api from './api';

// Note on units: everything here (subTotal, discount, totalAmount, paidAmount,
// dueAmount, chargeItems[].amount) is stored and returned by the backend in
// PAISE. Convert with rupeesToPaise/paiseToRupees from utils/formatCurrency.js
// when reading/writing rupee-denominated form fields.
//
// IMPORTANT: when creating a bill, send chargeItems[].amount and discount and
// initialPayment.amount as plain RUPEE numbers (not pre-multiplied) — the
// backend's billService.createNewBill() does the *100 conversion itself.

export const billService = {
  createBill: async (data) => {
    const response = await api.post('/bills', data);
    return response.data.data;
  },
  getBills: async (params) => {
    const response = await api.get('/bills', { params });
    return response.data.data; // { bills, total, page, totalPages }
  },
  getBillById: async (id) => {
    const response = await api.get(`/bills/${id}`);
    return response.data.data; // bill + payments[]
  },
  cancelBill: async (id, reason) => {
    const response = await api.post(`/bills/${id}/cancel`, { reason });
    return response.data.data;
  },
  getPendingBills: async (params) => {
    const response = await api.get('/bills/pending', { params });
    return response.data.data; // { bills, total, page, totalPages, totalOutstanding }
  },
  getCtScanRates: async () => {
    const response = await api.get('/bills/ct-rates');
    return response.data.data; // [{ procedure, rate }]
  },
  getBillPdf: async (id) => {
    const response = await api.get(`/bills/${id}/pdf`, { responseType: 'blob' });
    return response.data; // raw PDF blob, not wrapped in {success,data}
  },
  addPayment: async (billId, paymentData) => {
    const response = await api.post(`/bills/${billId}/payments`, paymentData);
    return response.data.data;
  },
  getPayments: async (billId) => {
    const response = await api.get(`/bills/${billId}/payments`);
    return response.data.data;
  }
};

// Triggers a browser download for a bill PDF. Call this from any page
// instead of writing the blob-handling logic inline each time.
export const downloadBillPdf = async (billId, invoiceNumber) => {
  const blob = await billService.getBillPdf(billId);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${invoiceNumber || billId}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};