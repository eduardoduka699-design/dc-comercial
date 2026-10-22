import React, { useState, useEffect } from 'react';
import { 
  Megaphone, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  RotateCcw, 
  Calculator, 
  Download, 
  Calendar, 
  ArrowUpRight,
  Target,
  BarChart3,
  X,
  FileSpreadsheet
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';

// Dados históricos fiéis ao modelo da planilha de Assessoria - Tráfego Pago
const INITIAL_PLANILHA = [
  {
    id: 1,
    num: '1º Mês',
    mes: 'julho/2026',
    investimento: 4858.24,
    leads: 1124,
    reunioesMarcadas: 0,
    reunioesRealizadas: 100,
    vendas: 17,
    tkm: 1096.08,
    valorVendas: 18633.40,
    comparecimentosNota: '-'
  },
  {
    id: 2,
    num: '2º Mês',
    mes: 'agosto/2026',
    investimento: 4607.40,
    leads: 1017,
    reunioesMarcadas: 0,
    reunioesRealizadas: 84,
    vendas: 11,
    tkm: 1490.00,
    valorVendas: 16400.00,
    comparecimentosNota: '-'
  },
  {
    id: 3,
    num: '3º Mês',
    mes: 'setembro/2026',
    investimento: 4259.08,
    leads: 882,
    reunioesMarcadas: 0,
    reunioesRealizadas: 85,
    vendas: 11,
    tkm: 1050.00,
    valorVendas: 13124.10,
    comparecimentosNota: '-'
  },
  {
    id: 4,
    num: '4º Mês',
    mes: 'outubro/2026',
    investimento: 3051.13,
    leads: 567,
    reunioesMarcadas: 98,
    reunioesRealizadas: 71,
    vendas: 6,
    tkm: 1579.82,
    valorVendas: 9478.92,
    comparecimentosNota: '-'
  },
  {
    id: 5,
    num: '5º Mês',
    mes: 'novembro/2026',
    investimento: 0,
    leads: 0,
    reunioesMarcadas: 0,
    reunioesRealizadas: 0,
    vendas: 0,
    tkm: 0,
    valorVendas: 0,
    comparecimentosNota: '-'
  },
  {
    id: 6,
    num: '6º Mês',
    mes: 'dezembro/2026',
    investimento: 0,
    leads: 0,
    reunioesMarcadas: 0,
    reunioesRealizadas: 0,
    vendas: 0,
    tkm: 0,
    valorVendas: 0,
    comparecimentosNota: '-'
  }
];

export default function MarketingModule() {
  const [planilha, setPlanilha] = useState(() => {
    try {
      const saved = localStorage.getItem('dc-leiseca-mkt-planilha-v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Erro ao ler planilha salva:', e);
    }
    return INITIAL_PLANILHA;
  });

  const [editingRow, setEditingRow] = useState(null);
  const [activeView, setActiveView] = useState('tabela'); // 'tabela' ou 'graficos'

  useEffect(() => {
    try {
      localStorage.setItem('dc-leiseca-mkt-planilha-v2', JSON.stringify(planilha));
    } catch (e) {
      console.error('Erro ao salvar planilha no localStorage:', e);
    }
  }, [planilha]);

  // Cálculos automáticos para cada linha
  const calculateRow = (row) => {
    const inv = Number(row.investimento) || 0;
    const lds = Number(row.leads) || 0;
    const marcadas = Number(row.reunioesMarcadas) || 0;
    const realizadas = Number(row.reunioesRealizadas) || 0;
    const vnds = Number(row.vendas) || 0;
    
    // CPL = Investimento / Leads
    const cpl = lds > 0 ? inv / lds : 0;

    // Taxa de Agendamento = Reuniões Marcadas / Leads
    const taxaAgendamento = (lds > 0 && marcadas > 0) ? (marcadas / lds) * 100 : null;

    // Taxa de Comparecimento = Reuniões Realizadas / Reuniões Marcadas
    const taxaComparecimento = (marcadas > 0 && realizadas > 0) ? (realizadas / marcadas) * 100 : null;

    // Taxa de Venda = Vendas / Reuniões Realizadas (ou se não houver reuniões, Vendas / Leads)
    let taxaVenda = null;
    if (realizadas > 0 && vnds > 0) {
      taxaVenda = (vnds / realizadas) * 100;
    } else if (lds > 0 && vnds > 0) {
      taxaVenda = (vnds / lds) * 100;
    }

    // CAC = Investimento / Vendas
    const cac = vnds > 0 ? inv / vnds : 0;

    // Valor de Vendas e TKM
    let valVendas = Number(row.valorVendas) || 0;
    let tkm = Number(row.tkm) || 0;

    if (valVendas === 0 && vnds > 0 && tkm > 0) {
      valVendas = vnds * tkm;
    } else if (tkm === 0 && vnds > 0 && valVendas > 0) {
      tkm = valVendas / vnds;
    }

    // ROAS = Valor de Vendas / Investimento
    const roas = inv > 0 ? valVendas / inv : 0;

    return {
      ...row,
      investimento: inv,
      leads: lds,
      cpl,
      reunioesMarcadas: marcadas,
      taxaAgendamento,
      reunioesRealizadas: realizadas,
      taxaComparecimento,
      taxaVenda,
      vendas: vnds,
      cac,
      tkm,
      valorVendas: valVendas,
      roas
    };
  };

  const rowsCalculadas = planilha.map(calculateRow);

  // Totais e Médias Consolidadas
  const mesesComDados = rowsCalculadas.filter(r => r.investimento > 0 || r.leads > 0 || r.vendas > 0);
  const totalInvestimento = mesesComDados.reduce((acc, r) => acc + r.investimento, 0);
  const totalLeads = mesesComDados.reduce((acc, r) => acc + r.leads, 0);
  const totalReunioesMarcadas = mesesComDados.reduce((acc, r) => acc + r.reunioesMarcadas, 0);
  const totalReunioesRealizadas = mesesComDados.reduce((acc, r) => acc + r.reunioesRealizadas, 0);
  const totalVendas = mesesComDados.reduce((acc, r) => acc + r.vendas, 0);
  const totalFaturamento = mesesComDados.reduce((acc, r) => acc + r.valorVendas, 0);

  const cplMedioGeral = totalLeads > 0 ? totalInvestimento / totalLeads : 0;
  const cacMedioGeral = totalVendas > 0 ? totalInvestimento / totalVendas : 0;
  const tkmMedioGeral = totalVendas > 0 ? totalFaturamento / totalVendas : 0;
  const roasMedioGeral = totalInvestimento > 0 ? totalFaturamento / totalInvestimento : 0;
  const taxaAgendamentoGeral = totalLeads > 0 && totalReunioesMarcadas > 0 ? (totalReunioesMarcadas / totalLeads) * 100 : 0;
  const taxaComparecimentoGeral = totalReunioesMarcadas > 0 && totalReunioesRealizadas > 0 ? (totalReunioesRealizadas / totalReunioesMarcadas) * 100 : 0;
  const taxaVendaGeral = totalReunioesRealizadas > 0 && totalVendas > 0 ? (totalVendas / totalReunioesRealizadas) * 100 : 0;

  // Handlers de edição
  const handleOpenEdit = (row) => {
    setEditingRow({ ...row });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingRow) return;

    setPlanilha(prev => prev.map(r => r.id === editingRow.id ? editingRow : r));
    setEditingRow(null);
  };

  const handleAddRow = () => {
    const nextNum = planilha.length + 1;
    const newRow = {
      id: Date.now(),
      num: `${nextNum}º Mês`,
      mes: `mês ${nextNum}/2027`,
      investimento: 0,
      leads: 0,
      reunioesMarcadas: 0,
      reunioesRealizadas: 0,
      vendas: 0,
      tkm: 0,
      valorVendas: 0,
      comparecimentosNota: '-'
    };
    setPlanilha(prev => [...prev, newRow]);
  };

  const handleDeleteRow = (id) => {
    if (planilha.length <= 1) {
      alert('É necessário manter ao menos um mês na planilha.');
      return;
    }
    if (window.confirm('Tem certeza que deseja remover esta linha da planilha?')) {
      setPlanilha(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Deseja restaurar a planilha original de exemplo (julho a dezembro)?')) {
      setPlanilha(INITIAL_PLANILHA);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'Nº do Mês', 'Mês', 'Investimento', 'Leads Gerados', 'CPL',
      'Reuniões marcadas', 'Taxa de agendamento', 'Reuniões realizadas',
      'Taxa de comparecimento', 'Comparecimentos', 'Taxa de venda',
      'Vendas', 'CAC', 'TKM', 'Valor de Vendas', 'ROAS'
    ];

    const rows = rowsCalculadas.map(r => [
      r.num,
      r.mes,
      r.investimento.toFixed(2),
      r.leads,
      r.cpl.toFixed(2),
      r.reunioesMarcadas || '',
      r.taxaAgendamento ? `${r.taxaAgendamento.toFixed(2)}%` : '',
      r.reunioesRealizadas || '',
      r.taxaComparecimento ? `${r.taxaComparecimento.toFixed(2)}%` : '',
      r.comparecimentosNota || '-',
      r.taxaVenda ? `${r.taxaVenda.toFixed(2)}%` : '',
      r.vendas,
      r.cac.toFixed(2),
      r.tkm.toFixed(2),
      r.valorVendas.toFixed(2),
      r.roas.toFixed(2)
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + 
      [headers.join(';'), ...rows.map(e => e.join(';'))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Assessoria_Trafego_Pago_Consolidado.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Formatação Moeda
  const formatBRL = (val) => {
    return Number(val || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatNum = (val) => {
    return Number(val || 0).toLocaleString('pt-BR');
  };

  // Dados para os gráficos
  const chartData = rowsCalculadas
    .filter(r => r.investimento > 0 || r.valorVendas > 0)
    .map(r => ({
      name: r.mes.split('/')[0],
      investimento: Math.round(r.investimento),
      faturamento: Math.round(r.valorVendas),
      leads: r.leads,
      vendas: r.vendas,
      roas: Number(r.roas.toFixed(2)),
      cpl: Number(r.cpl.toFixed(2))
    }));

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex flex-col" translate="no">
      <main className="flex-1 w-full max-w-[1600px] mx-auto p-6 md:p-8 overflow-y-auto">
        
        {/* Cabeçalho da Página */}
        <div className="mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-[#f59e0b]/15 text-[#f59e0b] rounded-xl border border-[#f59e0b]/30">
                <FileSpreadsheet size={24} />
              </div>
              <h1 className="text-3xl font-display font-black tracking-tight text-white">
                Assessoria — Tráfego Pago
              </h1>
              <span className="text-xs px-3 py-1 rounded-full bg-[#f59e0b]/10 border border-[#f59e0b]/30 text-[#f59e0b] font-bold">
                Consolidado Mensal
              </span>
            </div>
            <p className="text-white/50 text-sm max-w-2xl">
              Acompanhamento mês a mês de investimento, captação de leads, agendamentos, comparecimento, vendas e ROAS.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Seletor Tabela / Gráficos */}
            <div className="flex bg-[#151515] p-1 rounded-xl border border-white/10 mr-2">
              <button
                type="button"
                onClick={() => setActiveView('tabela')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeView === 'tabela' 
                    ? 'bg-[#f59e0b] text-black shadow-md' 
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <FileSpreadsheet size={14} /> Planilha Completa
              </button>
              <button
                type="button"
                onClick={() => setActiveView('graficos')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeView === 'graficos' 
                    ? 'bg-brand-blue text-white shadow-md' 
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <BarChart3 size={14} /> Gráficos de Evolução
              </button>
            </div>

            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              title="Baixar planilha em formato CSV"
            >
              <Download size={14} />
              Exportar CSV
            </button>

            <button
              type="button"
              onClick={handleResetDefaults}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-white/50 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
              title="Restaurar dados de exemplo do print"
            >
              <RotateCcw size={14} />
              Restaurar
            </button>

            <button
              type="button"
              onClick={handleAddRow}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-black bg-[#f59e0b] hover:bg-[#eab308] shadow-lg shadow-[#f59e0b]/20 transition-all"
            >
              <Plus size={16} />
              Adicionar Mês
            </button>
          </div>
        </div>

        {/* Top Executive KPI Cards (Consolidado Geral) */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
          
          <div className="bg-[#151515] p-4 rounded-2xl border border-white/10 flex flex-col justify-between hover:border-[#f59e0b]/40 transition-colors">
            <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">Total Investido</span>
            <div className="my-2">
              <span className="text-xl md:text-2xl font-bold text-white tracking-tight">
                {formatBRL(totalInvestimento)}
              </span>
            </div>
            <span className="text-[10px] text-white/50">{mesesComDados.length} meses apurados</span>
          </div>

          <div className="bg-[#151515] p-4 rounded-2xl border border-white/10 flex flex-col justify-between hover:border-brand-blue/40 transition-colors">
            <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">Leads Gerados</span>
            <div className="my-2">
              <span className="text-xl md:text-2xl font-bold text-brand-blue tracking-tight">
                {formatNum(totalLeads)}
              </span>
            </div>
            <span className="text-[10px] text-white/50">Captação consolidada</span>
          </div>

          <div className="bg-[#151515] p-4 rounded-2xl border border-white/10 flex flex-col justify-between hover:border-purple-500/40 transition-colors">
            <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">CPL Médio</span>
            <div className="my-2">
              <span className="text-xl md:text-2xl font-bold text-purple-400 tracking-tight">
                {formatBRL(cplMedioGeral)}
              </span>
            </div>
            <span className="text-[10px] text-white/50">Custo por lead</span>
          </div>

          <div className="bg-[#151515] p-4 rounded-2xl border border-white/10 flex flex-col justify-between hover:border-cyan-500/40 transition-colors">
            <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">Reuniões</span>
            <div className="my-2">
              <span className="text-xl md:text-2xl font-bold text-cyan-400 tracking-tight">
                {formatNum(totalReunioesRealizadas)}
              </span>
            </div>
            <span className="text-[10px] text-white/50">{totalReunioesMarcadas ? `${totalReunioesMarcadas} marcadas` : 'Realizadas'}</span>
          </div>

          <div className="bg-[#151515] p-4 rounded-2xl border border-white/10 flex flex-col justify-between hover:border-[#10b981]/40 transition-colors">
            <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">Contratos Fechados</span>
            <div className="my-2">
              <span className="text-xl md:text-2xl font-bold text-[#10b981] tracking-tight">
                {formatNum(totalVendas)}
              </span>
            </div>
            <span className="text-[10px] text-white/50">Taxa venda: {taxaVendaGeral.toFixed(1)}%</span>
          </div>

          <div className="bg-[#151515] p-4 rounded-2xl border border-white/10 flex flex-col justify-between hover:border-amber-500/40 transition-colors">
            <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">CAC Médio</span>
            <div className="my-2">
              <span className="text-xl md:text-2xl font-bold text-amber-400 tracking-tight">
                {formatBRL(cacMedioGeral)}
              </span>
            </div>
            <span className="text-[10px] text-white/50">TKM: {formatBRL(tkmMedioGeral)}</span>
          </div>

          <div className="bg-[#151515] p-4 rounded-2xl border border-[#10b981]/30 bg-gradient-to-br from-[#10b981]/10 to-transparent flex flex-col justify-between hover:border-[#10b981] transition-colors">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#10b981]">ROAS Global</span>
            <div className="my-2 flex items-baseline gap-1">
              <span className="text-2xl md:text-3xl font-black text-[#10b981] tracking-tight">
                {roasMedioGeral.toFixed(2)}x
              </span>
            </div>
            <span className="text-[10px] text-[#10b981]/80 font-bold truncate">
              {formatBRL(totalFaturamento)} fat.
            </span>
          </div>

        </div>

        {/* View 1: Tabela Fiel ao Modelo da Planilha */}
        {activeView === 'tabela' && (
          <div className="bg-[#151515] border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in duration-300">
            
            {/* Banner Laranja do Cabeçalho da Planilha */}
            <div className="bg-[#f59e0b] px-6 py-3 text-black font-black text-center text-sm md:text-base tracking-wider uppercase shadow-inner flex items-center justify-center gap-2">
              <FileSpreadsheet size={18} />
              Assessoria — Tráfego Pago
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs whitespace-nowrap border-collapse">
                <thead>
                  <tr className="bg-[#d97706] text-black font-extrabold uppercase text-[11px] divide-x divide-black/20">
                    <th className="py-3 px-3">Nº do Mês</th>
                    <th className="py-3 px-3">Mês</th>
                    <th className="py-3 px-3 bg-[#b45309] text-white">Investimento</th>
                    <th className="py-3 px-3">Leads Gerados</th>
                    <th className="py-3 px-3 bg-[#b45309]/80 text-white">CPL</th>
                    <th className="py-3 px-3">Reuniões marcadas</th>
                    <th className="py-3 px-3">Taxa de agendamento</th>
                    <th className="py-3 px-3">Reuniões realizadas</th>
                    <th className="py-3 px-3">Taxa de comparecimento</th>
                    <th className="py-3 px-3">Comparecimentos</th>
                    <th className="py-3 px-3">Taxa de venda</th>
                    <th className="py-3 px-3 bg-[#10b981] text-white">Vendas</th>
                    <th className="py-3 px-3">CAC</th>
                    <th className="py-3 px-3">TKM</th>
                    <th className="py-3 px-3 bg-[#10b981] text-white">Valor de Vendas</th>
                    <th className="py-3 px-3 bg-black text-[#10b981]">ROAS</th>
                    <th className="py-3 px-2 bg-black/60 text-white/70">Ações</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/10">
                  {rowsCalculadas.map((row, idx) => {
                    const hasData = row.investimento > 0 || row.leads > 0 || row.vendas > 0;
                    const isEven = idx % 2 === 0;

                    return (
                      <tr 
                        key={row.id} 
                        className={`transition-colors hover:bg-white/10 group ${
                          isEven ? 'bg-[#101010]' : 'bg-[#151515]'
                        } ${!hasData ? 'opacity-40 hover:opacity-100' : ''}`}
                      >
                        {/* Nº do Mês */}
                        <td className="py-3.5 px-3 font-bold text-white/90">{row.num}</td>

                        {/* Mês */}
                        <td className="py-3.5 px-3 font-medium text-white/80">{row.mes}</td>

                        {/* Investimento */}
                        <td className="py-3.5 px-3 font-bold text-amber-300 bg-amber-500/5">
                          {row.investimento > 0 ? formatBRL(row.investimento) : '-'}
                        </td>

                        {/* Leads Gerados */}
                        <td className="py-3.5 px-3 font-bold text-brand-blue">
                          {row.leads > 0 ? formatNum(row.leads) : '-'}
                        </td>

                        {/* CPL */}
                        <td className="py-3.5 px-3 font-bold text-purple-300 bg-purple-500/5">
                          {row.cpl > 0 ? formatBRL(row.cpl) : '-'}
                        </td>

                        {/* Reuniões marcadas */}
                        <td className="py-3.5 px-3 text-white/70">
                          {row.reunioesMarcadas > 0 ? row.reunioesMarcadas : '-'}
                        </td>

                        {/* Taxa de agendamento */}
                        <td className="py-3.5 px-3 font-medium text-cyan-300">
                          {row.taxaAgendamento !== null ? `${row.taxaAgendamento.toFixed(2)}%` : '-'}
                        </td>

                        {/* Reuniões realizadas */}
                        <td className="py-3.5 px-3 font-semibold text-white/90">
                          {row.reunioesRealizadas > 0 ? row.reunioesRealizadas : '-'}
                        </td>

                        {/* Taxa de comparecimento */}
                        <td className="py-3.5 px-3 font-medium text-emerald-300">
                          {row.taxaComparecimento !== null ? `${row.taxaComparecimento.toFixed(2)}%` : '-'}
                        </td>

                        {/* Comparecimentos (Nota) */}
                        <td className="py-3.5 px-3 text-white/40">
                          {row.comparecimentosNota || '-'}
                        </td>

                        {/* Taxa de venda */}
                        <td className="py-3.5 px-3 font-bold text-yellow-300">
                          {row.taxaVenda !== null ? `${Math.round(row.taxaVenda)}%` : '-'}
                        </td>

                        {/* Vendas */}
                        <td className="py-3.5 px-3 font-bold text-[#10b981] bg-[#10b981]/10 text-sm">
                          {row.vendas > 0 ? row.vendas : '-'}
                        </td>

                        {/* CAC */}
                        <td className="py-3.5 px-3 font-medium text-orange-300">
                          {row.cac > 0 ? formatBRL(row.cac) : '-'}
                        </td>

                        {/* TKM */}
                        <td className="py-3.5 px-3 font-medium text-white/80">
                          {row.tkm > 0 ? formatBRL(row.tkm) : '-'}
                        </td>

                        {/* Valor de Vendas (Faturamento) */}
                        <td className="py-3.5 px-3 font-bold text-[#10b981] bg-[#10b981]/10">
                          {row.valorVendas > 0 ? formatBRL(row.valorVendas) : '-'}
                        </td>

                        {/* ROAS */}
                        <td className="py-3.5 px-3 font-black text-sm bg-black/60 text-[#10b981]">
                          {row.roas > 0 ? `${row.roas.toFixed(2)}` : '-'}
                        </td>

                        {/* Ações */}
                        <td className="py-3.5 px-2">
                          <div className="flex items-center justify-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(row)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-brand-blue/20 text-white/70 hover:text-brand-blue border border-white/5 hover:border-brand-blue/30 transition-colors"
                              title="Editar valores deste mês"
                            >
                              <Edit3 size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteRow(row.id)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/70 hover:text-red-400 border border-white/5 hover:border-red-500/30 transition-colors"
                              title="Excluir este mês"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

                {/* Rodapé Consolidado com Totais e Médias */}
                <tfoot>
                  <tr className="bg-gradient-to-r from-[#1a1a1a] via-[#202020] to-[#1a1a1a] border-t-2 border-[#f59e0b] font-bold text-white text-xs divide-x divide-white/5 shadow-2xl">
                    <td className="py-4 px-3 text-[#f59e0b] font-black uppercase tracking-wider text-left pl-4" colSpan={2}>
                      Total Consolidado
                    </td>
                    <td className="py-4 px-3 text-amber-300 font-extrabold bg-amber-500/10">
                      {formatBRL(totalInvestimento)}
                    </td>
                    <td className="py-4 px-3 text-brand-blue font-extrabold">
                      {formatNum(totalLeads)}
                    </td>
                    <td className="py-4 px-3 text-purple-300 font-extrabold bg-purple-500/10">
                      {formatBRL(cplMedioGeral)}
                    </td>
                    <td className="py-4 px-3 text-white/80">
                      {totalReunioesMarcadas || '-'}
                    </td>
                    <td className="py-4 px-3 text-cyan-300">
                      {taxaAgendamentoGeral > 0 ? `${taxaAgendamentoGeral.toFixed(2)}%` : '-'}
                    </td>
                    <td className="py-4 px-3 text-white font-extrabold">
                      {totalReunioesRealizadas || '-'}
                    </td>
                    <td className="py-4 px-3 text-emerald-300">
                      {taxaComparecimentoGeral > 0 ? `${taxaComparecimentoGeral.toFixed(2)}%` : '-'}
                    </td>
                    <td className="py-4 px-3 text-white/30">-</td>
                    <td className="py-4 px-3 text-yellow-300">
                      {taxaVendaGeral > 0 ? `${Math.round(taxaVendaGeral)}%` : '-'}
                    </td>
                    <td className="py-4 px-3 text-[#10b981] font-black bg-[#10b981]/20 text-sm">
                      {formatNum(totalVendas)}
                    </td>
                    <td className="py-4 px-3 text-orange-300">
                      {formatBRL(cacMedioGeral)}
                    </td>
                    <td className="py-4 px-3 text-white/90">
                      {formatBRL(tkmMedioGeral)}
                    </td>
                    <td className="py-4 px-3 text-[#10b981] font-black bg-[#10b981]/20 text-sm">
                      {formatBRL(totalFaturamento)}
                    </td>
                    <td className="py-4 px-3 text-[#10b981] font-black bg-black text-sm">
                      {roasMedioGeral.toFixed(2)}x
                    </td>
                    <td className="py-4 px-2 bg-black/40">-</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="p-4 bg-[#101010] border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-white/40">
              <p>
                💡 <strong>Dica:</strong> Clique no ícone de lápis para editar qualquer mês. O CPL, Taxas, CAC, Faturamento e ROAS são calculados automaticamente.
              </p>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]"></div> Investimento</span>
                <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-brand-blue"></div> Leads</span>
                <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></div> Faturamento / ROAS</span>
              </div>
            </div>
          </div>
        )}

        {/* View 2: Gráficos de Evolução Mês a Mês */}
        {activeView === 'graficos' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Gráfico 1: Investimento vs Faturamento */}
              <div className="bg-[#151515] p-6 rounded-2xl border border-white/10">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="font-bold text-white text-base">Investimento vs. Faturamento (Vendas)</h3>
                    <p className="text-xs text-white/40 mt-0.5">Comparativo financeiro mensal</p>
                  </div>
                  <span className="text-xs font-bold text-[#10b981] bg-[#10b981]/10 px-2.5 py-1 rounded-full border border-[#10b981]/30">
                    ROAS Médio: {roasMedioGeral.toFixed(2)}x
                  </span>
                </div>
                
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                      <XAxis dataKey="name" stroke="#ffffff40" fontSize={11} />
                      <YAxis stroke="#ffffff40" fontSize={11} tickFormatter={(v) => `R$${v/1000}k`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#101010', borderColor: '#ffffff20', borderRadius: '12px' }}
                        formatter={(val) => formatBRL(val)}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                      <Bar dataKey="investimento" name="Investimento (R$)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="faturamento" name="Faturamento Vendas (R$)" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Gráfico 2: Evolução do ROAS & CPL */}
              <div className="bg-[#151515] p-6 rounded-2xl border border-white/10">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="font-bold text-white text-base">Curva de Eficiência (ROAS & CPL)</h3>
                    <p className="text-xs text-white/40 mt-0.5">Retorno de investimento e custo por lead</p>
                  </div>
                  <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/30">
                    CPL Médio: {formatBRL(cplMedioGeral)}
                  </span>
                </div>

                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                      <XAxis dataKey="name" stroke="#ffffff40" fontSize={11} />
                      <YAxis yAxisId="left" stroke="#ffffff40" fontSize={11} tickFormatter={(v) => `${v}x`} />
                      <YAxis yAxisId="right" orientation="right" stroke="#ffffff40" fontSize={11} tickFormatter={(v) => `R$${v}`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#101010', borderColor: '#ffffff20', borderRadius: '12px' }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                      <Line yAxisId="left" type="monotone" dataKey="roas" name="ROAS (Multiplicador)" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} />
                      <Line yAxisId="right" type="monotone" dataKey="cpl" name="CPL (R$)" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* Modal de Edição de Mês da Planilha */}
      {editingRow && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
          onClick={() => setEditingRow(null)}
        >
          <div 
            className="bg-[#151515] border border-white/10 rounded-2xl p-6 md:p-8 max-w-2xl w-full shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#f59e0b]/15 text-[#f59e0b] rounded-xl border border-[#f59e0b]/30">
                  <Edit3 size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-white">Editar Dados — {editingRow.num}</h3>
                  <p className="text-xs text-white/50">Altere os números deste mês. As taxas e o ROAS calculam automaticamente.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditingRow(null)}
                className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-white/60 uppercase tracking-wider mb-1.5 block">
                    Nº do Mês
                  </label>
                  <input
                    type="text"
                    required
                    value={editingRow.num}
                    onChange={e => setEditingRow({ ...editingRow, num: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#f59e0b]"
                    placeholder="Ex: 1º Mês"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-white/60 uppercase tracking-wider mb-1.5 block">
                    Mês / Ano
                  </label>
                  <input
                    type="text"
                    required
                    value={editingRow.mes}
                    onChange={e => setEditingRow({ ...editingRow, mes: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#f59e0b]"
                    placeholder="Ex: julho/2026"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-3">
                <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">Tráfego & Leads</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-white/60 uppercase tracking-wider mb-1.5 block">
                      Investimento em Anúncios (R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={editingRow.investimento}
                      onChange={e => setEditingRow({ ...editingRow, investimento: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-2.5 text-amber-300 font-bold focus:outline-none focus:border-amber-400 text-base"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-white/60 uppercase tracking-wider mb-1.5 block">
                      Leads Gerados (Contatos)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editingRow.leads}
                      onChange={e => setEditingRow({ ...editingRow, leads: parseInt(e.target.value, 10) || 0 })}
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-2.5 text-brand-blue font-bold focus:outline-none focus:border-brand-blue text-base"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20 space-y-3">
                <p className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Agendamento & Reuniões</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-white/60 uppercase tracking-wider mb-1.5 block">
                      Reuniões Marcadas
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editingRow.reunioesMarcadas || 0}
                      onChange={e => setEditingRow({ ...editingRow, reunioesMarcadas: parseInt(e.target.value, 10) || 0 })}
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-2.5 text-white font-bold focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-white/60 uppercase tracking-wider mb-1.5 block">
                      Reuniões Realizadas
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editingRow.reunioesRealizadas || 0}
                      onChange={e => setEditingRow({ ...editingRow, reunioesRealizadas: parseInt(e.target.value, 10) || 0 })}
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-2.5 text-white font-bold focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-3">
                <p className="text-xs font-bold text-[#10b981] uppercase tracking-wider">Vendas & Faturamento</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-white/60 uppercase tracking-wider mb-1.5 block">
                      Vendas Fechadas
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editingRow.vendas || 0}
                      onChange={e => setEditingRow({ ...editingRow, vendas: parseInt(e.target.value, 10) || 0 })}
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-2.5 text-[#10b981] font-bold focus:outline-none focus:border-[#10b981] text-base"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-white/60 uppercase tracking-wider mb-1.5 block">
                      TKM (Ticket Médio R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={editingRow.tkm || 0}
                      onChange={e => setEditingRow({ ...editingRow, tkm: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-2.5 text-white font-bold focus:outline-none focus:border-[#10b981]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-white/60 uppercase tracking-wider mb-1.5 block">
                      Valor de Vendas (R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={editingRow.valorVendas || 0}
                      onChange={e => setEditingRow({ ...editingRow, valorVendas: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-2.5 text-[#10b981] font-bold focus:outline-none focus:border-[#10b981]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingRow(null)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#f59e0b] hover:bg-[#eab308] text-black font-extrabold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#f59e0b]/20"
                >
                  <Check size={18} /> Salvar Alterações
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
