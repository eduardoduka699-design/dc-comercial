import React, { useState } from 'react';
import { ArrowLeft, DollarSign, BookOpen, Activity, Star, Award, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RHModule() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('comissoes');
  const [isEditing, setIsEditing] = useState(false);

  // Default initial state
  const defaultComissoes = [
    { id: 1, nome: 'Rafael Lima', cargo: 'Closer', status: 'Ouro', base: 3500, comissao: 8500, bonus: 2000 },
    { id: 2, nome: 'Júlia Meireles', cargo: 'SDR', status: 'Prata', base: 2500, comissao: 1200, bonus: 0 },
    { id: 3, nome: 'Carlos Andrade', cargo: 'Closer', status: 'Alerta', base: 3500, comissao: 4200, bonus: 0 },
    { id: 4, nome: 'Diego Castro', cargo: 'SDR', status: 'Diamante', base: 2500, comissao: 1800, bonus: 1000 },
  ];

  const [comissoes, setComissoes] = useState(() => {
    const saved = localStorage.getItem('dc-leiseca-rh-comissoes');
    return saved ? JSON.parse(saved) : defaultComissoes;
  });

  React.useEffect(() => {
    localStorage.setItem('dc-leiseca-rh-comissoes', JSON.stringify(comissoes));
  }, [comissoes]);

  const treinamentos = [
    { id: 1, nome: 'Playbook Sales Flow', tipo: 'Obrigatório', progresso: 100, concluido: 4, total: 4 },
    { id: 2, nome: 'Contorno de Objeções', tipo: 'Eletivo', progresso: 75, concluido: 3, total: 4 },
    { id: 3, nome: 'CRM na Prática', tipo: 'Obrigatório', progresso: 50, concluido: 2, total: 4 },
  ];

  const handleChange = (id, field, value) => {
    const numValue = parseFloat(value) || 0;
    setComissoes(prev => prev.map(c => c.id === id ? { ...c, [field]: numValue } : c));
  };

  const totalComissoes = comissoes.reduce((acc, c) => acc + c.base + c.comissao + c.bonus, 0);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex flex-col">
      

      <main className="flex-1 max-w-7xl w-full mx-auto p-8 overflow-y-auto">
        <div className="mb-10 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-display font-black mb-2">Painel de Alta Performance</h2>
            <p className="text-white/50">Gerencie comissionamento e desenvolvimento do time.</p>
          </div>
          {activeTab === 'comissoes' && (
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className={`px-6 py-2 rounded-xl font-bold transition-all ${isEditing ? 'bg-[#10b981] text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-brand-blue text-white shadow-[0_0_15px_rgba(0,112,243,0.3)]'}`}
            >
              {isEditing ? 'Salvar Alterações' : 'Editar Valores'}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-[#151515] border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><DollarSign size={64} /></div>
            <p className="text-white/50 text-xs font-bold tracking-wider uppercase mb-2">Comissões e Base</p>
            <h3 className="text-3xl font-black text-brand-blue">R$ {totalComissoes.toLocaleString('pt-BR')}</h3>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-8 border-b border-white/10 pb-4">
          <button onClick={() => setActiveTab('comissoes')} className={`px-4 py-2 rounded-lg text-sm font-bold tracking-wider transition-all ${activeTab === 'comissoes' ? 'bg-brand-blue text-white shadow-[0_0_15px_rgba(0,112,243,0.3)]' : 'text-white/50 hover:bg-white/5'}`}>MOTOR DE COMISSÃO</button>
          <button onClick={() => setActiveTab('qa')} className={`px-4 py-2 rounded-lg text-sm font-bold tracking-wider transition-all ${activeTab === 'qa' ? 'bg-brand-blue text-white shadow-[0_0_15px_rgba(0,112,243,0.3)]' : 'text-white/50 hover:bg-white/5'}`}>ONBOARDING & QA</button>
        </div>

        {activeTab === 'comissoes' ? (
          <div className="animate-in fade-in bg-[#151515] border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#101010] text-white/50 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4 pl-6">Colaborador</th>
                    <th className="p-4">Cargo</th>
                    <th className="p-4">Fixo (Base)</th>
                    <th className="p-4">Comissão Ganha</th>
                    <th className="p-4">Bônus / Acelerador</th>
                    <th className="p-4 text-right pr-6">Remuneração Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {comissoes.map((item) => (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 pl-6 font-bold text-white">{item.nome}</td>
                      <td className="p-4 text-white/70">{item.cargo}</td>
                      <td className="p-4">
                        {isEditing ? (
                          <input type="number" className="w-24 bg-[#0a0a0a] border border-white/20 rounded px-2 py-1 text-white focus:border-brand-blue focus:outline-none" value={item.base} onChange={(e) => handleChange(item.id, 'base', e.target.value)} />
                        ) : (
                          <span className="text-white/70">R$ {item.base.toLocaleString('pt-BR')}</span>
                        )}
                      </td>
                      <td className="p-4">
                        {isEditing ? (
                          <input type="number" className="w-24 bg-[#0a0a0a] border border-white/20 rounded px-2 py-1 text-white focus:border-brand-blue focus:outline-none" value={item.comissao} onChange={(e) => handleChange(item.id, 'comissao', e.target.value)} />
                        ) : (
                          <span className="font-medium">R$ {item.comissao.toLocaleString('pt-BR')}</span>
                        )}
                      </td>
                      <td className="p-4">
                        {isEditing ? (
                          <input type="number" className="w-24 bg-[#0a0a0a] border border-white/20 rounded px-2 py-1 text-white focus:border-brand-blue focus:outline-none" value={item.bonus} onChange={(e) => handleChange(item.id, 'bonus', e.target.value)} />
                        ) : (
                          <span className="font-bold text-[#10b981]">{item.bonus > 0 ? `+ R$ ${item.bonus.toLocaleString('pt-BR')}` : '-'}</span>
                        )}
                      </td>
                      <td className="p-4 text-right pr-6 font-black text-lg text-brand-blue">
                        R$ {(item.base + item.comissao + item.bonus).toLocaleString('pt-BR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in bg-[#151515] border border-white/10 rounded-2xl p-6">
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
                    <div className="h-full bg-brand-blue rounded-full relative" style={{ width: `${treino.progresso}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

