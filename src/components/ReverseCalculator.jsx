import React, { useState } from 'react';
import { Calculator, ArrowRight, Save } from 'lucide-react';

export default function ReverseCalculator({ onSaveGoals }) {
  const [targetSales, setTargetSales] = useState(20);
  const [ticketMedio, setTicketMedio] = useState(3500);

  // Benchmarks para Engenharia Reversa (Lei Seca)
  const WIN_RATE = 0.30; // 30% das reuniões realizadas fecham venda
  const SHOW_UP_RATE = 0.75; // 75% dos agendamentos realmente comparecem
  const SCHEDULE_RATE = 0.50; // 50% dos casos qualificados agendam
  const QUALIFICATION_RATE = 0.40; // 40% dos contatados são qualificados
  const CONTACT_RATE = 0.60; // 60% dos leads são contatados

  // Cálculos de trás pra frente
  const vendas = targetSales || 0;
  const reunioesRealizadas = Math.ceil(vendas / WIN_RATE);
  const reunioesMarcadas = Math.ceil(reunioesRealizadas / SHOW_UP_RATE);
  const casosQualificados = Math.ceil(reunioesMarcadas / SCHEDULE_RATE);
  const contatos = Math.ceil(casosQualificados / QUALIFICATION_RATE);
  const leads = Math.ceil(contatos / CONTACT_RATE);

  const faturamento = vendas * (ticketMedio || 0);

  const handleApply = () => {
    const newGoals = {
      sdr: {
        leadsRecebidos: leads,
        motoristasContatados: contatos,
        casosQualificados: casosQualificados,
        consultasAgendadas: reunioesMarcadas
      },
      bdr: {
        processosMapeados: leads * 2,
        contatosAtivos: contatos,
        consultasAgendadasOut: Math.floor(reunioesMarcadas * 0.3),
        casosQualificadosOut: Math.floor(casosQualificados * 0.3)
      },
      closer: {
        consultasRealizadas: reunioesRealizadas,
        contratosEnviados: reunioesRealizadas,
        contratosFechados: vendas,
        honorariosMedios: ticketMedio
      }
    };
    onSaveGoals(newGoals);
    alert('Metas aplicadas com sucesso!');
  };

  return (
    <div className="bg-bg-card p-8 rounded-xl border border-brand-blue/30 mb-8 animate-in fade-in" translate="no">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-brand-blue/10 text-brand-blue rounded-lg">
          <Calculator size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-text-main">Engenharia Reversa do Funil</h2>
          <p className="text-sm text-text-muted mt-1">Diga quanto quer vender e o sistema calcula exatamente o que a recepção (SDR) e o especialista (Closer) precisam fazer.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="flex-1 bg-bg-main p-4 rounded-lg border border-border">
          <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Meta de Contratos (Vendas)</label>
          <input 
            type="number"
            min="0"
            value={targetSales}
            onChange={(e) => setTargetSales(parseFloat(e.target.value))}
            className="w-full bg-transparent text-3xl font-bold text-brand-blue focus:outline-none"
          />
        </div>
        <div className="flex-1 bg-bg-main p-4 rounded-lg border border-border">
          <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Ticket Médio (Honorários)</label>
          <div className="flex items-center text-3xl font-bold text-[#10b981]">
            <span className="text-xl mr-1">R$</span>
            <input 
              type="number"
              min="0"
              value={ticketMedio}
              onChange={(e) => setTicketMedio(parseFloat(e.target.value))}
              className="w-full bg-transparent focus:outline-none"
            />
          </div>
        </div>
        <div className="flex-1 bg-[#10b981]/10 p-4 rounded-lg border border-[#10b981]/30 flex flex-col justify-center">
          <p className="text-xs font-bold text-[#10b981] uppercase tracking-widest mb-1">Faturamento Projetado</p>
          <p className="text-2xl font-bold text-[#10b981]">R$ {faturamento.toLocaleString('pt-BR')}</p>
        </div>
      </div>

      <div className="relative border border-border rounded-xl p-6 bg-bg-main mb-6 overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-brand-blue"></div>
        <h3 className="text-sm font-bold text-text-main mb-4 uppercase tracking-wider">O que sua equipe precisa fazer este mês:</h3>
        
        <div className="flex flex-wrap items-center gap-2 text-sm md:text-base font-medium">
          <div className="text-center p-3 bg-bg-card rounded-lg border border-border min-w-[90px]">
            <span className="block text-xl font-bold text-text-main">{leads}</span>
            <span className="text-xs text-text-muted">Leads</span>
          </div>
          <ArrowRight className="text-text-muted hidden md:block" size={14} />
          
          <div className="text-center p-3 bg-bg-card rounded-lg border border-border min-w-[90px]">
            <span className="block text-xl font-bold text-text-main">{contatos}</span>
            <span className="text-xs text-text-muted">Contatados</span>
          </div>
          <ArrowRight className="text-text-muted hidden md:block" size={14} />

          <div className="text-center p-3 bg-bg-card rounded-lg border border-border min-w-[90px]">
            <span className="block text-xl font-bold text-text-main">{casosQualificados}</span>
            <span className="text-xs text-text-muted">Qualificados</span>
          </div>
          <ArrowRight className="text-text-muted hidden md:block" size={14} />

          <div className="text-center p-3 bg-brand-blue/5 rounded-lg border border-brand-blue/30 min-w-[90px]">
            <span className="block text-xl font-bold text-brand-blue">{reunioesMarcadas}</span>
            <span className="text-xs text-brand-blue/80">Reuniões Marcadas</span>
          </div>
          <ArrowRight className="text-text-muted hidden md:block" size={14} />

          <div className="text-center p-3 bg-brand-blue/5 rounded-lg border border-brand-blue/30 min-w-[90px]">
            <span className="block text-xl font-bold text-brand-blue">{reunioesRealizadas}</span>
            <span className="text-xs text-brand-blue/80">Reuniões Realizadas</span>
          </div>
          <ArrowRight className="text-text-muted hidden md:block" size={14} />

          <div className="text-center p-3 bg-[#10b981]/10 rounded-lg border border-[#10b981]/30 min-w-[90px]">
            <span className="block text-xl font-bold text-[#10b981]">{vendas}</span>
            <span className="text-xs text-[#10b981]">Vendas Fechadas</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={handleApply}
          className="flex items-center gap-2 px-6 py-3 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-lg text-sm font-bold transition-colors"
        >
          <Save size={18} />
          Aplicar como Metas Oficiais do Mês
        </button>
      </div>
    </div>
  );
}
