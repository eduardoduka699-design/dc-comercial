import React from 'react';
import { X, ExternalLink, Download, Play, Calendar, Clock, User, HardDrive, ShieldCheck } from 'lucide-react';

export default function CallsPlayerModal({ call, onClose }) {
  if (!call) return null;

  const fileId = call.drive_file_id;
  const embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
  const viewUrl = call.drive_url || `https://drive.google.com/file/d/${fileId}/view`;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-5xl bg-[#121319] border border-white/15 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col max-h-[94vh] text-white relative animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header do Player */}
        <div className="flex items-start justify-between pb-3.5 border-b border-white/10 gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-blue/20 text-brand-blue border border-brand-blue/40">
                <Play size={11} className="fill-brand-blue" />
                Player de Call Integrado
              </span>
              <span className="text-xs text-white/50 font-mono">• Google Drive HD</span>
            </div>
            <h3 className="text-lg sm:text-xl font-display font-black text-white truncate">
              {call.titulo}
            </h3>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={viewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white/90 text-xs font-bold transition-colors cursor-pointer"
              title="Abrir no Google Drive oficial"
            >
              <span>Abrir no Drive</span>
              <ExternalLink size={13} />
            </a>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Fechar Player"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Área do Player de Vídeo do Google Drive */}
        <div className="my-3.5 w-full aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 relative shadow-inner">
          <iframe
            src={embedUrl}
            title={call.titulo}
            className="w-full h-full border-none"
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        </div>

        {/* Metadados e Informações da Gravação */}
        <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-white/70">
          <div className="flex items-center gap-4 flex-wrap">
            {call.closer && (
              <span className="flex items-center gap-1.5 text-white/80">
                <User size={13} className="text-brand-blue" />
                Closer: <strong className="text-white">{call.closer}</strong>
              </span>
            )}

            {call.data_gravacao && (
              <span className="flex items-center gap-1.5 text-white/80">
                <Calendar size={13} className="text-purple-400" />
                Data: <strong className="text-white font-mono">{call.data_gravacao}</strong>
              </span>
            )}

            {call.duracao && (
              <span className="flex items-center gap-1.5 text-white/80">
                <Clock size={13} className="text-amber-400" />
                Duração: <strong className="text-white">{call.duracao}</strong>
              </span>
            )}

            {call.tamanho && (
              <span className="flex items-center gap-1.5 text-white/80">
                <HardDrive size={13} className="text-emerald-400" />
                Tamanho: <strong className="text-white">{call.tamanho}</strong>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <a
              href={viewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-white border border-emerald-500/40 text-xs font-bold transition-all cursor-pointer"
            >
              <Download size={13} />
              <span>Baixar Arquivo Original</span>
            </a>
          </div>
        </div>

        {call.descricao && (
          <div className="mt-2.5 p-3 rounded-xl bg-[#0a0a0d] border border-white/5 text-xs text-white/70 leading-relaxed">
            <strong className="text-white block mb-0.5">Pontos Chave da Gravação:</strong>
            {call.descricao}
          </div>
        )}
      </div>
    </div>
  );
}
