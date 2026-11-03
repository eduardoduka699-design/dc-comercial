import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://vuoqrgflvcvfzjcynawp.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_-0ZXSLO98lvnTLbl_d3eHQ_8gP-SfhU';

const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

if (!globalThis.__recentLeads) {
  globalThis.__recentLeads = [];
}

// Extrai e normaliza tags
function normalizeTags(rawTags) {
  if (!rawTags) return [];
  if (Array.isArray(rawTags)) {
    return rawTags.map(t => typeof t === 'string' ? t.toLowerCase().trim() : (t?.name || '').toLowerCase().trim());
  }
  if (typeof rawTags === 'string') {
    return rawTags.split(',').map(t => t.toLowerCase().trim());
  }
  return [];
}

// Classifica a etapa do funil do lead
function classifyFunnelStage(tags, statusTicket, valor) {
  const tagsStr = tags.join(' ');
  
  const isContratoFechado = tagsStr.includes('fechad') || tagsStr.includes('ganho') || tagsStr.includes('pago') || tagsStr.includes('honor') || tagsStr.includes('assinado');
  const isContratoEnviado = tagsStr.includes('contrato enviado') || tagsStr.includes('proposta') || tagsStr.includes('enviad');
  const isConsultaRealizada = tagsStr.includes('realizad') || tagsStr.includes('comparec') || tagsStr.includes('compareceu');
  const isAgendado = tagsStr.includes('agend') || tagsStr.includes('consulta') || tagsStr.includes('reuni') || tagsStr.includes('marcad') || tagsStr.includes('atendimentos realizados');
  const isQualificado = tagsStr.includes('qualific') || tagsStr.includes('viável') || tagsStr.includes('perfil');
  const isContatado = tagsStr.includes('contato feito') || tagsStr.includes('contat') || tagsStr.includes('atendimento') || statusTicket === 'open';

  if (isContratoFechado) return 'fechado';
  if (isContratoEnviado) return 'contrato_enviado';
  if (isConsultaRealizada) return 'consulta_realizada';
  if (isAgendado) return 'agendado';
  if (isQualificado) return 'qualificado';
  if (isContatado) return 'contatado';
  return 'recebido';
}

