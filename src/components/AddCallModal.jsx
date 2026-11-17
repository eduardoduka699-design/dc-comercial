import React, { useState } from 'react';
import { X, Plus, ExternalLink, HardDrive, Check, AlertCircle } from 'lucide-react';
import { extractDriveFileId, DRIVE_FOLDER_URL } from '../services/trainingService';

export default function AddCallModal({ isOpen, onClose, onSave }) {
  const [titulo, setTitulo] = useState('');
  const [driveUrl, setDriveUrl] = useState('');
  const [closer, setCloser] = useState('Gabriel Vidal');
  const [duracao, setDuracao] = useState('45 min');
  const [tamanho, setTamanho] = useState('MP4');
  const [descricao, setDescricao] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const fileId = extractDriveFileId(driveUrl);
    if (!fileId || fileId.length < 15) {
      setError('Por favor, informe um link válido do Google Drive ou o ID do arquivo.');
      return;
    }

    if (!titulo.trim()) {
      setError('Informe um título para a gravação da call.');
      return;
    }

    setSaving(true);
    try {
      await onSave({
        titulo: titulo.trim(),
        drive_file_id: fileId,
        drive_url: driveUrl.includes('drive.google.com') ? driveUrl.trim() : `https://drive.google.com/file/d/${fileId}/view`,
        closer: closer.trim(),
        duracao: duracao.trim(),
        tamanho: tamanho.trim(),
        descricao: descricao.trim(),
        data_gravacao: new Date().toISOString().slice(0, 10),
        tipo: 'call'
      });
      onClose();
    } catch (err) {
      setError('Erro ao salvar gravação: ' + (err.message || 'Tente novamente'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg bg-[#121319] border border-white/15 rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col text-white relative animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between pb-3.5 border-b border-white/10 gap-4">
          <div>
            <h3 className="text-xl font-display font-black text-white">Vincular Nova Gravação</h3>
            <p className="text-xs text-white/50 mt-0.5">
              Adicione uma nova call gravada do Google Drive à plataforma.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mt-3 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1">
              Título da Call *
            </label>
            <input 
              type="text"
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
              placeholder="Ex: Reunião 2 - 18.11.2026 - Fechamento Lei Seca"
              className="w-full bg-[#0a0a0d] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-blue"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1">
              Link do Vídeo no Google Drive (ou File ID) *
            </label>
            <input 
              type="text"
              value={driveUrl}
              onChange={e => setDriveUrl(e.target.value)}
              placeholder="https://drive.google.com/file/d/1kZHgpB6qrBENc574v.../view"
              className="w-full bg-[#0a0a0d] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-brand-blue"
              required
            />
            <span className="text-[10px] text-white/40 mt-1 block">
              Copie o link de compartilhamento do arquivo de vídeo da pasta oficial do Drive.
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1">
                Closer / Responsável
              </label>
              <input 
                type="text"
                value={closer}
                onChange={e => setCloser(e.target.value)}
                placeholder="Gabriel Vidal"
                className="w-full bg-[#0a0a0d] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1">
                Duração Estimada
              </label>
              <input 
                type="text"
                value={duracao}
                onChange={e => setDuracao(e.target.value)}
                placeholder="45 min"
                className="w-full bg-[#0a0a0d] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-blue"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1">
              Pontos Abordados / Descrição da Call
            </label>
            <textarea 
              rows={2}
              value={descricao}
              onChange={e => setDescricao(e.target.value)}
              placeholder="Ex: Análise de postura, objeção de valor dos honorários e apresentação da garantia técnica..."
              className="w-full bg-[#0a0a0d] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-blue"
            />
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
            <a
              href={DRIVE_FOLDER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-brand-blue hover:underline flex items-center gap-1 font-medium"
            >
              <span>Abrir pasta no Drive</span>
              <ExternalLink size={12} />
            </a>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-xl bg-brand-blue hover:bg-blue-600 text-white text-xs font-bold transition-colors shadow-sm cursor-pointer disabled:opacity-50"
              >
                {saving ? 'Salvando...' : 'Salvar Gravação'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
