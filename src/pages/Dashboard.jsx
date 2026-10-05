import React from 'react';
import { 
  Users, 
  Activity, 
  PauseCircle, 
  AlertTriangle, 
  AlertOctagon, 
  Zap,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Clock,
  Download,
  RefreshCw,
  Bell,
  Sun,
  Globe
} from 'lucide-react';

export default function Dashboard() {
  const currentDate = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).toUpperCase();

  return (
    <div className="flex-1 overflow-y-auto w-full h-full pb-10">
      
      {/* Top Header */}
      <header className="h-16 flex items-center justify-between px-8 border-b border-white/5 shrink-0">
        <div>
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Espaço de trabalho</p>
          <h2 className="text-sm font-bold text-white">Central de performance</h2>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 bg-[#f97316]/20 border border-[#f97316]/30 text-[#f97316] px-4 py-1.5 rounded-full text-xs font-bold transition-all hover:bg-[#f97316]/30">
            <Zap size={12} fill="currentColor" /> Todos
          </button>
          <button className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-colors">
            <Bell size={14} />
          </button>
          <button className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-colors">
            <Sun size={14} />
          </button>
          <button className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-colors">
            <Globe size={14} />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <div className="px-8 mt-10 mb-8">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[#f97316] text-[10px] font-bold tracking-widest uppercase mb-2">{currentDate}</p>
            <h1 className="text-4xl font-display font-black text-white mb-2 tracking-tight">Boa tarde, Gabriel.</h1>
            <p className="text-white/40 text-sm">Visão executiva do portfólio — leitura rápida em 5 segundos.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-transparent border border-white/10 rounded-xl text-xs font-bold text-white hover:bg-white/5 transition-colors">
              <RefreshCw size={14} /> Atualizar
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-transparent border border-white/10 rounded-xl text-xs font-bold text-white hover:bg-white/5 transition-colors">
              <Download size={14} /> Exportar PDF
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-8 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2 bg-[#101010] p-1 rounded-full border border-white/5">
          <button className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f97316] text-white text-xs font-bold">
            <Globe size={12} /> Todos os Gestores <span className="bg-black/20 px-1.5 py-0.5 rounded text-[9px]">38</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-1.5 rounded-full text-white/50 hover:text-white text-xs font-bold transition-colors">
            <Users size={12} /> Equipe de Vendas <span className="bg-white/10 px-1.5 py-0.5 rounded text-[9px]">15</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-1.5 rounded-full text-white/50 hover:text-white text-xs font-bold transition-colors">
            <Users size={12} /> Marketing <span className="bg-white/10 px-1.5 py-0.5 rounded text-[9px]">23</span>
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/40">
          <div className="w-2 h-2 rounded-full bg-[#10b981]"></div>
          Visualizando: <strong className="text-white">Portfólio Consolidado</strong>
        </div>
      </div>

      {/* Status Cards */}
      <div className="px-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        
        <div className="bg-[#101010] border border-white/5 rounded-2xl p-5 hover:border-[#10b981]/30 transition-colors cursor-default">
          <div className="flex justify-between items-start mb-4">
            <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Ativos</p>
            <CheckCircle size={14} className="text-[#10b981]" />
          </div>
          <h3 className="text-3xl font-black text-[#10b981] mb-1">35</h3>
          <p className="text-[10px] text-white/40">Em operação</p>
        </div>

        <div className="bg-blue-900/10 border border-blue-500/20 rounded-2xl p-5 hover:border-blue-500/40 transition-colors cursor-default">
          <div className="flex justify-between items-start mb-4">
            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Onboarding</p>
            <Activity size={14} className="text-blue-400" />
          </div>
          <h3 className="text-3xl font-black text-blue-400 mb-1">1</h3>
          <p className="text-[10px] text-white/40">Em configuração</p>
        </div>

        <div className="bg-[#101010] border border-white/5 rounded-2xl p-5 hover:border-white/20 transition-colors cursor-default">
          <div className="flex justify-between items-start mb-4">
            <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Pausados</p>
            <PauseCircle size={14} className="text-white/30" />
          </div>
          <h3 className="text-3xl font-black text-white/80 mb-1">2</h3>
          <p className="text-[10px] text-white/40">Sem veicular</p>
        </div>

        <div className="bg-[#101010] border border-white/5 rounded-2xl p-5 hover:border-white/20 transition-colors cursor-default">
          <div className="flex justify-between items-start mb-4">
            <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Em Risco</p>
            <TrendingDown size={14} className="text-white/30" />
          </div>
          <h3 className="text-3xl font-black text-white/80 mb-1">0</h3>
          <p className="text-[10px] text-white/40">Performance abaixo</p>
        </div>

        <div className="bg-[#101010] border border-white/5 rounded-2xl p-5 hover:border-white/20 transition-colors cursor-default">
          <div className="flex justify-between items-start mb-4">
            <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Problemas</p>
            <AlertTriangle size={14} className="text-white/30" />
          </div>
          <h3 className="text-3xl font-black text-white/80 mb-1">0</h3>
          <p className="text-[10px] text-white/40">Atenção necessária</p>
        </div>

        <div className="bg-[#f97316]/5 border border-[#f97316]/20 rounded-2xl p-5 hover:border-[#f97316]/40 transition-colors cursor-default">
          <div className="flex justify-between items-start mb-4">
            <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Total</p>
            <Zap size={14} className="text-[#f97316]" fill="currentColor" />
          </div>
          <h3 className="text-3xl font-black text-[#f97316] mb-1">38</h3>
          <p className="text-[10px] text-white/40">Clientes cadastrados</p>
        </div>

      </div>

      {/* Financial/Meta Cards */}
      <div className="px-8 grid grid-cols-1 md:grid-cols-5 gap-4 mb-10">
        
        <div className="bg-[#101010] border border-white/5 rounded-2xl p-5 hover:border-[#f97316]/30 transition-colors cursor-default col-span-1 md:col-span-1">
          <div className="flex justify-between items-start mb-6">
            <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Investimento Mensal</p>
            <TrendingUp size={14} className="text-[#f97316]" />
          </div>
          <h3 className="text-2xl font-black text-[#f97316] mb-2">R$ 64.700</h3>
          <p className="text-[10px] text-white/40">Orçamento total da carteira</p>
        </div>

        <div className="bg-[#101010] border border-white/5 rounded-2xl p-5 hover:border-white/20 transition-colors cursor-default">
          <div className="flex justify-between items-start mb-6">
            <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Gasto Atual</p>
            <TrendingDown size={14} className="text-white/30" />
          </div>
          <h3 className="text-2xl font-black text-white mb-2">R$ 14.500</h3>
          <p className="text-[10px] text-white/40">22.4% do orçamento</p>
        </div>

        <div className="bg-[#101010] border border-white/5 rounded-2xl p-5 hover:border-white/20 transition-colors cursor-default">
          <div className="flex justify-between items-start mb-6">
            <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Projeção do Mês</p>
            <Activity size={14} className="text-white/30" />
          </div>
          <h3 className="text-2xl font-black text-white mb-2">R$ 61.200</h3>
          <p className="text-[10px] text-white/40">Dia 5 de 31</p>
        </div>

        <div className="bg-[#101010] border border-white/5 rounded-2xl p-5 hover:border-white/20 transition-colors cursor-default">
          <div className="flex justify-between items-start mb-6">
            <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Leads no Mês</p>
            <Users size={14} className="text-white/30" />
          </div>
          <h3 className="text-2xl font-black text-white mb-2">420</h3>
          <p className="text-[10px] text-white/40">Leads totais recebidos</p>
        </div>

        <div className="bg-[#101010] border border-white/5 rounded-2xl p-5 hover:border-white/20 transition-colors cursor-default">
          <div className="flex justify-between items-start mb-6">
            <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">CPL Médio</p>
            <TrendingDown size={14} className="text-white/30" />
          </div>
          <h3 className="text-2xl font-black text-white mb-2">R$ 34,50</h3>
          <p className="text-[10px] text-white/40">Custo por lead na carteira</p>
        </div>

      </div>

      <div className="px-8">
        <h3 className="text-lg font-bold text-white mb-1">Saúde das contas</h3>
        <p className="text-xs text-white/50">Baseado no CPL médio semanal · Guia Jurídico 2026 · 14 contas analisadas</p>
      </div>

    </div>
  );
}
