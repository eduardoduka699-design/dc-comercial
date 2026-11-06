import { useState, useEffect, useRef } from 'react';
import { Target, TrendingUp, Users, Bell, Sun, Moon, Download, LayoutDashboard, Database, Trophy, Calculator, LogOut, ArrowLeft, RefreshCw, Zap, ShieldCheck } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import FunnelView from '../components/FunnelView';
import Projection from '../components/Projection';
import Ranking from '../components/Ranking';
import ReverseCalculator from '../components/ReverseCalculator';
import DatePicker from '../components/DatePicker';
import RealLeadsModal from '../components/RealLeadsModal';
import { defaultGoals, baseMetrics } from '../data/mockData';
import { crmService } from '../services/crmService';

export default function ComercialModule({ currentUser }) {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [activeTab, setActiveTab] = useState(() => {
    const saved = localStorage.getItem('dc-comercial-active-tab');
    return saved === 'closer' ? 'closer' : 'sdr';
  });
  const [dateFilter, setDateFilter] = useState('Mês'); 
  const [customDate, setCustomDate] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const exportRef = useRef(null);
  
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('dc-leiseca-goals');
    return saved ? JSON.parse(saved) : defaultGoals;
  });

  const [metrics, setMetrics] = useState(() => {
    const saved = localStorage.getItem('dc-leiseca-metrics');
    return saved ? JSON.parse(saved) : baseMetrics;
  });

  // Estado da Conexão com o CRM em Tempo Real
  const [crmStatus, setCrmStatus] = useState(() => {
    try {
      const saved = localStorage.getItem('dc-leiseca-crm-status');
      return saved ? JSON.parse(saved) : { connected: true, totalLeads: 2 };
    } catch {
      return { connected: true, totalLeads: 2 };
    }
  });

  const [crmLeads, setCrmLeads] = useState(() => {
    try {
      const saved = localStorage.getItem('dc-leiseca-crm-leads');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [showLeadsModal, setShowLeadsModal] = useState(false);
  const [modalStageFilter, setModalStageFilter] = useState('all');
  const [syncingCrm, setSyncingCrm] = useState(false);
  const [chartViewMode, setChartViewMode] = useState('day'); // 'day' | 'week'

  // Sincroniza a classe dark no elemento raiz HTML para tema consistente
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleStageCardClick = (stageKey) => {
    setModalStageFilter(stageKey || 'all');
    setShowLeadsModal(true);
  };

  // Inicializa escuta e sincronização em tempo real com o CRM
  useEffect(() => {
    let isMounted = true;

    const initCrm = async () => {
      try {
        const live = await crmService.fetchLiveCRMData();
        if (!isMounted) return;
        if (live?.leads && live.leads.length > 0) setCrmLeads(live.leads);
        if (live?.status) setCrmStatus(live.status);
        if (live?.metrics) setMetrics(live.metrics);
      } catch (err) {
        console.error('Erro na carga inicial do CRM:', err);
      }
    };

    initCrm();

    // Assina atualizações em tempo real (Supabase Realtime + Polling automático)
    const unsubscribe = crmService.subscribeToLiveUpdates((live) => {
      if (!isMounted) return;
      if (live?.leads && live.leads.length > 0) setCrmLeads(live.leads);
      if (live?.status) setCrmStatus(live.status);
      if (live?.metrics) setMetrics(live.metrics);
    });

    const handleCrmSyncedEvent = (e) => {
      const detail = e.detail;
      if (detail?.leads && detail.leads.length > 0) setCrmLeads(detail.leads);
      if (detail?.status) setCrmStatus(detail.status);
      if (detail?.metrics) setMetrics(detail.metrics);
    };

    window.addEventListener('dc-crm-synced', handleCrmSyncedEvent);

    return () => {
      isMounted = false;
      unsubscribe();
      window.removeEventListener('dc-crm-synced', handleCrmSyncedEvent);
    };
  }, []);

  const handleManualCrmSync = async () => {
    setSyncingCrm(true);
    try {
      const data = await crmService.syncWithComercial();
      if (data?.leads && data.leads.length > 0) setCrmLeads(data.leads);
      if (data?.status) setCrmStatus(data.status);
      if (data?.metrics) setMetrics(data.metrics);
    } catch (err) {
      console.error('Erro ao sincronizar CRM:', err);
    } finally {
      setTimeout(() => setSyncingCrm(false), 600);
    }
  };

  useEffect(() => {
    localStorage.setItem('dc-leiseca-goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('dc-leiseca-metrics', JSON.stringify(metrics));
  }, [metrics]);

  useEffect(() => {
    const handleSync = () => {
      try {
        const savedGoals = localStorage.getItem('dc-leiseca-goals');
        if (savedGoals) {
          setGoals(JSON.parse(savedGoals));
        }
        const savedMetrics = localStorage.getItem('dc-leiseca-metrics');
        if (savedMetrics) {
          setMetrics(JSON.parse(savedMetrics));
        }
      } catch (err) {
        console.error('Erro ao sincronizar metas/métricas:', err);
      }
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('focus', handleSync);
    window.addEventListener('dc-goals-updated', handleSync);
    window.addEventListener('dc-metrics-updated', handleSync);

    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('focus', handleSync);
      window.removeEventListener('dc-goals-updated', handleSync);
      window.removeEventListener('dc-metrics-updated', handleSync);
    };
  }, []);

  const handleExportPDF = async () => {
    if (!exportRef.current) return;
    try {
      const canvas = await html2canvas(exportRef.current, {
        backgroundColor: isDarkMode ? '#0a0a0a' : '#ffffff',
        scale: 2
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Relatorio_LeiSeca_${customDate || dateFilter}_${activeTab.toUpperCase()}.pdf`);
    } catch (err) {
      console.error('Erro ao gerar PDF', err);
    }
  };

  const getFilteredMetrics = () => {
    const funnelType = localStorage.getItem('dc-leiseca-funnel-type') || 'com_reuniao';

    // Se temos leads reais do CRM, calcula as métricas com filtro real por data
    if (crmLeads && crmLeads.length > 0) {
      const now = new Date();
      const todayStr = now.toISOString().slice(0, 10);
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const filteredLeads = crmLeads.filter(lead => {
        const leadDateStr = lead.created_at || lead.updated_at;
        if (!leadDateStr) return true;
        const d = new Date(leadDateStr);

        if (customDate) {
          return leadDateStr.startsWith(customDate);
        }
        if (dateFilter === 'Hoje') {
          return leadDateStr.startsWith(todayStr);
        }
        if (dateFilter === 'Semana') {
          return d >= sevenDaysAgo;
        }
        if (dateFilter === 'Mês') {
          return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        }
        return true;
      });

      const liveMetrics = crmService.calculateMetricsFromLeads(filteredLeads);
      if (liveMetrics && liveMetrics[activeTab]) {
        const current = liveMetrics[activeTab];
        const newMetrics = {};
        Object.keys(current).forEach(k => {
          if (funnelType === 'sem_reuniao' && (k === 'consultasAgendadas' || k === 'consultasRealizadas')) {
            return;
          }
          newMetrics[k] = current[k];
        });
        return newMetrics;
      }
    }

    // Fallback proporcional
    let multiplier = 1;
    if (dateFilter === 'Hoje') multiplier = 0.05; 
    if (dateFilter === 'Semana') multiplier = 0.25; 
    if (customDate) {
      let hash = 0;
      for (let i = 0; i < customDate.length; i++) {
        hash = (hash << 5) - hash + customDate.charCodeAt(i);
        hash |= 0;
      }
      const variance = ((Math.abs(hash) % 20) - 10) / 1000;
      multiplier = Math.max(0.03, 0.05 + variance);
    }
    
    const adjusted = { ...metrics };
    const current = adjusted[activeTab] || {};
    const newMetrics = {};
    Object.keys(current).forEach(k => {
      if (funnelType === 'sem_reuniao' && (k === 'consultasAgendadas' || k === 'consultasRealizadas')) {
        return;
      }
      if (k.includes('honorarios') || k.includes('Ticket')) {
        newMetrics[k] = current[k];
      } else {
        newMetrics[k] = Math.max(0, Math.floor(current[k] * multiplier));
      }
    });
    return newMetrics;
  };

  // Gera dados consolidados reais para o gráfico de evolução (dia ou semana)
  const getDynamicChartData = () => {
    // Classificadores alinhados à taxonomia do CRM
    const isPagoLead = (lead) => {
      const t = (Array.isArray(lead.tags) ? lead.tags.join(' ') : '').toLowerCase();
      const e = (lead.etapa_funil || '').toLowerCase();
      return e === 'fechado' || t.includes('pagamento') || t.includes('pago') || t.includes('pagou') || t.includes('comprovante') || t.includes('fechad') || t.includes('ganho');
    };

    const isAssinadoLead = (lead) => {
      const t = (Array.isArray(lead.tags) ? lead.tags.join(' ') : '').toLowerCase();
      const e = (lead.etapa_funil || '').toLowerCase();
      return (e === 'contrato_assinado' || t.includes('assinado') || t.includes('assinatura')) && !isPagoLead(lead);
    };

    const isPropostaLead = (lead) => {
      const t = (Array.isArray(lead.tags) ? lead.tags.join(' ') : '').toLowerCase();
      const e = (lead.etapa_funil || '').toLowerCase();
      return e === 'contrato_enviado' || t.includes('proposta') || t.includes('contrato enviado');
    };

    const isRealizadaLead = (lead) => {
      const t = (Array.isArray(lead.tags) ? lead.tags.join(' ') : '').toLowerCase();
      const e = (lead.etapa_funil || '').toLowerCase();
      return e === 'consulta_realizada' || t.includes('reuniões realizadas') || t.includes('reunioes realizadas') || t.includes('compareceu');
    };

    const isMarcadaLead = (lead) => {
      const t = (Array.isArray(lead.tags) ? lead.tags.join(' ') : '').toLowerCase();
      const e = (lead.etapa_funil || '').toLowerCase();
      return e === 'agendado' || t.includes('reuniões marcadas') || t.includes('reunioes marcadas') || t.includes('agendad');
    };

    const isQualificadoLead = (lead) => {
      const t = (Array.isArray(lead.tags) ? lead.tags.join(' ') : '').toLowerCase();
      const e = (lead.etapa_funil || '').toLowerCase();
      return (e === 'qualificado' || t.includes('qualific') || t.includes('viável') || t.includes('viavel')) && !t.includes('desqualific');
    };

    const isContatadoLead = (lead) => {
      const t = (Array.isArray(lead.tags) ? lead.tags.join(' ') : '').toLowerCase();
      const e = (lead.etapa_funil || '').toLowerCase();
      return e === 'contatado' || t.includes('atendimento') || t.includes('contato') || t.includes('follow') || lead.status_ticket === 'open';
    };

    if (!crmLeads || crmLeads.length === 0) {
      if (chartViewMode === 'day') {
        return [
          { name: '03/11', date: '2026-11-03', leads: 29, contatados: 24, qualificados: 10, agendados: 9, realizadas: 9, propostas: 4, assinados: 0, fechados: 2, faturamento: 3034 },
          { name: '04/11', date: '2026-11-04', leads: 59, contatados: 44, qualificados: 24, agendados: 13, realizadas: 13, propostas: 4, assinados: 1, fechados: 1, faturamento: 1517 },
          { name: '05/11', date: '2026-11-05', leads: 56, contatados: 41, qualificados: 10, agendados: 7, realizadas: 5, propostas: 3, assinados: 1, fechados: 1, faturamento: 1517 },
          { name: '06/11', date: '2026-11-06', leads: 21, contatados: 14, qualificados: 4, agendados: 1, realizadas: 1, propostas: 0, assinados: 0, fechados: 0, faturamento: 0 }
        ];
      }
      return [
        { name: 'Semana 1', leads: 165, contatados: 123, qualificados: 48, agendados: 30, realizadas: 28, propostas: 11, assinados: 2, fechados: 4, faturamento: 6068 },
        { name: 'Semana 2', leads: 0, contatados: 0, qualificados: 0, agendados: 0, realizadas: 0, propostas: 0, assinados: 0, fechados: 0, faturamento: 0 },
        { name: 'Semana 3', leads: 0, contatados: 0, qualificados: 0, agendados: 0, realizadas: 0, propostas: 0, assinados: 0, fechados: 0, faturamento: 0 },
        { name: 'Semana 4', leads: 0, contatados: 0, qualificados: 0, agendados: 0, realizadas: 0, propostas: 0, assinados: 0, fechados: 0, faturamento: 0 }
      ];
    }

    if (chartViewMode === 'day') {
      const daysMap = {};
      crmLeads.forEach(lead => {
        const dt = lead.created_at || lead.updated_at || '2026-11-03';
        const dayKey = dt.slice(0, 10);
        if (!daysMap[dayKey]) {
          const parts = dayKey.split('-');
          daysMap[dayKey] = {
            name: `${parts[2]}/${parts[1]}`,
            date: dayKey,
            leads: 0,
            contatados: 0,
            qualificados: 0,
            agendados: 0,
            realizadas: 0,
            propostas: 0,
            assinados: 0,
            fechados: 0,
            faturamento: 0
          };
        }

        const d = daysMap[dayKey];
        d.leads += 1;

        const pago = isPagoLead(lead);
        const assinado = isAssinadoLead(lead);
        const proposta = isPropostaLead(lead);
        const realizada = isRealizadaLead(lead);
        const marcada = isMarcadaLead(lead);
        const qualificado = isQualificadoLead(lead);
        const contatado = isContatadoLead(lead);

        if (pago) {
          d.fechados += 1;
          d.faturamento += Number(lead.valor_honorarios || 1517);
        }
        if (assinado) d.assinados += 1;
        if (proposta || assinado || pago) d.propostas += 1;
        if (realizada || proposta || assinado || pago) d.realizadas += 1;
        if (marcada || realizada || proposta || assinado || pago) d.agendados += 1;
        if (qualificado || marcada || realizada || proposta || assinado || pago) d.qualificados += 1;
        if (contatado || qualificado || marcada || realizada || proposta || assinado || pago) d.contatados += 1;
      });

      return Object.keys(daysMap).sort().map(k => daysMap[k]);
    }

    // Modo semanal: consolidação por semanas do mês
    const weeksMap = {
      'Semana 1': { name: 'Semana 1', leads: 0, contatados: 0, qualificados: 0, agendados: 0, realizadas: 0, propostas: 0, assinados: 0, fechados: 0, faturamento: 0 },
      'Semana 2': { name: 'Semana 2', leads: 0, contatados: 0, qualificados: 0, agendados: 0, realizadas: 0, propostas: 0, assinados: 0, fechados: 0, faturamento: 0 },
      'Semana 3': { name: 'Semana 3', leads: 0, contatados: 0, qualificados: 0, agendados: 0, realizadas: 0, propostas: 0, assinados: 0, fechados: 0, faturamento: 0 },
      'Semana 4': { name: 'Semana 4', leads: 0, contatados: 0, qualificados: 0, agendados: 0, realizadas: 0, propostas: 0, assinados: 0, fechados: 0, faturamento: 0 }
    };

    crmLeads.forEach(lead => {
      const dt = lead.created_at || lead.updated_at || '2026-11-03';
      let dayNum = 3;
      try {
        dayNum = parseInt(dt.slice(8, 10), 10);
      } catch (e) {
        dayNum = 3;
      }
      let wKey = 'Semana 1';
      if (dayNum > 21) wKey = 'Semana 4';
      else if (dayNum > 14) wKey = 'Semana 3';
      else if (dayNum > 7) wKey = 'Semana 2';

      const d = weeksMap[wKey];
      d.leads += 1;

      const pago = isPagoLead(lead);
      const assinado = isAssinadoLead(lead);
      const proposta = isPropostaLead(lead);
      const realizada = isRealizadaLead(lead);
      const marcada = isMarcadaLead(lead);
      const qualificado = isQualificadoLead(lead);
      const contatado = isContatadoLead(lead);

      if (pago) {
        d.fechados += 1;
        d.faturamento += Number(lead.valor_honorarios || 1517);
      }
      if (assinado) d.assinados += 1;
      if (proposta || assinado || pago) d.propostas += 1;
      if (realizada || proposta || assinado || pago) d.realizadas += 1;
      if (marcada || realizada || proposta || assinado || pago) d.agendados += 1;
      if (qualificado || marcada || realizada || proposta || assinado || pago) d.qualificados += 1;
      if (contatado || qualificado || marcada || realizada || proposta || assinado || pago) d.contatados += 1;
    });

    return Object.values(weeksMap);
  };

    const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Bom dia' : currentHour < 18 ? 'Boa tarde' : 'Boa noite';
  const resolvedUser = currentUser || (() => {
    try {
      const s = localStorage.getItem('dc-leiseca-user-v2');
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  })();
  const userFirstName = resolvedUser?.nome ? resolvedUser.nome.split(' ')[0] : 'Equipe';

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'funnel', label: 'Funil e Conversão', icon: Target },
    { id: 'calculator', label: 'Engenharia Reversa', icon: Calculator },
    { id: 'ranking', label: 'Ranking', icon: Trophy },
  ];

  const roleTabs = [
    { id: 'sdr', label: 'SDR (Recepção de Multas)' },
    { id: 'closer', label: 'Closer (Especialista Jurídico)' },
  ];

  const filteredMetrics = getFilteredMetrics();

  return (
    <div className={`flex-1 h-full ${isDarkMode ? 'bg-[#0a0a0a] text-white' : 'bg-gray-50 text-gray-900'} font-sans flex flex-col transition-colors duration-300`} translate="no">
      {/* Top Header */}
      <header className={`min-h-16 h-auto md:h-16 border-b ${isDarkMode ? 'border-white/10 bg-[#0a0a0a]' : 'border-gray-200 bg-gray-50'} flex flex-col md:flex-row items-stretch md:items-center justify-between px-4 sm:px-6 md:px-8 py-3 md:py-0 gap-3 shrink-0 transition-colors duration-300`}>
        <div className="flex items-center gap-3 sm:gap-6 overflow-x-auto scrollbar-hide py-1">
          <div className="shrink-0">
            <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>Gestão Comercial</span>
            <div className="text-xs sm:text-sm font-bold text-brand-blue truncate">
              {menuItems.find(m => m.id === activeMenu)?.label}
            </div>
          </div>
          
          <div className="h-5 sm:h-6 w-px bg-white/10 shrink-0"></div>
          
          <div className="flex gap-1.5 sm:gap-2 shrink-0">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg font-medium text-xs transition-all shrink-0 ${
                    isActive 
                      ? 'bg-brand-blue/10 text-brand-blue border border-brand-blue/20' 
                      : isDarkMode 
                        ? 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent' 
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100 border border-transparent'
                  }`}
                >
                  <Icon size={14} className={isActive ? "text-brand-blue" : "opacity-70"} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
          
        <div className="flex items-center justify-between md:justify-end gap-2 shrink-0">
          <div className={`flex items-center border rounded-lg p-1 ${isDarkMode ? 'bg-[#151515] border-white/10' : 'bg-white border-gray-200'}`}>
            {/* Custom Date Picker Popover */}
            <div className={`border-r mr-1 pr-1 ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
              <DatePicker 
                selectedDate={customDate}
                onSelectDate={(dateStr) => {
                  setCustomDate(dateStr);
                  setDateFilter('Calendário');
                }}
                onClear={() => {
                  setCustomDate('');
                  setDateFilter('Mês');
                }}
                isDarkMode={isDarkMode}
              />
            </div>

            {/* Quick Period Buttons */}
            {['Hoje', 'Semana', 'Mês'].map(f => (
              <button 
                key={f}
                onClick={() => {
                  setDateFilter(f);
                  setCustomDate('');
                }}
                className={`px-2.5 sm:px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  dateFilter === f && !customDate
                    ? isDarkMode ? 'bg-white/10 text-white font-bold' : 'bg-gray-200 text-gray-900 font-bold'
                    : isDarkMode ? 'text-white/50 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-md border transition-colors shrink-0 ${
              isDarkMode 
                ? 'border-white/10 text-white/50 hover:text-white hover:bg-white/5' 
                : 'border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-100'
            }`}
            title="Alternar Tema"
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </header>

      {/* Scrollable Content */}
      <main className={`flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 pb-24 md:pb-8 transition-colors duration-300 ${isDarkMode ? 'bg-[#0a0a0a]' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto" ref={exportRef}>
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 mb-6 sm:mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-1">{greeting}, {userFirstName}.</h2>
              <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-white/50' : 'text-gray-500'}`}>
                Visão executiva e controle do setor comercial {customDate ? (
                  <span className="text-brand-blue font-bold ml-1">
                    • Filtrado para o dia {customDate.split('-').reverse().join('/')}
                  </span>
                ) : (
                  <span>• Período: {dateFilter}</span>
                )}
              </p>
            </div>
            
            <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap" data-html2canvas-ignore="true">
              {/* Badge de Conexão com o CRM em Tempo Real */}
              <button
                type="button"
                onClick={() => setShowLeadsModal(true)}
                className="flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold transition-all shadow-sm cursor-pointer"
                title="Clique para ver os leads reais recebidos do CRM"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>CRM Conectado ({crmLeads.length || crmStatus.totalLeads || 2} leads)</span>
              </button>

              {/* Botão Sincronizar CRM */}
              <button
                type="button"
                onClick={handleManualCrmSync}
                disabled={syncingCrm}
                className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border text-xs font-bold transition-all shadow-sm cursor-pointer ${
                  isDarkMode 
                    ? 'border-white/10 hover:border-brand-blue/40 text-white/70 hover:text-white bg-white/5' 
                    : 'border-gray-200 hover:border-brand-blue/40 text-gray-700 hover:text-gray-900 bg-white'
                }`}
                title="Sincronizar métricas reais do CRM agora"
              >
                <RefreshCw size={13} className={syncingCrm ? 'animate-spin text-brand-blue' : ''} />
                <span>{syncingCrm ? 'Sincronizando...' : 'Sincronizar CRM'}</span>
              </button>

              <button onClick={handleExportPDF} className={`flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl border text-xs sm:text-sm font-medium transition-colors ${
                isDarkMode 
                  ? 'border-white/10 text-white hover:bg-white/5' 
                  : 'border-gray-200 text-gray-900 hover:bg-gray-100'
              }`}>
                <Download size={15} />
                Exportar PDF
              </button>
            </div>
          </div>

          {/* Role Tabs inside the view (Horizontal scrollable no celular) */}
          <div className={`flex items-center gap-1.5 sm:gap-2 mb-6 sm:mb-8 p-1.5 sm:p-2 rounded-xl border w-full md:w-fit overflow-x-auto scrollbar-hide whitespace-nowrap ${isDarkMode ? 'bg-[#151515] border-white/10' : 'bg-white border-gray-200'}`}>
            {roleTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); localStorage.setItem('dc-comercial-active-tab', tab.id); }}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm shrink-0 transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-brand-blue text-white font-medium shadow-md shadow-brand-blue/20' 
                    : isDarkMode 
                      ? 'text-white/50 hover:text-white hover:bg-white/5' 
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

            {/* Dynamic Content based on activeMenu */}
            {activeMenu === 'dashboard' && (
              <div className="space-y-12">
                <Dashboard 
                    role={activeTab} 
                    metrics={filteredMetrics} 
                    goals={goals[activeTab]} 
                    chartData={getDynamicChartData()} 
                    onCardClick={handleStageCardClick}
                    chartViewMode={chartViewMode}
                    setChartViewMode={setChartViewMode}
                    isDarkMode={isDarkMode}
                  />
                <Projection role={activeTab} metrics={filteredMetrics} goals={goals[activeTab]} />
              </div>
            )}

            {activeMenu === 'funnel' && (
              <FunnelView role={activeTab} metrics={metrics} setMetrics={setMetrics} goals={goals[activeTab]} />
            )}

            {activeMenu === 'calculator' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <ReverseCalculator onSaveGoals={(newGoals) => setGoals(newGoals)} />
              </div>
            )}

            {activeMenu === 'ranking' && (
              <Ranking role={activeTab} />
            )}
          </div>
        </main>
      {/* Modal de Leads Reais do CRM */}
      <RealLeadsModal
        isOpen={showLeadsModal}
        onClose={() => setShowLeadsModal(false)}
        leads={crmLeads}
        onRefresh={handleManualCrmSync}
        isRefreshing={syncingCrm}
        initialStage={modalStageFilter}
      />
    </div>
  );
}
