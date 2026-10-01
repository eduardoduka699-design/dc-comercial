import React, { useState } from 'react';
import { ArrowLeft, DollarSign, BookOpen, Activity, Star, Award, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RHModule() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('comissoes');

  // Dados Mockados de RH
  const comissoes = [
    { id: 1, nome: 'Rafael Lima', cargo: 'Closer', honorarios: 'R$ 85.000', meta: 110, base: 3500, comissao: 8500, bonus: 2000, total: 14000, status: 'Ouro' },
    { id: 2, nome: 'Júlia Meireles', cargo: 'SDR', honorarios: '-', meta: 95, base: 2500, comissao: 1200, bonus: 0, total: 3700, status: 'Prata' },
    { id: 3, nome: 'Carlos Andrade', cargo: 'Closer', honorarios: 'R$ 42.000', meta: 80, base: 3500, comissao: 4200, bonus: 0, total: 7700, status: 'Alerta' },
    { id: 4, nome: 'Diego Castro', cargo: 'SDR', honorarios: '-', meta: 125, base: 2500, comissao: 1800, bonus: 1000, total: 5300, status: 'Diamante' },
  ];

  const treinamentos = [
    { id: 1, nome: 'Playbook Sales Flow', tipo: 'Obrigatório', progresso: 100, concluido: 4, total: 4 },
    { id: 2, nome: 'Contorno de Objeções (Áudio)', tipo: 'Eletivo', progresso: 75, concluido: 3, total: 4 },
    { id: 3, nome: 'CRM na Prática', tipo: 'Obrigatório', progresso: 50, concluido: 2, total: 4 },
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
        <div className="font-display font-bold tracking-widest text-sm bg-brand-blue/20 text-brand-blue px-4 py-1 rounded-full border border-brand-blue/30">
          Módulo 03 — Performance & RH
        </div>
        <div className="w-24"></div> {/* Spacer for centering */}
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-8 overflow-y-auto">
        <div className="mb-10">
          <h2 className="text-3xl font-display font-black mb-2">Painel de Alta Performance</h2>
          <p className="text-white/50">Gerencie comissionamento, metas e desenvolvimento do time comercial.</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-[#151515] border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><DollarSign size={64} /></div>
            <p className="text-white/50 text-xs font-bold tracking-wider uppercase mb-2">Comissões Projetadas</p>
            <h3 className="text-3xl font-black text-brand-blue">R$ 15.700</h3>
            <p className="text-[#10b981] text-xs font-bold mt-2 flex items-center gap-1"><TrendingUp size={12} /> +12% vs. mês passado</p>
          </div>
          <div className="bg-[#151515] border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Award size={64} /></div>
            <p className="text-white/50 text-xs font-bold tracking-wider uppercase mb-2">Aceleradores Ativos</p>
            <h3 className="text-3xl font-black text-[#f59e0b]">2 Vendedores</h3>
            <p className="text-white/40 text-xs font-bold mt-2">Batendo mais de 110% da meta</p>
          </div>
          <div className="bg-[#151515] border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><BookOpen size={64} /></div>
            <p className="text-white/50 text-xs font-bold tracking-wider uppercase mb-2">Engajamento Onboarding</p>
            <h3 className="text-3xl font-black text-white">75%</h3>
            <p className="text-[#f59e0b] text-xs font-bold mt-2 flex items-center gap-1"><AlertCircle size={12} /> 2 pendências críticas</p>
          </div>
          <div className="bg-[#151515] border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Activity size={64} /></div>
            <p className="text-white/50 text-xs font-bold tracking-wider uppercase mb-2">Clima da Equipe (Pulse)</p>
            <h3 className="text-3xl font-black text-[#10b981]">8.4 / 10</h3>
            <p className="text-white/40 text-xs font-bold mt-2">Saúde mental e energia estáveis</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-8 border-b border-white/10 pb-4">
          <button onClick={() => setActiveTab('comissoes')} className={`px-4 py-2 rounded-lg text-sm font-bold tracking-wider transition-all ${activeTab === 'comissoes' ? 'bg-brand-blue text-white shadow-[0_0_15px_rgba(0,112,243,0.3)]' : 'text-white/50 hover:bg-white/5'}`}>MOTOR DE COMISSÃO</button>
          <button onClick={() => setActiveTab('qa')} className={`px-4 py-2 rounded-lg text-sm font-bold tracking-wider transition-all ${activeTab === 'qa' ? 'bg-brand-blue text-white shadow-[0_0_15px_rgba(0,112,243,0.3)]' : 'text-white/50 hover:bg-white/5'}`}>ONBOARDING & QA</button>
        </div>

        {/* Tab Content */}
        {activeTab === 'comissoes' ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-[#151515] border border-white/10 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <h3 className="text-lg font-bold text-white/90">Folha de Performance (Ciclo Atual)</h3>
                <button className="text-xs bg-white/10 hover:bg-white/20 text-white font-bold py-2 px-4 rounded-lg transition-colors">Exportar Folha</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#101010] text-white/50 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4 pl-6">Colaborador</th>
                      <th className="p-4">Cargo</th>
                      <th className="p-4">Atingimento</th>
                      <th className="p-4">Fixo</th>
                      <th className="p-4">Comissão</th>
                      <th className="p-4">Acelerador (Bônus)</th>
                      <th className="p-4 text-right pr-6">Remuneração Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {comissoes.map((item) => (
                      <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                        <td className="p-4 pl-6">
                          <div className="font-bold text-white">{item.nome}</div>
                          <div className="text-[10px] text-brand-blue font-bold tracking-widest">{item.status.toUpperCase()}</div>
                        </td>
                        <td className="p-4 text-white/70">{item.cargo}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${item.meta >= 100 ? 'bg-[#10b981]' : item.meta >= 80 ? 'bg-[#f59e0b]' : 'bg-red-500'}`} style={{ width: `${Math.min(item.meta, 100)}%` }}></div>
                            </div>
                            <span className={`font-bold ${item.meta >= 100 ? 'text-[#10b981]' : item.meta >= 80 ? 'text-[#f59e0b]' : 'text-red-500'}`}>{item.meta}%</span>
                          </div>
                        </td>
                        <td className="p-4 text-white/70">R$ {item.base.toLocaleString('pt-BR')}</td>
                        <td className="p-4 font-medium">R$ {item.comissao.toLocaleString('pt-BR')}</td>
                        <td className="p-4 font-bold text-[#10b981]">{item.bonus > 0 ? `+ R$ ${item.bonus.toLocaleString('pt-BR')}` : '-'}</td>
                        <td className="p-4 text-right pr-6 font-black text-lg text-brand-blue">R$ {item.total.toLocaleString('pt-BR')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Onboarding */}
            <div className="bg-[#151515] border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white/90 mb-6 flex items-center gap-2"><BookOpen size={20} className="text-brand-blue"/> Central de Onboarding</h3>
              <div className="space-y-6">
                {treinamentos.map(treino => (
                  <div key={treino.id}>
                    <div className="flex justify-between text-sm mb-2">
                      <div>
                        <span className="font-bold text-white">{treino.nome}</span>
                        <span className="text-[10px] uppercase tracking-widest text-white/40 ml-2 bg-white/5 px-2 py-0.5 rounded">{treino.tipo}</span>
                      </div>
                      <span className="text-brand-blue font-bold">{treino.concluido}/{treino.total} concluíram</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-blue rounded-full relative" style={{ width: `${treino.progresso}%` }}>
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 bg-white/5 hover:bg-white/10 text-white text-sm font-bold py-3 rounded-xl transition-colors border border-white/10">Adicionar Novo Treinamento</button>
            </div>

            {/* QA */}
            <div className="bg-[#151515] border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white/90 mb-6 flex items-center gap-2"><Star size={20} className="text-[#f59e0b]"/> Auditoria de Vendas (QA)</h3>
              <div className="space-y-4">
                {[
                  { nome: 'Carlos Andrade', nota: 3.5, ultima: 'Ontem', pendente: true },
                  { nome: 'Diego Castro', nota: 4.8, ultima: 'Há 3 dias', pendente: false }
                ].map((auditoria, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border border-white/5 rounded-xl bg-black/30 hover:bg-black/50 transition-colors">
                    <div>
                      <h4 className="font-bold text-white text-sm">{auditoria.nome}</h4>
                      <p className="text-xs text-white/50 mt-1 flex items-center gap-1">
                        Última avaliação: {auditoria.ultima}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-[#f59e0b] mb-1">
                        <Star size={14} fill="currentColor" />
                        <span className="font-bold text-sm text-white">{auditoria.nota}</span>
                      </div>
                      {auditoria.pendente ? (
                        <span className="text-[10px] uppercase font-bold text-red-400 bg-red-400/10 px-2 py-0.5 rounded">Revisão Pendente</span>
                      ) : (
                        <span className="text-[10px] uppercase font-bold text-[#10b981] bg-[#10b981]/10 px-2 py-0.5 rounded flex items-center gap-1"><CheckCircle size={10}/> Em dia</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 bg-brand-blue hover:bg-blue-600 text-white text-sm font-bold py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(0,112,243,0.3)]">Realizar Nova Auditoria</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
