import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Target, 
  FileText, 
  Users, 
  Megaphone, 
  Briefcase, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  User
} from 'lucide-react';

export default function Layout({ children, userRole, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem('dc-sidebar-collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('dc-sidebar-collapsed', String(next));
      } catch {}
      return next;
    });
  };

  const isAdmin = userRole === 'Admin Supremo' || userRole?.includes('Gestor');

  const menuItems = [
    { name: 'Gestão Comercial', path: '/comercial', icon: Target },
    { name: 'Treinamentos', path: '/processual', icon: FileText },
    { name: 'Desempenho e RH', path: '/rh', icon: Users },
    { name: 'Growth e Marketing', path: '/marketing', icon: Megaphone },
    { name: 'Roleplay IA', path: '/roleplay', icon: Briefcase },
  ];

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden font-sans">
      
      {/* Sidebar Lateral */}
      <aside 
        className={`${isCollapsed ? 'w-20' : 'w-64'} bg-[#101010] border-r border-white/5 flex flex-col shrink-0 relative z-30 transition-all duration-300 select-none`}
      >
        {/* Botão de Recolher/Expandir no CENTRO da borda lateral */}
        <button
          type="button"
          onClick={toggleCollapse}
          aria-label={isCollapsed ? "Expandir menu lateral" : "Recolher menu lateral"}
          title={isCollapsed ? "Expandir menu lateral" : "Recolher menu lateral"}
          className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-[#1c1c1c] hover:bg-brand-blue border border-white/20 hover:border-brand-blue rounded-full flex items-center justify-center text-white/80 hover:text-white shadow-2xl cursor-pointer z-50 transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none"
        >
          {isCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
        
        {/* Header Logo */}
        <div className={`h-20 flex items-center border-b border-white/5 ${isCollapsed ? 'justify-center px-0' : 'justify-between px-6'}`}>
          <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
            <div 
              onClick={() => isCollapsed && toggleCollapse()}
              className={`w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center shadow-lg shadow-brand-blue/20 shrink-0 ${isCollapsed ? 'cursor-pointer hover:scale-105 transition-transform' : ''}`}
              title={isCollapsed ? "Clique para expandir o menu" : undefined}
            >
              <span className="font-bold text-white text-lg tracking-tighter" translate="no">DC</span>
            </div>
            {!isCollapsed && (
              <div className="flex flex-col justify-center animate-in fade-in">
                <h1 className="font-bold text-lg leading-none tracking-tight text-white" translate="no">DashClient</h1>
                <span className="text-[9px] tracking-[0.2em] text-white/50 font-bold uppercase mt-1 leading-none" translate="no">Gabriel Vidal</span>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              type="button"
              onClick={toggleCollapse}
              className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors"
              title="Recolher menu lateral"
            >
              <PanelLeftClose size={18} />
            </button>
          )}
        </div>

        {/* Menu Navigation */}
        <nav className={`flex-1 overflow-y-auto py-6 space-y-2 scrollbar-hide ${isCollapsed ? 'px-3' : 'px-4'}`}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                title={isCollapsed ? item.name : undefined}
                className={`flex items-center rounded-xl text-sm font-medium transition-all ${
                  isCollapsed ? 'justify-center p-3' : 'px-4 py-3 gap-3'
                } ${
                  isActive 
                    ? 'bg-brand-blue text-white shadow-[0_0_15px_rgba(0,112,243,0.3)]' 
                    : 'text-white/50 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-white shrink-0' : 'text-white/50 shrink-0'} />
                {!isCollapsed && <span className="whitespace-nowrap animate-in fade-in">{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Area */}
        <div className={`p-4 border-t border-white/5 space-y-2 flex flex-col ${isCollapsed ? 'items-center px-2' : ''}`}>
          
          {isAdmin && (
            <NavLink
              to="/admin"
              title={isCollapsed ? "Configurações" : undefined}
              className={`w-full flex items-center rounded-xl text-sm font-medium transition-all mb-4 ${
                isCollapsed ? 'justify-center p-3' : 'px-4 py-3 gap-3'
              } ${
                location.pathname === '/admin'
                  ? 'bg-brand-blue text-white shadow-[0_0_15px_rgba(0,112,243,0.3)]' 
                  : 'text-white/50 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Settings size={18} className={location.pathname === '/admin' ? 'text-white shrink-0' : 'text-white/50 shrink-0'} />
              {!isCollapsed && <span className="whitespace-nowrap animate-in fade-in">Configurações</span>}
            </NavLink>
          )}

          <div className={`mb-4 flex items-center gap-3 overflow-hidden whitespace-nowrap ${isCollapsed ? 'justify-center' : 'px-4'}`}>
            <div className="w-8 h-8 rounded-full bg-brand-blue/20 flex items-center justify-center text-brand-blue shrink-0">
              <User size={14} />
            </div>
            {!isCollapsed && (
              <div className="animate-in fade-in">
                <p className="text-xs font-bold text-white leading-tight">Minha Conta</p>
                <p className="text-[10px] text-white/40 truncate w-32" translate="no">{userRole}</p>
              </div>
            )}
          </div>
          
          <button 
            onClick={onLogout}
            title={isCollapsed ? "Sair do Sistema" : undefined}
            className={`w-full flex items-center rounded-xl text-sm font-medium text-white/50 hover:bg-white/5 hover:text-red-400 transition-colors ${
              isCollapsed ? 'justify-center p-2.5' : 'px-4 py-2.5 gap-3'
            }`}
          >
            <LogOut size={16} className="shrink-0" />
            {!isCollapsed && <span className="whitespace-nowrap animate-in fade-in">Sair do Sistema</span>}
          </button>
          
          {/* Botão de Rodapé para Recolher/Expandir */}
          <button 
            type="button"
            onClick={toggleCollapse}
            title={isCollapsed ? "Expandir menu lateral" : "Recolher menu lateral"}
            className={`w-full flex items-center rounded-xl text-sm font-medium transition-colors ${
              isCollapsed 
                ? 'justify-center p-2.5 text-white/60 hover:text-white hover:bg-white/10' 
                : 'justify-center py-2.5 gap-2 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5'
            }`}
          >
            {isCollapsed ? <ChevronRight size={16} className="shrink-0 text-brand-blue" /> : <ChevronLeft size={16} className="shrink-0" />}
            {!isCollapsed && <span className="whitespace-nowrap text-xs uppercase tracking-widest font-bold">Recolher Menu</span>}
          </button>
        </div>
      </aside>

      {/* Main Area onde os modulos renderizam */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0a0a0a] relative overflow-hidden">
        {children}
      </div>

    </div>
  );
}
