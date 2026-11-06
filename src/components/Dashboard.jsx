import React from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { 
  Target, AlertCircle, CheckCircle2, TrendingUp, Sparkles, 
  DollarSign, Clock, Users, Calendar, FileText, ArrowRight, 
  ExternalLink, Layers, ChevronRight, Zap
} from 'lucide-react';

const metricTranslations = {
  leadsRecebidos: 'LEADS RECEBIDOS (WHATSAPP)',
  motoristasContatados: 'ATENDIMENTOS / CONTATO FEITO',
  casosQualificados: 'QUALIFICADOS',
  consultasAgendadas: 'REUNIÕES MARCADAS (SDR)',
  consultasRealizadas: 'REUNIÕES REALIZADAS (SDR)',
  contratosEnviados: 'PROPOSTAS ENVIADAS',
  contratosAssinados: 'CONTRATOS ASSINADOS',
  contratosFechados: 'PAGAMENTO REALIZADO (FECHADO)',
  honorariosMedios: 'HONORÁRIOS (TICKET MÉDIO)',
  processosMapeados: 'PROCESSOS MAPEADOS',
  contatosAtivos: 'CONTATOS ATIVOS'
};

const metricTagBadges = {
  leadsRecebidos: 'Entrada de Leads no WhatsApp',
  motoristasContatados: 'ATENDIMENTOS REALIZADOS / CONTATO FEITO',
  casosQualificados: 'QUALIFICADOS - {MÊS}',
  consultasAgendadas: 'REUNIOES MARCADAS - {MÊS} (SDR)',
  consultasRealizadas: 'REUNIÕES REALIZADAS {MÊS} - (SDR)',
  contratosEnviados: 'PROPOSTA ENVIADA - {MÊS}',
  contratosAssinados: 'CONTRATO ASSINADO (Aguardando Pgto)',
  contratosFechados: 'PAGAMENTO REALIZADO (PAGO)',
  honorariosMedios: 'Média de Honorários Pagos'
};

// Mapeamento para abrir o modal de leads no filtro exato
const stageKeyMap = {
  leadsRecebidos: 'all',
  motoristasContatados: 'contatado',
  casosQualificados: 'qualificado',
  consultasAgendadas: 'agendado',
  consultasRealizadas: 'consulta_realizada',
  contratosEnviados: 'contrato_enviado',
  contratosAssinados: 'contrato_assinado',
  contratosFechados: 'fechado',
  honorariosMedios: 'fechado'
};

// Cores e estilos visuais específicos para cada etapa do funil (sem ficar tudo vermelho)
const stageStyles = {
  leadsRecebidos: {
    textColor: 'text-sky-400',
    borderColor: 'border-sky-500/20 hover:border-sky-500/60',
    bgColor: 'bg-sky-500/5',
    badgeBg: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    progressColor: 'bg-sky-500',
    icon: Users
  },
  motoristasContatados: {
    textColor: 'text-amber-400',
    borderColor: 'border-amber-500/20 hover:border-amber-500/60',
    bgColor: 'bg-amber-500/5',
    badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    progressColor: 'bg-amber-500',
    icon: Sparkles
  },
  casosQualificados: {
    textColor: 'text-purple-400',
    borderColor: 'border-purple-500/20 hover:border-purple-500/60',
    bgColor: 'bg-purple-500/5',
    badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    progressColor: 'bg-purple-500',
    icon: Target
  },
  consultasAgendadas: {
    textColor: 'text-cyan-400',
    borderColor: 'border-cyan-500/20 hover:border-cyan-500/60',
    bgColor: 'bg-cyan-500/5',
    badgeBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    progressColor: 'bg-cyan-500',
    icon: Calendar
  },
  consultasRealizadas: {
    textColor: 'text-blue-400',
    borderColor: 'border-blue-500/20 hover:border-blue-500/60',
    bgColor: 'bg-blue-500/5',
    badgeBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    progressColor: 'bg-blue-500',
    icon: Calendar
  },
  contratosEnviados: {
    textColor: 'text-indigo-400',
    borderColor: 'border-indigo-500/20 hover:border-indigo-500/60',
    bgColor: 'bg-indigo-500/5',
    badgeBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    progressColor: 'bg-indigo-500',
    icon: FileText
  },
  contratosAssinados: {
    textColor: 'text-amber-300',
    borderColor: 'border-amber-500/30 hover:border-amber-500/70',
    bgColor: 'bg-amber-500/5',
    badgeBg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    progressColor: 'bg-amber-400',
    icon: Clock
  },
  contratosFechados: {
    textColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/40 hover:border-emerald-500/80 shadow-lg shadow-emerald-500/5',
    bgColor: 'bg-emerald-500/10',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    progressColor: 'bg-emerald-500',
    icon: CheckCircle2
  },
  honorariosMedios: {
    textColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/20 hover:border-emerald-500/60',
    bgColor: 'bg-emerald-500/5',
    badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    progressColor: 'bg-emerald-500',
    icon: DollarSign
  }
};

