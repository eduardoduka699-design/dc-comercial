import React, { useState } from 'react';
import { X, Search, Phone, ExternalLink, Zap, Clock, ShieldCheck, CheckCircle2, User, Copy, Check } from 'lucide-react';

export default function RealLeadsModal({ isOpen, onClose, leads = [], onRefresh, isRefreshing }) {
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState(false);
  const webhookUrl = 'https://dc-comercial.vercel.app/api/webhook/legendary';

  if (!isOpen) return null;

  const filteredLeads = (leads || []).filter(lead => {
    const q = search.toLowerCase();
    const nome = (lead.nome || '').toLowerCase();
    const tel = (lead.telefone || '').toLowerCase();
    const tags = Array.isArray(lead.tags) ? lead.tags.join(' ').toLowerCase() : '';
    const etapa = (lead.etapa_funil || '').toLowerCase();
    return nome.includes(q) || tel.includes(q) || tags.includes(q) || etapa.includes(q);
  });

  const getStageBadge = (etapa) => {
    switch (etapa) {
      case 'fechado':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">Contrato Fechado</span>;
      case 'contrato_enviado':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">Contrato Enviado</span>;
      case 'agendado':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">Consulta Agendada</span>;
      case 'qualificado':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">Qualificado</span>;
      case 'contatado':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30">Contatado</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/10 text-white/70 border border-white/15">Recebido</span>;
    }
  };

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(webhookUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="w-full max-w-4xl bg-[#141416] border border-white/10 rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col max-h-[90vh] text-white relative animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Conexão CRM Ativa (Legendary Hub II)
              </span>
              <span className="text-xs text-white/50">• {leads.length} leads recebidos</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-display font-black text-white">Leads Reais da Operação Comercial</h3>
            <p className="text-xs text-white/50 mt-0.5">
              Alimentados automaticamente via webhook a cada novo contato ou mudança de etiqueta no WhatsApp.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors shrink-0"
            title="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Toolbar: Busca e Ações */}
        <div className="py-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-white/5">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nome, telefone, tag ou etapa..."
              className="w-full bg-[#0a0a0c] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-blue"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white/70 hover:text-white transition-all"
              title="Copiar URL do Webhook do CRM"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? 'URL Copiada!' : 'Copiar URL Webhook'}</span>
            </button>

            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-blue/15 hover:bg-brand-blue text-brand-blue hover:text-white border border-brand-blue/30 text-xs font-bold transition-all shadow-sm"
            >
              <Zap size={14} className={isRefreshing ? 'animate-spin' : ''} />
              <span>{isRefreshing ? 'Sincronizando...' : 'Atualizar'}</span>
            </button>
          </div>
        </div>

        {/* Lista de Leads */}
        <div className="flex-1 overflow-y-auto py-3 space-y-2.5 pr-1 scrollbar-thin">
          {filteredLeads.length === 0 ? (
            <div className="py-12 text-center text-white/40 text-sm">
              Nenhum lead encontrado para "{search}".
            </div>
          ) : (
            filteredLeads.map((lead, idx) => {
              const telRaw = (lead.telefone || '').replace(/\D/g, '');
              const waLink = telRaw ? `https://wa.me/${telRaw}` : null;
              const dateStr = lead.updated_at || lead.atualizado_em || lead.created_at;
              const timeDisplay = dateStr ? new Date(dateStr).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '';

              return (
                <div 
                  key={lead.id || idx} 
                  className="bg-[#0b0b0e] border border-white/5 hover:border-brand-blue/40 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-brand-blue/15 text-brand-blue border border-brand-blue/30 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                      <User size={16} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-sm text-white truncate max-w-[280px] sm:max-w-[360px]">
                          {lead.nome || 'Lead sem nome'}
                        </h4>
                        {getStageBadge(lead.etapa_funil)}
                      </div>

                      <div className="flex items-center gap-3 mt-1 text-xs text-white/50 flex-wrap">
                        {telRaw && (
                          <a 
                            href={waLink} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-emerald-400 hover:underline flex items-center gap-1 font-mono font-medium"
                          >
                            <Phone size={12} />
                            <span>+{telRaw}</span>
                            <ExternalLink size={10} />
                          </a>
                        )}

                        {timeDisplay && (
                          <span className="flex items-center gap-1 text-white/40">
                            <Clock size={11} /> {timeDisplay}
                          </span>
                        )}

                        {lead.atendente && (
                          <span className="text-white/60">
                            Atendente: <strong className="text-white/80">{lead.atendente}</strong>
                          </span>
                        )}
                      </div>

                      {/* Tags */}
                      {Array.isArray(lead.tags) && lead.tags.length > 0 && (
                        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                          {lead.tags.map((t, tidx) => (
                            <span key={tidx} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-white/70 font-medium">
                              🏷️ {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {lead.valor_honorarios > 0 && (
                    <div className="shrink-0 text-right sm:pl-4">
                      <span className="text-[10px] uppercase font-bold text-white/40 block">Honorários</span>
                      <span className="text-sm font-bold text-emerald-400">
                        {Number(lead.valor_honorarios).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/50 flex-wrap gap-2">
          <span>Endereço do Webhook: <code className="text-brand-blue font-mono">{webhookUrl}</code></span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold transition-colors ml-auto cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
