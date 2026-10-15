import React, { useState } from 'react';
import { Shield, ArrowRight, User, Lock, Zap, Loader2, UserPlus, Eye, EyeOff, KeyRound } from 'lucide-react';
import { userService } from '../services/userService';

export default function Login({ onLogin }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [nome, setNome] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [cargo, setCargo] = useState('SDR');
  const [isGestor, setIsGestor] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isResetting) {
        if (!username.trim() || !password.trim()) {
          setError('Preencha o usuário e a nova senha.');
          setLoading(false);
          return;
        }

        const res = await userService.resetPassword(username, password);
        if (!res.success) {
          setError(res.error || 'Erro ao redefinir a senha.');
          setLoading(false);
          return;
        }

        alert('Senha redefinida com sucesso! Faça login com a nova senha.');
        setIsResetting(false);
        setPassword('');
        
      } else if (isRegistering) {
        if (!nome.trim() || !username.trim() || !password.trim()) {
          setError('Preencha todos os campos.');
          setLoading(false);
          return;
        }

        const finalCargo = isGestor ? `${cargo} + Gestor` : cargo;

        const res = await userService.createUser({
          nome,
          usuario: username,
          senha: password,
          cargo: finalCargo
        });

        if (!res.success) {
          setError(res.error || 'Erro ao criar conta.');
          setLoading(false);
          return;
        }

        // Login automático com o cargo cadastrado
        onLogin(finalCargo);
        
      } else {
        // Fluxo de Login
        const res = await userService.loginUser(username, password);

        if (!res.success) {
          setError(res.error || 'Credenciais inválidas. Tente novamente.');
          setLoading(false);
          return;
        }

        onLogin(res.user.cargo);
      }
    } catch (err) {
      console.error('Erro no fluxo de login:', err);
      setError('Erro ao processar. Tente novamente.');
    }
    setLoading(false);
  };

  const getTitle = () => {
    if (isResetting) return 'Redefinir Senha';
    if (isRegistering) return 'Criar Conta';
    return 'Acesso ao Portal';
  };

  const getSubtitle = () => {
    if (isResetting) return 'Digite seu usuário e a nova senha desejada.';
    if (isRegistering) return 'Preencha os dados para se cadastrar na equipe.';
    return 'Insira suas credenciais para acessar o painel comercial.';
  };

  const getButtonText = () => {
    if (isResetting) return <>Redefinir <KeyRound size={20} /></>;
    if (isRegistering) return <>Cadastrar <UserPlus size={20} /></>;
    return <>Entrar <ArrowRight size={20} /></>;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-main font-sans p-4 relative overflow-hidden" translate="no">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-blue/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-brand-blue/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md bg-bg-card border border-border rounded-3xl p-8 md:p-12 shadow-2xl relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-brand-blue rounded-2xl flex items-center justify-center shadow-lg shadow-brand-blue/20">
              <span className="font-bold text-white text-2xl tracking-tighter">DC</span>
            </div>
            <div className="flex flex-col justify-center text-left">
              <h1 className="font-bold text-3xl leading-none tracking-tight text-white">DashClient</h1>
              <span className="text-[10px] tracking-[0.25em] text-white/50 font-bold uppercase mt-1 leading-none">Gabriel Vidal</span>
            </div>
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="font-display text-3xl font-bold text-text-main tracking-tight mb-2">
            {getTitle()}
          </h1>
          <p className="text-text-muted text-sm">
            {getSubtitle()}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {isRegistering && !isResetting && (
            <div className="animate-in fade-in slide-in-from-top-2 space-y-5">
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2 ml-1">Nome Completo</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                  <input 
                    type="text" 
                    value={nome}
                    onChange={(e) => { setNome(e.target.value); setError(''); }}
                    placeholder="Seu nome completo"
                    className="w-full bg-bg-main border border-border rounded-xl py-3 pl-11 pr-4 text-text-main font-medium focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2 ml-1">Seu Cargo / Função</label>
                <select 
                  value={cargo}
                  onChange={(e) => setCargo(e.target.value)}
                  className="w-full bg-bg-main border border-border rounded-xl py-3 px-4 text-text-main font-medium focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all appearance-none"
                >
                  <option value="SDR">SDR (Pré-vendas)</option>
                  <option value="Closer">Closer (Fechamento)</option>
                  <option value="BDR">BDR (Prospecção)</option>
                </select>
              </div>

              <div className="flex items-center gap-3 bg-bg-main border border-border p-3 rounded-xl mt-2">
                <input 
                  type="checkbox" 
                  id="gestor"
                  checked={isGestor}
                  onChange={(e) => setIsGestor(e.target.checked)}
                  className="w-5 h-5 rounded border-border bg-bg-card checked:bg-brand-blue focus:ring-brand-blue cursor-pointer"
                />
                <label htmlFor="gestor" className="text-sm font-bold text-text-main cursor-pointer select-none flex-1">
                  Sou Dono / Gestor da operação
                  <span className="block text-xs font-normal text-text-muted">Isso concederá acesso total ao painel.</span>
                </label>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2 ml-1">Usuário de Acesso</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input 
                type="text" 
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(''); }}
                placeholder="Ex: joao.sdr"
                className="w-full bg-bg-main border border-border rounded-xl py-3 pl-11 pr-4 text-text-main font-medium focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2 ml-1">
              <label className="block text-xs font-bold text-text-muted uppercase tracking-widest">{isResetting ? 'Nova Senha' : 'Senha'}</label>
              {!isRegistering && !isResetting && (
                <button 
                  type="button" 
                  onClick={() => { setIsResetting(true); setError(''); setPassword(''); }}
                  className="text-xs text-brand-blue hover:text-blue-400 font-bold transition-colors"
                >
                  Esqueceu?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="••••••••"
                className="w-full bg-bg-main border border-border rounded-xl py-3 pl-11 pr-12 text-text-main font-medium focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-500 font-medium text-center animate-in fade-in">{error}</p>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-brand-blue to-blue-600 hover:opacity-90 disabled:opacity-50 text-white font-display font-bold text-lg rounded-xl py-3.5 flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-blue/20 mt-4"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : getButtonText()}
          </button>
        </form>

        <div className="mt-8 text-center flex flex-col gap-3">
          {(isRegistering || isResetting) ? (
            <button 
              type="button"
              onClick={() => {
                setIsRegistering(false);
                setIsResetting(false);
                setError('');
              }}
              className="text-sm text-text-muted hover:text-brand-blue font-medium transition-colors"
            >
              Voltar para o Login
            </button>
          ) : (
            <button 
              type="button"
              onClick={() => {
                setIsRegistering(true);
                setIsResetting(false);
                setError('');
              }}
              className="text-sm text-text-muted hover:text-brand-blue font-medium transition-colors"
            >
              Primeiro acesso? Crie sua conta
            </button>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-border flex items-center justify-center gap-2 text-xs text-text-muted">
          <Shield size={14} />
          <span>Ambiente corporativo seguro e criptografado.</span>
        </div>
      </div>
    </div>
  );
}
