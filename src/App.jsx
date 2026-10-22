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

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('dc-leiseca-user-v2');
      if (saved) return JSON.parse(saved);
      const role = localStorage.getItem('dc-leiseca-role-v2') || 'Admin Supremo';
      return {
        nome: role === 'Admin Supremo' ? 'Gabriel Vidal' : 'Colaborador',
        cargo: role,
        usuario: 'admin'
      };
    } catch {
      return { nome: 'Gabriel Vidal', cargo: 'Admin Supremo', usuario: 'admin' };
    }
  });

  const [userRole, setUserRole] = useState(() => {
    try {
      return localStorage.getItem('dc-leiseca-role-v2') || 'Admin Supremo';
    } catch {
      return 'Admin Supremo';
    }
  });

  const handleLogin = (user) => {
    const role = typeof user === 'string' ? user : (user?.cargo || 'Admin Supremo');
    const userData = (typeof user === 'object' && user !== null) ? user : {
      nome: role === 'Admin Supremo' ? 'Gabriel Vidal' : 'Colaborador',
      cargo: role,
      usuario: 'admin'
    };

    setIsAuthenticated(true);
    setUserRole(role);
    setCurrentUser(userData);

    try {
      localStorage.setItem('dc-leiseca-auth-v2', 'true');
      localStorage.setItem('dc-leiseca-role-v2', role);
      localStorage.setItem('dc-leiseca-user-v2', JSON.stringify(userData));
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole('');
    setCurrentUser(null);
    try {
      localStorage.removeItem('dc-leiseca-auth-v2');
      localStorage.removeItem('dc-leiseca-role-v2');
      localStorage.removeItem('dc-leiseca-user-v2');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <BrowserRouter>
      {!isAuthenticated ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Layout userRole={userRole} currentUser={currentUser} onLogout={handleLogout}>
          <Routes>
            <Route path="/" element={<Navigate to="/comercial" replace />} />
            <Route path="/comercial" element={<ComercialModule currentUser={currentUser} />} />
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
