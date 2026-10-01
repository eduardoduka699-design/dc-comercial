import { useState, useEffect, useRef } from 'react';
import { Target, TrendingUp, Users, Settings, Bell, Sun, Moon, Calendar as CalendarIcon, Download, LayoutDashboard, Database, Trophy, Link2, Calculator, LogOut, ArrowLeft } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import FunnelView from '../components/FunnelView';
import Projection from '../components/Projection';
import Ranking from '../components/Ranking';
import ReverseCalculator from '../components/ReverseCalculator';
import { defaultGoals, baseMetrics, sdrChartData, bdrChartData, closerChartData } from '../data/mockData';

export default function ComercialModule() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('sdr');
  const [dateFilter, setDateFilter] = useState('Mês'); 
  const [customDate, setCustomDate] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const exportRef = useRef(null);
  
  const [goals, setGoals] = useState(() => {
    // Clear old storage because keys changed
    const saved = localStorage.getItem('dc-leiseca-goals');
    return saved ? JSON.parse(saved) : defaultGoals;
  });

  const [metrics, setMetrics] = useState(() => {
    const saved = localStorage.getItem('dc-leiseca-metrics');
    return saved ? JSON.parse(saved) : baseMetrics;
  });

  useEffect(() => {
    localStorage.setItem('dc-leiseca-goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('dc-leiseca-metrics', JSON.stringify(metrics));
  }, [metrics]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleGoalChange = (role, metric, value) => {
    setGoals(prev => ({
      ...prev,
      [role]: { ...prev[role], [metric]: Number(value) }
    }));
  };

  const handleSaveCalculatorGoals = (newGoals) => {
    setGoals(newGoals);
  };

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
      pdf.save(`Relatorio_LeiSeca_${dateFilter}_${activeTab.toUpperCase()}.pdf`);
    } catch (err) {
      console.error('Erro ao gerar PDF', err);
    }
  };

  const getFilteredMetrics = () => {
    let multiplier = 1;
    if (dateFilter === 'Hoje' || customDate) multiplier = 0.05; // Simulate 1 day (1/20 of month)
    if (dateFilter === 'Semana') multiplier = 0.25; // Simulate 1 week
    
    const adjusted = { ...metrics };
    const current = adjusted[activeTab];
    const newMetrics = {};
    Object.keys(current).forEach(k => {
      if (k.includes('honorarios') || k.includes('Ticket')) {
        newMetrics[k] = current[k]; // Averages don't multiply
      } else {
        newMetrics[k] = Math.max(0, Math.floor(current[k] * multiplier));
      }
    });
    return newMetrics;
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'funnel', label: 'Funil Lei Seca', icon: Calculator },
    { id: 'ranking', label: 'Ranking', icon: Trophy },
  ];

  const roleTabs = [
    { id: 'sdr', label: 'SDR (Recepção de Multas)' },
    { id: 'bdr', label: 'BDR (Prospecção Ativa)' },
    { id: 'closer', label: 'Closer (Especialista Jurídico)' },
  ];

  const filteredMetrics = getFilteredMetrics();

  return (
    <div className="min-h-screen bg-bg-main text-text-main font-sans flex transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-border bg-bg-sidebar flex flex-col transition-colors duration-300">
        <div className="p-6 flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-gradient-to-br from-brand-blue to-blue-600 rounded-lg flex items-center justify-center font-display font-bold text-white text-xl shadow-lg shadow-brand-blue/20">
            DC
          </div>
          <div>
            <h1 className="font-display font-bold text-lg tracking-tight text-text-main leading-tight">DC Comercial</h1>
            <span className="text-[10px] text-text-muted tracking-widest uppercase font-medium flex items-center gap-1"><ArrowLeft size={10} /> Voltar ao Hub</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-sm transition-all ${
                  isActive 
                    ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/20' 
                    : 'text-text-muted hover:text-text-main hover:bg-border/30'
                }`}
              >
                <Icon size={18} className={isActive ? "text-white" : "text-text-muted"} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <button 
            onClick={() => setActiveMenu('settings')}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-sm transition-all ${
              activeMenu === 'settings'
                ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/20' 
                : 'text-text-muted hover:text-text-main hover:bg-border/30'
            }`}
          >
            <Settings size={18} className={activeMenu === 'settings' ? "text-white" : "text-text-muted"} />
            Configurações
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-border bg-bg-main flex items-center justify-between px-8 shrink-0 transition-colors duration-300">
          <div>
            <span className="text-xs text-text-muted">Espaço de trabalho</span>
            <div className="text-sm font-semibold text-text-main">
              {activeMenu === 'settings' ? 'Configurações do Sistema' : menuItems.find(m => m.id === activeMenu)?.label}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-bg-card border border-border rounded-lg p-1 mr-4">
              <div className="flex px-2 py-1 items-center border-r border-border mr-2">
                <CalendarIcon size={14} className="text-text-muted mr-2" />
                <input 
                  type="date" 
                  value={customDate}
                  onChange={(e) => {
                    setCustomDate(e.target.value);
                    setDateFilter('Calendário');
                  }}
                  className="bg-transparent text-xs text-text-main focus:outline-none"
                />
              </div>
              {['Hoje', 'Semana', 'Mês'].map(f => (
                <button 
                  key={f}
                  onClick={() => {
                    setDateFilter(f);
                    setCustomDate('');
                  }}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${dateFilter === f ? 'bg-border text-text-main' : 'text-text-muted hover:text-text-main'}`}
                >
                  {f}
                </button>
              ))}
            </div>
            
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-md border border-border text-text-muted hover:text-text-main hover:bg-border/30 transition-colors"
              title="Alternar Tema"
            >
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto bg-bg-main p-8 transition-colors duration-300">
          <div className="max-w-7xl mx-auto" ref={exportRef}>
            {/* Page Header */}
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-1 text-text-main">Boa tarde, Equipe.</h2>
                <p className="text-text-muted text-sm">Visão executiva e controle do setor comercial.</p>
              </div>
              
              {activeMenu !== 'settings' && activeMenu !== 'data' && (
                <div className="flex gap-3" data-html2canvas-ignore="true">
                  <button onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2 rounded-md border border-border text-sm text-text-main hover:bg-border/30 transition-colors font-medium">
                    <Download size={16} />
                    Exportar PDF
                  </button>
                </div>
              )}
            </div>

            {activeMenu === 'settings' ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-bg-card p-8 rounded-xl border border-border">
                  <div className="flex items-center gap-2 mb-8 text-text-main">
                    <Settings size={24} className="text-brand-blue" />
                    <h2 className="text-xl font-bold">Configurações e Integrações</h2>
                  </div>
                  <p className="text-text-muted mb-8">Gerencie as conexões do seu painel com outras ferramentas do ecossistema de vendas.</p>
                  
                  <div className="space-y-4">
                    {['HubSpot CRM', 'Pipedrive', 'RD Station Marketing', 'Salesforce'].map(crm => (
                      <div key={crm} className="flex items-center justify-between p-4 border border-border rounded-lg bg-bg-main">
                        <div className="flex items-center gap-3">
                          <Link2 size={20} className="text-text-muted" />
                          <div>
                            <p className="font-bold text-text-main">{crm}</p>
                            <p className="text-xs text-text-muted">Não conectado</p>
                          </div>
                        </div>
                        <button className="px-4 py-2 text-sm border border-border rounded-md hover:bg-brand-blue hover:text-white hover:border-brand-blue transition-colors">
                          Conectar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Role Tabs inside the view */}
                <div className="flex items-center gap-2 mb-8 bg-bg-card p-2 rounded-xl border border-border w-fit">
                  {roleTabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                        activeTab === tab.id 
                          ? 'bg-brand-blue text-white font-medium' 
                          : 'text-text-muted hover:text-text-main hover:bg-border/30'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Dynamic Content based on activeMenu */}
                {activeMenu === 'dashboard' && (
                  <div className="space-y-12">
                    <Dashboard role={activeTab} metrics={filteredMetrics} goals={goals[activeTab]} chartData={activeTab === 'closer' ? closerChartData : activeTab === 'sdr' ? sdrChartData : bdrChartData} />
                    <Projection role={activeTab} metrics={filteredMetrics} goals={goals[activeTab]} />
                  </div>
                )}

                {activeMenu === 'funnel' && (
                  <FunnelView role={activeTab} />
                )}

                {activeMenu === 'ranking' && (
                  <Ranking role={activeTab} />
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
