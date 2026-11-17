import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vuoqrgflvcvfzjcynawp.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_-0ZXSLO98lvnTLbl_d3eHQ_8gP-SfhU';

const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

export const DRIVE_FOLDER_ID = '18Y4rIXcGK3UMmJRvW8ml6CJwpS76zqI9';
export const DRIVE_FOLDER_URL = `https://drive.google.com/drive/folders/${DRIVE_FOLDER_ID}`;

// Extrai o File ID de links comuns do Google Drive
export function extractDriveFileId(input) {
  if (!input) return '';
  const trimmed = input.trim();
  
  // Se já for apenas o ID (28 a 45 caracteres alfanuméricos com traço ou underline)
  if (/^[a-zA-Z0-9_-]{25,}$/.test(trimmed)) {
    return trimmed;
  }
  
  // Formato /file/d/ID/view ou /file/d/ID
  const fileDMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch && fileDMatch[1]) {
    return fileDMatch[1];
  }

  // Formato id=ID
  const idParamMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idParamMatch && idParamMatch[1]) {
    return idParamMatch[1];
  }

  return trimmed;
}

const DEFAULT_CALLS = [
  {
    id: 'rec-1',
    titulo: 'Reunião 1 - 17.11.2026',
    descricao: 'Gravação da reunião comercial com alinhamento prático de vendas, postura do closer, contorno de objeções em Lei Seca e fechamento de contrato.',
    drive_file_id: '1kZHgpB6qrBENc574v-NlQzpQpRnUOmKh',
    drive_url: 'https://drive.google.com/file/d/1kZHgpB6qrBENc574v-NlQzpQpRnUOmKh/view',
    drive_folder_url: DRIVE_FOLDER_URL,
    duracao: '45 min',
    closer: 'Gabriel Vidal',
    tamanho: '106.4 MB',
    data_gravacao: '2026-11-17',
    tipo: 'call'
  }
];

export const trainingService = {
  DRIVE_FOLDER_URL,
  DRIVE_FOLDER_ID,

  /**
   * Busca todas as chamadas gravadas do Supabase
   */
  async getCalls() {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('training_calls')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data) && data.length > 0) {
          localStorage.setItem('dc-training-calls-cache', JSON.stringify(data));
          return data;
        }
      } catch (err) {
        console.warn('[trainingService] Falha ao consultar Supabase, usando cache:', err);
      }
    }

    try {
      const cached = localStorage.getItem('dc-training-calls-cache');
      if (cached) return JSON.parse(cached);
    } catch {}

    return DEFAULT_CALLS;
  },

  /**
   * Adiciona uma nova gravação à plataforma e ao Supabase
   */
  async addCall(callData) {
    const fileId = extractDriveFileId(callData.drive_file_id || callData.drive_url);
    const newRecord = {
      titulo: callData.titulo || 'Nova Reunião Gravada',
      descricao: callData.descricao || '',
      drive_file_id: fileId,
      drive_url: callData.drive_url || `https://drive.google.com/file/d/${fileId}/view`,
      drive_folder_url: DRIVE_FOLDER_URL,
      duracao: callData.duracao || '45 min',
      closer: callData.closer || 'Equipe Comercial',
      tamanho: callData.tamanho || 'MP4',
      data_gravacao: callData.data_gravacao || new Date().toISOString().slice(0, 10),
      tipo: callData.tipo || 'call'
    };

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('training_calls')
          .insert([newRecord])
          .select()
          .single();

        if (!error && data) {
          return data;
        }
      } catch (err) {
        console.error('[trainingService] Erro ao salvar gravação no Supabase:', err);
      }
    }

    // Fallback local
    const fallbackRecord = { ...newRecord, id: 'local-' + Date.now() };
    const current = await this.getCalls();
    const updated = [fallbackRecord, ...current];
    localStorage.setItem('dc-training-calls-cache', JSON.stringify(updated));
    return fallbackRecord;
  },

  /**
   * Remove uma gravação
   */
  async deleteCall(id) {
    if (supabase) {
      try {
        await supabase.from('training_calls').delete().eq('id', id);
      } catch (err) {
        console.error('[trainingService] Erro ao deletar no Supabase:', err);
      }
    }

    try {
      const current = await this.getCalls();
      const updated = current.filter(c => c.id !== id);
      localStorage.setItem('dc-training-calls-cache', JSON.stringify(updated));
    } catch {}
  }
};
