import { supabase } from '../supabaseClient';
import { baseMetrics } from '../data/mockData';

const LOCAL_STORAGE_METRICS_KEY = 'dc-leiseca-metrics';
const LOCAL_STORAGE_LEADS_KEY = 'dc-leiseca-crm-leads';
const LOCAL_STORAGE_CRM_STATUS_KEY = 'dc-leiseca-crm-status';

export const crmService = {
  /**
   * Busca a lista de leads reais e métricas do CRM
   */
  async fetchLiveCRMData() {
    let leads = [];

    // 1. Tenta buscar direto no Supabase (tempo real e persistente)
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('crm_leads')
          .select('*')
          .order('updated_at', { ascending: false })
          .limit(10000);

        if (!error && Array.isArray(data) && data.length > 0) {
          leads = data;
        }
      } catch (err) {
        console.warn('[crmService] Supabase offline ou indisponível:', err);
      }
    }

    // 2. Se vazio ou sem Supabase, faz fallback para o endpoint da API no Vercel
    if (leads.length === 0) {
      try {
        const res = await fetch('https://dc-comercial.vercel.app/api/webhook/legendary', {
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json.recentLeads) && json.recentLeads.length > 0) {
            leads = json.recentLeads;
          }
        }
      } catch (err) {
        console.warn('[crmService] Falha ao consultar endpoint da API:', err);
      }
    }

    // 3. Fallback para cache local se ainda estiver vazio
    if (leads.length === 0) {
      try {
        const cached = localStorage.getItem(LOCAL_STORAGE_LEADS_KEY);
        if (cached) leads = JSON.parse(cached);
      } catch {}
    } else {
      try {
        localStorage.setItem(LOCAL_STORAGE_LEADS_KEY, JSON.stringify(leads));
      } catch {}
    }

    // 4. Calcula as métricas reais a partir dos leads
    const aggregated = this.calculateMetricsFromLeads(leads);

    const crmStatus = {
      connected: leads.length > 0,
      totalLeads: leads.length,
      lastSync: new Date().toISOString(),
      crmName: 'Legendary Hub II (WhatsApp)'
    };

    try {
      localStorage.setItem(LOCAL_STORAGE_CRM_STATUS_KEY, JSON.stringify(crmStatus));
    } catch {}

    return {
      status: crmStatus,
      leads,
      metrics: aggregated
    };
  },

  /**
   * Transforma a lista de leads reais nas métricas da Gestão Comercial
   */
  calculateMetricsFromLeads(leads) {
    if (!Array.isArray(leads) || leads.length === 0) {
      return null;
    }

    let sdrRecebidos = leads.length;
    let sdrContatados = 0;
    let sdrQualificados = 0;
    let sdrAgendados = 0;

    let closerRealizadas = 0;
    let closerEnviados = 0;
    let closerAssinados = 0;
    let closerFechados = 0;
    let totalHonorarios = 0;

    leads.forEach(lead => {
      const tags = Array.isArray(lead.tags) ? lead.tags : [];
      const tagsStr = tags.join(' ').toLowerCase();
      const etapa = (lead.etapa_funil || '').toLowerCase();

      // Pagamento = FECHADO (apenas quando o lead paga!)
      const isPago = etapa === 'fechado' || 
                     tagsStr.includes('pagamento') || 
                     tagsStr.includes('pago') || 
                     tagsStr.includes('pagou') || 
                     tagsStr.includes('comprovante') || 
                     tagsStr.includes('fechad') || 
                     tagsStr.includes('ganho');

      // Assinado (aguardando pagamento)
      const isAssinado = etapa === 'contrato_assinado' || 
                         tagsStr.includes('assinado') || 
                         tagsStr.includes('assinatura') || 
                         tagsStr.includes('assinou');

      const isEnviado = isPago || isAssinado || etapa === 'contrato_enviado' || tagsStr.includes('proposta') || tagsStr.includes('contrato enviado') || tagsStr.includes('enviad');
      const isRealizada = isEnviado || etapa === 'consulta_realizada' || tagsStr.includes('realizad') || tagsStr.includes('comparec');
      const isAgendado = isRealizada || etapa === 'agendado' || tagsStr.includes('agend') || tagsStr.includes('reuniões marcadas') || tagsStr.includes('atendimentos realizados');
      const isQualificado = isAgendado || etapa === 'qualificado' || tagsStr.includes('qualific') || tagsStr.includes('viável');
      const isContatado = isQualificado || etapa !== 'recebido' || tagsStr.includes('contat') || tagsStr.includes('atend') || lead.status_ticket === 'open';

      if (isContatado) sdrContatados++;
      if (isQualificado) sdrQualificados++;
      if (isAgendado) sdrAgendados++;

      if (isRealizada) closerRealizadas++;
      if (isEnviado) closerEnviados++;
      if (isAssinado && !isPago) closerAssinados++;
      if (isPago) {
        closerFechados++;
        totalHonorarios += Number(lead.valor_honorarios || 0);
      }
    });

    const honorariosMedios = closerFechados > 0 && totalHonorarios > 0
      ? Math.round(totalHonorarios / closerFechados)
      : 1517;

    return {
      sdr: {
        leadsRecebidos: sdrRecebidos,
        motoristasContatados: sdrContatados,
        casosQualificados: sdrQualificados,
        consultasAgendadas: sdrAgendados
      },
      bdr: {
        processosMapeados: Math.max(0, sdrRecebidos * 2),
        contatosAtivos: Math.max(0, sdrContatados),
        consultasAgendadasOut: Math.max(0, Math.floor(sdrAgendados * 0.3)),
        casosQualificadosOut: Math.max(0, Math.floor(sdrQualificados * 0.3))
      },
      closer: {
        consultasRealizadas: closerRealizadas,
        contratosEnviados: closerEnviados,
        contratosAssinados: closerAssinados,
        contratosFechados: closerFechados,
        honorariosMedios: honorariosMedios
      },
      totalHonorarios
    };
  },

  /**
   * Sincroniza métricas reais com o localStorage e emite evento para atualizar o app
   */
  async syncWithComercial() {
    const liveData = await this.fetchLiveCRMData();
    if (liveData && liveData.metrics) {
      try {
        localStorage.setItem(LOCAL_STORAGE_METRICS_KEY, JSON.stringify(liveData.metrics));
        window.dispatchEvent(new CustomEvent('dc-metrics-updated', { detail: liveData.metrics }));
        window.dispatchEvent(new CustomEvent('dc-crm-synced', { detail: liveData }));
      } catch (e) {
        console.error('[crmService] Erro ao sincronizar com Comercial:', e);
      }
    }
    return liveData;
  },

  /**
   * Assina atualizações em tempo real (Supabase Realtime + Polling)
   */
  subscribeToLiveUpdates(onUpdate) {
    let channel = null;

    if (supabase) {
      try {
        channel = supabase
          .channel('public:crm_leads')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'crm_leads' }, async () => {
            const data = await this.syncWithComercial();
            if (onUpdate) onUpdate(data);
          })
          .subscribe();
      } catch (err) {
        console.warn('[crmService] Erro ao abrir canal realtime:', err);
      }
    }

    // Polling a cada 20 segundos para garantir frescor mesmo sem WebSocket
    const intervalId = setInterval(async () => {
      const data = await this.syncWithComercial();
      if (onUpdate) onUpdate(data);
    }, 20000);

    return () => {
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
      clearInterval(intervalId);
    };
  }
};
