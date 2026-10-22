import React, { useState, useEffect } from 'react';
import { 
  Megaphone, 
  TrendingUp, 
  Users, 
  DollarSign, 
  MousePointerClick, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  RotateCcw,
  Calculator,
  Layers,
  Sparkles
} from 'lucide-react';

export default function MarketingModule() {
  const [isEditing, setIsEditing] = useState(false);

  const defaultCampanhas = [
    { id: 1, nome: '[META] Conversão - Lei Seca Urgente', plataforma: 'Meta Ads', investido: 4500, leads: 135 },
    { id: 2, nome: '[GOOGLE] Pesquisa - Advogado Lei Seca', plataforma: 'Google Ads', investido: 6000, leads: 140 },
    { id: 3, nome: '[META] Remarketing - Casos Qualificados', plataforma: 'Meta Ads', investido: 2000, leads: 45 },
  ];

  const defaultConfig = {
    vendas: 15,
    ticket: 3500,
    modoCalculo: 'campanhas', // 'campanhas' (soma automática) ou 'manual'
    manualInvestimento: 12500,
    manualLeads: 320
  };

  const [campanhas, setCampanhas] = useState(() => {
    try {
      const saved = localStorage.getItem('dc-leiseca-mkt-campanhas');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultCampanhas;
    } catch {
      return defaultCampanhas;
    }
  });

  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('dc-leiseca-mkt-config');
      const parsed = saved ? JSON.parse(saved) : null;
      return parsed && typeof parsed === 'object' ? { ...defaultConfig, ...parsed } : defaultConfig;
    } catch {
      return defaultConfig;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('dc-leiseca-mkt-campanhas', JSON.stringify(campanhas));
    } catch (e) {
      console.error(e);
    }
  }, [campanhas]);

  useEffect(() => {
    try {
      localStorage.setItem('dc-leiseca-mkt-config', JSON.stringify(config));
    } catch (e) {
      console.error(e);
    }
  }, [config]);

  // Edição das campanhas
  const handleCampaignChange = (id, field, value) => {
    setCampanhas(prev => (Array.isArray(prev) ? prev : defaultCampanhas).map(c => {
      if (c.id === id) {
        if (field === 'investido' || field === 'leads') {
          return { ...c, [field]: parseFloat(value) || 0 };
        }
        return { ...c, [field]: value };
      }
      return c;
    }));
  };

  const handleAddCampaign = () => {
    const list = Array.isArray(campanhas) ? campanhas : [];
    const newCamp = {
      id: Date.now(),
      nome: `Nova Campanha ${list.length + 1}`,
      plataforma: 'Meta Ads',
      investido: 1000,
      leads: 30
    };
    setCampanhas([...list, newCamp]);
  };

  const handleDeleteCampaign = (id) => {
    const list = Array.isArray(campanhas) ? campanhas : [];
    if (list.length <= 1) {
      alert('É necessário manter ao menos uma campanha na lista.');
      return;
    }
    setCampanhas(list.filter(c => c.id !== id));
  };

  const handleConfigChange = (field, value) => {
    setConfig(prev => ({
      ...defaultConfig,
      ...(prev || {}),
      [field]: parseFloat(value) || 0
    }));
  };

  const handleResetDefaults = () => {
    if (window.confirm('Deseja restaurar os dados de exemplo originais?')) {
      setCampanhas(defaultCampanhas);
      setConfig(defaultConfig);
    }
  };

  // Safe references
  const safeCampanhas = Array.isArray(campanhas) ? campanhas : defaultCampanhas;
  const safeConfig = { ...defaultConfig, ...(config || {}) };

  // Cálculos Automáticos e Invisíveis
  const somaInvestimento = safeCampanhas.reduce((acc, c) => acc + (Number(c.investido) || 0), 0);
  const somaLeads = safeCampanhas.reduce((acc, c) => acc + (Number(c.leads) || 0), 0);

  const totalInvestimento = safeConfig.modoCalculo === 'campanhas' ? somaInvestimento : (Number(safeConfig.manualInvestimento) || 0);
  const totalLeads = safeConfig.modoCalculo === 'campanhas' ? somaLeads : (Number(safeConfig.manualLeads) || 0);

  const cpl = totalLeads > 0 ? totalInvestimento / totalLeads : 0;
  const vendasCount = Number(safeConfig.vendas) || 0;
  const ticketValue = Number(safeConfig.ticket) || 0;
  const cac = vendasCount > 0 ? totalInvestimento / vendasCount : 0;
  const faturamento = vendasCount * ticketValue;
  const roas = totalInvestimento > 0 ? faturamento / totalInvestimento : 0;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex flex-col" translate="no">
      <main className="flex-1 w-full max-w-7xl mx-auto p-8 overflow-y-auto">
        
        {/* Cabeçalho da Página */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h2 className="text-3xl font-display font-black mb-2 flex items-center gap-3">
              Inteligência de Tráfego
              <span className="text-xs px-2.5 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/30 text-brand-blue font-semibold">
                Controle Manual & Fórmulas
              </span>
            </h2>
            <p className="text-white/50 max-w-2xl text-sm">
              Acompanhamento detalhado do funil de marketing, investimento, CPL, CAC e ROAS.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isEditing && (
              <button 
                onClick={handleResetDefaults}
                title="Restaurar dados de exemplo"
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-white/50 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
              >
                <RotateCcw size={14} />
                Restaurar Padrão
              </button>
            )}

            <button 
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
                isEditing 
                  ? 'bg-[#10b981] text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:brightness-110' 
                  : 'bg-brand-blue text-white shadow-[0_0_15px_rgba(0,112,243,0.3)] hover:brightness-110'
              }`}
            >
              {isEditing ? (
                <>
                  <Check size={18} />
                  Salvar Alterações
                </>
              ) : (
                <>
                  <Edit3 size={18} />
                  Editar Números Manuais
                </>
              )}
            </button>
          </div>
        </div>

        {/* Banner de Modo de Edição Ativo */}
        {isEditing && (
          <div className="bg-[#151515] border border-brand-blue/30 rounded-2xl p-6 mb-8 animate-in fade-in space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-brand-blue" />
                <h4 className="font-bold text-white text-sm">Modo de Edição Ativado</h4>
                <span className="text-xs text-white/40">— Os valores digitados recalculam as métricas instantaneamente</span>
              </div>

              {/* Seletor de Modo de Cálculo */}
              <div className="flex items-center gap-2 bg-[#0a0a0a] p-1 rounded-xl border border-white/10 text-xs">
                <button
                  onClick={() => setConfig(prev => ({ ...prev, modoCalculo: 'campanhas' }))}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    safeConfig.modoCalculo === 'campanhas' 
                      ? 'bg-brand-blue text-white font-bold' 
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  Somar pelas Campanhas
                </button>
                <button
                  onClick={() => setConfig(prev => ({ ...prev, modoCalculo: 'manual' }))}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    safeConfig.modoCalculo === 'manual' 
                      ? 'bg-brand-blue text-white font-bold' 
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  Digitar Totais Diretos
                </button>
              </div>
            </div>

            {/* Inputs de Vendas e Ticket Médio */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-white/60 uppercase mb-1">
                  Vendas Fechadas (Tráfego)
                </label>
                <input 
                  type="number" 
                  min="0"
                  value={safeConfig.vendas} 
                  onChange={(e) => handleConfigChange('vendas', e.target.value)} 
                  className="w-full bg-[#0a0a0a] border border-white/20 rounded-xl px-4 py-2 text-white font-bold focus:border-brand-blue focus:outline-none" 
                />
                <span className="text-[10px] text-white/40">Usado no cálculo de CAC e ROAS</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-white/60 uppercase mb-1">
                  Ticket Médio por Venda (R$)
                </label>
                <input 
                  type="number" 
                  min="0"
                  value={safeConfig.ticket} 
                  onChange={(e) => handleConfigChange('ticket', e.target.value)} 
                  className="w-full bg-[#0a0a0a] border border-white/20 rounded-xl px-4 py-2 text-white font-bold focus:border-brand-blue focus:outline-none" 
                />
                <span className="text-[10px] text-white/40">Valor médio de cada contrato fechado</span>
              </div>

              {safeConfig.modoCalculo === 'manual' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-white/60 uppercase mb-1">
                      Investimento Total Direto (R$)
                    </label>
                    <input 
                      type="number" 
                      min="0"
                      value={safeConfig.manualInvestimento} 
                      onChange={(e) => handleConfigChange('manualInvestimento', e.target.value)} 
                      className="w-full bg-[#0a0a0a] border border-brand-blue/50 rounded-xl px-4 py-2 text-white font-bold focus:border-brand-blue focus:outline-none" 
                    />
                    <span className="text-[10px] text-brand-blue">Total fixado manualmente</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/60 uppercase mb-1">
                      Total de Leads Direto
                    </label>
                    <input 
                      type="number" 
                      min="0"
                      value={safeConfig.manualLeads} 
                      onChange={(e) => handleConfigChange('manualLeads', e.target.value)} 
                      className="w-full bg-[#0a0a0a] border border-brand-blue/50 rounded-xl px-4 py-2 text-white font-bold focus:border-brand-blue focus:outline-none" 
                    />
                    <span className="text-[10px] text-brand-blue">Total fixado manualmente</span>
                  </div>
                </>
              )}

              {safeConfig.modoCalculo === 'campanhas' && (
                <div className="col-span-1 md:col-span-2 flex items-center p-3 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-xs text-white/60">
                    💡 O <strong className="text-white">Investimento Total</strong> e os <strong className="text-white">Leads Gerados</strong> estão sendo somados automaticamente a partir da tabela de campanhas abaixo.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Cards de Métricas Principais (KPIs) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          
          {/* Card 1: Investimento Total */}
          <div className={`bg-[#151515] border rounded-2xl p-5 relative overflow-hidden transition-all ${
            isEditing && safeConfig.modoCalculo === 'manual' ? 'border-brand-blue/50 ring-1 ring-brand-blue/30' : 'border-white/10'
          }`}>
            <p className="text-white/50 text-[10px] font-bold tracking-widest uppercase mb-1">Investimento Total</p>
            <h3 className="text-2xl font-black text-white">
              R$ {Number(totalInvestimento).toLocaleString('pt-BR')}
            </h3>
            <span className="text-[10px] text-white/40 block mt-1">
              {safeConfig.modoCalculo === 'campanhas' ? 'Soma das campanhas' : 'Valor manual'}
            </span>
            <div className="absolute top-0 right-0 p-3 opacity-10"><DollarSign size={40} /></div>
          </div>

          {/* Card 2: Leads Gerados */}
          <div className={`bg-[#151515] border rounded-2xl p-5 relative overflow-hidden transition-all ${
            isEditing && safeConfig.modoCalculo === 'manual' ? 'border-brand-blue/50 ring-1 ring-brand-blue/30' : 'border-white/10'
          }`}>
            <p className="text-white/50 text-[10px] font-bold tracking-widest uppercase mb-1">Leads Gerados</p>
            <h3 className="text-2xl font-black text-white">
              {Number(totalLeads).toLocaleString('pt-BR')}
            </h3>
            <span className="text-[10px] text-white/40 block mt-1">Volume de contatos</span>
            <div className="absolute top-0 right-0 p-3 opacity-10"><Users size={40} /></div>
          </div>

          {/* Card 3: CPL */}
          <div className="bg-purple-950/20 border border-purple-500/30 rounded-2xl p-5 relative overflow-hidden">
            <p className="text-purple-400 text-[10px] font-bold tracking-widest uppercase mb-1">CPL (Custo por Lead)</p>
            <h3 className="text-2xl font-black text-purple-400">
              R$ {cpl.toFixed(2).replace('.', ',')}
            </h3>
            <span className="text-[10px] text-purple-400/60 block mt-1">Fórmula: Investimento / Leads</span>
            <div className="absolute top-0 right-0 p-3 opacity-10 text-purple-400"><MousePointerClick size={40} /></div>
          </div>

          {/* Card 4: CAC */}
          <div className="bg-[#151515] border border-amber-500/30 rounded-2xl p-5 relative overflow-hidden">
            <p className="text-amber-400 text-[10px] font-bold tracking-widest uppercase mb-1">CAC (Custo Aquisição)</p>
            <h3 className="text-2xl font-black text-[#f59e0b]">
              R$ {cac.toFixed(2).replace('.', ',')}
            </h3>
            <span className="text-[10px] text-amber-400/60 block mt-1">
              Fórmula: Investimento / {safeConfig.vendas} vendas
            </span>
            <div className="absolute top-0 right-0 p-3 opacity-10 text-[#f59e0b]"><TrendingUp size={40} /></div>
          </div>

          {/* Card 5: ROAS */}
          <div className="bg-[#10b981]/10 border border-[#10b981]/30 rounded-2xl p-5 relative overflow-hidden">
            <p className="text-[#10b981] text-[10px] font-bold tracking-widest uppercase mb-1">ROAS Estimado</p>
            <h3 className="text-2xl font-black text-[#10b981]">
              {roas.toFixed(2).replace('.', ',')} x
            </h3>
            <span className="text-[10px] text-[#10b981]/60 block mt-1">
              Fat: R$ {faturamento.toLocaleString('pt-BR')}
            </span>
            <div className="absolute top-0 right-0 p-3 opacity-10 text-[#10b981]"><TrendingUp size={40} /></div>
          </div>

        </div>

        {/* Tabela de Campanhas */}
        <div className="bg-[#151515] border border-white/10 rounded-2xl overflow-hidden mb-10 shadow-xl">
          <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-xl text-purple-400">
                <Megaphone size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  Histórico e Controle de Campanhas
                </h3>
                <p className="text-xs text-white/50">
                  {isEditing ? 'Altere os valores de cada campanha abaixo' : 'Métricas registradas por canal de aquisição'}
                </p>
              </div>
            </div>

            {isEditing && (
              <button 
                onClick={handleAddCampaign}
                className="flex items-center gap-2 px-4 py-2 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl text-xs font-bold shadow-lg shadow-brand-blue/20 transition-all"
              >
                <Plus size={16} />
                Nova Campanha
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#101010] text-white/50 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4 pl-6">Campanha</th>
                  <th className="p-4">Plataforma</th>
                  <th className="p-4 text-right">Investido (R$)</th>
                  <th className="p-4 text-center">Leads Gerados</th>
                  <th className="p-4 text-right">CPL Calculado</th>
                  {isEditing && <th className="p-4 text-center pr-6">Ações</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {safeCampanhas.map((camp) => {
                  const campCpl = camp.leads > 0 ? camp.investido / camp.leads : 0;
                  
                  return (
                    <tr key={camp.id} className="hover:bg-white/5 transition-colors">
                      
                      {/* Nome da Campanha */}
                      <td className="p-4 pl-6 font-bold text-white">
                        {isEditing ? (
                          <input 
                            type="text" 
                            value={camp.nome} 
                            onChange={(e) => handleCampaignChange(camp.id, 'nome', e.target.value)} 
                            className="w-full max-w-sm bg-[#0a0a0a] border border-white/20 rounded-lg px-3 py-1.5 text-white font-medium focus:border-brand-blue focus:outline-none text-sm"
                          />
                        ) : (
                          <span>{camp.nome}</span>
                        )}
                      </td>

                      {/* Plataforma */}
                      <td className="p-4 text-white/70">
                        {isEditing ? (
                          <select 
                            value={camp.plataforma} 
                            onChange={(e) => handleCampaignChange(camp.id, 'plataforma', e.target.value)}
                            className="bg-[#0a0a0a] border border-white/20 rounded-lg px-2 py-1.5 text-white text-xs focus:border-brand-blue focus:outline-none"
                          >
                            <option value="Meta Ads">Meta Ads</option>
                            <option value="Google Ads">Google Ads</option>
                            <option value="TikTok Ads">TikTok Ads</option>
                            <option value="YouTube Ads">YouTube Ads</option>
                            <option value="LinkedIn Ads">LinkedIn Ads</option>
                            <option value="Outros">Outros</option>
                          </select>
                        ) : (
                          <span className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                            camp.plataforma === 'Google Ads' 
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                              : camp.plataforma === 'Meta Ads'
                              ? 'bg-sky-600/20 text-sky-400 border border-sky-600/30'
                              : 'bg-white/10 text-white/70'
                          }`}>
                            {camp.plataforma}
                          </span>
                        )}
                      </td>

                      {/* Investido */}
                      <td className="p-4 text-right">
                        {isEditing ? (
                          <div className="flex items-center justify-end gap-1">
                            <span className="text-xs text-white/40">R$</span>
                            <input 
                              type="number" 
                              min="0"
                              step="50"
                              value={camp.investido} 
                              onChange={(e) => handleCampaignChange(camp.id, 'investido', e.target.value)} 
                              className="w-28 bg-[#0a0a0a] border border-white/20 rounded-lg px-2 py-1.5 text-white font-bold text-right focus:border-brand-blue focus:outline-none text-sm"
                            />
                          </div>
                        ) : (
                          <span className="text-white/90 font-medium">
                            R$ {Number(camp.investido).toLocaleString('pt-BR')}
                          </span>
                        )}
                      </td>

                      {/* Leads */}
                      <td className="p-4 text-center">
                        {isEditing ? (
                          <input 
                            type="number" 
                            min="0"
                            value={camp.leads} 
                            onChange={(e) => handleCampaignChange(camp.id, 'leads', e.target.value)} 
                            className="w-20 bg-[#0a0a0a] border border-white/20 rounded-lg px-2 py-1.5 text-white font-bold text-center focus:border-brand-blue focus:outline-none text-sm mx-auto"
                          />
                        ) : (
                          <span className="font-bold text-white">{camp.leads}</span>
                        )}
                      </td>

                      {/* CPL (Calculado) */}
                      <td className="p-4 text-right font-bold text-purple-400">
                        R$ {campCpl.toFixed(2).replace('.', ',')}
                      </td>

                      {/* Ações */}
                      {isEditing && (
                        <td className="p-4 text-center pr-6">
                          <button 
                            onClick={() => handleDeleteCampaign(camp.id)}
                            title="Remover campanha"
                            className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>

              {/* Linha de Totais da Tabela */}
              <tfoot className="bg-[#101010] border-t border-white/10 font-bold text-xs">
                <tr>
                  <td className="p-4 pl-6 text-white/60 uppercase tracking-wider" colSpan="2">
                    Total Consolidado
                  </td>
                  <td className="p-4 text-right text-white font-black text-sm">
                    R$ {somaInvestimento.toLocaleString('pt-BR')}
                  </td>
                  <td className="p-4 text-center text-white font-black text-sm">
                    {somaLeads}
                  </td>
                  <td className="p-4 text-right font-black text-purple-400 text-sm">
                    R$ {(somaLeads > 0 ? somaInvestimento / somaLeads : 0).toFixed(2).replace('.', ',')}
                  </td>
                  {isEditing && <td></td>}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}


