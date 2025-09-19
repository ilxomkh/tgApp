import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminUsersList from './AdminUsersList';
import AdminUserDetail from './AdminUserDetail';
import AdminProtectedRoute from './AdminProtectedRoute';

const AdminPanel = () => {
  return (
    <AdminProtectedRoute>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/users" replace />} />
        <Route path="/users" element={<AdminUsersList />} />
        <Route path="/users/:userId" element={<AdminUserDetail />} />
      </Routes>
    </AdminProtectedRoute>
  );
};

export default AdminPanel;
