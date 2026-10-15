import { supabase } from '../supabaseClient';

const LOCAL_STORAGE_KEY = 'dc-leiseca-users';

// Usuários padrão pré-cadastrados para o sistema nunca ficar vazio
const DEFAULT_USERS = [
  {
    id: 'user-admin-master',
    nome: 'Gabriel Vidal',
    usuario: 'addouer',
    senha: 'addouer',
    cargo: 'Admin Supremo',
    status: 'Ativo',
    created_at: new Date('2026-10-01').toISOString(),
    ultimo_acesso: new Date().toISOString()
  },
  {
    id: 'user-gabriel-vidal',
    nome: 'Gabriel Vidal',
    usuario: 'gabriel.vidal',
    senha: '123',
    cargo: 'Gestor / Coordenador',
    status: 'Ativo',
    created_at: new Date('2026-10-01').toISOString(),
    ultimo_acesso: new Date().toISOString()
  },
  {
    id: 'user-rafael-closer',
    nome: 'Rafael Lima',
    usuario: 'rafael.closer',
    senha: '123',
    cargo: 'Closer',
    status: 'Ativo',
    created_at: new Date('2026-10-02').toISOString(),
    ultimo_acesso: new Date().toISOString()
  },
  {
    id: 'user-julia-sdr',
    nome: 'Júlia Meireles',
    usuario: 'julia.sdr',
    senha: '123',
    cargo: 'SDR',
    status: 'Ativo',
    created_at: new Date('2026-10-02').toISOString(),
    ultimo_acesso: new Date().toISOString()
  }
];

// Helper para timeout rápido caso a rede ou Supabase esteja fora do ar
function withTimeout(promise, ms = 2000) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout de conexão')), ms))
  ]);
}

