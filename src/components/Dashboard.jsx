import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Target, AlertCircle, CheckCircle2, TrendingUp, TrendingDown, Info, Zap } from 'lucide-react';

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

const formatLabel = (key) => {
  return metricTranslations[key] || key.replace(/([A-Z])/g, ' $1').toUpperCase();
};

const getUnit = (key) => {
  if (key.includes('Rate') || key.includes('Attainment')) return '%';
  if (key.includes('honorarios') || key.includes('Ticket')) return 'R$';
  if (key.includes('Length')) return ' dias';
  return '';
};

// Utility to pick a color for the metric based on progress or index
const getMetricColor = (progress) => {
  if (progress >= 100) return 'text-[#10b981]'; // Emerald green
  if (progress >= 80) return 'text-brand-blue'; // Brand blue
  if (progress >= 50) return 'text-[#f59e0b]'; // Amber
  return 'text-[#ef4444]'; // Red
};

const getMetricIcon = (progress) => {
  if (progress >= 100) return <CheckCircle2 size={16} className="text-[#10b981]" />;
  if (progress >= 80) return <TrendingUp size={16} className="text-brand-blue" />;
  if (progress >= 50) return <Zap size={16} className="text-[#f59e0b]" />;
  return <TrendingDown size={16} className="text-[#ef4444]" />;
};

export default function Dashboard({ role, metrics, goals, chartData }) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Smart Insight Alert */}
      <div className="p-4 rounded-xl bg-brand-blue/10 border border-brand-blue/30 flex items-start gap-3">
        <Target className="text-brand-blue shrink-0 mt-0.5" size={20} />
        <div>
          <h4 className="text-sm font-bold text-brand-blue mb-1">Insight Estratégico (Lei Seca)</h4>
          <p className="text-xs text-brand-blue/80">
            A taxa de contato no WhatsApp de infratores da equipe de {role.toUpperCase()} está abaixo da média ideal. 
            Recomendamos enviar a primeira mensagem de contato em até 5 minutos após o lead entrar na base para não perder o timing da dor.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.keys(metrics).map((key) => {
          const current = metrics[key];
          const goal = goals[key];
          const progress = (current / goal) * 100;
          const unit = getUnit(key);
          const formattedCurrent = current.toLocaleString();
          const colorClass = getMetricColor(progress);
          const Icon = getMetricIcon(progress);

          return (
            <div key={key} className="bg-bg-card p-5 rounded-2xl border border-border flex flex-col justify-between hover:border-brand-blue/50 transition-colors">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-text-muted text-[11px] font-bold tracking-widest uppercase">
                  {formatLabel(key)}
                </h3>
                {Icon}
              </div>

              <div className="mb-4">
                <div className="flex items-baseline gap-1">
                  {unit === 'R$' && <span className={`text-xl font-bold ${colorClass}`}>R$</span>}
                  <span className={`text-4xl font-bold tracking-tight ${colorClass}`}>
                    {formattedCurrent}
                  </span>
                  {unit !== 'R$' && <span className={`text-xl font-bold ${colorClass}`}>{unit}</span>}
                </div>
              </div>

              <div>
                <p className="text-text-muted text-xs font-medium">
                  Meta: {unit === 'R$' ? 'R$ ' : ''}{goal.toLocaleString()}{unit !== 'R$' ? unit : ''}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts section */}
      <div className="bg-bg-card p-6 rounded-2xl border border-border">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-bold tracking-wider uppercase text-text-main">
            Evolução Mensal
          </h3>
          <div className="flex items-center gap-2 text-xs text-text-muted bg-bg-main px-3 py-1.5 rounded-full border border-border">
            <Info size={14} />
            <span>Dados consolidados</span>
          </div>
        </div>
        
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {role === 'closer' ? (
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--color-text-muted)" tick={{fill: 'var(--color-text-muted)', fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis stroke="var(--color-text-muted)" tick={{fill: 'var(--color-text-muted)', fontSize: 12}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'var(--color-text-main)' }}
                  itemStyle={{ color: 'var(--color-text-main)' }}
                  cursor={{fill: 'var(--color-bg-main)'}}
                />
                <Bar dataKey="won" name="Ganhas" fill="#0070f3" radius={[4, 4, 0, 0]} />
                <Bar dataKey="lost" name="Perdidas" fill="var(--color-text-muted)" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--color-text-muted)" tick={{fill: 'var(--color-text-muted)', fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis stroke="var(--color-text-muted)" tick={{fill: 'var(--color-text-muted)', fontSize: 12}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'var(--color-text-main)' }}
                  itemStyle={{ color: 'var(--color-text-main)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey={role === 'sdr' ? 'leads' : 'outreach'} 
                  name={role === 'sdr' ? 'Leads' : 'Prospecção'}
                  stroke="var(--color-text-muted)" 
                  strokeWidth={2}
                  dot={{ r: 4, fill: 'var(--color-text-muted)', strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: 'var(--color-text-main)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey={role === 'sdr' ? 'sqls' : 'meetings'} 
                  name={role === 'sdr' ? 'SQLs' : 'Reuniões'}
                  stroke="#0070f3" 
                  strokeWidth={2} 
                  dot={{ r: 4, fill: '#0070f3', strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: 'var(--color-text-main)' }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
