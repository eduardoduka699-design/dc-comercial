export const defaultGoals = {
  sdr: {
    leadsRecebidos: 300, // Inbound leads from Ads
    motoristasContatados: 200, // Contacted
    casosQualificados: 80, // SQLs
    consultasAgendadas: 50 // Meetings Scheduled
  },
  bdr: {
    processosMapeados: 500, // Outreach / Cold prospects
    contatosAtivos: 50, // Connection
    consultasAgendadasOut: 15,
    casosQualificadosOut: 10
  },
  closer: {
    consultasRealizadas: 45, // Meetings done
    contratosEnviados: 35, // Proposals
    contratosFechados: 15, // Won
    honorariosMedios: 3500 // Ticket Medio
  }
};

// Base metrics for a full Month
export const baseMetrics = {
  sdr: {
    leadsRecebidos: 250,
    motoristasContatados: 160,
    casosQualificados: 65,
    consultasAgendadas: 40
  },
  bdr: {
    processosMapeados: 400,
    contatosAtivos: 35,
    consultasAgendadasOut: 10,
    casosQualificadosOut: 8
  },
  closer: {
    consultasRealizadas: 38,
    contratosEnviados: 28,
    contratosFechados: 10,
    honorariosMedios: 3200
  }
};

export const currentMetrics = { ...baseMetrics };

export const rankingData = {
  sdr: [
    { id: 1, name: 'Lucas (Pré-venda)', points: 1450, avatar: 'L', metrics: '28 Consultas Agendadas', trend: 'up' },
    { id: 2, name: 'Mariana (Pré-venda)', points: 1230, avatar: 'M', metrics: '22 Consultas Agendadas', trend: 'up' },
    { id: 3, name: 'Pedro (Pré-venda)', points: 980, avatar: 'P', metrics: '15 Consultas Agendadas', trend: 'down' },
  ],
  bdr: [
    { id: 1, name: 'Amanda (Prospecção)', points: 2100, avatar: 'A', metrics: '35 Casos Encontrados', trend: 'up' },
    { id: 2, name: 'Thiago (Prospecção)', points: 1850, avatar: 'T', metrics: '28 Casos Encontrados', trend: 'up' },
  ],
  closer: [
    { id: 1, name: 'Dr. Roberto', points: 5400, avatar: 'R', metrics: 'R$ 45.000 em Honorários', trend: 'up' },
    { id: 2, name: 'Dra. Fernanda', points: 4200, avatar: 'F', metrics: 'R$ 32.000 em Honorários', trend: 'up' },
  ]
};

export const sdrChartData = [
  { name: 'Semana 1', leads: 60, sqls: 10 },
  { name: 'Semana 2', leads: 70, sqls: 15 },
  { name: 'Semana 3', leads: 65, sqls: 12 },
  { name: 'Semana 4', leads: 55, sqls: 8 }
];

export const bdrChartData = [
  { name: 'Semana 1', outreach: 100, meetings: 2 },
  { name: 'Semana 2', outreach: 110, meetings: 3 },
  { name: 'Semana 3', outreach: 95, meetings: 2 },
  { name: 'Semana 4', outreach: 95, meetings: 3 }
];

export const closerChartData = [
  { name: 'Semana 1', won: 2, lost: 4 },
  { name: 'Semana 2', won: 3, lost: 3 },
  { name: 'Semana 3', won: 3, lost: 5 },
  { name: 'Semana 4', won: 2, lost: 4 }
];
