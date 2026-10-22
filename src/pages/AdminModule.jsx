import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShieldAlert, Users, UserPlus, Key, Trash2, Edit3, Loader2, Link2, Settings, CheckCircle2, Zap, Calculator, Copy, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import ReverseCalculator from '../components/ReverseCalculator';

export default function AdminModule() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('usuarios');
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [novoUser, setNovoUser] = useState({ nome: '', usuario: '', senha: '', cargo: 'SDR' });
  
  // Editar Usuário State
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ nome: '', cargo: 'SDR', status: 'Ativo', senha: '' });

  // Sidebar State
  const [isAdminCollapsed, setIsAdminCollapsed] = useState(false);

  // Integrações State
  const [activeCrmModal, setActiveCrmModal] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const webhookUrl = 'https://dc-comercial.vercel.app/api/webhook/legendary';

  const handleCopyWebhook = () => {
    try {
      navigator.clipboard.writeText(webhookUrl);
      setCopiedWebhook(true);
      setTimeout(() => setCopiedWebhook(false), 2500);
    } catch {
      alert('URL copiada: ' + webhookUrl);
    }
  };

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
    try {
      const data = await userService.getUsers();
      setUsuarios(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Erro ao buscar usuários:', e);
      setUsuarios([]);
    }
    setLoading(false);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!novoUser.nome || !novoUser.usuario || !novoUser.senha) return;
    
    setSalvando(true);
    const result = await userService.createUser({
      nome: novoUser.nome,
      usuario: novoUser.usuario,
      senha: novoUser.senha,
      cargo: novoUser.cargo
    });

    if (!result.success) {
      alert('Aviso: ' + (result.error || 'Erro ao criar usuário'));
    } else if (result.data) {
      setUsuarios(prev => [result.data, ...prev.filter(u => u.id !== result.data.id)]);
      setIsModalOpen(false);
      setNovoUser({ nome: '', usuario: '', senha: '', cargo: 'SDR' });
    }
    setSalvando(false);
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setEditForm({
      nome: user.nome || '',
      cargo: user.cargo || 'SDR',
      status: user.status || 'Ativo',
      senha: ''
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    if (!editForm.nome.trim()) {
      alert('Por favor, informe o nome do colaborador.');
      return;
    }

    setSalvando(true);
    const result = await userService.updateUser(editingUser.id, {
      nome: editForm.nome,
      cargo: editForm.cargo,
      status: editForm.status,
      senha: editForm.senha
    });

    if (result.success && result.data) {
      setUsuarios(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...result.data } : u));
      setEditingUser(null);
    } else {
      alert('Erro ao atualizar usuário: ' + (result.error || 'Falha ao salvar'));
    }
    setSalvando(false);
  };

  const removerUsuario = async (id, cargo) => {
    if (cargo === 'Admin Supremo') {
      alert("Você não pode remover o Admin Supremo!");
      return;
    }
    if (window.confirm("Tem certeza que deseja remover este usuário permanentemente?")) {
      const result = await userService.deleteUser(id, cargo);
      if (result.success) {
        setUsuarios(usuarios.filter(u => u.id !== id));
      } else {
        alert('Erro ao remover: ' + (result.error || 'Falha ao excluir'));
      }
    }
  };

  const handleSaveApi = (e) => {
    e.preventDefault();
    if (!activeCrmModal) return;
    const token = apiKey.trim() || 'webhook_active';
    setSavedIntegrations(prev => ({
      ...prev,
      [activeCrmModal]: token
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
    try {
      const d = new Date(dateString);
      return isNaN(d.getTime()) ? 'Nunca' : d.toLocaleString('pt-BR');
    } catch {
      return 'Nunca';
    }
  };

  const crms = [
    { id: 'legendary', name: 'Legendary Hub (CRM)', icon: Zap, color: 'text-[#10b981]' },
    { id: 'kommo', name: 'Kommo (amoCRM)', icon: Link2, color: 'text-brand-blue' },
    { id: 'rd', name: 'RD Station Marketing', icon: Link2, color: 'text-[#f59e0b]' },
    { id: 'pipedrive', name: 'Pipedrive', icon: Link2, color: 'text-[#10b981]' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex flex-col" translate="no">
      <div className="flex flex-1 overflow-hidden">
        <aside className={`${isAdminCollapsed ? 'w-20' : 'w-64'} border-r border-white/10 bg-[#101010] flex flex-col shrink-0 p-4 relative transition-all duration-300 select-none`}>
          {/* Botão de Recolher no Centro da Borda */}
          <button
            type="button"
            onClick={() => setIsAdminCollapsed(!isAdminCollapsed)}
            className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#1a1a1a] hover:bg-red-600 border border-white/20 hover:border-red-600 rounded-full flex items-center justify-center text-white/80 hover:text-white shadow-xl cursor-pointer z-40 transition-all hover:scale-110 focus:outline-none"
            title={isAdminCollapsed ? "Expandir menu de Gestão" : "Recolher menu de Gestão"}
          >
            {isAdminCollapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
          </button>

          {!isAdminCollapsed && (
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-4 px-3 animate-in fade-in">
              Gestão Master
            </p>
          )}

          <div className="space-y-2">
            <button 
              onClick={() => setActiveTab('usuarios')}
              title={isAdminCollapsed ? "Usuários e Acessos" : undefined}
              className={`w-full flex items-center ${isAdminCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'} rounded-xl font-medium text-sm transition-colors ${
                activeTab === 'usuarios' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'text-white/50 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Users size={18} className="shrink-0" />
              {!isAdminCollapsed && <span className="whitespace-nowrap animate-in fade-in">Usuários e Acessos</span>}
            </button>
            <button 
              onClick={() => setActiveTab('integracoes')}
              title={isAdminCollapsed ? "Integrações (CRM)" : undefined}
              className={`w-full flex items-center ${isAdminCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'} rounded-xl font-medium text-sm transition-colors ${
                activeTab === 'integracoes' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'text-white/50 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Settings size={18} className="shrink-0" />
              {!isAdminCollapsed && <span className="whitespace-nowrap animate-in fade-in">Integrações (CRM)</span>}
            </button>
            <button 
              onClick={() => setActiveTab('metas')}
              title={isAdminCollapsed ? "Engenharia de Metas" : undefined}
              className={`w-full flex items-center ${isAdminCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'} rounded-xl font-medium text-sm transition-colors ${
                activeTab === 'metas' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'text-white/50 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Calculator size={18} className="shrink-0" />
              {!isAdminCollapsed && <span className="whitespace-nowrap animate-in fade-in">Engenharia de Metas</span>}
            </button>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-8">
          {activeTab === 'usuarios' && (
            <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-10 flex justify-between items-end">
                <div>
                  <h2 className="text-3xl font-display font-black mb-2">Controle de Acessos</h2>
                  <p className="text-white/50 max-w-2xl">Gerencie quem pode acessar a plataforma. Clique no nome ou no botão de editar para alterar dados do usuário.</p>
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
                  <h3 className="text-lg font-bold text-white">Usuários Cadastrados ({Array.isArray(usuarios) ? usuarios.length : 0})</h3>
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
                        {(Array.isArray(usuarios) ? usuarios : []).map((user) => (
                          <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                            <td 
                              className="p-4 pl-6 font-bold text-white cursor-pointer hover:text-brand-blue transition-colors group/cell"
                              onClick={() => handleOpenEdit(user)}
                              title="Clique para editar usuário"
                            >
                              <div className="flex items-center gap-2">
                                <span>{user.nome}</span>
                                <Edit3 size={14} className="text-white/20 group-hover/cell:text-brand-blue transition-colors" />
                              </div>
                            </td>
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
                              <div className="flex items-center justify-end gap-2">
                                <button 
                                  onClick={() => handleOpenEdit(user)} 
                                  className="p-2 bg-white/5 hover:bg-brand-blue/20 text-white/70 hover:text-brand-blue rounded-lg transition-colors border border-white/5 hover:border-brand-blue/30" 
                                  title="Editar Usuário"
                                >
                                  <Edit3 size={15} />
                                </button>
                                {user.cargo !== 'Admin Supremo' && (
                                  <button 
                                    onClick={() => removerUsuario(user.id, user.cargo)} 
                                    className="p-2 bg-white/5 hover:bg-red-500/20 text-white/70 hover:text-red-500 rounded-lg transition-colors border border-white/5 hover:border-red-500/30" 
                                    title="Excluir Usuário"
                                  >
                                    <Trash2 size={15} />
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
                        <div className="flex gap-2 w-full">
                          <button 
                            onClick={() => {
                              setActiveCrmModal(crm.id);
                              const existing = savedIntegrations[crm.id];
                              setApiKey(existing && existing !== 'webhook_active' ? existing : '');
                            }} 
                            className="flex-1 py-3 px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold transition-colors text-white"
                          >
                            Configurações
                          </button>
                          <button 
                            onClick={() => handleDisconnectApi(crm.id)} 
                            className="py-3 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl text-xs font-bold transition-colors"
                          >
                            Desconectar
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => {
                            setActiveCrmModal(crm.id);
                            const existing = savedIntegrations[crm.id];
                            setApiKey(existing && existing !== 'webhook_active' ? existing : '');
                          }} 
                          className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold transition-colors"
                        >
                          Configurar API
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'metas' && (
            <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
              <ReverseCalculator hideNavigation onSaveGoals={() => {}} />
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

      {/* Modal Editar Usuário */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4" onClick={() => setEditingUser(null)}>
          <div className="bg-[#151515] border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-brand-blue/10 text-brand-blue rounded-xl border border-brand-blue/20">
                  <Edit3 size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-white">Editar Usuário</h3>
                  <p className="text-xs text-white/50">Altere o nome e configurações de acesso</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2 block">Nome Completo</label>
                <input 
                  required 
                  type="text" 
                  value={editForm.nome} 
                  onChange={e => setEditForm({...editForm, nome: e.target.value})} 
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-blue transition-colors" 
                  placeholder="Nome do colaborador" 
                />
              </div>

              <div>
                <label className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2 block">Login de Acesso</label>
                <input 
                  type="text" 
                  disabled 
                  value={editingUser.usuario} 
                  className="w-full bg-[#0a0a0a]/50 border border-white/5 rounded-xl px-4 py-3 text-white/40 font-mono cursor-not-allowed" 
                />
                <p className="text-[10px] text-white/30 mt-1">O login é identificador único do usuário.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2 block">Cargo</label>
                  <select 
                    value={editForm.cargo} 
                    onChange={e => setEditForm({...editForm, cargo: e.target.value})} 
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-blue transition-colors text-sm"
                  >
                    <option value="SDR">SDR (Recepção)</option>
                    <option value="Closer">Closer (Especialista)</option>
                    <option value="BDR">BDR (Prospecção)</option>
                    <option value="Gestor">Gestor / Coordenador</option>
                    <option value="Admin Supremo">Admin Supremo</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2 block">Status</label>
                  <select 
                    value={editForm.status} 
                    onChange={e => setEditForm({...editForm, status: e.target.value})} 
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-blue transition-colors text-sm"
                  >
                    <option value="Ativo">Ativo</option>
                    <option value="Inativo">Inativo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2 block">Redefinir Senha (Opcional)</label>
                <input 
                  type="password" 
                  value={editForm.senha} 
                  onChange={e => setEditForm({...editForm, senha: e.target.value})} 
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white font-mono focus:outline-none focus:border-brand-blue transition-colors" 
                  placeholder="Deixe em branco para manter a atual" 
                />
              </div>

              <div className="flex gap-4 mt-8">
                <button 
                  type="button" 
                  onClick={() => setEditingUser(null)} 
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={salvando} 
                  className="flex-1 bg-brand-blue hover:bg-brand-blue/90 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors flex justify-center items-center shadow-lg shadow-brand-blue/20"
                >
                  {salvando ? <Loader2 size={20} className="animate-spin" /> : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal API CRM */}
      {activeCrmModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4" onClick={() => setActiveCrmModal(null)}>
          <div className="bg-[#151515] border border-white/10 rounded-2xl p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                <Link2 size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-display font-bold text-white">Conectar {crms.find(c => c.id === activeCrmModal)?.name}</h3>
                <p className="text-xs text-white/50">Sincronização em tempo real de leads e funis.</p>
              </div>
            </div>
            
            {activeCrmModal === 'legendary' && (
              <div className="mb-6 p-4 rounded-xl bg-brand-blue/10 border border-brand-blue/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-blue uppercase tracking-wider flex items-center gap-1.5">
                    <Zap size={14} /> Webhook em Tempo Real (Recomendado)
                  </span>
                  <span className="text-[10px] bg-brand-blue/20 text-brand-blue px-2 py-0.5 rounded font-bold">Ativo</span>
                </div>
                <p className="text-xs text-white/70 leading-relaxed">
                  No seu <strong>Legendary Hub II</strong>, clique no botão azul <strong>+ Adicionar Projeto</strong> (ou em <strong>Integração Api</strong>) e cadastre esta URL para receber os leads na hora:
                </p>
                <div className="flex items-center gap-2 bg-[#0a0a0a] p-2 rounded-lg border border-white/10">
                  <input 
                    type="text" 
                    readOnly 
                    value={webhookUrl} 
                    className="w-full bg-transparent text-xs text-brand-blue font-mono focus:outline-none select-all"
                  />
                  <button 
                    type="button" 
                    onClick={handleCopyWebhook} 
                    className="px-3 py-1.5 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-md text-xs font-bold transition-all flex items-center gap-1 shrink-0"
                  >
                    {copiedWebhook ? <Check size={14} /> : <Copy size={14} />}
                    {copiedWebhook ? 'Copiado!' : 'Copiar'}
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSaveApi} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2 block">
                  {activeCrmModal === 'legendary' ? 'Token / Credencial da API (Opcional para puxar histórico)' : 'Chave de Integração (API Key / Token)'}
                </label>
                <input 
                  type="text" 
                  value={apiKey} 
                  onChange={e => setApiKey(e.target.value)} 
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white font-mono focus:outline-none focus:border-[#10b981] transition-colors" 
                  placeholder={activeCrmModal === 'legendary' ? 'Cole o Bearer Token gerado em Credenciais API...' : 'Cole sua chave aqui...'} 
                />
                <p className="text-[10px] text-white/30 mt-2">
                  {activeCrmModal === 'legendary' 
                    ? 'No menu lateral do Legendary Hub II, clique em "Credenciais API" para gerar e copiar seu Token.' 
                    : 'Você encontra essa chave nas configurações de desenvolvedor/integração do seu CRM.'}
                </p>
              </div>
              <div className="flex gap-4 mt-8">
                <button type="button" onClick={() => { setActiveCrmModal(null); setApiKey(''); }} className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition-colors">Cancelar</button>
                <button type="submit" className="flex-1 bg-[#10b981] hover:bg-[#059669] text-white font-bold py-3 rounded-xl transition-colors flex justify-center items-center">
                  Salvar Conexão
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
