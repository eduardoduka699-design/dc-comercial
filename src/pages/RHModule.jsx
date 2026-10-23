import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  DollarSign, 
  BookOpen, 
  Activity, 
  Star, 
  Award, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle,
  Users,
  ShieldCheck,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';

export default function RHModule() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('comissoes');
  const [isEditing, setIsEditing] = useState(false);

  // Default inicial caso não haja dados salvos
  const defaultComissoes = [
    { id: 'usr-rafael-closer', nome: 'Rafael Lima', cargo: 'Closer', status: 'Ouro', base: 3500, comissao: 8500, bonus: 2000 },
    { id: 'usr-julia-sdr', nome: 'Júlia Meireles', cargo: 'SDR', status: 'Prata', base: 2500, comissao: 1200, bonus: 0 },
    { id: 'usr-carlos-closer', nome: 'Carlos Andrade', cargo: 'Closer', status: 'Alerta', base: 3500, comissao: 4200, bonus: 0 },
    { id: 'usr-diego-sdr', nome: 'Diego Castro', cargo: 'SDR', status: 'Diamante', base: 2500, comissao: 1800, bonus: 1000 },
  ];

  const [comissoes, setComissoes] = useState(() => {
    try {
      const saved = localStorage.getItem('dc-leiseca-rh-comissoes');
      return saved ? JSON.parse(saved) : defaultComissoes;
    } catch {
      return defaultComissoes;
    }
  });

  // Sincroniza colaboradores reais do banco de dados (userService)
  const syncWithRealUsers = async () => {
    try {
      const users = await userService.getUsers();
      if (!Array.isArray(users) || users.length === 0) return;

      setComissoes(prevList => {
        const currentList = Array.isArray(prevList) ? [...prevList] : [...defaultComissoes];
        const existingNames = new Set(currentList.map(c => c.nome.toLowerCase().trim()));

        let changed = false;

        users.forEach(user => {
          const userNome = (user.nome || user.usuario || '').trim();
          if (!userNome) return;

          // Se já está na tabela de comissões, apenas assegura cargo atualizado se mudou
          const existingIdx = currentList.findIndex(c => 
            c.id === user.id || c.nome.toLowerCase().trim() === userNome.toLowerCase()
          );

          if (existingIdx >= 0) {
            if (user.cargo && currentList[existingIdx].cargo !== user.cargo) {
              currentList[existingIdx] = { ...currentList[existingIdx], cargo: user.cargo };
              changed = true;
            }
          } else {
            // Se for um novo colaborador cadastrado no Admin
            const cargo = user.cargo || 'SDR';
            const isCloser = cargo.toLowerCase().includes('closer');
            const isGestor = cargo.toLowerCase().includes('gestor') || cargo.toLowerCase().includes('admin');
            
            const newMember = {
              id: user.id || ('rh_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4)),
              nome: userNome,
              cargo: cargo,
              status: 'Ativo',
              base: isGestor ? 5000 : isCloser ? 3500 : 2500,
              comissao: isGestor ? 3000 : isCloser ? 4500 : 1500,
              bonus: isCloser ? 1000 : 500
            };

            currentList.push(newMember);
            existingNames.add(userNome.toLowerCase());
            changed = true;
          }
        });

        if (changed) {
          localStorage.setItem('dc-leiseca-rh-comissoes', JSON.stringify(currentList));
          return currentList;
        }
        return prevList;
      });
    } catch (err) {
      console.error('Erro ao sincronizar RH com usuários reais:', err);
    }
  };

  useEffect(() => {
    syncWithRealUsers();

    const handleSync = () => syncWithRealUsers();
    window.addEventListener('dc-users-updated', handleSync);
    window.addEventListener('storage', handleSync);

    return () => {
      window.removeEventListener('dc-users-updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('dc-leiseca-rh-comissoes', JSON.stringify(comissoes));
    } catch (e) {
      console.error(e);
    }
  }, [comissoes]);

  const treinamentos = [
    { id: 1, nome: 'Playbook Sales Flow (Lei Seca)', tipo: 'Obrigatório', progresso: 100, concluido: 4, total: 4 },
    { id: 2, nome: 'Contorno de Objeções: "Já paguei a multa"', tipo: 'Eletivo', progresso: 75, concluido: 3, total: 4 },
    { id: 3, nome: 'Operação CRM & Disparos WhatsApp', tipo: 'Obrigatório', progresso: 85, concluido: 3, total: 4 },
    { id: 4, nome: 'Fechamento Jurídico & Assinatura Digital', tipo: 'Obrigatório', progresso: 60, concluido: 2, total: 4 },
  ];

  const handleChange = (id, field, value) => {
    const numValue = parseFloat(value) || 0;
    setComissoes(prev => prev.map(c => c.id === id ? { ...c, [field]: numValue } : c));
  };

  const safeComissoes = Array.isArray(comissoes) ? comissoes : [];
  const totalBase = safeComissoes.reduce((acc, c) => acc + (Number(c.base) || 0), 0);
  const totalComissoesGanha = safeComissoes.reduce((acc, c) => acc + (Number(c.comissao) || 0), 0);
  const totalBonus = safeComissoes.reduce((acc, c) => acc + (Number(c.bonus) || 0), 0);
  const totalGeral = totalBase + totalComissoesGanha + totalBonus;
  const mediaPorPessoa = safeComissoes.length > 0 ? Math.round(totalGeral / safeComissoes.length) : 0;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex flex-col">
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8 pb-24 md:pb-8 overflow-y-auto">
        
        {/* Top Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-blue bg-brand-blue/10 px-2.5 py-0.5 rounded-full border border-brand-blue/20">
                Departamento Pessoal & Metas
              </span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                <ShieldCheck size={11} /> Time Integrado
              </span>
            </div>
            <h2 className="text-3xl font-display font-black text-white">Painel de Alta Performance</h2>
            <p className="text-white/50 text-sm mt-0.5">
              Gerencie a folha comercial, bonificações variáveis e motor de comissões por metas.
            </p>
          </div>
          
          {activeTab === 'comissoes' && (
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg flex items-center gap-2 ${
                isEditing 
                  ? 'bg-[#10b981] text-white shadow-[#10b981]/20 hover:bg-[#10b981]/90' 
                  : 'bg-brand-blue text-white shadow-brand-blue/20 hover:bg-blue-600'
              }`}
            >
              {isEditing ? (
                <>
                  <CheckCircle size={16} />
                  Salvar Alterações
                </>
              ) : (
                'Editar Folha / Valores'
              )}
            </button>
          )}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#151515] border border-white/10 rounded-2xl p-5 relative overflow-hidden group hover:border-brand-blue/40 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <DollarSign size={52} />
            </div>
            <p className="text-white/40 text-[11px] font-bold tracking-wider uppercase mb-1">Remuneração Total</p>
            <h3 className="text-2xl font-black text-brand-blue">R$ {totalGeral.toLocaleString('pt-BR')}</h3>
            <p className="text-[11px] text-white/50 mt-1">Fixo + Comissões + Bônus</p>
          </div>

          <div className="bg-[#151515] border border-white/10 rounded-2xl p-5 relative overflow-hidden group hover:border-white/20 transition-colors">
            <p className="text-white/40 text-[11px] font-bold tracking-wider uppercase mb-1">Comissões Variáveis</p>
            <h3 className="text-2xl font-black text-emerald-400">R$ {totalComissoesGanha.toLocaleString('pt-BR')}</h3>
            <p className="text-[11px] text-white/50 mt-1">Ganhos por contratos fechados</p>
          </div>

          <div className="bg-[#151515] border border-white/10 rounded-2xl p-5 relative overflow-hidden group hover:border-white/20 transition-colors">
            <p className="text-white/40 text-[11px] font-bold tracking-wider uppercase mb-1">Aceleradores / Bônus</p>
            <h3 className="text-2xl font-black text-amber-400">R$ {totalBonus.toLocaleString('pt-BR')}</h3>
            <p className="text-[11px] text-white/50 mt-1">Superação de metas do mês</p>
          </div>

          <div className="bg-[#151515] border border-white/10 rounded-2xl p-5 relative overflow-hidden group hover:border-white/20 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Users size={52} />
            </div>
            <p className="text-white/40 text-[11px] font-bold tracking-wider uppercase mb-1">Média por Colaborador</p>
            <h3 className="text-2xl font-black text-white">R$ {mediaPorPessoa.toLocaleString('pt-BR')}</h3>
            <p className="text-[11px] text-white/50 mt-1">{safeComissoes.length} profissionais na folha</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-3">
          <button 
            onClick={() => setActiveTab('comissoes')} 
            className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-all ${
              activeTab === 'comissoes' 
                ? 'bg-brand-blue text-white shadow-[0_0_15px_rgba(0,112,243,0.3)]' 
                : 'text-white/50 hover:bg-white/5 hover:text-white'
            }`}
          >
            Motor de Comissão & Folha
          </button>
          <button 
            onClick={() => setActiveTab('qa')} 
            className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-all ${
              activeTab === 'qa' 
                ? 'bg-brand-blue text-white shadow-[0_0_15px_rgba(0,112,243,0.3)]' 
                : 'text-white/50 hover:bg-white/5 hover:text-white'
            }`}
          >
            Onboarding & Playbooks
          </button>
        </div>

        {activeTab === 'comissoes' ? (
          <div className="animate-in fade-in bg-[#151515] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#101010] text-white/50 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4 pl-6">Colaborador Oficial</th>
                    <th className="p-4">Cargo / Função</th>
                    <th className="p-4">Fixo (Base)</th>
                    <th className="p-4">Comissão Variável</th>
                    <th className="p-4">Bônus / Acelerador</th>
                    <th className="p-4 text-right pr-6">Remuneração Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {safeComissoes.map((item) => {
                    const totalColaborador = (Number(item?.base || 0) + Number(item?.comissao || 0) + Number(item?.bonus || 0));

                    return (
                      <tr key={item.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 pl-6 font-bold text-white flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-brand-blue/20 text-brand-blue font-black text-xs flex items-center justify-center shrink-0">
                            {item.nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                          </div>
                          <div>
                            <span className="block leading-tight">{item.nome}</span>
                            <span className="text-[10px] text-white/40 font-normal">Identificador: #{item.id}</span>
                          </div>
                        </td>
                        <td className="p-4 text-white/70">
                          <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold bg-white/5 border border-white/10">
                            {item.cargo}
                          </span>
                        </td>
                        <td className="p-4">
                          {isEditing ? (
                            <input 
                              type="number" 
                              className="w-28 bg-[#0a0a0a] border border-white/20 rounded-lg px-2.5 py-1 text-white focus:border-brand-blue focus:outline-none text-sm" 
                              value={item.base} 
                              onChange={(e) => handleChange(item.id, 'base', e.target.value)} 
                            />
                          ) : (
                            <span className="text-white/80 font-medium">R$ {Number(item?.base || 0).toLocaleString('pt-BR')}</span>
                          )}
                        </td>
                        <td className="p-4">
                          {isEditing ? (
                            <input 
                              type="number" 
                              className="w-28 bg-[#0a0a0a] border border-white/20 rounded-lg px-2.5 py-1 text-white focus:border-brand-blue focus:outline-none text-sm" 
                              value={item.comissao} 
                              onChange={(e) => handleChange(item.id, 'comissao', e.target.value)} 
                            />
                          ) : (
                            <span className="font-semibold text-emerald-400">R$ {Number(item?.comissao || 0).toLocaleString('pt-BR')}</span>
                          )}
                        </td>
                        <td className="p-4">
                          {isEditing ? (
                            <input 
                              type="number" 
                              className="w-28 bg-[#0a0a0a] border border-white/20 rounded-lg px-2.5 py-1 text-white focus:border-brand-blue focus:outline-none text-sm" 
                              value={item.bonus} 
                              onChange={(e) => handleChange(item.id, 'bonus', e.target.value)} 
                            />
                          ) : (
                            <span className="font-bold text-amber-400">
                              {Number(item?.bonus || 0) > 0 ? `+ R$ ${Number(item?.bonus || 0).toLocaleString('pt-BR')}` : '-'}
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right pr-6 font-black text-base text-brand-blue">
                          R$ {totalColaborador.toLocaleString('pt-BR')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in bg-[#151515] border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white/90 mb-6 flex items-center gap-2">
              <BookOpen size={20} className="text-brand-blue"/> Central de Onboarding & Qualificação
            </h3>
            <div className="space-y-6">
              {treinamentos.map(treino => (
                <div key={treino.id} className="bg-white/5 border border-white/5 p-4 rounded-xl">
                  <div className="flex justify-between text-sm mb-2">
                    <div>
                      <span className="font-bold text-white">{treino.nome}</span>
                      <span className="text-[10px] uppercase tracking-widest text-brand-blue ml-2 bg-brand-blue/10 px-2 py-0.5 rounded border border-brand-blue/20">
                        {treino.tipo}
                      </span>
                    </div>
                    <span className="text-brand-blue font-bold">{treino.concluido}/{treino.total} concluíram</span>
                  </div>
                  <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-gradient-to-r from-brand-blue to-emerald-400 rounded-full" style={{ width: `${treino.progresso}%` }}></div>
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
