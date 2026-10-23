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
  User,
  Menu,
  X,
  Download,
  Smartphone
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import InstallModal from './InstallModal';

export default function Layout({ children, userRole, currentUser, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const {
    isInstallable,
    isStandalone,
    isIOS,
    promptInstall,
    showInstallGuide,
    setShowInstallGuide
  } = usePWAInstall();

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

  // Atalhos rápidos para a barra inferior mobile
  const bottomNavItems = [
    { name: 'Comercial', path: '/comercial', icon: Target },
    { name: 'Marketing', path: '/marketing', icon: Megaphone },
    { name: 'Treinos', path: '/processual', icon: FileText },
    { name: 'RH', path: '/rh', icon: Users },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#0a0a0a] text-white overflow-hidden font-sans">
      
      {/* ---------------- MOBILE TOP HEADER (Visível apenas em celular < md) ---------------- */}
      <header className="flex md:hidden h-14 bg-[#101010] border-b border-white/10 px-4 items-center justify-between shrink-0 z-30 select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center shadow-md shadow-brand-blue/30">
            <span className="font-bold text-white text-sm tracking-tighter" translate="no">DC</span>
          </div>
          <div className="flex flex-col">
            <h1 className="font-bold text-sm leading-none tracking-tight text-white" translate="no">DashClient</h1>
            <span className="text-[9px] tracking-widest text-white/40 uppercase font-bold mt-0.5 truncate max-w-[120px]">
              {currentUser?.nome?.split(' ')[0] || 'Portal'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Botão Instalar App no Header Mobile */}
          {isInstallable && (
            <button
              type="button"
              onClick={promptInstall}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-blue/15 border border-brand-blue/30 text-brand-blue text-xs font-bold hover:bg-brand-blue hover:text-white transition-all shadow-sm"
              title="Instalar aplicativo"
            >
              <Download size={13} />
              <span>Instalar</span>
            </button>
          )}

          {/* Botão Hambúrguer para abrir Gaveta */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-xl text-white/70 hover:text-white bg-white/5 border border-white/10 transition-colors"
            aria-label="Abrir menu de navegação"
          >
            <Menu size={18} />
          </button>
        </div>
      </header>

      {/* ---------------- MOBILE DRAWER OFF-CANVAS (Menu Deslizante Mobile) ---------------- */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex animate-in fade-in duration-200">
          {/* Backdrop escuro com blur */}
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Gaveta Lateral */}
          <div className="relative w-4/5 max-w-xs bg-[#121212] border-r border-white/10 h-full flex flex-col p-5 shadow-2xl z-10 animate-in slide-in-from-left duration-300">
            {/* Header da Gaveta */}
            <div className="flex items-center justify-between pb-5 border-b border-white/10 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-brand-blue rounded-xl flex items-center justify-center shadow-lg shadow-brand-blue/30">
                  <span className="font-bold text-white text-base tracking-tighter" translate="no">DC</span>
                </div>
                <div>
                  <h2 className="font-bold text-base text-white" translate="no">DashClient</h2>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Gestão & Comercial</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            {/* Links de Navegação Mobile */}
            <nav className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 px-3 py-1">Módulos</p>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive 
                        ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' 
                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon size={18} className={isActive ? 'text-white' : 'text-white/50'} />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}

              {isAdmin && (
                <>
                  <div className="pt-3 pb-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 px-3">Gestão</p>
                  </div>
                  <NavLink
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                      location.pathname === '/admin'
                        ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' 
                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Settings size={18} className={location.pathname === '/admin' ? 'text-white' : 'text-white/50'} />
                    <span>Configurações</span>
                  </NavLink>
                </>
              )}
            </nav>

            {/* Rodapé da Gaveta Mobile */}
            <div className="pt-4 border-t border-white/10 space-y-3 shrink-0">
              {/* Botão de Instalação na Gaveta */}
              {isInstallable && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    promptInstall();
                  }}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-brand-blue/20 to-blue-600/20 border border-brand-blue/30 text-brand-blue hover:text-white hover:bg-brand-blue text-xs font-bold transition-all shadow-md"
                >
                  <Download size={15} />
                  <span>Instalar App no Celular</span>
                </button>
              )}

              {/* Informações do Usuário */}
              <div className="flex items-center gap-3 px-2 py-1">
                <div className="w-8 h-8 rounded-full bg-brand-blue/20 flex items-center justify-center text-brand-blue shrink-0">
                  <User size={14} />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-white truncate">{currentUser?.nome || 'Minha Conta'}</p>
                  <p className="text-[10px] text-white/40 truncate">{currentUser?.cargo || userRole}</p>
                </div>
              </div>

              {/* Botão Sair */}
              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut size={15} />
                <span>Sair da Conta</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- SIDEBAR LATERAL DESKTOP (Oculta no Celular, Visível em >= md) ---------------- */}
      <aside 
        className={`hidden md:flex ${isCollapsed ? 'w-20' : 'w-64'} bg-[#101010] border-r border-white/5 flex-col shrink-0 relative z-30 transition-all duration-300 select-none`}
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
                <span className="text-[9px] tracking-[0.2em] text-white/50 font-bold uppercase mt-1 leading-none truncate max-w-[130px]" translate="no">
                  {currentUser?.nome || 'Gabriel Vidal'}
                </span>
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

        {/* Menu Navigation Desktop */}
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

        {/* Footer Area Desktop */}
        <div className={`p-4 border-t border-white/5 space-y-2 flex flex-col ${isCollapsed ? 'items-center px-2' : ''}`}>
          
          {/* Botão de Instalação no Desktop Sidebar */}
          {isInstallable && (
            <button
              type="button"
              onClick={promptInstall}
              title="Instalar aplicativo DashClient"
              className={`w-full flex items-center rounded-xl text-xs font-bold transition-all mb-2 ${
                isCollapsed 
                  ? 'justify-center p-3 text-brand-blue hover:bg-brand-blue/10 border border-brand-blue/20' 
                  : 'px-4 py-2.5 gap-2.5 text-brand-blue hover:text-white hover:bg-brand-blue bg-brand-blue/10 border border-brand-blue/30 shadow-sm'
              }`}
            >
              <Download size={16} className="shrink-0" />
              {!isCollapsed && <span className="whitespace-nowrap animate-in fade-in">Instalar Aplicativo</span>}
            </button>
          )}

          {isAdmin && (
            <NavLink
              to="/admin"
              title={isCollapsed ? "Configurações" : undefined}
              className={`w-full flex items-center rounded-xl text-sm font-medium transition-all mb-2 ${
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

          <div className={`mb-2 flex items-center gap-3 overflow-hidden whitespace-nowrap ${isCollapsed ? 'justify-center' : 'px-4'}`}>
            <div className="w-8 h-8 rounded-full bg-brand-blue/20 flex items-center justify-center text-brand-blue shrink-0">
              <User size={14} />
            </div>
            {!isCollapsed && (
              <div className="animate-in fade-in overflow-hidden">
                <p className="text-xs font-bold text-white leading-tight truncate w-32" title={currentUser?.nome || 'Minha Conta'}>
                  {currentUser?.nome || 'Minha Conta'}
                </p>
                <p className="text-[10px] text-white/40 truncate w-32" translate="no">
                  {currentUser?.cargo || userRole}
                </p>
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

      {/* ---------------- MAIN CONTENT AREA ---------------- */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0a0a0a] relative overflow-hidden pb-16 md:pb-0">
        {children}
      </div>

      {/* ---------------- MOBILE BOTTOM NAVIGATION BAR (Barra Fixa Inferior Mobile) ---------------- */}
      <nav 
        aria-label="Navegação móvel inferior"
        className="flex md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#101010]/95 backdrop-blur-md border-t border-white/10 z-40 px-2 items-center justify-around select-none shadow-[0_-5px_20px_rgba(0,0,0,0.5)]"
      >
        {bottomNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all ${
                isActive ? 'text-brand-blue font-bold' : 'text-white/40 hover:text-white/70'
              }`}
            >
              <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-brand-blue/15 scale-105' : ''}`}>
                <Icon size={19} className={isActive ? 'text-brand-blue' : 'text-white/50'} />
              </div>
              <span className="text-[10px] leading-tight mt-0.5 tracking-tight truncate max-w-[64px]">
                {item.name}
              </span>
            </NavLink>
          );
        })}

        {/* Botão Menu (abre drawer lateral) */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-white/40 hover:text-white transition-all ${
            mobileMenuOpen ? 'text-brand-blue font-bold' : ''
          }`}
        >
          <div className="p-1 rounded-xl">
            <Menu size={19} className="text-white/50" />
          </div>
          <span className="text-[10px] leading-tight mt-0.5 tracking-tight">Menu</span>
        </button>
      </nav>

      {/* Modal explicativo de instalação PWA (iOS e fallback desktop/Android) */}
      <InstallModal
        isOpen={showInstallGuide}
        onClose={() => setShowInstallGuide(false)}
        isIOS={isIOS}
      />

    </div>
  );
}
