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
  ChevronRight
} from 'lucide-react';

export default function Layout({ children, userRole, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isAdmin = userRole === 'Admin Supremo' || userRole?.includes('Gestor');

  const menuItems = [
    { name: 'Gestão Comercial', path: '/comercial', icon: Target },
    { name: 'Treinamentos', path: '/processual', icon: FileText },
    { name: 'Desempenho e RH', path: '/rh', icon: Users },
    { name: 'Growth e Marketing', path: '/marketing', icon: Megaphone },
    { name: 'Roleplay IA', path: '/roleplay', icon: Briefcase },
  ];

  if (isAdmin) {
    menuItems.push({ name: 'Configurações', path: '/admin', icon: Settings });
  }

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden font-sans">
      
      {/* Sidebar Lateral */}
      <aside 
        className={`${isCollapsed ? 'w-20' : 'w-64'} bg-[#101010] border-r border-white/5 flex flex-col shrink-0 relative z-20 transition-all duration-300`}
      >
        
        {/* Header Logo */}
        <div className={`h-20 flex items-center border-b border-white/5 ${isCollapsed ? 'justify-center px-0' : 'px-6'}`}>
          <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
            <div className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center shadow-lg shadow-brand-blue/20 shrink-0">
              <span className="font-bold text-white text-lg tracking-tighter">DC</span>
            </div>
            {!isCollapsed && (
              <div className="flex flex-col justify-center animate-in fade-in">
                <h1 className="font-bold text-lg leading-none tracking-tight text-white">DashClient</h1>
                <span className="text-[9px] tracking-[0.2em] text-white/50 font-bold uppercase mt-1 leading-none">Gabriel Vidal</span>
              </div>
            )}
          </div>
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
          
          <div className={`mb-4 flex items-center gap-3 overflow-hidden whitespace-nowrap ${isCollapsed ? 'justify-center' : 'px-4'}`}>
            <div className="w-8 h-8 rounded-full bg-brand-blue/20 flex items-center justify-center text-brand-blue font-bold text-xs shrink-0">
              {userRole?.substring(0, 2).toUpperCase() || 'US'}
            </div>
            {!isCollapsed && (
              <div className="animate-in fade-in">
                <p className="text-xs font-bold text-white leading-tight">Minha Conta</p>
                <p className="text-[10px] text-white/40 truncate w-32">{userRole}</p>
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
          
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`w-full flex items-center rounded-xl text-sm font-medium text-white/30 hover:bg-white/5 hover:text-white transition-colors ${
              isCollapsed ? 'justify-center p-2.5' : 'justify-center py-2.5 gap-2'
            }`}
          >
            {isCollapsed ? <ChevronRight size={16} className="shrink-0" /> : <ChevronLeft size={16} className="shrink-0" />}
            {!isCollapsed && <span className="whitespace-nowrap animate-in fade-in text-xs uppercase tracking-widest font-bold">Recolher</span>}
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
