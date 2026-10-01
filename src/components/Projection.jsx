import React from 'react';
import { Target, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';

const metricTranslations = {
  leadsRecebidos: 'LEADS (MULTAS)',
  motoristasContatados: 'CONTATADOS (WHATSAPP)',
  casosQualificados: 'CASOS QUALIFICADOS',
  consultasAgendadas: 'CONSULTAS AGENDADAS',
  processosMapeados: 'PROCESSOS ENCONTRADOS',
  contatosAtivos: 'CONTATOS ATIVOS',
  consultasAgendadasOut: 'CONSULTAS AGENDADAS',
  casosQualificadosOut: 'CASOS QUALIFICADOS',
  consultasRealizadas: 'CONSULTAS REALIZADAS',
  contratosEnviados: 'CONTRATOS ENVIADOS',
  contratosFechados: 'CONTRATOS FECHADOS',
  honorariosMedios: 'HONORÁRIOS (TICKET)'
};

export default function Projection({ role, metrics, goals }) {
  const roleTitle = role.toUpperCase();

  const getStatus = (current, goal) => {
    const progress = (current / goal) * 100;
    if (progress >= 100) return 'bated';
    if (progress >= 80) return 'onTrack';
    return 'behind';
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      <div className="bg-bg-card p-8 rounded-2xl border border-border">
        <div className="flex items-center gap-3 mb-8 border-b border-border pb-6">
          <div className="p-2 bg-brand-blue/10 text-brand-blue rounded-lg">
            <TrendingUp size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-main">Projeção e Acompanhamento de Metas - {roleTitle}</h2>
            <p className="text-sm text-text-muted mt-1">Veja quanto falta para atingir as metas gerais da empresa na sua função.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.keys(goals).map((key) => {
            const current = metrics[key];
            const goal = goals[key];
            const gap = goal - current;
            const status = getStatus(current, goal);
            
            const isPercent = key.includes('Rate') || key.includes('Attainment');
            const isCurrency = key.includes('Size');
            
            const formatValue = (val) => {
              if (isCurrency) return `R$ ${val.toLocaleString()}`;
              if (isPercent) return `${val}%`;
              return val.toLocaleString();
            };

            return (
              <div key={key} className="bg-bg-main border border-border p-6 rounded-xl">
                <h3 className="text-sm font-bold text-text-muted uppercase tracking-widest mb-4">
                  {metricTranslations[key] || key.replace(/([A-Z])/g, ' $1').toUpperCase()}
                </h3>
                
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <p className="text-xs text-text-muted mb-1">Status Atual</p>
                    <p className="text-2xl font-bold text-text-main">{formatValue(current)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-text-muted mb-1">Meta</p>
                    <p className="text-xl font-medium text-text-muted">{formatValue(goal)}</p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-bg-card border border-border">
                  {status === 'bated' ? (
                    <div className="flex items-start gap-3">
                      <CheckCircle2 size={20} className="text-[#10b981] mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-[#10b981]">Meta Atingida!</p>
                        <p className="text-xs text-text-muted mt-1">Excelente trabalho. Você superou a expectativa em {formatValue(Math.abs(gap))}.</p>
                      </div>
                    </div>
                  ) : status === 'onTrack' ? (
                    <div className="flex items-start gap-3">
                      <Target size={20} className="text-brand-blue mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-brand-blue">Quase lá!</p>
                        <p className="text-xs text-text-muted mt-1">Falta apenas <strong>{formatValue(gap)}</strong> para bater a meta. Mantenha o ritmo.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3">
                      <AlertTriangle size={20} className="text-[#f59e0b] mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-[#f59e0b]">Atenção Necessária</p>
                        <p className="text-xs text-text-muted mt-1">Você está atrás da meta. Precisa de mais <strong>{formatValue(gap)}</strong> para alcançá-la.</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Visual Progress Bar */}
                <div className="mt-6 w-full bg-border rounded-full h-1.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${status === 'bated' ? 'bg-[#10b981]' : status === 'onTrack' ? 'bg-brand-blue' : 'bg-[#f59e0b]'}`}
                    style={{ width: `${Math.min((current / goal) * 100, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
