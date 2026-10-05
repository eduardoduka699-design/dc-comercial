import { useState, useEffect, useRef } from 'react';
import { Target, TrendingUp, Users, Bell, Sun, Moon, Calendar as CalendarIcon, Download, LayoutDashboard, Database, Trophy, Calculator, LogOut, ArrowLeft } from 'lucide-react';
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
    if (dateFilter === 'Hoje' || customDate) multiplier = 0.05; 
    if (dateFilter === 'Semana') multiplier = 0.25; 
    
    const funnelType = localStorage.getItem('dc-leiseca-funnel-type') || 'com_reuniao';
    const adjusted = { ...metrics };
    const current = adjusted[activeTab];
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

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'funnel', label: 'Funil e Conversão', icon: Calculator },
    { id: 'ranking', label: 'Ranking', icon: Trophy },
  ];

  const roleTabs = [
    { id: 'sdr', label: 'SDR (Recepção de Multas)' },
    { id: 'bdr', label: 'BDR (Prospecção Ativa)' },
    { id: 'closer', label: 'Closer (Especialista Jurídico)' },
  ];

  const filteredMetrics = getFilteredMetrics();

  return (
    <div className={`flex-1 h-full ${isDarkMode ? 'bg-[#0a0a0a] text-white' : 'bg-gray-50 text-gray-900'} font-sans flex flex-col transition-colors duration-300`} translate="no">
      {/* Top Header */}
      <header className={`h-16 border-b ${isDarkMode ? 'border-white/10 bg-[#0a0a0a]' : 'border-gray-200 bg-gray-50'} flex items-center justify-between px-8 shrink-0 transition-colors duration-300`}>
        <div className="flex items-center gap-6">
          <div>
            <span className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>Gestão Comercial</span>
            <div className="text-sm font-bold text-brand-blue">
              {menuItems.find(m => m.id === activeMenu)?.label}
            </div>
          </div>
          
          <div className="h-6 w-px bg-white/10 mx-2"></div>
          
          <div className="flex gap-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium text-xs transition-all ${
                    isActive 
                      ? 'bg-brand-blue/10 text-brand-blue border border-brand-blue/20' 
                      : isDarkMode 
                        ? 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent' 
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100 border border-transparent'
                  }`}
                >
                  <Icon size={14} className={isActive ? "text-brand-blue" : "opacity-70"} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
          
          <div className="flex items-center gap-3">
            <div className={`flex items-center border rounded-lg p-1 mr-4 ${isDarkMode ? 'bg-[#151515] border-white/10' : 'bg-white border-gray-200'}`}>
              <div className={`flex px-2 py-1 items-center border-r mr-2 ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                <CalendarIcon size={14} className={`mr-2 ${isDarkMode ? 'text-white/50' : 'text-gray-400'}`} />
                <input 
                  type="date" 
                  value={customDate}
                  onChange={(e) => {
                    setCustomDate(e.target.value);
                    setDateFilter('Calendário');
                  }}
                  className={`bg-transparent text-xs focus:outline-none ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                />
              </div>
              {['Hoje', 'Semana', 'Mês'].map(f => (
                <button 
                  key={f}
                  onClick={() => {
                    setDateFilter(f);
                    setCustomDate('');
                  }}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    dateFilter === f 
                      ? isDarkMode ? 'bg-white/10 text-white' : 'bg-gray-200 text-gray-900'
                      : isDarkMode ? 'text-white/50 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-md border transition-colors ${
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
        <main className={`flex-1 overflow-y-auto p-8 transition-colors duration-300 ${isDarkMode ? 'bg-[#0a0a0a]' : 'bg-gray-50'}`}>
          <div className="max-w-7xl mx-auto" ref={exportRef}>
            {/* Page Header */}
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-1">Boa tarde, Equipe.</h2>
                <p className={`text-sm ${isDarkMode ? 'text-white/50' : 'text-gray-500'}`}>Visão executiva e controle do setor comercial.</p>
              </div>
              
              <div className="flex gap-3" data-html2canvas-ignore="true">
                <button onClick={handleExportPDF} className={`flex items-center gap-2 px-4 py-2 rounded-md border text-sm font-medium transition-colors ${
                  isDarkMode 
                    ? 'border-white/10 text-white hover:bg-white/5' 
                    : 'border-gray-200 text-gray-900 hover:bg-gray-100'
                }`}>
                  <Download size={16} />
                  Exportar PDF
                </button>
              </div>
            </div>

            {/* Role Tabs inside the view */}
            <div className={`flex items-center gap-2 mb-8 p-2 rounded-xl border w-fit ${isDarkMode ? 'bg-[#151515] border-white/10' : 'bg-white border-gray-200'}`}>
              {roleTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                    activeTab === tab.id 
                      ? 'bg-brand-blue text-white font-medium' 
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
                <Dashboard role={activeTab} metrics={filteredMetrics} goals={goals[activeTab]} chartData={activeTab === 'closer' ? closerChartData : activeTab === 'sdr' ? sdrChartData : bdrChartData} />
                <Projection role={activeTab} metrics={filteredMetrics} goals={goals[activeTab]} />
              </div>
            )}

            {activeMenu === 'funnel' && (
              <FunnelView role={activeTab} metrics={metrics} setMetrics={setMetrics} />
            )}

            {activeMenu === 'ranking' && (
              <Ranking role={activeTab} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
