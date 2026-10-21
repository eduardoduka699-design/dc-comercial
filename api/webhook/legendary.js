import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://vuoqrgflvcvfzjcynawp.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_-0ZXSLO98lvnTLbl_d3eHQ_8gP-SfhU';

const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

export default async function handler(req, res) {
  // Habilita CORS para o Legendary Hub
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

  // GET: Teste de conectividade (permite abrir no navegador para verificar se o webhook está ativo)
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'online',
      service: 'DC Comercial - Webhook Legendary Hub II',
      timestamp: new Date().toISOString(),
      url_para_configurar: 'https://dc-comercial.vercel.app/api/webhook/legendary'
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido. Envie um POST.' });
  }

  try {
    const payload = req.body || {};
    const receivedAt = new Date().toISOString();

    console.log('[Legendary Hub] Evento recebido:', JSON.stringify(payload, null, 2));

    // Salva o evento bruto no Supabase para auditoria em tempo real
    let dbSuccess = false;
    if (supabase) {
      try {
        const { error } = await supabase.from('crm_events').insert([
          {
            crm: 'legendary',
            event_type: payload.event || payload.action || payload.type || 'lead_update',
            payload: payload,
            created_at: receivedAt
          }
        ]);
        if (!error) dbSuccess = true;
      } catch (dbErr) {
        console.warn('[Legendary Hub] Erro ao gravar evento no Supabase:', dbErr.message);
      }
    }

    // Normaliza dados do lead
    const lead = {
      nome: payload.name || payload.contact?.name || payload.data?.name || payload.nome || 'Lead WhatsApp',
      telefone: payload.phone || payload.number || payload.contact?.number || payload.data?.number || '',
      tags: payload.tags || payload.contact?.tags || payload.data?.tags || [],
      etapa: payload.stage || payload.status || payload.event || 'recebido',
      valor: Number(payload.value || payload.amount || 0),
      timestamp: receivedAt
    };

    return res.status(200).json({
      success: true,
      message: 'Evento do Legendary Hub processado com sucesso!',
      persisted_in_db: dbSuccess,
      lead: lead
    });
  } catch (error) {
    console.error('[Legendary Hub] Erro:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno ao processar webhook',
      details: error.message
    });
  }
}
