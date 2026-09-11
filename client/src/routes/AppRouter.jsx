import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AppLayout from '../layouts/AppLayout';

// Pages
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import CreateBillPage from '../pages/CreateBillPage';
import BillHistoryPage from '../pages/BillHistoryPage';
import BillDetailPage from '../pages/BillDetailPage';
import PendingPaymentsPage from '../pages/PendingPaymentsPage';
import RevenuePage from '../pages/RevenuePage';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/bills/create" element={<CreateBillPage />} />
          <Route path="/bills" element={<BillHistoryPage />} />
          <Route path="/bills/:id" element={<BillDetailPage />} />
          <Route path="/pending" element={<PendingPaymentsPage />} />
          <Route path="/revenue" element={<RevenuePage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRouter;
