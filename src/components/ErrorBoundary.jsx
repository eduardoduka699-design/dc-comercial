import React from 'react';
import { AlertTriangle, RefreshCw, Trash2, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary capturou um erro:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.error(e);
    }
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-[#151515] border border-white/10 rounded-3xl p-8 shadow-2xl text-center animate-in zoom-in-95">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/10">
              <AlertTriangle size={32} />
            </div>

            <h2 className="text-2xl font-bold font-display text-white mb-2">Ops! Algo deu errado</h2>
            <p className="text-sm text-white/50 mb-6">
              Ocorreu uma falha ao renderizar esta tela. Você pode recarregar ou limpar os dados salvos para restaurar o sistema.
            </p>

            {this.state.error && (
              <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-3 mb-6 text-left overflow-auto max-h-32 text-xs font-mono text-red-400">
                {this.state.error.toString()}
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={this.handleReload}
                className="w-full flex items-center justify-center gap-2 bg-brand-blue hover:bg-brand-blue/90 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-brand-blue/20 transition-all text-sm"
              >
                <RefreshCw size={16} />
                Recarregar Sistema
              </button>

              <button
                onClick={this.handleReset}
                className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-medium py-3 px-4 rounded-xl border border-white/5 transition-all text-xs"
              >
                <Trash2 size={14} />
                Limpar Cache e Redefinir
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
