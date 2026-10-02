import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShieldAlert, Users, UserPlus, Key, Trash2, Edit3, Loader2, Link2, Settings, CheckCircle2, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function AdminModule() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('usuarios');
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [novoUser, setNovoUser] = useState({ nome: '', usuario: '', senha: '', cargo: 'SDR' });
  
  // Integrações State
  const [activeCrmModal, setActiveCrmModal] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [savedIntegrations, setSavedIntegrations] = useState(() => {
    const saved = localStorage.getItem('dc-leiseca-integrations');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('dc-leiseca-integrations', JSON.stringify(savedIntegrations));
  }, [savedIntegrations]);

  useEffect(() => {
    if (activeTab === 'usuarios') {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    setLoading(true);
    if (!supabase) return;
    const { data, error } = await supabase.from('usuarios').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setUsuarios(data);
    }
    setLoading(false);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!novoUser.nome || !novoUser.usuario || !novoUser.senha) return;
    
    setSalvando(true);
    const { data, error } = await supabase.from('usuarios').insert([{
      nome: novoUser.nome,
      usuario: novoUser.usuario,
      senha: novoUser.senha,
      cargo: novoUser.cargo,
      status: 'Ativo'
    }]).select();

    if (error) {
      alert('Erro ao criar usuário: ' + error.message);
    } else if (data) {
      setUsuarios([...data, ...usuarios]);
      setIsModalOpen(false);
      setNovoUser({ nome: '', usuario: '', senha: '', cargo: 'SDR' });
    }
    setSalvando(false);
  };

  const removerUsuario = async (id, cargo) => {
    if (cargo === 'Admin Supremo') {
      alert("Você não pode remover o Admin Supremo!");
      return;
    }
    if (window.confirm("Tem certeza que deseja remover este usuário permanentemente?")) {
      const { error } = await supabase.from('usuarios').delete().eq('id', id);
      if (!error) {
        setUsuarios(usuarios.filter(u => u.id !== id));
      } else {
        alert('Erro ao remover: ' + error.message);
      }
    }
  };

  const handleSaveApi = (e) => {
    e.preventDefault();
    if (apiKey.trim() === '') return;
    setSavedIntegrations(prev => ({
      ...prev,
      [activeCrmModal]: apiKey
    }));
    setActiveCrmModal(null);
    setApiKey('');
  };

  const handleDisconnectApi = (crmId) => {
    if (window.confirm("Deseja realmente desconectar este CRM? Isso interromperá a atualização automática do funil.")) {
      const updated = { ...savedIntegrations };
      delete updated[crmId];
      setSavedIntegrations(updated);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Nunca';
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const crms = [
    { id: 'legendary', name: 'Legendary Hub (CRM)', icon: Zap, color: 'text-[#10b981]' },
    { id: 'kommo', name: 'Kommo (amoCRM)', icon: Link2, color: 'text-brand-blue' },
    { id: 'rd', name: 'RD Station Marketing', icon: Link2, color: 'text-[#f59e0b]' },
    { id: 'pipedrive', name: 'Pipedrive', icon: Link2, color: 'text-[#10b981]' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex flex-col" translate="no">
      <header className="h-16 border-b border-white/10 bg-black/50 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-50">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-bold tracking-wider uppercase"
        >
          <ArrowLeft size={16} />
          Voltar ao Hub Central
        </button>
        <div className="font-display font-bold tracking-widest text-sm bg-red-500/20 text-red-500 px-4 py-1 rounded-full border border-red-500/30 flex items-center gap-2">
          <ShieldAlert size={16} />
          Módulo Master — Painel Administrativo
        </div>
        <div className="w-40 flex justify-end"></div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 border-r border-white/10 bg-[#101010] flex flex-col shrink-0 p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-4 px-3">Gestão Master</p>
          <div className="space-y-2">
            <button 
              onClick={() => setActiveTab('usuarios')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors ${
                activeTab === 'usuarios' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'text-white/50 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Users size={18} /> Usuários e Acessos
            </button>
            <button 
              onClick={() => setActiveTab('integracoes')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors ${
                activeTab === 'integracoes' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'text-white/50 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Settings size={18} /> Integrações (CRM)
            </button>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-8">
          {activeTab === 'usuarios' && (
            <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-10 flex justify-between items-end">
                <div>
                  <h2 className="text-3xl font-display font-black mb-2">Controle de Acessos</h2>
                  <p className="text-white/50 max-w-2xl">Gerencie quem pode acessar a plataforma. Dados sincronizados em tempo real.</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(220,38,38,0.3)]"
                >
                  <UserPlus size={20} /> Novo Usuário
                </button>
              </div>

              <div className="bg-[#151515] border border-white/10 rounded-2xl overflow-hidden min-h-[400px]">
                <div className="p-6 border-b border-white/10 flex items-center gap-3">
                  <Users size={24} className="text-red-500" />
                  <h3 className="text-lg font-bold text-white">Usuários Cadastrados ({usuarios.length})</h3>
                </div>
                
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-64 text-white/50">
                    <Loader2 className="animate-spin mb-4 text-brand-blue" size={32} />
                    <p>Carregando usuários...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-[#101010] text-white/50 font-bold uppercase tracking-wider text-[10px]">
                        <tr>
                          <th className="p-4 pl-6">Nome Completo</th>
                          <th className="p-4">Login (Usuário)</th>
                          <th className="p-4">Cargo / Função</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Último Acesso</th>
                          <th className="p-4 text-right pr-6">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {usuarios.map((user) => (
                          <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                            <td className="p-4 pl-6 font-bold text-white">{user.nome}</td>
                            <td className="p-4 text-white/60 font-mono text-xs">{user.usuario}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${user.cargo === 'Admin Supremo' ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 'bg-brand-blue/10 text-brand-blue border border-brand-blue/30'}`}>
                                {user.cargo}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className={`flex items-center gap-2 text-xs font-bold ${user.status === 'Ativo' ? 'text-[#10b981]' : 'text-white/30'}`}>
                                <div className={`w-2 h-2 rounded-full ${user.status === 'Ativo' ? 'bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-white/30'}`}></div>
                                {user.status}
                              </span>
                            </td>
                            <td className="p-4 text-white/40 text-xs">{formatDate(user.ultimo_acesso)}</td>
                            <td className="p-4 text-right pr-6">
                              <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                {user.cargo !== 'Admin Supremo' && (
                                  <button onClick={() => removerUsuario(user.id, user.cargo)} className="text-white/50 hover:text-red-500 transition-colors" title="Excluir">
                                    <Trash2 size={16} />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'integracoes' && (
            <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-10">
                <h2 className="text-3xl font-display font-black mb-2 flex items-center gap-3">
                  <Settings className="text-red-500" size={32} />
                  Integrações (CRM)
                </h2>
                <p className="text-white/50 max-w-2xl">
                  Conecte o DC Hub ao seu CRM para sincronizar funis, extrair métricas de leads e puxar faturamento (ganhos) automaticamente, ponta a ponta.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {crms.map(crm => {
                  const Icon = crm.icon;
                  const isConnected = !!savedIntegrations[crm.id];

                  return (
                    <div key={crm.id} className={`bg-[#151515] border ${isConnected ? 'border-[#10b981]/30' : 'border-white/10'} rounded-2xl p-6 flex flex-col justify-between hover:border-white/20 transition-colors relative overflow-hidden`}>
                      {isConnected && (
                        <div className="absolute top-0 right-0 w-16 h-16 bg-[#10b981]/10 rounded-bl-[100%] flex items-start justify-end p-2 pointer-events-none">
                          <CheckCircle2 size={16} className="text-[#10b981]" />
                        </div>
                      )}
                      
                      <div>
                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-4">
                          <Icon size={24} className={crm.color} />
                        </div>
                        <h3 className="font-bold text-lg text-white mb-1">{crm.name}</h3>
                        <p className="text-xs text-white/50 mb-6">
                          Status: {isConnected ? <span className="text-[#10b981] font-bold">Conectado (Sincronizando)</span> : <span className="text-red-500 font-bold">Desconectado</span>}
                        </p>
                      </div>
                      
                      {isConnected ? (
                        <button onClick={() => handleDisconnectApi(crm.id)} className="w-full py-3 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl text-sm font-bold transition-colors">
                          Desconectar
                        </button>
                      ) : (
                        <button onClick={() => setActiveCrmModal(crm.id)} className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold transition-colors">
                          Configurar API
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Modal Novo Usuário */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4" onClick={() => setIsModalOpen(false)}>
          <div className="bg-[#151515] border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <h3 className="text-2xl font-display font-bold text-white mb-6">Cadastrar Usuário</h3>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2 block">Nome Completo</label>
                <input required type="text" value={novoUser.nome} onChange={e => setNovoUser({...novoUser, nome: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors" placeholder="Ex: João Silva" />
              </div>
              <div>
                <label className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2 block">Login de Acesso</label>
                <input required type="text" value={novoUser.usuario} onChange={e => setNovoUser({...novoUser, usuario: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white font-mono focus:outline-none focus:border-red-500 transition-colors" placeholder="ex: joao.sdr" />
              </div>
              <div>
                <label className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2 block">Senha Provisória</label>
                <input required type="password" value={novoUser.senha} onChange={e => setNovoUser({...novoUser, senha: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white font-mono focus:outline-none focus:border-red-500 transition-colors" placeholder="••••••••" />
              </div>
              <div>
                <label className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2 block">Cargo</label>
                <select value={novoUser.cargo} onChange={e => setNovoUser({...novoUser, cargo: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors">
                  <option value="SDR">SDR (Recepção)</option>
                  <option value="Closer">Closer (Especialista)</option>
                  <option value="BDR">BDR (Prospecção)</option>
                  <option value="Gestor">Gestor / Coordenador</option>
                  <option value="Admin Supremo">Admin Supremo</option>
                </select>
              </div>
              <div className="flex gap-4 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition-colors">Cancelar</button>
                <button type="submit" disabled={salvando} className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors flex justify-center items-center">
                  {salvando ? <Loader2 size={20} className="animate-spin" /> : 'Salvar Usuário'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal API CRM */}
      {activeCrmModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4" onClick={() => setActiveCrmModal(null)}>
          <div className="bg-[#151515] border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                <Link2 size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-display font-bold text-white">Conectar {crms.find(c => c.id === activeCrmModal)?.name}</h3>
                <p className="text-xs text-white/50">Autorize o Hub a ler os dados ponta a ponta.</p>
              </div>
            </div>
            
            <form onSubmit={handleSaveApi} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2 block">Chave de Integração (API Key / Token)</label>
                <input 
                  required 
                  type="text" 
                  value={apiKey} 
                  onChange={e => setApiKey(e.target.value)} 
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white font-mono focus:outline-none focus:border-[#10b981] transition-colors" 
                  placeholder="Cole sua chave aqui..." 
                />
                <p className="text-[10px] text-white/30 mt-2">Você encontra essa chave nas configurações de desenvolvedor/integração do seu CRM.</p>
              </div>
              <div className="flex gap-4 mt-8">
                <button type="button" onClick={() => { setActiveCrmModal(null); setApiKey(''); }} className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition-colors">Cancelar</button>
                <button type="submit" className="flex-1 bg-[#10b981] hover:bg-[#059669] text-white font-bold py-3 rounded-xl transition-colors flex justify-center items-center">
                  Conectar CRM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
