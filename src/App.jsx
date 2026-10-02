import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Hub from './pages/Hub';
import ComercialModule from './pages/ComercialModule';
import ProcessualModule from './pages/ProcessualModule';
import RHModule from './pages/RHModule';
import SimuladorModule from './pages/SimuladorModule';
import RoleplayModule from './pages/RoleplayModule';
import MarketingModule from './pages/MarketingModule';
import AdminModule from './pages/AdminModule';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('dc-leiseca-auth') === 'true';
  });

  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('dc-leiseca-role') || '';
  });

  const handleLogin = (cargo) => {
    setIsAuthenticated(true);
    setUserRole(cargo);
    localStorage.setItem('dc-leiseca-auth', 'true');
    localStorage.setItem('dc-leiseca-role', cargo || 'Admin Supremo');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole('');
    localStorage.removeItem('dc-leiseca-auth');
    localStorage.removeItem('dc-leiseca-role');
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Hub onLogout={handleLogout} userRole={userRole} />} />
        <Route path="/comercial" element={<ComercialModule />} />
        <Route path="/processual" element={<ProcessualModule />} />
        <Route path="/rh" element={<RHModule />} />
        <Route path="/marketing" element={<MarketingModule />} />
        <Route path="/simulador" element={<SimuladorModule />} />
        <Route path="/roleplay" element={<RoleplayModule />} />
        <Route path="/admin" element={<AdminModule />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
