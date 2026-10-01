import React, { useState } from 'react';
import { Shield, ArrowRight, User, Lock, Zap } from 'lucide-react';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Admin Master Authentication
    if (username === 'addouder' && password === 'addouer') {
      onLogin();
    } else if (username.length >= 3 && password.length >= 4) {
      // Mock validation for other users
      onLogin();
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-main font-sans p-4 relative overflow-hidden" translate="no">
      {/* Decorative background elements */}
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
          <p className="text-text-muted text-sm">Insira suas credenciais para gerenciar a performance do seu negócio.</p>
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
              <a href="#" onClick={(e) => { e.preventDefault(); alert('Em desenvolvimento: Envio de link de recuperação.'); }} className="text-xs font-bold text-brand-blue hover:underline">Esqueci a senha</a>
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
            className="w-full bg-gradient-to-r from-brand-blue to-blue-600 hover:opacity-90 text-white font-display font-bold text-lg rounded-xl py-3.5 flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-blue/20 mt-4"
          >
            Entrar
            <ArrowRight size={20} />
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-text-muted">
            Ainda não tem acesso?{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); alert('Em desenvolvimento: Fluxo de criação de conta.'); }} className="font-bold text-brand-blue hover:underline">
              Criar usuário
            </a>
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-border flex items-center justify-center gap-2 text-xs text-text-muted">
          <Shield size={14} />
          <span>Ambiente corporativo seguro e criptografado.</span>
        </div>
      </div>
    </div>
  );
}
