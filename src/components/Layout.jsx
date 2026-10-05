import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Target, 
  FileText, 
  Users, 
  Megaphone, 
  Briefcase, 
  Settings, 
  LogOut,
  ChevronLeft
} from 'lucide-react';

export default function Layout({ children, userRole, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = userRole === 'Admin Supremo' || userRole?.includes('Gestor');

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Gestão Comercial', path: '/comercial', icon: Target },
    { name: 'Treinamentos', path: '/processual', icon: FileText },
    { name: 'Performance & RH', path: '/rh', icon: Users },
    { name: 'Growth & Mkt', path: '/marketing', icon: Megaphone },
    { name: 'Roleplay IA', path: '/roleplay', icon: Briefcase },
  ];

  if (isAdmin) {
    menuItems.push({ name: 'Configurações', path: '/admin', icon: Settings });
  }

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden font-sans">
      
      {/* Sidebar Lateral */}
      <aside className="w-64 bg-[#101010] border-r border-white/5 flex flex-col shrink-0 relative z-20">
        
        {/* Header Logo */}
        <div className="h-20 flex items-center px-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#f97316] rounded-xl flex items-center justify-center shadow-lg shadow-[#f97316]/20">
              <span className="font-bold text-white text-lg tracking-tighter">DC</span>
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="font-bold text-lg leading-none tracking-tight text-white">DashClient</h1>
              <span className="text-[9px] tracking-[0.2em] text-white/50 font-bold uppercase mt-1 leading-none">Gabriel Vidal</span>
            </div>
          </div>
        </div>

        {/* Menu Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 scrollbar-hide">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-[#f97316] text-white shadow-[0_0_15px_rgba(249,115,22,0.3)]' 
                    : 'text-white/50 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-white' : 'text-white/50'} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Area */}
        <div className="p-4 border-t border-white/5 space-y-2">
          <div className="px-4 mb-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-blue/20 flex items-center justify-center text-brand-blue font-bold text-xs">
              {userRole?.substring(0, 2).toUpperCase() || 'US'}
            </div>
            <div>
              <p className="text-xs font-bold text-white leading-tight">Minha Conta</p>
              <p className="text-[10px] text-white/40">{userRole}</p>
            </div>
          </div>
          
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:bg-white/5 hover:text-red-400 transition-colors"
          >
            <LogOut size={16} />
            Sair do Sistema
          </button>
          
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/30 hover:bg-white/5 hover:text-white transition-colors">
            <ChevronLeft size={16} />
            Recolher
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
