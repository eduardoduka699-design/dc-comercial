import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Layout from './components/Layout';
import ComercialModule from './pages/ComercialModule';
import ProcessualModule from './pages/ProcessualModule';
import RHModule from './pages/RHModule';
import RoleplayModule from './pages/RoleplayModule';
import MarketingModule from './pages/MarketingModule';
import AdminModule from './pages/AdminModule';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return localStorage.getItem('dc-leiseca-auth-v2') === 'true';
    } catch {
      return false;
    }
  });

  const [userRole, setUserRole] = useState(() => {
    try {
      return localStorage.getItem('dc-leiseca-role-v2') || 'Admin Supremo';
    } catch {
      return 'Admin Supremo';
    }
  });

  const handleLogin = (cargo) => {
    const role = cargo || 'Admin Supremo';
    setIsAuthenticated(true);
    setUserRole(role);
    try {
      localStorage.setItem('dc-leiseca-auth-v2', 'true');
      localStorage.setItem('dc-leiseca-role-v2', role);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole('');
    try {
      localStorage.removeItem('dc-leiseca-auth-v2');
      localStorage.removeItem('dc-leiseca-role-v2');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <BrowserRouter>
      {!isAuthenticated ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Layout userRole={userRole} onLogout={handleLogout}>
          <Routes>
            <Route path="/" element={<Navigate to="/comercial" replace />} />
            <Route path="/comercial" element={<ComercialModule />} />
            <Route path="/processual" element={<ProcessualModule />} />
            <Route path="/rh" element={<RHModule />} />
            <Route path="/marketing" element={<MarketingModule />} />
            <Route path="/roleplay" element={<RoleplayModule />} />
            <Route path="/admin" element={<AdminModule />} />
            <Route path="*" element={<Navigate to="/comercial" replace />} />
          </Routes>
        </Layout>
      )}
    </BrowserRouter>
  );
}

export default App;