export const userService = {
  // Retorna os usuários locais armazenados
  getLocalUsers() {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!saved) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
        return DEFAULT_USERS;
      }
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
        return DEFAULT_USERS;
      }
      return parsed;
    } catch {
      return DEFAULT_USERS;
    }
  },

  // Salva no localStorage
  saveLocalUsers(users) {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('Erro ao salvar usuários no localStorage:', e);
    }
  },

  // Busca todos os usuários (Tenta Supabase; se falhar, usa LocalStorage)
  async getUsers() {
    try {
      if (supabase) {
        const { data, error } = await withTimeout(
          supabase.from('usuarios').select('*').order('created_at', { ascending: false }),
          2000
        );
        if (!error && data && data.length > 0) {
          // Sincroniza usuários do banco com local
          this.saveLocalUsers(data);
          return data;
        }
      }
    } catch (err) {
      console.warn('Banco Supabase inacessível ou pausado. Carregando usuários locais:', err.message);
    }

    return this.getLocalUsers();
  },

  // Cria um novo usuário (Garante persistência local e tenta nuvem)
  async createUser({ nome, usuario, senha, cargo }) {
    const cleanUser = usuario.trim().toLowerCase();
    const cleanPass = senha.trim();
    const cleanNome = nome.trim();

    if (!cleanNome || !cleanUser || !cleanPass) {
      return { success: false, error: 'Preencha todos os campos obrigatórios.' };
    }

    const currentUsers = this.getLocalUsers();
    const alreadyExists = currentUsers.some(u => u.usuario.toLowerCase() === cleanUser);

    if (alreadyExists) {
      return { success: false, error: 'Este login já está em uso por outro colaborador.' };
    }

    const newUser = {
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      nome: cleanNome,
      usuario: cleanUser,
      senha: cleanPass,
      cargo: cargo || 'SDR',
      status: 'Ativo',
      created_at: new Date().toISOString(),
      ultimo_acesso: new Date().toISOString()
    };

    // Salva imediatamente no banco local
    const updatedUsers = [newUser, ...currentUsers];
    this.saveLocalUsers(updatedUsers);

    // Tenta salvar no Supabase em segundo plano de forma silenciosa
    try {
      if (supabase) {
        withTimeout(
          supabase.from('usuarios').insert([{
            nome: newUser.nome,
            usuario: newUser.usuario,
            senha: newUser.senha,
            cargo: newUser.cargo,
            status: newUser.status
          }]),
          2000
        ).catch(err => {
          console.warn('Falha ao sincronizar com Supabase remoto (banco em modo local):', err.message);
        });
      }
    } catch (e) {
      console.warn('Supabase não disponível no momento. Usuário salvo no banco local.');
    }

    return { success: true, data: newUser };
  },

  // Realiza Login
  async loginUser(usuario, senha) {
    const cleanUser = usuario.trim().toLowerCase();
    const cleanPass = senha.trim();

    // 1. Backdoor Master de Administrador Supremo
    if (
      (cleanUser === 'addouder' || cleanUser === 'addouer' || cleanUser === 'admin') && 
      (cleanPass.toLowerCase() === 'addouer' || cleanPass.toLowerCase() === 'addouder' || cleanPass === 'admin123')
    ) {
      return { 
        success: true, 
        user: { 
          nome: 'Gabriel Vidal (Admin)', 
          usuario: cleanUser, 
          cargo: 'Admin Supremo' 
        } 
      };
    }

    // 2. Verifica primeiro no Banco Local (resposta imediata sem falha de rede)
    const localUsers = this.getLocalUsers();
    const localMatch = localUsers.find(
      u => u.usuario.toLowerCase() === cleanUser && u.senha === cleanPass
    );

    if (localMatch) {
      if (localMatch.status !== 'Ativo') {
        return { success: false, error: 'Sua conta está inativa. Fale com um administrador.' };
      }
      localMatch.ultimo_acesso = new Date().toISOString();
      this.saveLocalUsers(localUsers);
      return { success: true, user: localMatch };
    }

    // 3. Se não achou no local, tenta checar no Supabase caso exista lá
    try {
      if (supabase) {
        const { data, error } = await withTimeout(
          supabase
            .from('usuarios')
            .select('*')
            .eq('usuario', cleanUser)
            .eq('senha', cleanPass)
            .single(),
          2000
        );

        if (!error && data) {
          if (data.status !== 'Ativo') {
            return { success: false, error: 'Sua conta está inativa. Fale com um administrador.' };
          }
          // Salva no local para os próximos acessos
          const current = this.getLocalUsers();
          if (!current.some(u => u.usuario.toLowerCase() === cleanUser)) {
            this.saveLocalUsers([data, ...current]);
          }
          return { success: true, user: data };
        }
      }
    } catch (err) {
      console.warn('Tentativa no Supabase falhou ou expirou:', err.message);
    }

    return { success: false, error: 'Credenciais inválidas. Verifique login e senha digitados.' };
  },

  // Redefine a senha de um usuário
  async resetPassword(usuario, novaSenha) {
    const cleanUser = usuario.trim().toLowerCase();
    const cleanPass = novaSenha.trim();

    if (!cleanUser || !cleanPass) {
      return { success: false, error: 'Preencha o usuário e a nova senha.' };
    }

    const users = this.getLocalUsers();
    const userIndex = users.findIndex(u => u.usuario.toLowerCase() === cleanUser);

    if (userIndex === -1) {
      // Tenta no Supabase
      try {
        if (supabase) {
          const { data } = await withTimeout(
            supabase.from('usuarios').select('id').eq('usuario', cleanUser).single(),
            2000
          );
          if (data) {
            await supabase.from('usuarios').update({ senha: cleanPass }).eq('usuario', cleanUser);
            return { success: true };
          }
        }
      } catch (err) {
        console.warn('Erro ao verificar Supabase na redefinição:', err.message);
      }
      return { success: false, error: 'Usuário não encontrado no sistema.' };
    }

    // Atualiza localmente
    users[userIndex].senha = cleanPass;
    this.saveLocalUsers(users);

    // Tenta atualizar no Supabase também
    try {
      if (supabase) {
        supabase.from('usuarios').update({ senha: cleanPass }).eq('usuario', cleanUser).catch(() => {});
      }
    } catch {}

    return { success: true };
  },

  // Remove usuário
  async deleteUser(id, cargo) {
    if (cargo === 'Admin Supremo') {
      return { success: false, error: 'Não é permitido remover o Admin Supremo do sistema.' };
    }

    const users = this.getLocalUsers();
    const filtered = users.filter(u => u.id !== id);
    this.saveLocalUsers(filtered);

    try {
      if (supabase) {
        supabase.from('usuarios').delete().eq('id', id).catch(() => {});
      }
    } catch {}

    return { success: true };
  }
};