// Agrega métricas reais para a Gestão Comercial
function aggregateMetrics(leads) {
  const list = Array.isArray(leads) ? leads : [];
  
  let sdrRecebidos = list.length;
  let sdrContatados = 0;
  let sdrQualificados = 0;
  let sdrAgendados = 0;

  let closerRealizadas = 0;
  let closerEnviados = 0;
  let closerFechados = 0;
  let totalHonorarios = 0;

  list.forEach(lead => {
    const tags = Array.isArray(lead.tags) ? lead.tags : [];
    const tagsStr = tags.join(' ').toLowerCase();
    const etapa = lead.etapa_funil || '';

    // SDR
    const isContatado = etapa !== 'recebido' || tagsStr.includes('contat') || tagsStr.includes('atend') || lead.status_ticket === 'open';
    const isQualificado = ['qualificado', 'agendado', 'consulta_realizada', 'contrato_enviado', 'fechado'].includes(etapa) || tagsStr.includes('qualific') || tagsStr.includes('viável');
    const isAgendado = ['agendado', 'consulta_realizada', 'contrato_enviado', 'fechado'].includes(etapa) || tagsStr.includes('agend') || tagsStr.includes('atendimentos realizados') || tagsStr.includes('consulta');

    if (isContatado) sdrContatados++;
    if (isQualificado) sdrQualificados++;
    if (isAgendado) sdrAgendados++;

    // Closer
    const isRealizada = ['consulta_realizada', 'contrato_enviado', 'fechado'].includes(etapa) || tagsStr.includes('realizad') || tagsStr.includes('comparec');
    const isEnviado = ['contrato_enviado', 'fechado'].includes(etapa) || tagsStr.includes('proposta') || tagsStr.includes('contrato enviado');
    const isFechado = etapa === 'fechado' || tagsStr.includes('fechad') || tagsStr.includes('ganho') || tagsStr.includes('assinado');

    if (isRealizada) closerRealizadas++;
    if (isEnviado) closerEnviados++;
    if (isFechado) {
      closerFechados++;
      totalHonorarios += Number(lead.valor_honorarios || 0);
    }
  });

  const honorariosMedios = closerFechados > 0 && totalHonorarios > 0
    ? Math.round(totalHonorarios / closerFechados)
    : 3500;

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
      contratosFechados: closerFechados,
      honorariosMedios: honorariosMedios
    },
    totalHonorarios
  };
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Health Check, leads em tempo real e métricas agregadas da Gestão Comercial
  if (req.method === 'GET') {
    let leads = [];

    // Tenta puxar do Supabase (persistente)
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('crm_leads')
          .select('*')
          .order('updated_at', { ascending: false })
          .limit(100);

        if (!error && Array.isArray(data) && data.length > 0) {
          leads = data;
        }
      } catch (err) {
        console.warn('[Webhook GET] Falha ao consultar Supabase:', err.message);
      }
    }

    // Fallback para memória do servidor
    if (leads.length === 0 && globalThis.__recentLeads && globalThis.__recentLeads.length > 0) {
      leads = globalThis.__recentLeads;
    }

    const metrics = aggregateMetrics(leads);

    return res.status(200).json({
      status: 'online',
      service: 'DC Comercial - Webhook Legendary Hub II',
      timestamp: new Date().toISOString(),
      endpoint: 'https://dc-comercial.vercel.app/api/webhook/legendary',
      recentCount: leads.length,
      recentLeads: leads,
      metrics: metrics
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido. Utilize POST.' });
  }

  try {
    const payload = req.body || {};
    const receivedAt = new Date().toISOString();

    console.log('[Legendary Hub] Webhook Recebido:', JSON.stringify(payload, null, 2));

    // Extrai dados do ticket / mensagem
    const ticket = payload.ticket || payload.data?.ticket || payload.data || payload;
    const contact = ticket.contact || payload.contact || {};
    
    const leadNome = contact.name || payload.name || ticket.name || 'Lead WhatsApp';
    const leadTelefone = contact.number || contact.phone || payload.phone || payload.number || '';
    const status = (ticket.status || payload.status || 'open').toLowerCase();
    const queue = ticket.queue?.name || payload.queue?.name || payload.setor || '';
    const atendente = ticket.user?.name || payload.user?.name || '';
    const valor = Number(ticket.value || ticket.amount || payload.value || payload.amount || 0);

    const tags = normalizeTags(ticket.tags || payload.tags || []);
    const etapaFunil = classifyFunnelStage(tags, status, valor);

    const processedLead = {
      crm: 'legendary',
      external_id: ticket.id ? String(ticket.id) : null,
      nome: leadNome,
      telefone: leadTelefone,
      status_ticket: status,
      tags: tags,
      setor: queue,
      atendente: atendente,
      etapa_funil: etapaFunil,
      valor_honorarios: valor,
      updated_at: receivedAt
    };

    // Salva no cache em memória
    if (!globalThis.__recentLeads) globalThis.__recentLeads = [];
    // Atualiza ou insere no cache em memória
    const existingIndex = globalThis.__recentLeads.findIndex(l => l.telefone === leadTelefone && leadTelefone !== '');
    if (existingIndex >= 0) {
      globalThis.__recentLeads[existingIndex] = processedLead;
    } else {
      globalThis.__recentLeads.unshift(processedLead);
      if (globalThis.__recentLeads.length > 100) globalThis.__recentLeads.pop();
    }

    // Salva no Supabase de forma persistente
    let persisted = false;
    if (supabase) {
      try {
        if (leadTelefone) {
          const { error: upsertErr } = await supabase
            .from('crm_leads')
            .upsert(processedLead, { onConflict: 'crm,telefone' });

          if (upsertErr) {
            console.warn('[Legendary Hub] Erro no upsert de crm_leads:', upsertErr.message);
          } else {
            persisted = true;
          }
        } else {
          await supabase.from('crm_leads').insert([processedLead]);
          persisted = true;
        }

        // Registra o evento cru em crm_events
        await supabase.from('crm_events').insert([
          {
            crm: 'legendary',
            event_type: payload.event || payload.action || 'webhook',
            payload: payload,
            created_at: receivedAt
          }
        ]);
      } catch (err) {
        console.warn('[Legendary Hub] Erro ao persistir no Supabase:', err.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Lead do Legendary Hub processado e sincronizado com sucesso!',
      persisted: persisted,
      lead: processedLead
    });

  } catch (error) {
    console.error('[Legendary Hub] Erro ao processar:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro no processamento do webhook',
      details: error.message
    });
  }
}