const formatLabel = (key) => {
  return metricTranslations[key] || key.replace(/([A-Z])/g, ' $1').toUpperCase();
};

const getUnit = (key) => {
  if (key.includes('Rate') || key.includes('Attainment')) return '%';
  if (key.includes('honorarios') || key.includes('Ticket')) return 'R$';
  if (key.includes('Length')) return ' dias';
  return '';
};

export default function Dashboard({ 
  role, 
  metrics, 
  goals, 
  chartData = [], 
  onCardClick, 
  chartViewMode = 'day', 
  setChartViewMode,
  isDarkMode = true 
}) {
  const isCloser = role === 'closer';
  const fechados = Number(metrics?.contratosFechados || 0);
  const assinados = Number(metrics?.contratosAssinados || 0);
  const ticket = Number(metrics?.honorariosMedios || 1517);
  const faturamentoFechado = fechados * ticket;
  const faturamentoAguardando = assinados * ticket;

  // Calcula conversões entre etapas para o mini funil
  const leads = Number(metrics?.leadsRecebidos || 0);
  const contatados = Number(metrics?.motoristasContatados || 0);
  const qualificados = Number(metrics?.casosQualificados || 0);
  const agendados = Number(metrics?.consultasAgendadas || 0);
  const realizadas = Number(metrics?.consultasRealizadas || 0);
  const propostas = Number(metrics?.contratosEnviados || 0);

  const txContato = leads > 0 ? ((contatados / leads) * 100).toFixed(1) : 0;
  const txQualif = contatados > 0 ? ((qualificados / contatados) * 100).toFixed(1) : 0;
  const txAgend = qualificados > 0 ? ((agendados / qualificados) * 100).toFixed(1) : 0;
  const txComparecimento = agendados > 0 ? ((realizadas / agendados) * 100).toFixed(1) : 0;
  const txProposta = realizadas > 0 ? ((propostas / realizadas) * 100).toFixed(1) : 0;
  const txFechamento = realizadas > 0 ? ((fechados / realizadas) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-7 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Closer Executive Highlight: Faturamento Total Fechado & Pipeline a Receber */}
      {isCloser && (
        <div className="bg-gradient-to-r from-emerald-950/40 via-[#13141b] to-blue-950/30 border border-emerald-500/30 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-2">
                <CheckCircle2 size={13} /> Fechamento Jurídico Consolidado
              </span>
              <h3 className="text-xl sm:text-2xl font-display font-extrabold text-white">
                Faturamento Total Fechado (Honorários Pagos)
              </h3>
              <p className="text-xs text-white/60 mt-1 max-w-xl">
                Considera estritamente os clientes que já realizaram o pagamento. Contratos apenas assinados ficam no pipeline aguardando liquidação.
              </p>
            </div>

            <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
              <div className="bg-[#0b0c10] border border-emerald-500/40 rounded-2xl p-4 min-w-[200px]">
                <span className="text-[11px] font-bold text-emerald-400/80 uppercase block">Total Recebido</span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                  {faturamentoFechado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
                <span className="text-[11px] text-white/50 block mt-0.5">{fechados} honorários quitados</span>
              </div>

              {assinados > 0 && (
                <div 
                  onClick={() => onCardClick && onCardClick('contrato_assinado')}
                  className="bg-[#0b0c10] border border-amber-500/30 hover:border-amber-500/70 rounded-2xl p-4 min-w-[200px] cursor-pointer transition-all hover:scale-[1.02]"
                  title="Clique para ver os contratos aguardando pagamento"
                >
                  <span className="text-[11px] font-bold text-amber-300/80 uppercase block">A Faturar (Assinados)</span>
                  <span className="text-2xl sm:text-3xl font-black text-amber-300 font-mono">
                    {faturamentoAguardando.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                  <span className="text-[11px] text-amber-400/70 flex items-center gap-1 mt-0.5">
                    {assinados} contratos aguardando PIX <ArrowRight size={11} />
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Smart Insight Alert contextual por papel */}
      <div className="p-4 rounded-2xl bg-[#13141b] border border-brand-blue/30 flex items-start gap-3.5 shadow-md">
        <div className="p-2 rounded-xl bg-brand-blue/15 text-brand-blue border border-brand-blue/30 shrink-0">
          <Target size={18} />
        </div>
        <div className="flex-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-brand-blue mb-0.5">
            Insight Operacional Estratégico • {role.toUpperCase()}
          </h4>
          {isCloser ? (
            <p className="text-xs text-white/70 leading-relaxed">
              Você tem <strong>{assinados} contrato(s) assinado(s) aguardando liquidação</strong> (aproximadamente {faturamentoAguardando.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}). 
              A prioridade máxima do Closer hoje é enviar a chave PIX e acompanhar a confirmação com o cliente.
            </p>
          ) : (
            <p className="text-xs text-white/70 leading-relaxed">
              Taxa de contato no WhatsApp em <strong>{txContato}%</strong> com <strong>{contatados} atendimentos</strong> iniciados. 
              O tempo de resposta nos primeiros 5 minutos após a entrada do lead no WhatsApp eleva a taxa de qualificação em até 300%.
            </p>
          )}
        </div>
      </div>

      {/* Funil Visual de Conversão Entre Etapas */}
      <div className="bg-[#121319] border border-white/10 rounded-2xl p-4 text-xs text-white/70 overflow-x-auto scrollbar-hide">
        <div className="flex items-center justify-between min-w-[700px] gap-2">
          <div className="flex items-center gap-1.5 font-bold text-white/90">
            <Layers size={14} className="text-brand-blue" />
            <span>Taxas de Conversão do Funil:</span>
          </div>

          {!isCloser ? (
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 font-bold">
                {leads} Leads
              </span>
              <span className="text-white/40 flex items-center gap-1">── <strong className="text-amber-400">{txContato}%</strong> ──&gt;</span>
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                {contatados} Contatados
              </span>
              <span className="text-white/40 flex items-center gap-1">── <strong className="text-purple-400">{txQualif}%</strong> ──&gt;</span>
              <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 font-bold">
                {qualificados} Qualificados
              </span>
              <span className="text-white/40 flex items-center gap-1">── <strong className="text-cyan-400">{txAgend}%</strong> ──&gt;</span>
              <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
                {agendados} Agendados
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">
                {realizadas} Realizadas
              </span>
              <span className="text-white/40 flex items-center gap-1">── <strong className="text-indigo-400">{txProposta}%</strong> ──&gt;</span>
              <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">
                {propostas} Propostas
              </span>
              <span className="text-white/40 flex items-center gap-1">── <strong className="text-amber-400">{assinados > 0 ? `${((assinados / (propostas || 1)) * 100).toFixed(0)}%` : '0%'}</strong> ──&gt;</span>
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
                {assinados} Assinados
              </span>
              <span className="text-white/40 flex items-center gap-1">── <strong className="text-emerald-400">{txFechamento}%</strong> ──&gt;</span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                {fechados} Fechados (Pagos)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* KPI Cards Interativos (Dark Premium & Click-to-Drilldown) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Object.keys(metrics || {}).map((key) => {
          const current = Number(metrics?.[key] || 0);
          const goal = Number(goals?.[key] || 0);
          const progress = goal > 0 ? (current / goal) * 100 : 0;
          const unit = getUnit(key);
          const formattedCurrent = current.toLocaleString('pt-BR');
          const style = stageStyles[key] || {
            textColor: 'text-white',
            borderColor: 'border-white/10 hover:border-brand-blue/50',
            bgColor: 'bg-[#121319]',
            badgeBg: 'bg-white/5 text-white/60 border-white/10',
            progressColor: 'bg-brand-blue',
            icon: Target
          };
          const IconComponent = style.icon || Target;
          const stageFilterKey = stageKeyMap[key] || 'all';

          return (
            <div 
              key={key} 
              onClick={() => onCardClick && onCardClick(stageFilterKey)}
              className={`group bg-[#121319] hover:bg-[#161822] p-5 rounded-2xl border ${style.borderColor} flex flex-col justify-between shadow-xl shadow-black/40 cursor-pointer transition-all duration-200 hover:-translate-y-1 relative overflow-hidden`}
              title="Clique para ver os leads reais desta etapa"
            >
              <div className="flex justify-between items-start mb-3 gap-2">
                <div className="min-w-0 pr-1">
                  <h3 className="text-white/70 text-[11px] font-bold tracking-wider uppercase leading-tight group-hover:text-white transition-colors">
                    {formatLabel(key)}
                  </h3>
                  {metricTagBadges[key] && (
                    <span className={`text-[10px] font-mono mt-1.5 px-2 py-0.5 rounded border block truncate max-w-[210px] ${style.badgeBg}`} title={`Etiqueta CRM: ${metricTagBadges[key]}`}>
                      🏷️ {metricTagBadges[key]}
                    </span>
                  )}
                </div>
                <div className={`p-2 rounded-xl shrink-0 ${style.bgColor} ${style.textColor} border border-white/5`}>
                  <IconComponent size={16} />
                </div>
              </div>

              <div className="my-3">
                <div className="flex items-baseline gap-1">
                  {unit === 'R$' && <span className={`text-xl font-bold ${style.textColor}`}>R$</span>}
                  <span className={`text-4xl font-extrabold tracking-tight font-mono ${style.textColor}`}>
                    {formattedCurrent}
                  </span>
                  {unit !== 'R$' && <span className={`text-xl font-bold ${style.textColor}`}>{unit}</span>}
                </div>

                {/* Barra de Progresso em direção à meta */}
                {goal > 0 && (
                  <div className="w-full bg-white/5 rounded-full h-1.5 mt-3 overflow-hidden">
                    <div 
                      className={`h-full ${style.progressColor} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.min(100, Math.max(5, progress))}%` }}
                    />
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-white/40 font-medium">
                  Meta: {unit === 'R$' ? 'R$ ' : ''}{goal.toLocaleString('pt-BR')}{unit !== 'R$' ? unit : ''}
                </span>

                <span className="text-brand-blue group-hover:text-blue-400 font-bold flex items-center gap-1 text-[11px] transition-transform group-hover:translate-x-1">
                  Ver leads <ArrowRight size={11} />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Gráfico de Evolução com Dados Reais do CRM */}
      <div className="bg-[#121319] p-6 rounded-3xl border border-white/10 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">Dados Reais do CRM</span>
            </div>
            <h3 className="text-base sm:text-lg font-display font-extrabold text-white">
              Evolução da Operação ({isCloser ? 'Fechamentos & Propostas' : 'Captação & Qualificação'})
            </h3>
            <p className="text-xs text-white/50 mt-0.5">
              Consolidação cronológica por carimbo de data/hora do CRM Legendary Hub.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {setChartViewMode && (
              <div className="flex items-center bg-[#0a0a0d] border border-white/10 rounded-xl p-1 text-xs font-bold">
                <button
                  onClick={() => setChartViewMode('day')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    chartViewMode === 'day' ? 'bg-brand-blue text-white shadow-sm' : 'text-white/50 hover:text-white'
                  }`}
                >
                  Por Dia
                </button>
                <button
                  onClick={() => setChartViewMode('week')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    chartViewMode === 'week' ? 'bg-brand-blue text-white shadow-sm' : 'text-white/50 hover:text-white'
                  }`}
                >
                  Por Semana
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="h-80 w-full min-h-[320px]">
          <ResponsiveContainer width="100%" height={320}>
            {isCloser ? (
              <BarChart data={chartData && chartData.length > 0 ? chartData : []} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#22232e" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" tick={{fill: '#9ca3af', fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis stroke="#6b7280" tick={{fill: '#9ca3af', fontSize: 12}} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const dataItem = payload[0]?.payload || {};
                      return (
                        <div className="bg-[#121319] border border-white/20 p-3.5 rounded-2xl shadow-2xl text-xs space-y-1.5 min-w-[200px]">
                          <p className="font-bold text-white text-sm pb-1 border-b border-white/10 flex items-center justify-between">
                            <span>{label}</span>
                            {dataItem.date && <span className="text-[10px] text-white/40 font-mono">{dataItem.date}</span>}
                          </p>
                          {payload.map((entry, idx) => (
                            <div key={`tip-${idx}`} className="flex items-center justify-between gap-3">
                              <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                <span className="text-white/80">{entry.name}:</span>
                              </span>
                              <span className="font-bold text-white font-mono">{entry.value}</span>
                            </div>
                          ))}
                          {dataItem.faturamento > 0 && (
                            <div className="pt-1.5 mt-1 border-t border-white/10 flex items-center justify-between text-emerald-400 font-bold">
                              <span>Faturamento:</span>
                              <span className="font-mono">
                                {Number(dataItem.faturamento).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                  cursor={{fill: 'rgba(255,255,255,0.04)'}}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '16px', fontSize: '12px' }}
                />
                <Bar dataKey="realizadas" name="Reuniões Realizadas" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="propostas" name="Propostas Enviadas" fill="#818cf8" radius={[6, 6, 0, 0]} />
                <Bar dataKey="assinados" name="Contratos Assinados" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                <Bar dataKey="fechados" name="Pagamento Realizado (Pago)" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            ) : (
              <LineChart data={chartData && chartData.length > 0 ? chartData : []} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#22232e" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" tick={{fill: '#9ca3af', fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis stroke="#6b7280" tick={{fill: '#9ca3af', fontSize: 12}} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-[#121319] border border-white/20 p-3.5 rounded-2xl shadow-2xl text-xs space-y-1.5 min-w-[190px]">
                          <p className="font-bold text-white text-sm pb-1 border-b border-white/10">
                            {label}
                          </p>
                          {payload.map((entry, idx) => (
                            <div key={`tip-sdr-${idx}`} className="flex items-center justify-between gap-3">
                              <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                <span className="text-white/80">{entry.name}:</span>
                              </span>
                              <span className="font-bold text-white font-mono">{entry.value}</span>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '16px', fontSize: '12px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="leads" 
                  name="Leads Recebidos"
                  stroke="#38bdf8" 
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#38bdf8', strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#ffffff' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="contatados" 
                  name="Atendimentos / Contatados"
                  stroke="#fbbf24" 
                  strokeWidth={2} 
                  dot={{ r: 4, fill: '#fbbf24', strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#ffffff' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="qualificados" 
                  name="Qualificados"
                  stroke="#c084fc" 
                  strokeWidth={2} 
                  dot={{ r: 4, fill: '#c084fc', strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#ffffff' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="agendados" 
                  name="Reuniões Marcadas"
                  stroke="#22d3ee" 
                  strokeWidth={2} 
                  dot={{ r: 4, fill: '#22d3ee', strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#ffffff' }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
