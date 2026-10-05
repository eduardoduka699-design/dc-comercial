import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ComercialModule from './pages/ComercialModule';
import ProcessualModule from './pages/ProcessualModule';
import RHModule from './pages/RHModule';
import RoleplayModule from './pages/RoleplayModule';
import MarketingModule from './pages/MarketingModule';
import AdminModule from './pages/AdminModule';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('dc-leiseca-auth-v2') === 'true';
  });

  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('dc-leiseca-role-v2') || '';
  });

  const handleLogin = (cargo) => {
    setIsAuthenticated(true);
    setUserRole(cargo);
    localStorage.setItem('dc-leiseca-auth-v2', 'true');
    localStorage.setItem('dc-leiseca-role-v2', cargo || 'Admin Supremo');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole('');
    localStorage.removeItem('dc-leiseca-auth-v2');
    localStorage.removeItem('dc-leiseca-role-v2');
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <BrowserRouter>
      <Layout userRole={userRole} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/comercial" element={<ComercialModule />} />
          <Route path="/processual" element={<ProcessualModule />} />
          <Route path="/rh" element={<RHModule />} />
          <Route path="/marketing" element={<MarketingModule />} />
          <Route path="/roleplay" element={<RoleplayModule />} />
          <Route path="/admin" element={<AdminModule />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
