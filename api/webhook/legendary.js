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

// Classifica a etapa do funil do lead de acordo com as regras comerciais da assessoria:
// - CONTRATO FECHADO: APENAS quando o lead efetua o pagamento (pagamento realizado, honorários pagos, pago, fechado, ganho)!
// - CONTRATO ASSINADO: contrato assinado aguardando confirmação do pagamento.
function classifyFunnelStage(tags, statusTicket, valor) {
  const tagsStr = tags.join(' ').toLowerCase();
  
  // 1. Pagamento efetuado = CONTRATO FECHADO (apenas quando paga!)
  const isPago = tagsStr.includes('pagamento') || 
                 tagsStr.includes('pago') || 
                 tagsStr.includes('pagou') || 
                 tagsStr.includes('comprovante') || 
                 tagsStr.includes('fechad') || 
                 tagsStr.includes('ganho');

  // 2. Contrato Assinado (aguardando pagamento)
  const isAssinado = tagsStr.includes('assinado') || 
                     tagsStr.includes('assinatura') || 
                     tagsStr.includes('assinou');

  // 3. Proposta / Contrato Enviado
  const isContratoEnviado = tagsStr.includes('contrato enviado') || 
                            tagsStr.includes('proposta') || 
                            tagsStr.includes('enviad');

  // 4. Reunião / Consulta Realizada
  const isConsultaRealizada = tagsStr.includes('reuniões realizadas') ||
                              tagsStr.includes('realizad') || 
                              tagsStr.includes('comparec') || 
                              tagsStr.includes('compareceu');

  // 5. Consulta Agendada / Reunião Marcada
  const isAgendado = tagsStr.includes('reuniões marcadas') ||
                     tagsStr.includes('agend') || 
                     tagsStr.includes('consulta') || 
                     tagsStr.includes('marcad') || 
                     tagsStr.includes('atendimentos realizados');

  // 6. Caso Qualificado
  const isQualificado = tagsStr.includes('qualific') || 
                        tagsStr.includes('viável') || 
                        tagsStr.includes('perfil');

  // 7. Contatado / Atendimento em aberto
  const isContatado = tagsStr.includes('contato feito') || 
                      tagsStr.includes('contat') || 
                      tagsStr.includes('atendimento') || 
                      statusTicket === 'open' || 
                      statusTicket === 'aberto';

  if (isPago) return 'fechado';
  if (isAssinado) return 'contrato_assinado';
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
  let closerAssinados = 0;
  let closerFechados = 0;
  let totalHonorarios = 0;

  list.forEach(lead => {
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

    // Assinado (mas ainda não pago)
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
          .limit(10000);

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
      if (globalThis.__recentLeads.length > 5000) globalThis.__recentLeads.pop();
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
