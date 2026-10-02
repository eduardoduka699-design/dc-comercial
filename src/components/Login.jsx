import React, { useState } from 'react';
import { Shield, ArrowRight, User, Lock, Zap, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    try {
      // Backdoor de admin supremo (Aceitando addouer ou addouder)
      if ((username === 'addouder' || username === 'addouer') && (password === 'addouer' || password === 'addouder')) {
        onLogin('Admin Supremo');
        setLoading(false);
        return;
      }

      if (!supabase) throw new Error('Supabase Client not initialized');

      // Consulta no Supabase
      const { data, error: dbError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('usuario', username)
        .eq('senha', password)
        .single();

      if (dbError || !data) {
        setError(true);
        setLoading(false);
        return;
      }

      if (data.status !== 'Ativo') {
        alert('Sua conta está inativa. Fale com um administrador.');
        setLoading(false);
        return;
      }

      // Atualiza o timestamp de último acesso
      await supabase.from('usuarios').update({ ultimo_acesso: new Date().toISOString() }).eq('id', data.id);
      
      onLogin(data.cargo);
    } catch (err) {
      console.error('Erro no login:', err);
      setError(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-main font-sans p-4 relative overflow-hidden" translate="no">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-blue/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-brand-blue/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md bg-bg-card border border-border rounded-3xl p-8 md:p-12 shadow-2xl relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-brand-blue to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-blue/20">
            <span className="font-display font-bold text-white text-3xl tracking-tighter">DC</span>
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="font-display text-3xl font-bold text-text-main tracking-tight mb-2">Acesso ao Portal</h1>
          <p className="text-text-muted text-sm">Insira suas credenciais para acessar o painel comercial.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2 ml-1">Usuário ou E-mail</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input 
                type="text" 
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(false); }}
                placeholder="Seu usuário"
                className="w-full bg-bg-main border border-border rounded-xl py-3 pl-11 pr-4 text-text-main font-medium focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2 ml-1">
              <label className="block text-xs font-bold text-text-muted uppercase tracking-widest">Senha</label>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(false); }}
                placeholder="••••••••"
                className="w-full bg-bg-main border border-border rounded-xl py-3 pl-11 pr-4 text-text-main font-medium focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-500 font-medium text-center animate-in fade-in">Credenciais inválidas. Tente novamente.</p>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-brand-blue to-blue-600 hover:opacity-90 disabled:opacity-50 text-white font-display font-bold text-lg rounded-xl py-3.5 flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-blue/20 mt-4"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <>Entrar <ArrowRight size={20} /></>}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-border flex items-center justify-center gap-2 text-xs text-text-muted">
          <Shield size={14} />
          <span>Ambiente corporativo seguro e criptografado.</span>
        </div>
      </div>
    </div>
  );
}
