import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminUsersList from './AdminUsersList';
import AdminUserDetail from './AdminUserDetail';
import AdminRaffles from './AdminRaffles';
import AdminStats from './AdminStats';
import AdminProtectedRoute from './AdminProtectedRoute';

const AdminPanel = () => {
  return (
    <AdminProtectedRoute>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/users" replace />} />
        <Route path="/users" element={<AdminUsersList />} />
        <Route path="/users/:userId" element={<AdminUserDetail />} />
        <Route path="/raffles" element={<AdminRaffles />} />
        <Route path="/stats" element={<AdminStats />} />
      </Routes>
    </AdminProtectedRoute>
  );
};

export default AdminPanel;
