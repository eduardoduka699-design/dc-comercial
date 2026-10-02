import React from 'react';
import { Target, Users, Phone, Star, Calendar, CheckSquare, FileText, CheckCircle2 } from 'lucide-react';

export default function FunnelView({ role, metrics, setMetrics }) {
  const funnelType = localStorage.getItem('dc-leiseca-funnel-type') || 'com_reuniao';

  const funnelConfigs = {
    sdr: {
      title: 'Funil Lei Seca — SDR (Recepção)',
      stages: [
        { id: 'leadsRecebidos', label: 'Leads (Multas)', icon: Users, color: 'bg-[#f59e0b]' },
        { id: 'motoristasContatados', label: 'Contatados (WhatsApp)', icon: Phone, color: 'bg-[#f97316]', benchmark: [60, 80], benchmarkText: '60-80% respondem' },
        { id: 'casosQualificados', label: 'Casos Qualificados', icon: Star, color: 'bg-[#eab308]', benchmark: [30, 50], benchmarkText: '30-50% têm perfil de recurso' },
        ...(funnelType === 'com_reuniao' ? [
          { id: 'consultasAgendadas', label: 'Consultas Agendadas', icon: Calendar, color: 'bg-[#10b981]', benchmark: [50, 70], benchmarkText: '50-70% agendam consulta' }
        ] : [])
      ]
    },
    bdr: {
      title: 'Funil Lei Seca — BDR (Prospecção)',
      stages: [
        { id: 'processosMapeados', label: 'Processos Encontrados', icon: Users, color: 'bg-[#f59e0b]' },
        { id: 'contatosAtivos', label: 'Contatos Ativos', icon: Phone, color: 'bg-[#f97316]', benchmark: [5, 15], benchmarkText: '5-15% conectam' },
        ...(funnelType === 'com_reuniao' ? [
          { id: 'consultasAgendadasOut', label: 'Consultas Agendadas', icon: Calendar, color: 'bg-[#eab308]', benchmark: [10, 20], benchmarkText: '10-20% agendam consulta' }
        ] : []),
        { id: 'casosQualificadosOut', label: 'Casos Qualificados', icon: CheckSquare, color: 'bg-[#10b981]', benchmark: [60, 80], benchmarkText: '60-80% são viáveis' }
      ]
    },
    closer: {
      title: 'Funil Lei Seca — Closer (Especialista)',
      stages: [
        ...(funnelType === 'com_reuniao' ? [
          { id: 'consultasRealizadas', label: 'Consultas Realizadas', icon: Star, color: 'bg-[#f59e0b]' }
        ] : [
          { id: 'casosQualificados', label: 'Casos Qualificados Repassados', icon: Star, color: 'bg-[#f59e0b]' }
        ]),
        { id: 'contratosEnviados', label: 'Contratos Enviados', icon: FileText, color: 'bg-[#f97316]', benchmark: [funnelType === 'com_reuniao' ? 60 : 80, funnelType === 'com_reuniao' ? 75 : 95], benchmarkText: funnelType === 'com_reuniao' ? '60-75% recebem contrato' : '80-95% recebem proposta no Wpp' },
        { id: 'contratosFechados', label: 'Contratos Fechados', icon: CheckCircle2, color: 'bg-[#10b981]', benchmark: [funnelType === 'com_reuniao' ? 20 : 10, funnelType === 'com_reuniao' ? 30 : 20], benchmarkText: funnelType === 'com_reuniao' ? '20-30% fecham honorários' : '10-20% fecham direto no Wpp' }
      ]
    }
  };

  const config = funnelConfigs[role];
  const roleMetrics = metrics[role] || {};

  const handleChange = (id, value) => {
    setMetrics(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [id]: Number(value)
      }
    }));
  };

  const calculateConversion = (currentIndex, val) => {
    if (currentIndex === 0) return null;
    const prevId = config.stages[currentIndex - 1].id;
    const prevVal = roleMetrics[prevId] || 0;
    if (!prevVal || prevVal === 0) return 0;
    return (val / prevVal) * 100;
  };

  const getBenchmarkStatus = (conversion, benchmark) => {
    if (!conversion || !benchmark) return null;
    if (conversion >= benchmark[0]) return 'good';
    return 'bad';
  };

  const topValue = roleMetrics[config.stages[0]?.id] || 0;
  const bottomValue = roleMetrics[config.stages[config.stages.length - 1]?.id] || 0;
  const totalConversion = topValue > 0 ? (bottomValue / topValue) * 100 : 0;
  const ticketMedio = roleMetrics.honorariosMedios || 5000;
  const roas = bottomValue * ticketMedio;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Left Column - Inputs */}
      <div className="bg-bg-card p-6 rounded-2xl border border-border">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Users size={20} className="text-brand-blue" />
            <h2 className="text-lg font-bold text-text-main">{config.title}</h2>
          </div>
          <span className="text-xs bg-brand-blue/20 text-brand-blue px-2 py-1 rounded">Lançamento de Resultados</span>
        </div>
        
        <p className="text-xs text-text-muted mb-6">Insira os volumes reais alcançados neste mês para atualizar os gráficos do Dashboard automaticamente.</p>

        <div className="space-y-4">
          {config.stages.map((stage, index) => {
            const Icon = stage.icon;
            const val = roleMetrics[stage.id] || 0;
            const conversion = calculateConversion(index, val);
            const status = getBenchmarkStatus(conversion, stage.benchmark);

            return (
              <div key={stage.id}>
                <div className="flex justify-between items-end mb-2">
                  <div className="flex items-center gap-2">
                    <Icon size={14} className={stage.color.replace('bg-', 'text-')} />
                    <label className="text-sm font-medium text-text-main">{stage.label}</label>
                  </div>
                  {conversion !== null && (
                    <span className={`text-xs font-bold ${status === 'good' ? 'text-[#10b981]' : 'text-[#f59e0b]'}`}>
                      {conversion.toFixed(1)}% {status === 'good' ? 'ok.' : 'atenção'}
                    </span>
                  )}
                </div>
                <input 
                  type="number"
                  value={val}
                  onChange={(e) => handleChange(stage.id, e.target.value)}
                  className="w-full bg-bg-main border border-border rounded-lg py-2.5 px-4 text-text-main font-medium focus:outline-none focus:border-brand-blue"
                />
                {stage.benchmarkText && (
                  <p className="text-[10px] text-text-muted mt-1">
                    Benchmark de mercado: {stage.benchmarkText}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex justify-between items-end mb-2">
            <label className="text-sm font-medium text-text-main">Ticket Médio (Vendas)</label>
            <span className="text-xs font-bold text-[#f59e0b]">R$ {ticketMedio.toLocaleString('pt-BR')}</span>
          </div>
          <input 
            type="number"
            value={ticketMedio}
            onChange={(e) => handleChange('honorariosMedios', e.target.value)}
            className="w-full bg-bg-main border border-border rounded-lg py-2.5 px-4 text-text-main font-medium focus:outline-none focus:border-brand-blue"
          />
        </div>

        <div className="mt-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 bg-bg-main p-4 rounded-xl border border-border">
            <p className="text-[10px] text-text-muted uppercase tracking-widest text-center mb-1">Conversão Geral</p>
            <p className="text-2xl font-bold text-[#f97316] text-center">{totalConversion.toFixed(1)}%</p>
            <p className="text-[10px] text-text-muted text-center mt-1">{topValue} início - {bottomValue} fim</p>
          </div>
          <div className="flex-1 bg-bg-main p-4 rounded-xl border border-[#10b981]/30">
            <p className="text-[10px] text-text-muted uppercase tracking-widest text-center mb-1">Faturamento Gerado</p>
            <p className="text-2xl font-bold text-[#10b981] text-center">R$ {roas.toLocaleString('pt-BR')}</p>
          </div>
        </div>
      </div>

      {/* Right Column - Visual Funnel */}
      <div className="bg-bg-card p-6 rounded-2xl border border-border flex flex-col">
        <h3 className="text-sm font-bold text-text-main mb-8">Taxas de Conversão Reais</h3>
        
        {/* CSS Clip-Path Funnel */}
        <div className="flex-1 flex flex-col items-center justify-center py-8">
          <div 
            className="w-full max-w-[300px] h-[300px] flex flex-col"
            style={{ clipPath: 'polygon(0 0, 100% 0, 65% 100%, 35% 100%)' }}
          >
            {config.stages.map((stage) => {
              const val = roleMetrics[stage.id] || 0;
              const Icon = stage.icon;
              return (
                <div key={stage.id} className={`flex-1 flex flex-col items-center justify-center ${stage.color}`}>
                  <div className="flex items-center gap-1 text-white/90 text-xs mb-1 font-medium">
                    <Icon size={12} /> {stage.label}
                  </div>
                  <div className="text-2xl font-bold text-white leading-none">{val}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stage to Stage list */}
        <div className="mt-8 space-y-2">
          {config.stages.map((stage, index) => {
            if (index === 0) return null;
            const prevStage = config.stages[index - 1];
            const conversion = calculateConversion(index, roleMetrics[stage.id] || 0);
            const status = getBenchmarkStatus(conversion, stage.benchmark);
            const isGood = status === 'good';
            
            return (
              <div key={stage.id} className={`flex justify-between items-center p-3 rounded-lg border ${isGood ? 'border-[#10b981]/20 bg-[#10b981]/5' : 'border-[#f59e0b]/20 bg-[#f59e0b]/5'}`}>
                <span className="text-xs text-text-muted">
                  {prevStage.label} -> {stage.label}
                </span>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] text-text-muted">
                    meta: {stage.benchmark ? `${stage.benchmark[0]}-${stage.benchmark[1]}%` : '-'}
                  </span>
                  <span className={`text-xs font-bold ${isGood ? 'text-[#10b981]' : 'text-[#f59e0b]'}`}>
                    {conversion.toFixed(1)}%
                  </span>
                </div>
              </div>
            );
          })}
          
          <div className="flex justify-between items-center p-3 rounded-lg border border-[#f97316]/20 bg-[#f97316]/5 mt-4">
            <span className="text-xs font-bold text-text-main">
              Conversão Geral ({config.stages[0].label} -> {config.stages[config.stages.length-1].label})
            </span>
            <span className="text-xs font-bold text-[#f97316]">
              {totalConversion.toFixed(1)}%
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
