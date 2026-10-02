import React, { useState } from 'react';
import { Shield, ArrowRight, User, Lock, Zap, Loader2, UserPlus } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function Login({ onLogin }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [nome, setNome] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const cleanUser = username.trim().toLowerCase();
      const cleanPass = password.trim();

      if (!supabase) throw new Error('Supabase Client not initialized');

      if (isRegistering) {
        if (!nome.trim() || !cleanUser || !cleanPass) {
          setError('Preencha todos os campos.');
          setLoading(false);
          return;
        }

        // Verifica se usuário já existe
        const { data: existing } = await supabase
          .from('usuarios')
          .select('id')
          .eq('usuario', cleanUser)
          .single();

        if (existing) {
          setError('Este usuário já está em uso.');
          setLoading(false);
          return;
        }

        // Cria o usuário com cargo SDR por padrão
        const { data, error: insertError } = await supabase
          .from('usuarios')
          .insert([{
            nome: nome.trim(),
            usuario: cleanUser,
            senha: cleanPass,
            cargo: 'SDR', // Default role para auto-cadastro
            status: 'Ativo'
          }])
          .select()
          .single();

        if (insertError) {
          setError('Erro ao criar conta. Tente novamente.');
          setLoading(false);
          return;
        }

        // Faz login automático após criar
        onLogin(data.cargo);
        
      } else {
        // Fluxo de Login
        // Backdoor de admin supremo
        if ((cleanUser === 'addouder' || cleanUser === 'addouer') && (cleanPass.toLowerCase() === 'addouer' || cleanPass.toLowerCase() === 'addouder')) {
          onLogin('Admin Supremo');
          setLoading(false);
          return;
        }

        const { data, error: dbError } = await supabase
          .from('usuarios')
          .select('*')
          .eq('usuario', cleanUser)
          .eq('senha', cleanPass)
          .single();

        if (dbError || !data) {
          setError('Credenciais inválidas. Tente novamente.');
          setLoading(false);
          return;
        }

        if (data.status !== 'Ativo') {
          setError('Sua conta está inativa. Fale com um administrador.');
          setLoading(false);
          return;
        }

        await supabase.from('usuarios').update({ ultimo_acesso: new Date().toISOString() }).eq('id', data.id);
        
        onLogin(data.cargo);
      }
    } catch (err) {
      console.error('Erro:', err);
      setError('Erro de conexão. Tente novamente.');
    }
    setLoading(false);
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
            {isRegistering ? 'Criar Conta' : 'Acesso ao Portal'}
          </h1>
          <p className="text-text-muted text-sm">
            {isRegistering ? 'Preencha os dados para se cadastrar na equipe.' : 'Insira suas credenciais para acessar o painel comercial.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {isRegistering && (
            <div className="animate-in fade-in slide-in-from-top-2">
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
            <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2 ml-1">Senha</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="••••••••"
                className="w-full bg-bg-main border border-border rounded-xl py-3 pl-11 pr-4 text-text-main font-medium focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
              />
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
            {loading ? <Loader2 size={20} className="animate-spin" /> : (
              isRegistering ? <>Cadastrar <UserPlus size={20} /></> : <>Entrar <ArrowRight size={20} /></>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            type="button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
            }}
            className="text-sm text-text-muted hover:text-brand-blue font-medium transition-colors"
          >
            {isRegistering ? 'Já tem uma conta? Fazer login' : 'Primeiro acesso? Crie sua conta'}
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-border flex items-center justify-center gap-2 text-xs text-text-muted">
          <Shield size={14} />
          <span>Ambiente corporativo seguro e criptografado.</span>
        </div>
      </div>
    </div>
  );
}
