import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ReverseCalculator from '../components/ReverseCalculator';

export default function SimuladorModule() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex flex-col">
      {/* Barra superior de navegação */}
      <header className="h-16 border-b border-white/10 bg-black/50 backdrop-blur-md flex items-center px-6 shrink-0 z-50">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-bold tracking-wider uppercase"
        >
          <ArrowLeft size={16} />
          Voltar ao Hub Central
        </button>
        <div className="mx-auto font-display font-bold tracking-widest text-sm bg-brand-blue/20 text-brand-blue px-4 py-1 rounded-full border border-brand-blue/30">
          Ferramenta — Engenharia Reversa
        </div>
        <div className="w-40"></div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-8 overflow-y-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-display font-black mb-2">Simulador de Metas</h2>
          <p className="text-white/50 max-w-2xl">
            Insira o faturamento desejado e o sistema calculará retroativamente quantos leads, atendimentos e propostas sua equipe precisa entregar.
          </p>
        </div>

        {/* Reutilizando o componente que já criamos antes */}
        <div className="bg-[#151515] p-6 rounded-2xl border border-white/10">
          <ReverseCalculator onSaveGoals={(goals) => {
            localStorage.setItem('dc-leiseca-goals', JSON.stringify(goals));
            alert('Metas salvas no sistema principal com sucesso! O módulo Comercial já está atualizado com essas novas metas.');
          }} />
        </div>
      </main>
    </div>
  );
}
