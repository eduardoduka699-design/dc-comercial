import React, { useState, useEffect } from 'react';
import { X, Search, Phone, ExternalLink, Zap, Clock, ShieldCheck, CheckCircle2, User, Copy, Check, Filter, MessageSquare, DollarSign, Calendar, FileText } from 'lucide-react';

export default function RealLeadsModal({ isOpen, onClose, leads = [], onRefresh, isRefreshing, initialStage = 'all' }) {
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState(initialStage || 'all');
  const [copied, setCopied] = useState(false);
  const webhookUrl = 'https://dc-comercial.vercel.app/api/webhook/legendary';

  // Sincroniza o filtro da etapa sempre que o modal abre ou um card diferente for clicado
  useEffect(() => {
    if (isOpen) {
      setStageFilter(initialStage || 'all');
    }
  }, [isOpen, initialStage]);

  if (!isOpen) return null;

  // Classificadores auxiliares
  const isPagoLead = (lead) => {
    const t = (Array.isArray(lead.tags) ? lead.tags.join(' ') : '').toLowerCase();
    const e = (lead.etapa_funil || '').toLowerCase();
    return e === 'fechado' || t.includes('pagamento') || t.includes('pago') || t.includes('pagou') || t.includes('comprovante') || t.includes('fechad') || t.includes('ganho');
  };

  const isAssinadoLead = (lead) => {
    const t = (Array.isArray(lead.tags) ? lead.tags.join(' ') : '').toLowerCase();
    const e = (lead.etapa_funil || '').toLowerCase();
    return (e === 'contrato_assinado' || t.includes('assinado') || t.includes('assinatura')) && !isPagoLead(lead);
  };

  const isPropostaLead = (lead) => {
    const t = (Array.isArray(lead.tags) ? lead.tags.join(' ') : '').toLowerCase();
    const e = (lead.etapa_funil || '').toLowerCase();
    return e === 'contrato_enviado' || t.includes('proposta') || t.includes('contrato enviado');
  };

  const isRealizadaLead = (lead) => {
    const t = (Array.isArray(lead.tags) ? lead.tags.join(' ') : '').toLowerCase();
    const e = (lead.etapa_funil || '').toLowerCase();
    return e === 'consulta_realizada' || t.includes('reuniões realizadas') || t.includes('reunioes realizadas') || t.includes('compareceu');
  };

  const isMarcadaLead = (lead) => {
    const t = (Array.isArray(lead.tags) ? lead.tags.join(' ') : '').toLowerCase();
    const e = (lead.etapa_funil || '').toLowerCase();
    return e === 'agendado' || t.includes('reuniões marcadas') || t.includes('reunioes marcadas') || t.includes('reunião marcada') || t.includes('agendad');
  };

  const isQualificadoLead = (lead) => {
    const t = (Array.isArray(lead.tags) ? lead.tags.join(' ') : '').toLowerCase();
    const e = (lead.etapa_funil || '').toLowerCase();
    return (e === 'qualificado' || t.includes('qualific') || t.includes('viável') || t.includes('viavel')) && !t.includes('desqualific');
  };

  const isContatadoLead = (lead) => {
    const t = (Array.isArray(lead.tags) ? lead.tags.join(' ') : '').toLowerCase();
    const e = (lead.etapa_funil || '').toLowerCase();
    return e === 'contatado' || t.includes('atendimento') || t.includes('contato') || t.includes('follow') || lead.status_ticket === 'open';
  };

  // Contagens para os botões de filtro
  const countFechados = leads.filter(isPagoLead).length;
  const countAssinados = leads.filter(isAssinadoLead).length;
  const countPropostas = leads.filter(l => isPropostaLead(l) || isAssinadoLead(l) || isPagoLead(l)).length;
  const countRealizadas = leads.filter(l => isRealizadaLead(l) || isPropostaLead(l) || isAssinadoLead(l) || isPagoLead(l)).length;
  const countMarcadas = leads.filter(l => isMarcadaLead(l) || isRealizadaLead(l) || isPropostaLead(l) || isAssinadoLead(l) || isPagoLead(l)).length;
  const countQualificados = leads.filter(l => isQualificadoLead(l) || isMarcadaLead(l) || isRealizadaLead(l) || isPropostaLead(l) || isAssinadoLead(l) || isPagoLead(l)).length;
  const countContatados = leads.filter(l => isContatadoLead(l) || isQualificadoLead(l) || isMarcadaLead(l) || isRealizadaLead(l) || isPropostaLead(l) || isAssinadoLead(l) || isPagoLead(l)).length;

  // Filtragem dos leads
  const filteredLeads = leads.filter(lead => {
    const q = search.toLowerCase();
    const nome = (lead.nome || '').toLowerCase();
    const tel = (lead.telefone || '').toLowerCase();
    const tags = Array.isArray(lead.tags) ? lead.tags.join(' ').toLowerCase() : '';
    const etapa = (lead.etapa_funil || '').toLowerCase();

    // Match text search
    const matchesSearch = !q || nome.includes(q) || tel.includes(q) || tags.includes(q) || etapa.includes(q);
    if (!matchesSearch) return false;

    // Match stage filter
    if (stageFilter === 'fechado') return isPagoLead(lead);
    if (stageFilter === 'contrato_assinado' || stageFilter === 'assinado') return isAssinadoLead(lead);
    if (stageFilter === 'contrato_enviado' || stageFilter === 'proposta') return isPropostaLead(lead) || isAssinadoLead(lead) || isPagoLead(lead);
    if (stageFilter === 'consulta_realizada' || stageFilter === 'reunioes_realizadas') return isRealizadaLead(lead) || isPropostaLead(lead) || isAssinadoLead(lead) || isPagoLead(lead);
    if (stageFilter === 'agendado' || stageFilter === 'reunioes_marcadas') return isMarcadaLead(lead) || isRealizadaLead(lead) || isPropostaLead(lead) || isAssinadoLead(lead) || isPagoLead(lead);
    if (stageFilter === 'qualificado') return isQualificadoLead(lead) || isMarcadaLead(lead) || isRealizadaLead(lead) || isPropostaLead(lead) || isAssinadoLead(lead) || isPagoLead(lead);
    if (stageFilter === 'contatado') return isContatadoLead(lead) || isQualificadoLead(lead) || isMarcadaLead(lead) || isRealizadaLead(lead) || isPropostaLead(lead) || isAssinadoLead(lead) || isPagoLead(lead);
    return true;
  });

  const getStageBadge = (lead) => {
    if (isPagoLead(lead)) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1.5 shadow-sm">
          <CheckCircle2 size={12} className="text-emerald-400" />
          Pagamento Realizado (Pago)
        </span>
      );
    }

    if (isAssinadoLead(lead)) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 shadow-sm">
          <Clock size={12} className="text-amber-400" />
          Contrato Assinado (Aguardando Pagamento)
        </span>
      );
    }

    if (isPropostaLead(lead)) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center gap-1.5">
          <FileText size={12} className="text-indigo-400" />
          Proposta Enviada
        </span>
      );
    }

    if (isRealizadaLead(lead)) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40 flex items-center gap-1.5">
          <Calendar size={12} className="text-blue-400" />
          Reunião Realizada
        </span>
      );
    }

    if (isMarcadaLead(lead)) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5">
          <Clock size={12} className="text-cyan-400" />
          Reunião Marcada
        </span>
      );
    }

    if (isQualificadoLead(lead)) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1.5">
          <ShieldCheck size={12} className="text-purple-400" />
          Qualificado
        </span>
      );
    }

    if (isContatadoLead(lead)) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
          <MessageSquare size={12} className="text-amber-400" />
          Atendimento Realizado
        </span>
      );
    }

    return (
      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/10 text-white/60 border border-white/20">
        Lead Recebido
      </span>
    );
  };

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(webhookUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  // Prepara link de mensagem do WhatsApp de acordo com o status
  const getWhatsAppAction = (lead) => {
    const telRaw = (lead.telefone || '').replace(/\D/g, '');
    if (!telRaw) return null;
    const nome = lead.nome ? lead.nome.split(' ')[0] : 'Olá';

    let text = `Olá ${nome}, tudo bem? Sou da assessoria jurídica Lei Seca.`;
    if (isAssinadoLead(lead)) {
      text = `Olá ${nome}, tudo bem? Identifiquei a assinatura do seu contrato. Gostaria de enviar a chave PIX para validação do início do processo.`;
    } else if (isPropostaLead(lead)) {
      text = `Olá ${nome}, tudo bem? Conseguiu avaliar os termos da proposta jurídica que te encaminhei? Posso te auxiliar com alguma dúvida?`;
    } else if (isMarcadaLead(lead)) {
      text = `Olá ${nome}, confirmando nossa conversa jurídica com o especialista. Você estará disponível no horário agendado?`;
    }

    return `https://wa.me/${telRaw}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="w-full max-w-5xl bg-[#121319] border border-white/15 rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col max-h-[92vh] text-white relative animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Conexão CRM Ativa (Legendary Hub II)
              </span>
              <span className="text-xs text-white/50 font-medium">• {leads.length} leads no total</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-display font-black text-white">Leads da Operação Comercial</h3>
            <p className="text-xs text-white/50 mt-0.5">
              Filtrando etapa em tempo real. Clique no botão de WhatsApp para contato ou cobrança imediata.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
            title="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Toolbar: Busca e Ações */}
        <div className="py-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-white/10">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nome, telefone, tag ou etapa..."
              className="w-full bg-[#0a0a0d] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-blue placeholder:text-white/30"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white/70 hover:text-white transition-colors cursor-pointer"
              title="Copiar URL do Webhook para configurar no CRM"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? 'Copiado!' : 'Copiar Webhook'}</span>
            </button>

            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-blue/20 hover:bg-brand-blue text-brand-blue hover:text-white border border-brand-blue/40 text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Zap size={14} className={isRefreshing ? 'animate-spin' : ''} />
              <span>{isRefreshing ? 'Sincronizando...' : 'Atualizar'}</span>
            </button>
          </div>
        </div>

        {/* Filtros Rápidos por Todas as Etapas do Funil */}
        <div className="py-2.5 flex items-center gap-1.5 overflow-x-auto scrollbar-hide border-b border-white/10 text-xs">
          <button
            onClick={() => setStageFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
              stageFilter === 'all' ? 'bg-white/20 text-white shadow-sm' : 'text-white/50 hover:text-white bg-white/5'
            }`}
          >
            Todos ({leads.length})
          </button>
          
          <button
            onClick={() => setStageFilter('fechado')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
              stageFilter === 'fechado' ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50 shadow-sm' : 'text-emerald-400/70 hover:text-emerald-300 bg-emerald-500/10'
            }`}
          >
            <CheckCircle2 size={13} className="text-emerald-400" />
            Pagamento Realizado ({countFechados})
          </button>

          <button
            onClick={() => setStageFilter('contrato_assinado')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
              stageFilter === 'contrato_assinado' || stageFilter === 'assinado' ? 'bg-amber-500/30 text-amber-200 border border-amber-500/50 shadow-sm' : 'text-amber-400/70 hover:text-amber-300 bg-amber-500/10'
            }`}
          >
            <Clock size={13} className="text-amber-400" />
            Contratos Assinados ({countAssinados})
          </button>

          <button
            onClick={() => setStageFilter('contrato_enviado')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
              stageFilter === 'contrato_enviado' || stageFilter === 'proposta' ? 'bg-indigo-500/30 text-indigo-200 border border-indigo-500/50 shadow-sm' : 'text-indigo-400/70 hover:text-indigo-300 bg-indigo-500/10'
            }`}
          >
            <FileText size={13} className="text-indigo-400" />
            Propostas Enviadas ({countPropostas})
          </button>

          <button
            onClick={() => setStageFilter('consulta_realizada')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
              stageFilter === 'consulta_realizada' ? 'bg-blue-500/30 text-blue-200 border border-blue-500/50 shadow-sm' : 'text-blue-400/70 hover:text-blue-300 bg-blue-500/10'
            }`}
          >
            <Calendar size={13} className="text-blue-400" />
            Reuniões Realizadas ({countRealizadas})
          </button>

          <button
            onClick={() => setStageFilter('agendado')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
              stageFilter === 'agendado' ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-500/50 shadow-sm' : 'text-cyan-400/70 hover:text-cyan-300 bg-cyan-500/10'
            }`}
          >
            <Clock size={13} className="text-cyan-400" />
            Reuniões Marcadas ({countMarcadas})
          </button>

          <button
            onClick={() => setStageFilter('qualificado')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
              stageFilter === 'qualificado' ? 'bg-purple-500/30 text-purple-200 border border-purple-500/50 shadow-sm' : 'text-purple-400/70 hover:text-purple-300 bg-purple-500/10'
            }`}
          >
            <ShieldCheck size={13} className="text-purple-400" />
            Qualificados ({countQualificados})
          </button>

          <button
            onClick={() => setStageFilter('contatado')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
              stageFilter === 'contatado' ? 'bg-amber-500/25 text-amber-200 border border-amber-500/40 shadow-sm' : 'text-amber-300/70 hover:text-amber-200 bg-amber-500/10'
            }`}
          >
            <MessageSquare size={13} className="text-amber-400" />
            Atendimentos ({countContatados})
          </button>
        </div>

        {/* Lista de Leads */}
        <div className="flex-1 overflow-y-auto py-3 space-y-2.5 pr-1 scrollbar-thin">
          {filteredLeads.length === 0 ? (
            <div className="py-16 text-center text-white/40 text-sm">
              Nenhum lead encontrado para este filtro de etapa.
            </div>
          ) : (
            filteredLeads.map((lead, idx) => {
              const telRaw = (lead.telefone || '').replace(/\D/g, '');
              const waLink = getWhatsAppAction(lead);
              const dateStr = lead.updated_at || lead.atualizado_em || lead.created_at;
              const timeDisplay = dateStr ? new Date(dateStr).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '';
              const isPago = isPagoLead(lead);
              const isAssinado = isAssinadoLead(lead);

              return (
                <div 
                  key={lead.id || idx} 
                  className={`border rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 transition-all ${
                    isPago 
                      ? 'bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/60' 
                      : isAssinado 
                      ? 'bg-amber-950/20 border-amber-500/30 hover:border-amber-500/60'
                      : 'bg-[#0e0f14] border-white/5 hover:border-brand-blue/40'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs mt-0.5 ${
                      isPago 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                        : isAssinado 
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-brand-blue/15 text-brand-blue border border-brand-blue/30'
                    }`}>
                      <User size={18} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-sm text-white truncate max-w-[280px] sm:max-w-[360px]">
                          {lead.nome || 'Lead sem nome'}
                        </h4>
                        {getStageBadge(lead)}
                      </div>

                      <div className="flex items-center gap-3 mt-1.5 text-xs text-white/50 flex-wrap">
                        {telRaw && (
                          <span className="font-mono text-white/70">
                            +{telRaw}
                          </span>
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

                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                    {lead.valor_honorarios > 0 && (
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] uppercase font-bold text-white/40 block">Honorários</span>
                        <span className="text-sm font-bold text-emerald-400 font-mono">
                          {Number(lead.valor_honorarios).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                      </div>
                    )}

                    {waLink && (
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer ${
                          isAssinado 
                            ? 'bg-amber-500 hover:bg-amber-400 text-black font-extrabold' 
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        }`}
                        title="Abrir conversa no WhatsApp"
                      >
                        <Phone size={12} />
                        <span>{isAssinado ? 'Cobrar PIX / Pgto' : isPago ? 'WhatsApp' : 'Conversar'}</span>
                        <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
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
