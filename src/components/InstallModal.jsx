import React from 'react';
import { X, Smartphone, Monitor, Share2, PlusSquare, CheckCircle, Download } from 'lucide-react';

export default function InstallModal({ isOpen, onClose, isIOS }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-[#141414] border border-white/10 rounded-3xl p-6 shadow-2xl relative text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors"
          title="Fechar"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 bg-brand-blue rounded-2xl flex items-center justify-center shadow-lg shadow-brand-blue/30 text-white shrink-0">
            <Download size={22} />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-white">Instalar o DashClient</h3>
            <p className="text-xs text-white/50">Acesse com 1 toque direto da sua tela inicial</p>
          </div>
        </div>

        {isIOS ? (
          /* Instruções para iPhone / iPad */
          <div className="space-y-4 text-sm bg-[#0c0c0c] border border-white/5 p-4 rounded-2xl">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-brand-blue flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs border border-blue-500/20">
                1
              </div>
              <p className="text-white/80 text-xs leading-relaxed">
                No Safari do seu iPhone, toque no botão de <strong className="text-white">Compartilhar</strong> (ícone do quadrado com seta para cima <Share2 size={13} className="inline text-brand-blue mx-0.5" />) na barra inferior.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-brand-blue flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs border border-blue-500/20">
                2
              </div>
              <p className="text-white/80 text-xs leading-relaxed">
                Role para baixo e selecione a opção <strong className="text-white">"Adicionar à Tela de Início"</strong> (<PlusSquare size={13} className="inline text-brand-blue mx-0.5" />).
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-brand-blue flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs border border-blue-500/20">
                3
              </div>
              <p className="text-white/80 text-xs leading-relaxed">
                Toque em <strong className="text-white">"Adicionar"</strong> no canto superior direito. O DashClient aparecerá como um aplicativo nativo!
              </p>
            </div>
          </div>
        ) : (
          /* Instruções para Android / Computador */
          <div className="space-y-4 text-sm bg-[#0c0c0c] border border-white/5 p-4 rounded-2xl">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-brand-blue flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs border border-blue-500/20">
                <Smartphone size={14} />
              </div>
              <div>
                <p className="font-bold text-xs text-white">No Celular (Android / Chrome):</p>
                <p className="text-white/70 text-xs leading-relaxed mt-0.5">
                  Toque nos <strong className="text-white">três pontinhos (⋮)</strong> no canto superior direito do Chrome e selecione <strong className="text-white">"Instalar aplicativo"</strong> ou <strong className="text-white">"Adicionar à tela inicial"</strong>.
                </p>
              </div>
            </div>

            <div className="border-t border-white/5 pt-3 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-brand-blue flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs border border-blue-500/20">
                <Monitor size={14} />
              </div>
              <div>
                <p className="font-bold text-xs text-white">No Computador (Chrome / Edge):</p>
                <p className="text-white/70 text-xs leading-relaxed mt-0.5">
                  Clique no ícone de <strong className="text-white">Instalar aplicativo 💻⬇️</strong> na barra de endereços (ao lado da estrela de favoritos) ou no menu do navegador &gt; <strong className="text-white">Instalar DashClient</strong>.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="w-full bg-brand-blue hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-brand-blue/20 text-sm"
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
}
