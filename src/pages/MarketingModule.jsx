import React, { useState } from 'react';
import { ArrowLeft, Megaphone, TrendingUp, Users, DollarSign, MousePointerClick, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MarketingModule() {
  const navigate = useNavigate();
  const [periodo, setPeriodo] = useState('Mes');

  const metricas = {
    investimento: 12500,
    leads: 320,
    cpl: 39.06,
    cac: 833.33,
    roas: 4.2
  };

  const campanhas = [
    { id: 1, nome: '[META] Conversão - Lei Seca Urgente', status: 'Ativo', investido: 4500, leads: 135, cpl: 33.33, plataforma: 'Meta Ads' },
    { id: 2, nome: '[GOOGLE] Pesquisa - Advogado Lei Seca', status: 'Ativo', investido: 6000, leads: 140, cpl: 42.85, plataforma: 'Google Ads' },
    { id: 3, nome: '[META] Remarketing - Casos Qualificados', status: 'Ativo', investido: 2000, leads: 45, cpl: 44.44, plataforma: 'Meta Ads' },
  ];

  const criativos = [
    { id: 1, nome: 'Vídeo - "Soprou o bafômetro?"', ctr: '3.2%', conversao: '12%', custoLead: 31.50 },
    { id: 2, nome: 'Imagem - "Multa de R$ 2.934,70"', ctr: '2.8%', conversao: '9%', custoLead: 38.00 },
    { id: 3, nome: 'Carrossel - Prazos do Recurso', ctr: '1.9%', conversao: '6%', custoLead: 45.20 },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex flex-col">
      {/* Barra superior */}
      <header className="h-16 border-b border-white/10 bg-black/50 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-50">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-bold tracking-wider uppercase"
        >
          <ArrowLeft size={16} />
          Voltar ao Hub Central
        </button>
        <div className="font-display font-bold tracking-widest text-sm bg-purple-500/20 text-purple-400 px-4 py-1 rounded-full border border-purple-500/30">
          Módulo 04 — Growth & Marketing
        </div>
        <div className="w-40 flex justify-end">
          <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
            <Filter size={14} /> Filtro: {periodo}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-8 overflow-y-auto">
        <div className="mb-10">
          <h2 className="text-3xl font-display font-black mb-2">Inteligência de Tráfego</h2>
          <p className="text-white/50 max-w-2xl">
            Acompanhamento do funil de marketing, custos de aquisição e performance das campanhas de Lei Seca.
          </p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-10">
          <div className="bg-[#151515] border border-white/10 rounded-2xl p-5 relative overflow-hidden">
            <p className="text-white/50 text-[10px] font-bold tracking-widest uppercase mb-2">Investimento Total</p>
            <h3 className="text-2xl font-black text-white">R$ {metricas.investimento.toLocaleString('pt-BR')}</h3>
            <div className="absolute top-0 right-0 p-3 opacity-10"><DollarSign size={40} /></div>
          </div>
          <div className="bg-[#151515] border border-white/10 rounded-2xl p-5 relative overflow-hidden">
            <p className="text-white/50 text-[10px] font-bold tracking-widest uppercase mb-2">Leads Gerados</p>
            <h3 className="text-2xl font-black text-white">{metricas.leads}</h3>
            <div className="absolute top-0 right-0 p-3 opacity-10"><Users size={40} /></div>
          </div>
          <div className="bg-purple-900/20 border border-purple-500/30 rounded-2xl p-5 relative overflow-hidden">
            <p className="text-purple-400 text-[10px] font-bold tracking-widest uppercase mb-2">CPL (Custo por Lead)</p>
            <h3 className="text-2xl font-black text-purple-400">R$ {metricas.cpl.toFixed(2).replace('.', ',')}</h3>
            <div className="absolute top-0 right-0 p-3 opacity-10 text-purple-400"><MousePointerClick size={40} /></div>
          </div>
          <div className="bg-[#151515] border border-white/10 rounded-2xl p-5 relative overflow-hidden">
            <p className="text-white/50 text-[10px] font-bold tracking-widest uppercase mb-2">CAC (Custo Aquisição)</p>
            <h3 className="text-2xl font-black text-[#f59e0b]">R$ {metricas.cac.toFixed(2).replace('.', ',')}</h3>
            <div className="absolute top-0 right-0 p-3 opacity-10"><TrendingUp size={40} /></div>
          </div>
          <div className="bg-[#10b981]/10 border border-[#10b981]/30 rounded-2xl p-5 relative overflow-hidden">
            <p className="text-[#10b981] text-[10px] font-bold tracking-widest uppercase mb-2">ROAS Projetado</p>
            <h3 className="text-2xl font-black text-[#10b981]">{metricas.roas}x</h3>
            <div className="absolute top-0 right-0 p-3 opacity-10 text-[#10b981]"><TrendingUp size={40} /></div>
          </div>
        </div>

        {/* Gráficos e Tabelas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          
          {/* Campanhas Ativas */}
          <div className="lg:col-span-2 bg-[#151515] border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-lg font-bold text-white/90 flex items-center gap-2"><Megaphone size={20} className="text-purple-400"/> Campanhas Ativas (Google & Meta)</h3>
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

          {/* Top Criativos */}
          <div className="bg-[#151515] border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white/90 mb-6 flex items-center gap-2"><MousePointerClick size={20} className="text-brand-blue"/> Top Criativos</h3>
            <div className="space-y-4">
              {criativos.map((criativo, i) => (
                <div key={criativo.id} className="p-4 bg-black/40 border border-white/5 rounded-xl">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-sm text-white">{criativo.nome}</h4>
                    <span className="text-[10px] font-bold bg-white/10 text-white/60 px-2 py-0.5 rounded">#{i+1}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <p className="text-[9px] text-white/40 uppercase tracking-widest">CTR</p>
                      <p className="font-bold text-white text-xs">{criativo.ctr}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-white/40 uppercase tracking-widest">Conv.</p>
                      <p className="font-bold text-white text-xs">{criativo.conversao}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-white/40 uppercase tracking-widest">Custo</p>
                      <p className="font-bold text-[#10b981] text-xs">R$ {criativo.custoLead.toFixed(2).replace('.', ',')}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
