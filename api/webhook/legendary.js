import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://vuoqrgflvcvfzjcynawp.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_-0ZXSLO98lvnTLbl_d3eHQ_8gP-SfhU';

const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

if (!globalThis.__recentLeads) {
  globalThis.__recentLeads = [];
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

  // GET: Health Check e lista de leads recebidos em tempo real
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'online',
      service: 'DC Comercial - Webhook Legendary Hub II',
      timestamp: new Date().toISOString(),
      endpoint: 'https://dc-comercial.vercel.app/api/webhook/legendary',
      recentCount: globalThis.__recentLeads ? globalThis.__recentLeads.length : 0,
      recentLeads: globalThis.__recentLeads || []
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
    
    // Normaliza tags
    const rawTags = ticket.tags || payload.tags || [];
    const tags = Array.isArray(rawTags) 
      ? rawTags.map(t => typeof t === 'string' ? t.toLowerCase() : (t?.name || '').toLowerCase())
      : [];

    const status = (ticket.status || payload.status || '').toLowerCase(); // pending, open, closed
    const queue = ticket.queue?.name || payload.queue?.name || payload.setor || '';
    const atendente = ticket.user?.name || payload.user?.name || '';
    const valor = Number(ticket.value || ticket.amount || payload.value || payload.amount || 0);

    // Mapeamento inteligente de funil de acordo com as regras da Lei Seca
    const tagsString = tags.join(' ');
    
    const isQualificado = tagsString.includes('qualific') || tagsString.includes('viável') || tagsString.includes('perfil');
    const isAgendado = tagsString.includes('agend') || tagsString.includes('consulta') || tagsString.includes('reuni') || tagsString.includes('marcad');
    const isContratoEnviado = tagsString.includes('contrato enviado') || tagsString.includes('proposta') || tagsString.includes('enviad');
    const isContratoFechado = tagsString.includes('fechad') || tagsString.includes('ganho') || tagsString.includes('pago') || tagsString.includes('honor');

    // Determina a etapa principal no funil
    let etapaFunil = 'recebido'; // Lead SDR
    if (isContratoFechado) etapaFunil = 'fechado';
    else if (isContratoEnviado) etapaFunil = 'contrato_enviado';
    else if (isAgendado) etapaFunil = 'agendado';
    else if (isQualificado) etapaFunil = 'qualificado';
    else if (status === 'open' || status === 'aberto') etapaFunil = 'contatado';

    const processedLead = {
      nome: leadNome,
      telefone: leadTelefone,
      status_ticket: status,
      tags: tags,
      setor: queue,
      atendente: atendente,
      etapa_funil: etapaFunil,
      valor_honorarios: valor,
      atualizado_em: receivedAt
    };

    // Salva no cache em memória para consulta instantânea
    if (!globalThis.__recentLeads) globalThis.__recentLeads = [];
    globalThis.__recentLeads.unshift(processedLead);
    if (globalThis.__recentLeads.length > 50) globalThis.__recentLeads.pop();

    // Salva o evento e o lead no Supabase se disponível
    let persisted = false;
    if (supabase) {
      try {
        await supabase.from('crm_events').insert([
          {
            crm: 'legendary',
            event_type: payload.event || payload.action || 'webhook',
            payload: payload,
            created_at: receivedAt
          }
        ]);
        persisted = true;
      } catch (err) {
        console.warn('[Legendary Hub] Tabela crm_events não encontrada no Supabase:', err.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Lead do Legendary Hub processado com sucesso!',
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
