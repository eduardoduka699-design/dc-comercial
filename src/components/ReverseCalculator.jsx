import React, { useState, useEffect } from 'react';
import { Calculator, ArrowRight, Save, Settings2, Check, HelpCircle, Sliders, RotateCcw, TrendingUp, ShieldCheck, DollarSign } from 'lucide-react';

export default function ReverseCalculator({ onSaveGoals, hideNavigation }) {
  // Padrões oficiais com as taxas médias do funil da assessoria
  const DEFAULT_TARGET_REVENUE = 25000;
  const DEFAULT_TICKET = 1517;
  const DEFAULT_SCHEDULE_RATE = 15; // 15% de agendamento sobre leads
  const DEFAULT_CLOSE_RATE = 12;    // 12% de fechamento sobre agendamentos
  const DEFAULT_SHOW_UP_RATE = 75;  // 75% de comparecimento nas reuniões marcadas
  const DEFAULT_CONTACT_RATE = 70;  // 70% dos leads contatados

  // Estados principais
  const [calculationMode, setCalculationMode] = useState('revenue'); // 'revenue' | 'sales'
  const [targetRevenue, setTargetRevenue] = useState(DEFAULT_TARGET_REVENUE);
  const [targetSales, setTargetSales] = useState(17);
  const [ticketMedio, setTicketMedio] = useState(DEFAULT_TICKET);
  const [funnelType, setFunnelType] = useState('com_reuniao'); // com_reuniao | sem_reuniao

  // Taxas médias do funil (editáveis via painel de benchmarks)
  const [scheduleRate, setScheduleRate] = useState(DEFAULT_SCHEDULE_RATE);
  const [closeRate, setCloseRate] = useState(DEFAULT_CLOSE_RATE);
  const [showUpRate, setShowUpRate] = useState(DEFAULT_SHOW_UP_RATE);
  const [contactRate, setContactRate] = useState(DEFAULT_CONTACT_RATE);
  const [showBenchmarks, setShowBenchmarks] = useState(false);
  const [applied, setApplied] = useState(false);

  // Manipuladores de input sincronizados
  const handleRevenueChange = (val) => {
    const num = parseFloat(val) || 0;
    setTargetRevenue(num);
    setCalculationMode('revenue');
    if (ticketMedio > 0) {
      const calculatedSales = Math.ceil(num / ticketMedio);
      setTargetSales(calculatedSales);
    }
  };

  const handleSalesChange = (val) => {
    const num = parseFloat(val) || 0;
    setTargetSales(num);
    setCalculationMode('sales');
    setTargetRevenue(num * (ticketMedio || 0));
  };

  const handleTicketChange = (val) => {
    const num = parseFloat(val) || 0;
    setTicketMedio(num);
    if (calculationMode === 'revenue') {
      if (num > 0) {
        setTargetSales(Math.ceil(targetRevenue / num));
      }
    } else {
      setTargetRevenue(targetSales * num);
    }
  };

  const handleResetBenchmarks = () => {
    setScheduleRate(DEFAULT_SCHEDULE_RATE);
    setCloseRate(DEFAULT_CLOSE_RATE);
    setShowUpRate(DEFAULT_SHOW_UP_RATE);
    setContactRate(DEFAULT_CONTACT_RATE);
    setTicketMedio(DEFAULT_TICKET);
    setTargetRevenue(DEFAULT_TARGET_REVENUE);
    setTargetSales(17);
    setCalculationMode('revenue');
  };

  // Cálculos Matemáticos Exatos (com frações)
  const exactTicket = ticketMedio > 0 ? ticketMedio : 1;
  const exactClosePct = (closeRate > 0 ? closeRate : 1) / 100;
  const exactSchedulePct = (scheduleRate > 0 ? scheduleRate : 1) / 100;
  const directClosePct = exactSchedulePct * exactClosePct; // 15% * 12% = 1.8%

  // 1. Vendas necessárias exatas
  let exactSales = 0;
  if (calculationMode === 'revenue') {
    exactSales = targetRevenue / exactTicket;
  } else {
    exactSales = targetSales;
  }

  // 2. Agendamentos necessários exatos
  let exactAgendamentos = 0;
  if (funnelType === 'com_reuniao') {
    exactAgendamentos = exactSales / exactClosePct;
  } else {
    exactAgendamentos = exactSales; // no fechamento direto
  }

  // 3. Leads necessários exatos
  let exactLeads = 0;
  if (funnelType === 'com_reuniao') {
    exactLeads = exactAgendamentos / exactSchedulePct;
  } else {
    exactLeads = exactSales / directClosePct;
  }

  // Metas Práticas de Segurança (Arredondamento para Cima)
  const safeSales = Math.ceil(exactSales);
  const safeAgendamentos = funnelType === 'com_reuniao' ? Math.ceil(exactAgendamentos) : 0;
  const safeLeads = Math.ceil(exactLeads);
  const safeContatos = Math.ceil(safeLeads * (contactRate / 100));
  const safeRealizadas = funnelType === 'com_reuniao' ? Math.ceil(safeAgendamentos * (showUpRate / 100)) : 0;
  const safeRevenue = safeSales * ticketMedio;

  const handleApply = () => {
    let newGoals = {
      sdr: {
        leadsRecebidos: safeLeads,
        motoristasContatados: safeContatos,
        casosQualificados: safeAgendamentos || Math.ceil(safeLeads * 0.25),
        consultasAgendadas: funnelType === 'com_reuniao' ? safeAgendamentos : 0
      },
      closer: {
        consultasRealizadas: funnelType === 'com_reuniao' ? safeRealizadas : 0,
        casosQualificados: safeAgendamentos || safeSales,
        contratosEnviados: funnelType === 'com_reuniao' ? safeAgendamentos : safeSales,
        contratosFechados: safeSales,
        honorariosMedios: ticketMedio
      },
      bdr: {
        processosMapeados: safeLeads * 2,
        contatosAtivos: safeContatos,
        consultasAgendadasOut: funnelType === 'com_reuniao' ? Math.floor(safeAgendamentos * 0.3) : 0,
        casosQualificadosOut: Math.floor(safeLeads * 0.05)
      }
    };

    try {
      localStorage.setItem('dc-leiseca-goals', JSON.stringify(newGoals));
      localStorage.setItem('dc-leiseca-funnel-type', funnelType);

      const currentMetricsSaved = localStorage.getItem('dc-leiseca-metrics');
      let currentMetrics = currentMetricsSaved ? JSON.parse(currentMetricsSaved) : {};
      const updatedMetrics = {
        ...currentMetrics,
        sdr: { ...(currentMetrics.sdr || {}), ...newGoals.sdr },
        closer: { ...(currentMetrics.closer || {}), ...newGoals.closer },
        bdr: { ...(currentMetrics.bdr || {}), ...newGoals.bdr }
      };
      localStorage.setItem('dc-leiseca-metrics', JSON.stringify(updatedMetrics));

      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('dc-goals-updated', { detail: newGoals }));
      window.dispatchEvent(new CustomEvent('dc-metrics-updated', { detail: updatedMetrics }));
    } catch (e) {
      console.error('Erro ao salvar metas:', e);
    }

    if (typeof onSaveGoals === 'function') {
      onSaveGoals(newGoals);
    }

    setApplied(true);
    setTimeout(() => setApplied(false), 3500);
  };

  return (
    <div className="bg-bg-card p-6 sm:p-8 rounded-2xl border border-brand-blue/30 mb-8 animate-in fade-in shadow-xl shadow-black/20" translate="no">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand-blue/10 text-brand-blue rounded-xl border border-brand-blue/20">
            <Calculator size={26} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-text-main">Engenharia Reversa do Funil</h2>
              <span className="text-[11px] font-bold bg-brand-blue/10 text-brand-blue px-2.5 py-0.5 rounded-full border border-brand-blue/20">
                Médias da Assessoria
              </span>
            </div>
            <p className="text-xs sm:text-sm text-text-muted mt-1">
              Simule o esforço necessário de acordo com a média de conversão real da sua equipe.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 self-start md:self-auto">
          {/* Seletor de Modelo de Funil */}
          <div className="flex bg-[#0a0a0a] p-1 rounded-xl border border-border shadow-inner">
            <button 
              type="button"
              onClick={() => setFunnelType('com_reuniao')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${funnelType === 'com_reuniao' ? 'bg-brand-blue text-white shadow-md' : 'text-text-muted hover:text-white'}`}
            >
              COM REUNIÃO
            </button>
            <button 
              type="button"
              onClick={() => setFunnelType('sem_reuniao')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${funnelType === 'sem_reuniao' ? 'bg-[#10b981] text-white shadow-md' : 'text-text-muted hover:text-white'}`}
            >
              FECHAMENTO DIRETO (WPP)
            </button>
          </div>

          {/* Botão de Benchmarks */}
          <button
            type="button"
            onClick={() => setShowBenchmarks(!showBenchmarks)}
            className={`p-2 rounded-xl border text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              showBenchmarks 
                ? 'bg-brand-blue/20 border-brand-blue text-brand-blue' 
                : 'bg-white/5 border-border text-text-muted hover:text-text-main hover:bg-white/10'
            }`}
            title="Ajustar Taxas Médias e Benchmarks"
          >
            <Sliders size={16} />
            <span className="hidden sm:inline">Taxas</span>
          </button>
        </div>
      </div>

      {/* Painel Expansível de Ajuste de Taxas Médias (Benchmarks) */}
      {showBenchmarks && (
        <div className="mb-6 p-4 rounded-xl bg-bg-main border border-border animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-border/50">
            <div className="flex items-center gap-2 text-xs font-bold text-text-main uppercase tracking-wider">
              <Sliders size={14} className="text-brand-blue" />
              Taxas Médias do Funil (Parâmetros da Assessoria)
            </div>
            <button
              type="button"
              onClick={handleResetBenchmarks}
              className="text-[11px] text-text-muted hover:text-brand-blue flex items-center gap-1 cursor-pointer transition-colors"
              title="Restaurar taxas originais (15% agendamento, 12% fechamento, R$ 1.517)"
            >
              <RotateCcw size={12} /> Restaurar Padrões da Assessoria
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-bg-card rounded-lg border border-border">
              <label className="block text-[11px] font-bold text-text-muted mb-1">Taxa de Agendamento</label>
              <div className="flex items-center">
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={scheduleRate}
                  onChange={(e) => setScheduleRate(parseFloat(e.target.value) || 1)}
                  className="w-full bg-transparent text-lg font-bold text-brand-blue focus:outline-none"
                />
                <span className="text-xs text-text-muted font-bold">%</span>
              </div>
              <span className="text-[10px] text-text-muted">Leads → Agendados (Padrão 15%)</span>
            </div>

            <div className="p-3 bg-bg-card rounded-lg border border-border">
              <label className="block text-[11px] font-bold text-text-muted mb-1">Conversão Fechamento</label>
              <div className="flex items-center">
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={closeRate}
                  onChange={(e) => setCloseRate(parseFloat(e.target.value) || 1)}
                  className="w-full bg-transparent text-lg font-bold text-[#10b981] focus:outline-none"
                />
                <span className="text-xs text-text-muted font-bold">%</span>
              </div>
              <span className="text-[10px] text-text-muted">Agendados → Vendas (Padrão 12%)</span>
            </div>

            <div className="p-3 bg-bg-card rounded-lg border border-border">
              <label className="block text-[11px] font-bold text-text-muted mb-1">Taxa Comparecimento</label>
              <div className="flex items-center">
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={showUpRate}
                  onChange={(e) => setShowUpRate(parseFloat(e.target.value) || 1)}
                  className="w-full bg-transparent text-lg font-bold text-purple-400 focus:outline-none"
                />
                <span className="text-xs text-text-muted font-bold">%</span>
              </div>
              <span className="text-[10px] text-text-muted">Agendados → Realizadas (75%)</span>
            </div>

            <div className="p-3 bg-bg-card rounded-lg border border-border">
              <label className="block text-[11px] font-bold text-text-muted mb-1">Taxa Contato Ativo</label>
              <div className="flex items-center">
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={contactRate}
                  onChange={(e) => setContactRate(parseFloat(e.target.value) || 1)}
                  className="w-full bg-transparent text-lg font-bold text-amber-400 focus:outline-none"
                />
                <span className="text-xs text-text-muted font-bold">%</span>
              </div>
              <span className="text-[10px] text-text-muted">Leads → Contatados (70%)</span>
            </div>
          </div>
        </div>
      )}

      {/* Grid de Inputs Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* 1. Meta de Faturamento */}
        <div className={`p-4 rounded-xl border transition-all ${
          calculationMode === 'revenue' 
            ? 'bg-brand-blue/5 border-brand-blue shadow-sm' 
            : 'bg-bg-main border-border'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
              Meta de Faturamento (Alvo)
            </label>
            {calculationMode === 'revenue' && (
              <span className="text-[10px] bg-brand-blue text-white px-1.5 py-0.5 rounded font-bold">Base</span>
            )}
          </div>
          <div className="flex items-center text-2xl sm:text-3xl font-bold text-brand-blue">
            <span className="text-lg mr-1 text-brand-blue/70">R$</span>
            <input 
              type="number"
              min="0"
              step="500"
              value={targetRevenue}
              onChange={(e) => handleRevenueChange(e.target.value)}
              className="w-full bg-transparent focus:outline-none font-bold"
              placeholder="25000"
            />
          </div>
          <span className="text-[11px] text-text-muted mt-1 block">
            Alvo financeiro do mês
          </span>
        </div>

        {/* 2. Ticket Médio */}
        <div className="p-4 rounded-xl bg-bg-main border border-border">
          <label className="block text-[11px] font-bold text-text-muted uppercase tracking-wider mb-2">
            Ticket Médio (Honorários)
          </label>
          <div className="flex items-center text-2xl sm:text-3xl font-bold text-[#10b981]">
            <span className="text-lg mr-1 text-[#10b981]/70">R$</span>
            <input 
              type="number"
              min="1"
              value={ticketMedio}
              onChange={(e) => handleTicketChange(e.target.value)}
              className="w-full bg-transparent focus:outline-none font-bold text-[#10b981]"
              placeholder="1517"
            />
          </div>
          <span className="text-[11px] text-text-muted mt-1 block">
            Média real: R$ 1.517,00
          </span>
        </div>

        {/* 3. Meta de Contratos (Vendas) */}
        <div className={`p-4 rounded-xl border transition-all ${
          calculationMode === 'sales' 
            ? 'bg-brand-blue/5 border-brand-blue shadow-sm' 
            : 'bg-bg-main border-border'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
              Meta de Contratos (Vendas)
            </label>
            {calculationMode === 'sales' && (
              <span className="text-[10px] bg-brand-blue text-white px-1.5 py-0.5 rounded font-bold">Base</span>
            )}
          </div>
          <input 
            type="number"
            min="1"
            value={targetSales}
            onChange={(e) => handleSalesChange(e.target.value)}
            className="w-full bg-transparent text-2xl sm:text-3xl font-bold text-text-main focus:outline-none"
            placeholder="17"
          />
          <span className="text-[11px] text-text-muted mt-1 block">
            {exactSales.toFixed(2).replace('.', ',')} vendas exatas (arred. {safeSales})
          </span>
        </div>

        {/* 4. Faturamento Projetado Seguro */}
        <div className="p-4 rounded-xl bg-[#10b981]/10 border border-[#10b981]/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-[#10b981] uppercase tracking-wider">Faturamento Seguro</span>
              <ShieldCheck size={14} className="text-[#10b981]" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#10b981]">
              R$ {Number(safeRevenue || 0).toLocaleString('pt-BR')}
            </p>
          </div>
          <span className="text-[11px] text-[#10b981]/80 mt-1 block">
            {safeSales} contratos × R$ {Number(ticketMedio).toLocaleString('pt-BR')}
          </span>
        </div>
      </div>

      {/* Badges de Taxas Ativas do Funil */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-bg-main border border-border text-xs text-text-muted">
          <span className="h-2 w-2 rounded-full bg-brand-blue"></span>
          <span>Taxa de Agendamento: <strong className="text-text-main">{scheduleRate}%</strong> (s/ Leads)</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-bg-main border border-border text-xs text-text-muted">
          <span className="h-2 w-2 rounded-full bg-[#10b981]"></span>
          <span>Conversão de Fechamento: <strong className="text-text-main">{closeRate}%</strong> (s/ Agendamentos)</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-bg-main border border-border text-xs text-text-muted">
          <span className="h-2 w-2 rounded-full bg-purple-400"></span>
          <span>Conversão Final (Lead → Venda): <strong className="text-text-main">{(directClosePct * 100).toFixed(2).replace('.', ',')}%</strong></span>
        </div>
      </div>

      {/* Pipeline Visual: "O QUE SUA EQUIPE PRECISA FAZER ESTE MÊS" */}
      <div className="relative border border-border rounded-2xl p-6 bg-bg-main mb-6 overflow-hidden">
        <div className={`absolute top-0 left-0 w-1.5 h-full ${funnelType === 'com_reuniao' ? 'bg-brand-blue' : 'bg-[#10b981]'}`}></div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <h3 className="text-xs sm:text-sm font-bold text-text-main uppercase tracking-wider flex items-center gap-2">
            <Settings2 size={16} className="text-brand-blue" /> 
            O que sua equipe precisa fazer este mês para bater a meta:
          </h3>
          <span className="text-[11px] text-text-muted font-medium">
            Captação mínima recomendada: <strong className="text-text-main">{safeLeads} leads</strong>
          </span>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm md:text-base font-medium">
          {/* 1. Leads */}
          <div className="flex-1 min-w-[110px] text-center p-3.5 bg-bg-card rounded-xl border border-brand-blue/30 shadow-sm relative group">
            <span className="block text-2xl font-extrabold text-brand-blue">{safeLeads}</span>
            <span className="text-xs font-semibold text-text-muted mt-0.5 block">Leads Recebidos (WhatsApp)</span>
            <span className="text-[10px] text-text-muted mt-1 block">Exato: {exactLeads.toFixed(2).replace('.', ',')}</span>
          </div>

          <ArrowRight className="text-text-muted shrink-0 hidden sm:block" size={16} />
          
          {/* 2. Contatados */}
          <div className="flex-1 min-w-[110px] text-center p-3.5 bg-bg-card rounded-xl border border-border shadow-sm">
            <span className="block text-2xl font-extrabold text-text-main">{safeContatos}</span>
            <span className="text-xs font-semibold text-text-muted mt-0.5 block">Atendimentos Realizados (Contato Feito)</span>
            <span className="text-[10px] text-text-muted mt-1 block">~{contactRate}% em conversa</span>
          </div>

          <ArrowRight className="text-text-muted shrink-0 hidden sm:block" size={16} />

          {/* Se Com Reunião: Agendados & Realizados */}
          {funnelType === 'com_reuniao' ? (
            <>
              {/* 3. Agendamentos */}
              <div className="flex-1 min-w-[120px] text-center p-3.5 bg-brand-blue/10 rounded-xl border border-brand-blue/40 shadow-sm">
                <span className="block text-2xl font-extrabold text-brand-blue">{safeAgendamentos}</span>
                <span className="text-xs font-semibold text-brand-blue/90 mt-0.5 block">Reuniões Marcadas (SDR)</span>
                <span className="text-[10px] text-brand-blue/70 mt-1 block">Exato: {exactAgendamentos.toFixed(2).replace('.', ',')}</span>
              </div>

              <ArrowRight className="text-text-muted shrink-0 hidden sm:block" size={16} />

              {/* 4. Realizadas */}
              <div className="flex-1 min-w-[110px] text-center p-3.5 bg-purple-500/10 rounded-xl border border-purple-500/30 shadow-sm">
                <span className="block text-2xl font-extrabold text-purple-400">{safeRealizadas}</span>
                <span className="text-xs font-semibold text-purple-300 mt-0.5 block">Reuniões Realizadas (SDR)</span>
                <span className="text-[10px] text-purple-300/70 mt-1 block">~{showUpRate}% presença</span>
              </div>
            </>
          ) : (
            <>
              {/* Fechamento Direto: Casos Qualificados */}
              <div className="flex-1 min-w-[110px] text-center p-3.5 bg-emerald-500/10 rounded-xl border border-emerald-500/30 shadow-sm">
                <span className="block text-2xl font-extrabold text-emerald-400">{safeAgendamentos || Math.ceil(safeLeads * 0.25)}</span>
                <span className="text-xs font-semibold text-emerald-300 mt-0.5 block">Qualificados WPP</span>
                <span className="text-[10px] text-emerald-300/70 mt-1 block">Negociação ativa</span>
              </div>
            </>
          )}

          <ArrowRight className="text-text-muted shrink-0 hidden sm:block" size={16} />

          {/* 5. Vendas Fechadas */}
          <div className="flex-1 min-w-[120px] text-center p-3.5 bg-[#10b981]/15 rounded-xl border border-[#10b981]/40 shadow-sm">
            <span className="block text-2xl font-extrabold text-[#10b981]">{safeSales}</span>
            <span className="text-xs font-semibold text-[#10b981] mt-0.5 block">Pagamento Realizado (Fechado)</span>
            <span className="text-[10px] text-[#10b981]/80 mt-1 block">Exato: {exactSales.toFixed(2).replace('.', ',')}</span>
          </div>
        </div>
      </div>

      {/* Box Didático: Detalhamento do Funil Reverso (Conforme o exemplo exato do usuário) */}
      <div className="mb-6 p-5 rounded-2xl bg-gradient-to-r from-brand-blue/10 via-purple-500/5 to-[#10b981]/10 border border-brand-blue/20">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-brand-blue/20 text-brand-blue mt-0.5 shrink-0">
            <TrendingUp size={20} />
          </div>
          <div className="space-y-3 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <h4 className="text-sm font-bold text-text-main flex items-center gap-1.5">
                Detalhamento do Funil Reverso para atingir a meta de R$ {Number(targetRevenue).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}:
              </h4>
              <span className="text-xs text-text-muted">
                Taxas: {scheduleRate}% agendamento | {closeRate}% fechamento
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-bg-card/80 rounded-xl border border-border">
                <span className="font-bold text-text-muted uppercase text-[10px] tracking-wider block mb-1">1. Vendas Necessárias</span>
                <p className="text-base font-extrabold text-text-main">
                  {exactSales.toFixed(2).replace('.', ',')} vendas
                </p>
                <p className="text-[11px] text-text-muted mt-1">
                  (R$ {Number(targetRevenue).toLocaleString('pt-BR')} / R$ {Number(ticketMedio).toLocaleString('pt-BR')} ticket)
                </p>
              </div>

              <div className="p-3 bg-bg-card/80 rounded-xl border border-border">
                <span className="font-bold text-text-muted uppercase text-[10px] tracking-wider block mb-1">2. Agendamentos Necessários</span>
                <p className="text-base font-extrabold text-brand-blue">
                  {exactAgendamentos.toFixed(2).replace('.', ',')} agendamentos
                </p>
                <p className="text-[11px] text-text-muted mt-1">
                  ({exactSales.toFixed(2).replace('.', ',')} vendas / {closeRate}% conversão fechamento)
                </p>
              </div>

              <div className="p-3 bg-bg-card/80 rounded-xl border border-border">
                <span className="font-bold text-text-muted uppercase text-[10px] tracking-wider block mb-1">3. Leads Recebidos (WhatsApp)</span>
                <p className="text-base font-extrabold text-[#10b981]">
                  {exactLeads.toFixed(2).replace('.', ',')} leads
                </p>
                <p className="text-[11px] text-text-muted mt-1">
                  ({exactAgendamentos.toFixed(2).replace('.', ',')} agendamentos / {scheduleRate}% agendamento)
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-bg-card rounded-xl border border-[#10b981]/30 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-[#10b981] shrink-0" />
                <p className="text-xs text-text-main leading-relaxed">
                  <strong>Meta Prática de Segurança:</strong> Sem depender de frações, mire na captação de <strong className="text-brand-blue">{safeLeads} leads</strong>. Isso gerará cerca de <strong className="text-purple-400">{safeAgendamentos} agendamentos</strong> e <strong className="text-[#10b981]">{safeSales} contratos fechados</strong>, resultando em um faturamento de <strong className="text-[#10b981]">R$ {Number(safeRevenue).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rodapé com Botão de Aplicação de Metas */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
        {applied ? (
          <span className="text-xs font-bold text-[#10b981] flex items-center gap-2 animate-in fade-in">
            <Check size={18} /> Metas aplicadas com sucesso nos funis de SDR e Closer!
          </span>
        ) : (
          <p className="text-xs text-text-muted">
            Ao aplicar, estas metas serão distribuídas automaticamente para o acompanhamento diário da equipe.
          </p>
        )}

        <button 
          type="button"
          onClick={handleApply}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg cursor-pointer ${
            applied 
              ? 'bg-[#10b981] text-white shadow-[#10b981]/20 scale-102' 
              : 'bg-brand-blue hover:bg-brand-blue/90 text-white shadow-brand-blue/20 hover:scale-102'
          }`}
        >
          {applied ? <Check size={18} /> : <Save size={18} />}
          {applied ? 'Metas Aplicadas nos Funis!' : 'Aplicar como Metas Oficiais do Mês'}
        </button>
      </div>
    </div>
  );
}
