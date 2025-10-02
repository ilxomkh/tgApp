import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminUsersList from './AdminUsersList';
import AdminUserDetail from './AdminUserDetail';
import AdminRaffles from './AdminRaffles';
import AdminStats from './AdminStats';
import AdminBroadcast from './AdminBroadcast';
import AdminProtectedRoute from './AdminProtectedRoute';

const AdminPanel = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#7C65FF]/5 via-white to-[#5538F9]/8">
      <div className="absolute inset-0 bg-gradient-to-tr from-[#7C65FF]/3 via-transparent to-[#5538F9]/4 opacity-60"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#7C65FF]/8 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-[#5538F9]/6 rounded-full blur-3xl"></div>
      
      <AdminProtectedRoute>
        <div className="relative z-10">
          <Routes>
            <Route path="/" element={<Navigate to="/admin/users" replace />} />
            <Route path="/users" element={<AdminUsersList />} />
            <Route path="/users/:userId" element={<AdminUserDetail />} />
            <Route path="/raffles" element={<AdminRaffles />} />
            <Route path="/stats" element={<AdminStats />} />
            <Route path="/broadcast" element={<AdminBroadcast />} />
          </Routes>
        </div>
      </AdminProtectedRoute>
    </div>
  );
};

export default AdminPanel;
