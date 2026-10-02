import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Settings, LogOut, Calculator, Target, Briefcase, Megaphone } from 'lucide-react';

export default function Hub({ onLogout, userRole }) {
  const navigate = useNavigate();

  let sections = [
    {
      title: 'OPERAÇÕES PRINCIPAIS',
      modules: [
        {
          id: 'comercial',
          tag: 'MÓDULO 01',
          title: 'GESTÃO COMERCIAL',
          subtitle: 'FUNIL E METAS',
          icon: LayoutDashboard,
          locked: false,
          path: '/comercial'
        },
        {
          id: 'juridico',
          tag: 'MÓDULO 02',
          title: 'PLAYBOOK COMERCIAL',
          subtitle: 'DOCUMENTAÇÃO',
          icon: FileText,
          locked: false,
          path: '/processual'
        },
        {
          id: 'rh',
          tag: 'MÓDULO 03',
          title: 'PERFORMANCE RH',
          subtitle: 'EQUIPE E METAS',
          icon: Users,
          locked: false,
          path: '/rh'
        },
        {
          id: 'marketing',
          tag: 'MÓDULO 04',
          title: 'GROWTH & MARKETING',
          subtitle: 'TRÁFEGO E CAC',
          icon: Megaphone,
          locked: false,
          path: '/marketing'
        }
      ]
    },
    {
      title: 'FERRAMENTAS E IA',
      modules: [
        {
          id: 'roleplay',
          tag: 'FERRAMENTA',
          title: 'ROLEPLAY IA',
          subtitle: 'TREINAMENTO WPP',
          icon: Briefcase,
          locked: false,
          path: '/roleplay'
        }
      ]
    }
  ];

  if (userRole === 'Admin Supremo' || userRole === 'Gestor') {
    sections.push({
      title: 'CONFIGURAÇÕES DO SISTEMA',
      modules: [
        {
          id: 'admin',
          tag: 'MASTER',
          title: 'CONFIGURAÇÕES GERAIS',
          subtitle: 'METAS, CRM E ACESSOS',
          icon: Settings,
          locked: false,
          path: '/admin'
        }
      ]
    });
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans overflow-x-hidden" translate="no">
      {/* Navbar Minimalista */}
      <nav className="h-16 flex items-center justify-between px-8 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-blue rounded-md flex items-center justify-center shadow-[0_0_15px_rgba(0,112,243,0.5)]">
            <span className="font-display font-bold text-white text-sm">DC</span>
          </div>
          <h1 className="font-display font-bold text-lg tracking-wider uppercase text-white/90">Hub Central</h1>
        </div>
        <button 
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-all"
        >
          <LogOut size={16} />
          Sair
        </button>
      </nav>

      {/* Main Area */}
      <main className="max-w-[1400px] mx-auto p-8 pt-4 pb-20">
        <div className="mb-12">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-2 tracking-tight text-white">
            Painel Executivo
          </h2>
          <p className="text-white/50 text-lg">
            Selecione um módulo para iniciar sua sessão.
          </p>
        </div>

        {sections.map((section, idx) => (
          <div key={idx} className="mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${idx * 150}ms` }}>
            <h3 className="font-display text-lg font-bold text-white/90 tracking-wider mb-6 pl-2 border-l-4 border-brand-blue">
              {section.title}
            </h3>
            
            <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory">
              {section.modules.map((mod) => {
                const Icon = mod.icon;
                return (
                  <div 
                    key={mod.id}
                    onClick={() => !mod.locked ? navigate(mod.path) : null}
                    className={`shrink-0 w-[380px] h-[214px] rounded-2xl relative overflow-hidden group snap-start
                      ${!mod.locked ? 'cursor-pointer' : 'cursor-not-allowed'}
                    `}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#151515] to-[#050505] border border-white/10 group-hover:border-brand-blue/50 transition-colors duration-500 rounded-2xl"></div>
                    
                    {!mod.locked && (
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-brand-blue/20 blur-[80px] rounded-full"></div>
                      </div>
                    )}

                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                         style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                    </div>

                    <div className="absolute inset-0 p-6 flex items-center justify-between z-10">
                      
                      <div className={`w-28 h-28 rounded-2xl flex items-center justify-center shrink-0
                        ${!mod.locked 
                          ? 'bg-gradient-to-b from-[#1a1a1a] to-black border border-white/5 shadow-[0_0_30px_rgba(0,112,243,0.2)] group-hover:shadow-[0_0_40px_rgba(0,112,243,0.4)] transition-all' 
                          : 'bg-black/50 border border-white/5 opacity-50'}
                      `}>
                        <Icon size={48} className={!mod.locked ? "text-brand-blue drop-shadow-[0_0_10px_rgba(0,112,243,0.8)]" : "text-white/30"} strokeWidth={1.5} />
                      </div>

                      <div className="flex-1 pl-6 flex flex-col justify-center">
                        <span className="text-white/50 font-bold text-[10px] tracking-widest mb-1">
                          {mod.tag}
                        </span>
                        
                        <h4 className={`font-display text-2xl font-black leading-tight tracking-tight mb-2
                          ${!mod.locked ? 'text-white' : 'text-white/40'}
                        `}>
                          {mod.title.split(' ').map((word, i) => (
                            <span key={i} className="block">{word}</span>
                          ))}
                        </h4>
                        
                        <div className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-wider w-fit
                          ${!mod.locked 
                            ? 'bg-brand-blue text-white shadow-[0_0_10px_rgba(0,112,243,0.4)]' 
                            : 'bg-white/10 text-white/40'}
                        `}>
                          {mod.locked ? 'EM BREVE' : mod.subtitle}
                        </div>
                      </div>
                    </div>

                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-brand-blue/30 transition-colors pointer-events-none"></div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
