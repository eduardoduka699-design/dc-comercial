import React, { useState } from 'react';
import { ArrowLeft, Megaphone, TrendingUp, Users, DollarSign, MousePointerClick, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MarketingModule() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const defaultMetrics = {
    investimento: 12500,
    leads: 320,
    vendas: 15,
    ticket: 3500
  };

  const [metrics, setMetrics] = useState(() => {
    const saved = localStorage.getItem('dc-leiseca-marketing');
    return saved ? JSON.parse(saved) : defaultMetrics;
  });

  React.useEffect(() => {
    localStorage.setItem('dc-leiseca-marketing', JSON.stringify(metrics));
  }, [metrics]);

  const handleChange = (field, value) => {
    setMetrics(prev => ({ ...prev, [field]: parseFloat(value) || 0 }));
  };

  const cpl = metrics.leads > 0 ? metrics.investimento / metrics.leads : 0;
  const cac = metrics.vendas > 0 ? metrics.investimento / metrics.vendas : 0;
  const faturamento = metrics.vendas * metrics.ticket;
  const roas = metrics.investimento > 0 ? faturamento / metrics.investimento : 0;

  const campanhas = [
    { id: 1, nome: '[META] Conversão - Lei Seca Urgente', status: 'Ativo', investido: 4500, leads: 135, cpl: 33.33, plataforma: 'Meta Ads' },
    { id: 2, nome: '[GOOGLE] Pesquisa - Advogado Lei Seca', status: 'Ativo', investido: 6000, leads: 140, cpl: 42.85, plataforma: 'Google Ads' },
    { id: 3, nome: '[META] Remarketing - Casos Qualificados', status: 'Ativo', investido: 2000, leads: 45, cpl: 44.44, plataforma: 'Meta Ads' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex flex-col">
      

      <main className="flex-1 w-full max-w-7xl mx-auto p-8 overflow-y-auto">
        <div className="mb-10 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-display font-black mb-2">Inteligência de Tráfego</h2>
            <p className="text-white/50 max-w-2xl">Acompanhamento do funil de marketing, CPL, CAC e ROAS.</p>
          </div>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={`px-6 py-2 rounded-xl font-bold transition-all ${isEditing ? 'bg-[#10b981] text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]'}`}
          >
            {isEditing ? 'Salvar Alterações' : 'Preencher Dados'}
          </button>
        </div>

        {isEditing && (
          <div className="bg-[#151515] border border-white/10 rounded-2xl p-6 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 animate-in fade-in">
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase mb-2">Investimento Total (R$)</label>
              <input type="number" value={metrics.investimento} onChange={(e) => handleChange('investimento', e.target.value)} className="w-full bg-[#0a0a0a] border border-white/20 rounded-xl px-4 py-2 text-white focus:border-purple-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase mb-2">Leads Gerados</label>
              <input type="number" value={metrics.leads} onChange={(e) => handleChange('leads', e.target.value)} className="w-full bg-[#0a0a0a] border border-white/20 rounded-xl px-4 py-2 text-white focus:border-purple-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase mb-2">Vendas Fechadas (Mkt)</label>
              <input type="number" value={metrics.vendas} onChange={(e) => handleChange('vendas', e.target.value)} className="w-full bg-[#0a0a0a] border border-white/20 rounded-xl px-4 py-2 text-white focus:border-purple-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase mb-2">Ticket Médio (R$)</label>
              <input type="number" value={metrics.ticket} onChange={(e) => handleChange('ticket', e.target.value)} className="w-full bg-[#0a0a0a] border border-white/20 rounded-xl px-4 py-2 text-white focus:border-purple-500 focus:outline-none" />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-10">
          <div className="bg-[#151515] border border-white/10 rounded-2xl p-5 relative overflow-hidden">
            <p className="text-white/50 text-[10px] font-bold tracking-widest uppercase mb-2">Investimento Total</p>
            <h3 className="text-2xl font-black text-white">R$ {metrics.investimento.toLocaleString('pt-BR')}</h3>
            <div className="absolute top-0 right-0 p-3 opacity-10"><DollarSign size={40} /></div>
          </div>
          <div className="bg-[#151515] border border-white/10 rounded-2xl p-5 relative overflow-hidden">
            <p className="text-white/50 text-[10px] font-bold tracking-widest uppercase mb-2">Leads Gerados</p>
            <h3 className="text-2xl font-black text-white">{metrics.leads}</h3>
            <div className="absolute top-0 right-0 p-3 opacity-10"><Users size={40} /></div>
          </div>
          <div className="bg-purple-900/20 border border-purple-500/30 rounded-2xl p-5 relative overflow-hidden">
            <p className="text-purple-400 text-[10px] font-bold tracking-widest uppercase mb-2">CPL (Custo por Lead)</p>
            <h3 className="text-2xl font-black text-purple-400">R$ {cpl.toFixed(2).replace('.', ',')}</h3>
            <div className="absolute top-0 right-0 p-3 opacity-10 text-purple-400"><MousePointerClick size={40} /></div>
          </div>
          <div className="bg-[#151515] border border-white/10 rounded-2xl p-5 relative overflow-hidden">
            <p className="text-white/50 text-[10px] font-bold tracking-widest uppercase mb-2">CAC (Custo Aquisição)</p>
            <h3 className="text-2xl font-black text-[#f59e0b]">R$ {cac.toFixed(2).replace('.', ',')}</h3>
            <div className="absolute top-0 right-0 p-3 opacity-10"><TrendingUp size={40} /></div>
          </div>
          <div className="bg-[#10b981]/10 border border-[#10b981]/30 rounded-2xl p-5 relative overflow-hidden">
            <p className="text-[#10b981] text-[10px] font-bold tracking-widest uppercase mb-2">ROAS Projetado</p>
            <h3 className="text-2xl font-black text-[#10b981]">{roas.toFixed(2).replace('.', ',')}x</h3>
            <div className="absolute top-0 right-0 p-3 opacity-10 text-[#10b981]"><TrendingUp size={40} /></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 mb-10">
          <div className="bg-[#151515] border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-lg font-bold text-white/90 flex items-center gap-2"><Megaphone size={20} className="text-purple-400"/> Histórico de Campanhas (Demo)</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#101010] text-white/50 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4 pl-6">Campanha</th>
                    <th className="p-4">Plataforma</th>
                    <th className="p-4 text-right">Investido</th>
                    <th className="p-4 text-center">Leads</th>
                    <th className="p-4 text-right pr-6">CPL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {campanhas.map((camp) => (
                    <tr key={camp.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 pl-6 font-bold text-white">{camp.nome}</td>
                      <td className="p-4 text-white/50">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${camp.plataforma === 'Google Ads' ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-600/20 text-blue-500'}`}>
                          {camp.plataforma}
                        </span>
                      </td>
                      <td className="p-4 text-right text-white/80">R$ {camp.investido.toLocaleString('pt-BR')}</td>
                      <td className="p-4 text-center font-medium">{camp.leads}</td>
                      <td className="p-4 text-right pr-6 font-bold text-purple-400">R$ {camp.cpl.toFixed(2).replace('.', ',')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

