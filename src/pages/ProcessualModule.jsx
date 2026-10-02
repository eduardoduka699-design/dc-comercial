import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const playbookHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Playbook Comercial — Sales Flow (Capítulos 01 a 22)</title>
  <style>
    :root {
      --bg: #0f141c;
      --surface: #171e29;
      --surface-alt: #1f2937;
      --primary: #3b82f6;
      --primary-soft: rgba(59, 130, 246, 0.14);
      --text: #f3f4f6;
      --muted: #9ca3af;
      --border: rgba(255, 255, 255, 0.12);
      --danger: #ef4444;
      --danger-soft: rgba(239, 68, 68, 0.12);
      --success: #10b981;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, Arial, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.6;
      padding: 0;
    }
    .toolbar {
      display: none; /* Hide toolbar inside the React app, we have our own header */
    }
    .container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 32px 24px 64px;
    }
    .cover {
      background: linear-gradient(135deg, #0b0f17 0%, #172030 100%);
      border: 1px solid var(--border);
      border-left: 6px solid var(--primary);
      border-radius: 14px;
      padding: 40px 36px;
      margin-bottom: 28px;
    }
    .eyebrow {
      color: var(--primary);
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      margin: 0 0 6px;
    }
    .cover h1 {
      font-size: 42px;
      font-weight: 900;
      text-transform: uppercase;
      margin: 0 0 12px;
      line-height: 1.05;
    }
    .cover p {
      color: var(--muted);
      font-size: 16px;
      max-width: 720px;
      margin: 0 0 20px;
    }
    .quote {
      background: #0b0f17;
      border: 1px solid var(--border);
      border-left: 5px solid var(--primary);
      border-radius: 10px;
      padding: 18px 22px;
      margin: 18px 0;
      font-weight: 700;
      font-size: 17px;
    }
    .quote small {
      display: block;
      margin-top: 6px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      color: var(--primary);
    }
    .toc {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 28px;
    }
    .toc h2 {
      margin: 0 0 14px;
      font-size: 20px;
      text-transform: uppercase;
    }
    .toc-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
      gap: 8px 20px;
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .toc-grid a {
      color: var(--text);
      text-decoration: none;
      font-size: 13px;
      display: flex;
      gap: 8px;
      padding: 6px 8px;
      border-radius: 6px;
    }
    .toc-grid a:hover {
      background: var(--surface-alt);
      color: var(--primary);
    }
    .toc-grid a strong { color: var(--primary); }
    .chapter {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 28px;
      margin-bottom: 22px;
      page-break-inside: avoid;
    }
    .chapter-header {
      display: flex;
      align-items: baseline;
      gap: 14px;
      border-bottom: 2px solid var(--border);
      padding-bottom: 12px;
      margin-bottom: 18px;
    }
    .chapter-num {
      font-size: 32px;
      font-weight: 900;
      color: var(--primary);
      line-height: 1;
    }
    .chapter-title {
      font-size: 22px;
      font-weight: 900;
      text-transform: uppercase;
      margin: 0;
    }
    h3 {
      font-size: 15px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin: 20px 0 10px;
      color: #fff;
    }
    .box {
      background: #101620;
      border: 1px solid var(--border);
      border-left: 4px solid var(--primary);
      border-radius: 8px;
      padding: 16px 18px;
      margin: 14px 0;
    }
    .box-warn {
      border-left-color: var(--danger);
      background: var(--danger-soft);
    }
    .box-orange {
      background: var(--primary-soft);
      border-color: rgba(59, 130, 246, 0.35);
    }
    .msg {
      background: var(--primary-soft);
      border: 1px solid rgba(59, 130, 246, 0.35);
      border-radius: 10px;
      border-top-left-radius: 0;
      padding: 14px 16px;
      margin: 12px 0;
      font-style: italic;
    }
    .msg strong {
      display: block;
      font-style: normal;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--primary);
      margin-bottom: 4px;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 14px;
      margin: 14px 0;
    }
    .grid-3 {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 14px;
      margin: 14px 0;
    }
    .flow {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
      margin: 14px 0;
    }
    .flow span.step {
      background: #0b0f17;
      border: 1px solid var(--border);
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
    }
    .flow span.arrow { color: var(--primary); font-weight: 900; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 14px 0;
      font-size: 13.5px;
    }
    th, td {
      border: 1px solid var(--border);
      padding: 10px 12px;
      text-align: left;
      vertical-align: top;
    }
    th {
      background: #0b0f17;
      color: var(--primary);
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
    tr:nth-child(even) td { background: rgba(255, 255, 255, 0.02); }
    ul { margin: 8px 0; padding-left: 20px; }
    li { margin-bottom: 6px; }
    @media print {
      .toolbar { display: none !important; }
      body { background: #fff; color: #111; }
      .cover, .toc, .chapter, .box, .quote, .msg {
        background: #fff !important;
        color: #111 !important;
        border-color: #d1d5db !important;
      }
      th { background: #f3f4f6 !important; color: #111 !important; }
      td, th { border-color: #d1d5db !important; }
      .chapter-title, h3, .cover h1 { color: #111 !important; }
      .cover p, .toc-grid a { color: #374151 !important; }
    }
  </style>
</head>
<body>
  <div class="container">
    <header class="cover">
      <p class="eyebrow">Manual Operacional Independente</p>
      <h1>Playbook Comercial — Sales Flow</h1>
      <p>Estrutura comercial para atendimento, follow-up e conversão de leads de tráfego pago.</p>
      <div class="quote" style="margin-bottom:0">
        “Tráfego gera oportunidade. Comercial transforma oportunidade em contrato.”
      </div>
    </header>

    <section class="toc">
      <p class="eyebrow">Sumário</p>
      <h2>O Que Você Vai Encontrar (Capítulos 01 a 22)</h2>
      <ol class="toc-grid">
        <li><a href="#introducao"><strong>01</strong> Introdução — o lead não é o contrato</a></li>
        <li><a href="#fundamentos"><strong>02</strong> Fundamentos do comercial</a></li>
        <li><a href="#jornada"><strong>03</strong> A jornada comercial do lead</a></li>
        <li><a href="#pilares"><strong>04</strong> Os 5 pilares e o SLA comercial</a></li>
        <li><a href="#velocidade"><strong>05</strong> Etapa 1 — velocidade de atendimento</a></li>
        <li><a href="#primeiro-contato"><strong>06</strong> Etapa 2 — primeiro contato</a></li>
        <li><a href="#qualificacao"><strong>07</strong> Etapa 3 — qualificação do lead</a></li>
        <li><a href="#conducao"><strong>08</strong> Etapa 4 — condução da conversa</a></li>
        <li><a href="#solucao"><strong>09</strong> Etapa 5 — apresentação da solução</a></li>
        <li><a href="#objecoes"><strong>10</strong> Etapa 6 — quebra de objeções</a></li>
        <li><a href="#follow-up"><strong>11</strong> Etapa 7 — follow-up de 7 dias</a></li>
        <li><a href="#recuperacao"><strong>12</strong> Etapa 8 — recuperação de leads parados</a></li>
        <li><a href="#fechamento"><strong>13</strong> Etapa 9 — fechamento</a></li>
        <li><a href="#nao-qualificado"><strong>14</strong> Etapa 10 — quando o lead não é qualificado</a></li>
        <li><a href="#rotina"><strong>15</strong> Rotina comercial e canais</a></li>
        <li><a href="#funil"><strong>16</strong> Organização do funil</a></li>
        <li><a href="#indicadores"><strong>17</strong> Indicadores comerciais</a></li>
        <li><a href="#gargalo"><strong>18</strong> Diagnóstico do gargalo</a></li>
        <li><a href="#erros"><strong>19</strong> Erros comerciais mais comuns</a></li>
        <li><a href="#script"><strong>20</strong> Script comercial base</a></li>
        <li><a href="#checklist"><strong>21</strong> Checklist do comercial</a></li>
        <li><a href="#bolso"><strong>22</strong> Playbook de bolso</a></li>
      </ol>
    </section>

    <!-- CAP 01 -->
    <section id="introducao" class="chapter">
      <div class="chapter-header">
        <span class="chapter-num">01</span>
        <div>
          <p class="eyebrow">Introdução</p>
          <h2 class="chapter-title">O lead não é o contrato</h2>
        </div>
      </div>
      <p>O tráfego pago tem uma função clara: gerar oportunidades. Ele coloca pessoas com um problema jurídico real em contato com o seu escritório. Mas o dinheiro no caixa não vem do anúncio — vem do que acontece depois que o lead chega.</p>
      <div class="flow">
        <span class="step">Tráfego</span><span class="arrow">→</span>
        <span class="step">Lead</span><span class="arrow">→</span>
        <span class="step">Atendimento</span><span class="arrow">→</span>
        <span class="step">Qualificação</span><span class="arrow">→</span>
        <span class="step">Negociação</span><span class="arrow">→</span>
        <span class="step">Follow-up</span><span class="arrow">→</span>
        <span class="step">Contrato</span>
      </div>
      <p>Gerar muitos leads não significa gerar muitos contratos. Dois escritórios podem receber os mesmos 100 leads e ter resultados completamente diferentes: um fecha 3 contratos, o outro fecha 12. A diferença não está no anúncio — está no processo comercial.</p>
      <div class="quote">
        “Tráfego gera oportunidade. Comercial transforma oportunidade em contrato.”
        <small>Princípio central do playbook</small>
      </div>
      <div class="box">
        <p class="eyebrow">A regra mais importante</p>
        <p><strong>Lead não é atendimento. Lead é oportunidade.</strong> O trabalho não termina quando você responde a primeira mensagem — ele começa ali.</p>
        <p>O erro mais comum é interpretar “mandei mensagem e ele não respondeu” como “o lead não tem interesse”. Isso é uma conclusão prematura:</p>
        <ul>
          <li>Está trabalhando, dirigindo ou sem tempo</li>
          <li>Está comparando opções e ainda não decidiu</li>
          <li>Está com receio, insegurança ou pouca confiança</li>
          <li>Ainda não entendeu o serviço</li>
          <li>Tem interesse, mas não tem urgência</li>
          <li>Precisa falar com outra pessoa antes de decidir</li>
          <li>Simplesmente não viu a mensagem</li>
        </ul>
        <p><strong>Silêncio não é sinônimo de desinteresse.</strong></p>
      </div>
    </section>

    <!-- CAP 02 -->
    <section id="fundamentos" class="chapter">
      <div class="chapter-header">
        <span class="chapter-num">02</span>
        <div>
          <p class="eyebrow">Fundamentos</p>
          <h2 class="chapter-title">O vocabulário do comercial</h2>
        </div>
      </div>
      <p>Antes de aplicar o processo, o escritório precisa dominar seis conceitos. Eles aparecem em todo o playbook e são a base para decidir onde investir e onde corrigir.</p>
      <div class="grid-2">
        <div class="box"><p class="eyebrow">Lead</p>É qualquer pessoa que demonstrou interesse e deixou uma forma de contato — clicou no anúncio, mandou mensagem no WhatsApp, preencheu um formulário. Lead é contato com interesse, não cliente.</div>
        <div class="box"><p class="eyebrow">Lead qualificado</p>É o lead que tem o problema que você resolve, o perfil compatível com o serviço e a intenção de resolver. Quantidade é volume; qualidade é aderência. 50 leads qualificados valem mais que 300 curiosos.</div>
        <div class="box"><p class="eyebrow">MQL (Marketing Qualified Lead)</p>Lead qualificado pelo marketing: veio da campanha certa, sobre o tema certo, e demonstrou interesse mínimo. Ex.: pessoa que clicou no anúncio de revisão de benefício do INSS e disse que teve o benefício negado.</div>
        <div class="box"><p class="eyebrow">SQL (Sales Qualified Lead)</p>Lead qualificado pelo comercial: você já conversou, entendeu o caso, confirmou perfil, urgência e intenção. É o lead pronto para receber proposta.</div>
        <div class="box"><p class="eyebrow">Conversão</p>É a passagem de uma etapa para a seguinte, medida em percentual. Ex.: 100 leads, 10 contratos = 10% de conversão lead → contrato.</div>
        <div class="box"><p class="eyebrow">CAC (Custo de Aquisição de Cliente)</p>Quanto custa cada contrato fechado. Investiu R$ 5.000 e fechou 5 contratos? CAC = R$ 1.000. Se o honorário médio é R$ 3.500, o negócio é saudável.</div>
      </div>
      <div class="box box-orange">
        <p class="eyebrow">Por que acompanhar essas métricas</p>
        <p>Porque “recebi poucos leads” e “recebi muitos leads e não fechei” exigem ações completamente opostas. Sem indicadores, o escritório troca de campanha quando o problema é comercial — ou troca de closer quando o problema é o público do anúncio.</p>
      </div>
    </section>

    <!-- CAP 03 -->
    <section id="jornada" class="chapter">
      <div class="chapter-header">
        <span class="chapter-num">03</span>
        <div>
          <p class="eyebrow">Mapa do processo</p>
          <h2 class="chapter-title">A jornada comercial do lead</h2>
        </div>
      </div>
      <p>Todo lead percorre o mesmo caminho. Saber em qual etapa cada pessoa está é o que torna o comercial previsível.</p>
      <div class="box">
        <p class="eyebrow">Fluxo completo (12 Etapas)</p>
        <ol>
          <li><strong>Lead recebido</strong> — Entrada registrada com origem e campanha</li>
          <li><strong>Primeiro contato</strong> — Mensagem contextualizada em até 5 minutos</li>
          <li><strong>Resposta do lead</strong> — Início da conversa comercial</li>
          <li><strong>Investigação / qualificação</strong> — Contexto, problema, tempo, impacto</li>
          <li><strong>Identificação da oportunidade</strong> — Existe aderência ao serviço?</li>
          <li><strong>Apresentação da solução</strong> — Caminho, segurança e próximo passo</li>
          <li><strong>Tratamento de objeções</strong> — Dúvida, valor, tempo, decisão</li>
          <li><strong>Negociação</strong> — Condições, honorários, documentação</li>
          <li><strong>Follow-up</strong> — Continuidade estratégica da conversa</li>
          <li><strong>Fechamento</strong> — Ação concreta: assinatura e pagamento</li>
          <li><strong>Contrato</strong> — Registro e início do atendimento jurídico</li>
          <li><strong>Pós-venda</strong> — Atualizações, experiência e indicações</li>
        </ol>
      </div>
      <table>
        <thead>
          <tr><th>Etapa</th><th>Objetivo</th><th>O que fazer</th><th>Evitar</th><th>Indicador</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>1. Lead recebido</strong></td><td>Não perder nenhuma oportunidade</td><td>Abrir o lead imediatamente e conferir nome, origem, anúncio, serviço e horário</td><td>Deixar leads acumulando para responder em lote</td><td>Leads sem contato</td></tr>
          <tr><td><strong>2. Primeiro contato</strong></td><td>Iniciar a conversa enquanto o interesse está alto</td><td>Mensagem curta e contextualizada + tentativa de ligação</td><td>Mensagem automática fria ou apresentação longa do escritório</td><td>Speed to lead</td></tr>
          <tr><td><strong>3. Qualificação</strong></td><td>Entender o caso e confirmar aderência</td><td>Perguntas encadeadas: contexto, problema, tempo, impacto, urgência</td><td>Interrogatório com 10 perguntas de uma vez</td><td>Taxa de qualificação</td></tr>
          <tr><td><strong>4. Solução e negociação</strong></td><td>Transmitir segurança e conduzir ao próximo passo</td><td>Mostrar entendimento do problema, o caminho e a ação seguinte</td><td>Aula jurídica e envio de preço sem contexto</td><td>Taxa de proposta</td></tr>
          <tr><td><strong>5. Follow-up</strong></td><td>Manter a conversa viva até a decisão</td><td>Cadência com objetivo diferente em cada contato</td><td>Mensagens repetidas do tipo “viu minha mensagem?”</td><td>Follow-up executado</td></tr>
          <tr><td><strong>6. Fechamento e pós-venda</strong></td><td>Transformar intenção em contrato assinado</td><td>Direcionar a ação concreta e acompanhar pendências</td><td>Enviar proposta e desaparecer</td><td>Taxa de fechamento</td></tr>
        </tbody>
      </table>
    </section>

    <!-- CAP 04 -->
    <section id="pilares" class="chapter">
      <div class="chapter-header">
        <span class="chapter-num">04</span>
        <div>
          <p class="eyebrow">Base operacional</p>
          <h2 class="chapter-title">Os 5 pilares e o SLA comercial</h2>
        </div>
      </div>
      <div class="grid-3">
        <div class="box"><strong>1. Velocidade:</strong> Responder rápido, sempre.</div>
        <div class="box"><strong>2. Persistência:</strong> Não abandonar após 1 ou 2 tentativas.</div>
        <div class="box"><strong>3. Personalização:</strong> Cada lead tem um contexto.</div>
        <div class="box"><strong>4. Condução:</strong> Levar o lead ao próximo passo.</div>
        <div class="box"><strong>5. Registro:</strong> Toda interação relevante anotada.</div>
      </div>
      <h3>SLA Comercial (Meta de primeira resposta: até 5 minutos)</h3>
      <table>
        <thead><tr><th>Janela</th><th>Ação</th><th>Canal</th></tr></thead>
        <tbody>
          <tr><td>0–5 minutos</td><td>Primeira mensagem + tentativa de ligação</td><td>WhatsApp + telefone</td></tr>
          <tr><td>30–60 minutos</td><td>Segunda tentativa</td><td>Ligação</td></tr>
          <tr><td>2–4 horas</td><td>Terceira tentativa com pergunta objetiva</td><td>WhatsApp</td></tr>
          <tr><td>Depois disso</td><td>Entrada na cadência estruturada de 7 dias</td><td>Multicanal</td></tr>
        </tbody>
      </table>
      <div class="box">
        <p class="eyebrow">Referência de mercado</p>
        <p>Estudos de mercado (InsideSales, Gong) apontam ganhos expressivos de conversão quando o primeiro contato ocorre nos primeiros minutos, e melhores taxas de conexão em cadências com sete ou mais tentativas, planejadas e multicanal. Trate esses números como referência para testar — o dado que vale é o do seu próprio funil.</p>
      </div>
    </section>

    <!-- CAP 05 -->
    <section id="velocidade" class="chapter">
      <div class="chapter-header">
        <span class="chapter-num">05</span>
        <div>
          <p class="eyebrow">Etapa 1</p>
          <h2 class="chapter-title">Velocidade de atendimento</h2>
        </div>
      </div>
      <p>O lead de tráfego pago é um lead de atenção curta. Ele clicou em um anúncio no meio de outra atividade e, muitas vezes, mandou mensagem para mais de um escritório. Quem responde primeiro conversa primeiro — e quem conversa primeiro tem mais chance de fechar.</p>
      <div class="quote">“Quanto mais rápido o contato, maior a oportunidade de iniciar a conversa enquanto o interesse ainda está alto.”</div>
      <div class="grid-2">
        <div class="box">
          <p class="eyebrow">✓ O que fazer</p>
          <ul>
            <li>Responder em até 5 minutos</li>
            <li>Demonstrar que viu a solicitação e de onde ela veio</li>
            <li>Personalizar com nome, tema do anúncio e problema</li>
            <li>Terminar com uma pergunta fácil de responder</li>
            <li>Tentar ligação em paralelo à mensagem</li>
          </ul>
        </div>
        <div class="box box-warn">
          <p class="eyebrow">✕ O que evitar</p>
          <ul>
            <li>Mensagens automáticas frias e genéricas</li>
            <li>Textos enormes que ninguém lê no celular</li>
            <li>Enviar tabela de preços imediatamente</li>
            <li>Apresentação longa do escritório e do currículo</li>
            <li>Esperar o lead perguntar tudo</li>
          </ul>
        </div>
      </div>
      <div class="msg">
        <strong>Abordagem inicial — modelo curto</strong>
        “Olá, João! Vi que você entrou em contato pelo nosso anúncio sobre negativa do INSS. Quero entender o que aconteceu no seu caso para verificar se conseguimos te orientar. O que aconteceu?”
      </div>
    </section>

    <!-- CAP 06 -->
    <section id="primeiro-contato" class="chapter">
      <div class="chapter-header">
        <span class="chapter-num">06</span>
        <div>
          <p class="eyebrow">Etapa 2</p>
          <h2 class="chapter-title">Primeiro contato</h2>
        </div>
      </div>
      <p>Não comece com “Olá, tudo bem?”. O lead não entrou para conversar sobre como você está. Comece contextualizando: ele precisa entender, em 5 segundos, quem está falando e por quê.</p>
      <div class="box">
        <p class="eyebrow">Estrutura da primeira mensagem (5 Passos)</p>
        <ol>
          <li><strong>Saudação:</strong> Com o nome do lead</li>
          <li><strong>Identificação:</strong> Quem fala e de qual escritório</li>
          <li><strong>Contextualização:</strong> De onde veio o contato (anúncio/tema)</li>
          <li><strong>Demonstração de interesse:</strong> “quero entender o seu caso”</li>
          <li><strong>Pergunta estratégica:</strong> Aberta, curta e fácil de responder</li>
        </ol>
      </div>
      <div class="grid-3">
        <div class="msg"><strong>Previdenciário</strong>“Olá, Maria! Aqui é o Rafael, do escritório Lima Advocacia. Você falou com a gente pelo anúncio sobre benefício negado pelo INSS. Para eu ver se conseguimos te orientar, me conta: quando o seu pedido foi negado?”</div>
        <div class="msg"><strong>Trabalhista</strong>“Oi, Carlos! Sou o Diego, do escritório Andrade. Vi que você buscou informações sobre verbas não pagas na demissão. O que aconteceu quando você saiu da empresa?”</div>
        <div class="msg"><strong>Consumidor / bancário</strong>“Olá, Ana! Aqui é a Júlia, do escritório Meireles. Você entrou em contato pelo anúncio sobre cobranças indevidas. Me conta rapidamente: essa cobrança é de banco, cartão ou empréstimo?”</div>
      </div>
      <div class="box box-orange">
        <p class="eyebrow">Regra das perguntas</p>
        <p>Uma pergunta por vez. O caminho é: <strong>pergunta → resposta → aprofundamento → próxima pergunta</strong>. Dez perguntas de uma vez viram interrogatório e o lead desiste de responder.</p>
      </div>
    </section>

    <!-- CAP 07 -->
    <section id="qualificacao" class="chapter">
      <div class="chapter-header">
        <span class="chapter-num">07</span>
        <div>
          <p class="eyebrow">Etapa 3</p>
          <h2 class="chapter-title">Qualificação do lead</h2>
        </div>
      </div>
      <p>Qualificar não é perguntar se a pessoa “tem interesse”. É descobrir o que aconteceu, o que isso causou, o que ela precisa resolver, com que urgência e se existe aderência à atuação do escritório.</p>
      <table>
        <thead><tr><th>Bloco</th><th>O que você quer descobrir</th><th>Pergunta exemplo</th></tr></thead>
        <tbody>
          <tr><td><strong>Contexto</strong></td><td>O que aconteceu e como aconteceu</td><td>“Me conta o que aconteceu?”</td></tr>
          <tr><td><strong>Problema</strong></td><td>Qual prejuízo isso gerou</td><td>“Qual foi o principal prejuízo que isso causou?”</td></tr>
          <tr><td><strong>Tempo</strong></td><td>Quando aconteceu (prazos)</td><td>“Isso aconteceu recentemente ou já faz tempo?”</td></tr>
          <tr><td><strong>Necessidade</strong></td><td>O que ela precisa resolver</td><td>“O que você precisa resolver primeiro?”</td></tr>
          <tr><td><strong>Urgência</strong></td><td>Por que agora</td><td>“O que fez você procurar ajuda neste momento?”</td></tr>
          <tr><td><strong>Oportunidade</strong></td><td>Aderência ao serviço</td><td>“Você já tentou resolver de alguma forma?”</td></tr>
          <tr><td><strong>Decisão</strong></td><td>Quem decide e o que falta</td><td>“O que precisa acontecer para você avançar?”</td></tr>
          <tr><td><strong>Próximo passo</strong></td><td>A ação seguinte concreta</td><td>“Faz sentido avançarmos com a análise?”</td></tr>
        </tbody>
      </table>
      <div class="box box-orange">
        <p class="eyebrow">Pergunta de avanço — a mais importante</p>
        <p><strong>“Se identificarmos que existe possibilidade de atuação no seu caso, você teria interesse em avançar?”</strong> — Essa pergunta separa curiosidade de intenção comercial.</p>
      </div>
      <h3>Como identificar um lead quente</h3>
      <ul>
        <li>Pergunta preço, honorários ou formas de pagamento</li>
        <li>Pergunta como contratar, prazo ou documentação</li>
        <li>Pergunta “tenho direito?” ou “vocês pegam o meu caso?”</li>
        <li>Envia documentos por conta própria</li>
        <li>Relata urgência ou pede ligação</li>
        <li>Pergunta quais são os próximos passos</li>
      </ul>
      <div class="box"><strong>Regra:</strong> Lead quente não espera a próxima etapa da cadência. Se demonstrou intenção, o closer acelera: liga, resolve dúvidas e conduz ao fechamento no mesmo dia.</div>
    </section>

    <!-- CAP 08 -->
    <section id="conducao" class="chapter">
      <div class="chapter-header">
        <span class="chapter-num">08</span>
        <div>
          <p class="eyebrow">Etapa 4</p>
          <h2 class="chapter-title">Condução da conversa</h2>
        </div>
      </div>
      <p>Responder perguntas é atendimento. Levar o lead ao próximo passo é comercial. A maioria das oportunidades morre porque o profissional só reage.</p>
      <div class="quote">“Não espere o lead conduzir o atendimento. Conduza o lead até o próximo passo.”</div>
      <div class="grid-2">
        <div class="box box-warn">
          <p class="eyebrow">Atendimento reativo</p>
          <p><em>Lead:</em> “Quanto custa?”<br/><em>Escritório:</em> “A consulta é R$ 300.”<br/><em>Lead:</em> “Ok, obrigado.”</p>
          <p>Conversa encerrada sem entender o caso e sem próximo passo.</p>
        </div>
        <div class="box box-orange">
          <p class="eyebrow">Atendimento comercial</p>
          <p><em>Lead:</em> “Quanto custa?”<br/><em>Escritório:</em> “Consigo te explicar os valores, sim. Antes preciso entender rapidamente o seu caso, porque a forma de atuação muda o custo. Quando o seu benefício foi negado?”</p>
          <p>Conversa continua, o caso é diagnosticado e existe próximo passo.</p>
        </div>
      </div>
      <div class="box">
        <p class="eyebrow">Toda conversa deve terminar com:</p>
        <ul>
          <li>Uma informação nova para o lead</li>
          <li>Uma pergunta em aberto para ele responder</li>
          <li>Um próximo passo combinado (dia e horário)</li>
          <li>Um registro atualizado no CRM/planilha</li>
        </ul>
      </div>
    </section>

    <!-- CAP 09 -->
    <section id="solucao" class="chapter">
      <div class="chapter-header">
        <span class="chapter-num">09</span>
        <div>
          <p class="eyebrow">Etapa 5</p>
          <h2 class="chapter-title">Apresentação da solução</h2>
        </div>
      </div>
      <p>Apresentar a solução não é dar uma aula de direito. O lead não quer entender a tese: ele quer saber se o problema dele tem saída, quem vai cuidar disso e o que ele precisa fazer agora.</p>
      <div class="flow">
        <span class="step">Entendimento</span><span class="arrow">→</span>
        <span class="step">Caminho</span><span class="arrow">→</span>
        <span class="step">Segurança</span><span class="arrow">→</span>
        <span class="step">Próximo passo</span>
      </div>
      <div class="msg">
        <strong>Exemplo curto</strong>
        “Pelo que você me contou, o seu pedido foi negado por falta de comprovação do período rural. Isso é comum e existe caminho para reverter, mas depende dos documentos. O próximo passo é analisarmos seus documentos com você, e aí explico exatamente quais são as possibilidades. Consigo fazer essa análise hoje às 17h — funciona para você?”
      </div>
      <div class="box box-warn">
        <p class="eyebrow">Nunca prometa resultado</p>
        <p>“Nenhum profissional sério consegue garantir resultado antes de analisar o caso. O que podemos fazer é avaliar sua situação, verificar a documentação e explicar com clareza as possibilidades de atuação.”</p>
      </div>
    </section>

    <!-- CAP 10 -->
    <section id="objecoes" class="chapter">
      <div class="chapter-header">
        <span class="chapter-num">10</span>
        <div>
          <p class="eyebrow">Etapa 6</p>
          <h2 class="chapter-title">Quebra de objeções</h2>
        </div>
      </div>
      <div class="quote">“Objeção não significa necessariamente desinteresse.”</div>
      <div class="flow">
        <span class="step">Ouvir</span><span class="arrow">→</span>
        <span class="step">Entender</span><span class="arrow">→</span>
        <span class="step">Validar</span><span class="arrow">→</span>
        <span class="step">Responder</span><span class="arrow">→</span>
        <span class="step">Conduzir</span>
      </div>
      <table>
        <thead><tr><th>Objeção</th><th>Como responder</th><th>Objetivo</th></tr></thead>
        <tbody>
          <tr><td><strong>“Vou pensar.”</strong></td><td>“Claro. Para eu conseguir te ajudar melhor, o que você gostaria de avaliar antes de decidir?”</td><td>Descobrir a objeção real</td></tr>
          <tr><td><strong>“Está caro.”</strong></td><td>“Entendo. Quando você fala do valor, é porque neste momento não consegue assumir o investimento ou porque gostaria de entender melhor o que está incluído?”</td><td>Separar condição de percepção de valor</td></tr>
          <tr><td><strong>“Não tenho dinheiro agora.”</strong></td><td>“Entendi. Se o investimento não fosse o problema neste momento, você teria interesse em resolver essa situação?”</td><td>Confirmar intenção</td></tr>
          <tr><td><strong>“Preciso falar com meu marido/esposa.”</strong></td><td>“Claro. O que você acredita que ele(a) vai querer saber antes de vocês decidirem? Posso te explicar esse ponto para você já conversar com todas as informações.”</td><td>Armar o lead para a conversa interna</td></tr>
          <tr><td><strong>“Vou pesquisar outros advogados.”</strong></td><td>“Faz sentido decidir com segurança. O que você pretende comparar antes de decidir?”</td><td>Identificar critério (preço, confiança, estratégia)</td></tr>
          <tr><td><strong>“Depois eu vejo isso.”</strong></td><td>“Sem problema. Quando você fala depois, é porque precisa de mais tempo para decidir ou porque agora não é prioridade?”</td><td>Descobrir a razão verdadeira</td></tr>
          <tr><td><strong>“Tenho que analisar melhor.”</strong></td><td>“Certo. Qual ponto específico você quer analisar? Assim eu te mando exatamente essa informação.”</td><td>Transformar vaga em concreta</td></tr>
          <tr><td><strong>“Só queria saber o preço.”</strong></td><td>“Consigo te explicar os valores. Antes preciso entender rapidamente seu caso, porque a atuação depende da situação. Me conta: o que aconteceu?”</td><td>Recuperar o diagnóstico</td></tr>
          <tr><td><strong>“Já estou falando com outro advogado.”</strong></td><td>“Entendi. Você já conseguiu esclarecer exatamente como será a atuação e os próximos passos?”</td><td>Reabrir o diagnóstico sem disputa</td></tr>
          <tr><td><strong>“Vocês garantem?”</strong></td><td>“Ninguém sério garante resultado antes de analisar. Podemos avaliar sua situação e explicar com clareza as possibilidades.”</td><td>Construir confiança</td></tr>
          <tr><td><strong>“Quanto vou ganhar?”</strong></td><td>“Depende das características e documentos do seu caso. Primeiro analisamos a situação para entender se existe direito e quais valores podem estar envolvidos.”</td><td>Evitar expectativa falsa</td></tr>
        </tbody>
      </table>
    </section>

    <!-- CAP 11 -->
    <section id="follow-up" class="chapter">
      <div class="chapter-header">
        <span class="chapter-num">11</span>
        <div>
          <p class="eyebrow">Etapa 7</p>
          <h2 class="chapter-title">Follow-up — cadência de 7 dias</h2>
        </div>
      </div>
      <p>Follow-up não é ficar cobrando o cliente. Follow-up é a continuidade estratégica da conversa. São 7 dias e 3 pontos de contato por dia — 21 contatos no total. Se o lead responder, a cadência para e a conversa assume.</p>
      <div class="quote">“Nunca envie ‘Oi, viu minha mensagem?’. Todo contato precisa trazer informação + contexto + pergunta, ou nova abordagem + novo motivo + próximo passo.”</div>
      <table>
        <thead><tr><th>Dia</th><th>Momento</th><th>Objetivo</th><th>Canal</th><th>Exemplo de abordagem</th></tr></thead>
        <tbody>
          <tr><td><strong>Dia 1 · Velocidade</strong></td><td>Imediato</td><td>Iniciar a conversa</td><td>WhatsApp</td><td>“Olá, [nome]! Vi que você entrou em contato pelo nosso anúncio sobre [assunto]. Quero entender o que aconteceu para verificar se consigo te orientar. O que aconteceu?”</td></tr>
          <tr><td><strong>Dia 1</strong></td><td>30–60 min</td><td>Tentar conexão por voz</td><td>Ligação</td><td>Não atendeu: “Oi, [nome]. Tentei te ligar porque algumas informações do seu caso são importantes para eu entender se consigo ajudar. Quando puder, me chama por aqui.”</td></tr>
          <tr><td><strong>Dia 1</strong></td><td>2–4 horas</td><td>Provocar resposta fácil</td><td>WhatsApp</td><td>“[Nome], para eu entender se o seu caso se enquadra, preciso confirmar uma coisa: [pergunta objetiva].”</td></tr>
          <tr><td><strong>Dia 2 · Qualificação</strong></td><td>Manhã</td><td>Retomar com pergunta simples</td><td>WhatsApp</td><td>“Bom dia, [nome]. Ainda não conseguimos conversar sobre o seu caso. Me confirma: isso aconteceu recentemente ou já faz algum tempo?”</td></tr>
          <tr><td><strong>Dia 2</strong></td><td>Meio do dia</td><td>Diagnóstico por voz</td><td>Ligação</td><td>“Aqui é [closer]. Você entrou em contato sobre [problema]. Queria entender rapidamente o que aconteceu para verificar se existe possibilidade de atuação.”</td></tr>
          <tr><td><strong>Dia 2</strong></td><td>Final do dia</td><td>Entregar segurança</td><td>WhatsApp</td><td>“Uma informação importante, [nome]: antes de falar em contratação, fazemos uma análise da situação para entender se existe possibilidade de atuação. Posso verificar isso com você?”</td></tr>
          <tr><td><strong>Dia 3 · Dor e autoridade</strong></td><td>Manhã</td><td>Reativar a dor</td><td>WhatsApp</td><td>“[Nome], pelo que você buscropped no anúncio, imagino que o principal problema tenha sido [dor]. Isso ainda está sem solução?”</td></tr>
          <tr><td><strong>Dia 3</strong></td><td>Meio do dia</td><td>Aproximar pelo tom de voz</td><td>Áudio (20–40s)</td><td>“[Nome], estou te mandando esse áudio porque quero entender exatamente o que aconteceu. Dependendo da situação existem caminhos diferentes. Me conta rapidamente?”</td></tr>
          <tr><td><strong>Dia 3</strong></td><td>Final do dia</td><td>Autoridade sem promessa</td><td>WhatsApp</td><td>“Atendemos situações semelhantes à sua e justamente por isso fazemos uma análise individual antes de orientar. Se ainda precisar resolver, posso verificar seu caso.”</td></tr>
          <tr><td><strong>Dia 4 · Objeções</strong></td><td>Manhã</td><td>Forçar uma definição gentil</td><td>WhatsApp</td><td>“[Nome], só para eu entender: você ainda está avaliando resolver essa situação ou acabou deixando isso de lado?”</td></tr>
          <tr><td><strong>Dia 4</strong></td><td>Meio do dia</td><td>Descobrir o impedimento</td><td>Ligação</td><td>“Queria entender se ficou alguma dúvida ou se existe algum ponto te impedindo de avançar.”</td></tr>
          <tr><td><strong>Dia 4</strong></td><td>Final do dia</td><td>Responder a objeção identificada</td><td>WhatsApp</td><td>“Sobre aquele ponto que você comentou, funciona assim: [explicação]. Se era isso que estava te deixando em dúvida, podemos avançar com a análise.”</td></tr>
          <tr><td><strong>Dia 5 · Decisão</strong></td><td>Manhã</td><td>Pedir clareza</td><td>WhatsApp</td><td>“[Nome], quero evitar te chamar sem necessidade. Antes disso: você ainda quer verificar essa situação?”</td></tr>
          <tr><td><strong>Dia 5</strong></td><td>Meio do dia</td><td>Remover barreira</td><td>Ligação</td><td>“Estou te ligando porque queria entender se existe algum ponto específico impedindo você de avançar.”</td></tr>
          <tr><td><strong>Dia 5</strong></td><td>Final do dia</td><td>CTA de baixa fricção</td><td>WhatsApp</td><td>“Faz sentido para você avançarmos com a análise do seu caso?”</td></tr>
          <tr><td><strong>Dia 6 · Recuperação</strong></td><td>Manhã</td><td>Lembrar que o caso está aberto</td><td>WhatsApp</td><td>“[Nome], ainda estou com seu atendimento em aberto por aqui.”</td></tr>
          <tr><td><strong>Dia 6</strong></td><td>Tarde</td><td>Dar saída honesta</td><td>WhatsApp</td><td>“Não sei se você não viu minhas mensagens ou se resolveu por outro caminho. Se ainda precisar de ajuda, posso verificar seu caso.”</td></tr>
          <tr><td><strong>Dia 6</strong></td><td>Final do dia</td><td>Última tentativa por voz</td><td>Ligação</td><td>“Fiz uma última tentativa por ligação. Vou deixar seu atendimento em aberto. Se ainda quiser verificar, me chama por aqui.”</td></tr>
          <tr><td><strong>Dia 7 · Encerramento</strong></td><td>Manhã</td><td>Sinalizar encerramento</td><td>WhatsApp</td><td>“[Nome], estou encerrando alguns atendimentos sem retorno e o seu ainda está pendente.”</td></tr>
          <tr><td><strong>Dia 7</strong></td><td>Tarde</td><td>Confirmação final</td><td>WhatsApp</td><td>“Antes de encerrar, queria confirmar: você ainda tem interesse em verificar seu caso?”</td></tr>
          <tr><td><strong>Dia 7</strong></td><td>Final do dia</td><td>Fechar o ciclo com a porta aberta</td><td>WhatsApp</td><td>“Vou encerrar seu atendimento por enquanto para não insistir sem necessidade. Se ainda quiser verificar seu caso, é só me chamar que retomamos de onde paramos.”</td></tr>
        </tbody>
      </table>
      <div class="box box-orange">
        <p class="eyebrow">Regra do pós-proposta</p>
        <p>Nunca pergunte apenas “vai fechar?”. Pergunte: <strong>“o que falta para fechar?”</strong> — é uma das perguntas mais importantes do comercial.</p>
      </div>
    </section>

    <!-- CAP 12 -->
    <section id="recuperacao" class="chapter">
      <div class="chapter-header">
        <span class="chapter-num">12</span>
        <div>
          <p class="eyebrow">Etapa 8</p>
          <h2 class="chapter-title">Recuperação de leads parados</h2>
        </div>
      </div>
      <table>
        <thead><tr><th>Situação</th><th>Estratégia</th><th>Mensagem</th></tr></thead>
        <tbody>
          <tr><td>Parou de responder no meio da conversa</td><td>Retomar pelo ponto exato onde parou</td><td>“[Nome], nossa conversa ficou pendente justamente na etapa de [etapa]. Ainda faz sentido para você resolver isso?”</td></tr>
          <tr><td>Demonstrou interesse e desapareceu</td><td>Dar saída honesta e pedir atualização</td><td>“Se o momento mudou, sem problema. Só preciso saber para atualizar seu atendimento por aqui.”</td></tr>
          <tr><td>Pediu informações e não retornou</td><td>Entregar a informação + pergunta objetiva</td><td>“Separei a informação que você pediu sobre [tema]. Uma dúvida para eu te orientar melhor: [pergunta].”</td></tr>
          <tr><td>Recebeu proposta e não respondeu</td><td>Descobrir o que falta</td><td>“Ficou alguma dúvida sobre a proposta? Existe algum ponto específico te impedindo de avançar?”</td></tr>
          <tr><td>Disse que iria analisar</td><td>Cobrar o combinado com data</td><td>“Você comentou que ia analisar até [dia]. Conseguiu ver? Se preferir, te explico em 5 minutos por ligação.”</td></tr>
          <tr><td>Estava quase fechando (disse sim, não assinou)</td><td>Tratar como lead em fechamento, não como lead frio</td><td>“[Nome], ficou pendente apenas [pagamento/assinatura/documentação]. Consigo te ajudar a concluir essa etapa hoje?”</td></tr>
          <tr><td>Lead antigo (reativação)</td><td>Campanha de reativação com contexto</td><td>“Estou revisando atendimentos pendentes e lembrei do seu caso. Na época você comentou sobre [problema]. Isso ainda está pendente?”</td></tr>
        </tbody>
      </table>
    </section>

    <!-- CAP 13 -->
    <section id="fechamento" class="chapter">
      <div class="chapter-header">
        <span class="chapter-num">13</span>
        <div>
          <p class="eyebrow">Etapa 9</p>
          <h2 class="chapter-title">Fechamento</h2>
        </div>
      </div>
      <p>Fechar não é convencer — é conduzir. Quando aparecem sinais de compra, o comercial precisa transformar interesse em ação concreta.</p>
      <div class="grid-2">
        <div class="msg"><strong>Frase de fechamento — direta</strong>“Pelo que você me contou, seu caso se enquadra. O próximo passo é a assinatura do contrato e o envio dos documentos. Te mando agora para você assinar ainda hoje?”</div>
        <div class="msg"><strong>Frase de fechamento — baixa fricção</strong>“Faz sentido para você avançarmos com a análise do seu caso? Se sim, eu já reservo o horário e te envio a lista de documentos.”</div>
      </div>
      <div class="box">
        <p class="eyebrow">Honorários — estrutura da resposta (Valor → O que está incluído → Contexto → Próximo passo)</p>
        <p>“Os honorários para esse tipo de atuação funcionam assim: [condição]. Antes de avançarmos, precisamos confirmar se o seu caso se enquadra. Pelo que você me contou, podemos seguir para [próximo passo].”</p>
      </div>
    </section>

    <!-- CAP 14 -->
    <section id="nao-qualificado" class="chapter">
      <div class="chapter-header">
        <span class="chapter-num">14</span>
        <div>
          <p class="eyebrow">Etapa 10</p>
          <h2 class="chapter-title">Quando o lead não é qualificado</h2>
        </div>
      </div>
      <table>
        <thead><tr><th>Status</th><th>Significado</th><th>Ação</th></tr></thead>
        <tbody>
          <tr><td><strong>Novo</strong></td><td>Entrou e ainda não houve contato</td><td>Contato imediato</td></tr>
          <tr><td><strong>Em contato</strong></td><td>Respondeu, ainda não qualificado</td><td>Seguir a qualificação</td></tr>
          <tr><td><strong>Qualificando</strong></td><td>Tem potencial, faltam informações</td><td>Perguntas de diagnóstico</td></tr>
          <tr><td><strong>Qualificado (SQL)</strong></td><td>Perfil e problema compatíveis</td><td>Apresentar solução/proposta</td></tr>
          <tr><td><strong>Em negociação</strong></td><td>Avaliando contratação</td><td>Tratar objeções + follow-up</td></tr>
          <tr><td><strong>Em fechamento</strong></td><td>Disse sim, falta assinar/pagar</td><td>Resolver a pendência</td></tr>
          <tr><td><strong>Contrato fechado</strong></td><td>Assinado e pago</td><td>Pós-venda</td></tr>
          <tr><td><strong>Desqualificado</strong></td><td>Não possui perfil</td><td>Encerrar com educação</td></tr>
          <tr><td><strong>Sem momento</strong></td><td>Tem perfil, não quer avançar agora</td><td>Reativação futura</td></tr>
          <tr><td><strong>Sem resposta após cadência</strong></td><td>Cumpriu os 7 dias sem retorno</td><td>Reativação em 30–60 dias</td></tr>
          <tr><td><strong>Perdido</strong></td><td>Escolheu outra solução ou recusou</td><td>Registrar motivo de perda</td></tr>
        </tbody>
      </table>
      <div class="box box-orange"><strong>Atenção:</strong> “Sem resposta” não é “sem interesse”. Classificar silêncio como desqualificação apaga oportunidades reais e distorce a leitura da campanha.</div>
    </section>

    <!-- CAP 15 -->
    <section id="rotina" class="chapter">
      <div class="chapter-header">
        <span class="chapter-num">15</span>
        <div>
          <p class="eyebrow">Operação</p>
          <h2 class="chapter-title">Rotina comercial e canais</h2>
        </div>
      </div>
      <div class="grid-3">
        <div class="box"><p class="eyebrow">Início do dia</p><ul><li>Verificar novos leads</li><li>Responder pendências da noite</li><li>Revisar follow-ups do dia</li><li>Priorizar leads quentes e fechamentos</li></ul></div>
        <div class="box"><p class="eyebrow">Durante o dia</p><ul><li>Atender novos leads em até 5 min</li><li>Executar follow-ups previstos</li><li>Fazer as ligações do dia</li><li>Atualizar CRM/planilha e registrar objeções</li></ul></div>
        <div class="box"><p class="eyebrow">Final do dia</p><ul><li>Conferir leads sem resposta</li><li>Atualizar etapa de cada lead</li><li>Registrar resultados do dia</li><li>Separar os follow-ups de amanhã</li></ul></div>
      </div>
      <table>
        <thead><tr><th>Etapa da Ligação</th><th>O que dizer</th></tr></thead>
        <tbody>
          <tr><td>1. Abertura</td><td>“Olá, [nome], aqui é [closer] do escritório [nome]. Você entrou em contato sobre [problema]. É um bom momento para conversarmos rapidamente?”</td></tr>
          <tr><td>2. Contexto</td><td>“Queria entender o que aconteceu.”</td></tr>
          <tr><td>3. Diagnóstico</td><td>“Quando aconteceu?” · “O que você fez depois?” · “Qual foi o prejuízo?”</td></tr>
          <tr><td>4. Solução</td><td>“Pelo que você me explicou, o próximo passo é [ação].”</td></tr>
          <tr><td>5. Fechamento</td><td>“Faz sentido para você avançarmos?”</td></tr>
        </tbody>
      </table>
    </section>

    <!-- CAP 16 -->
    <section id="funil" class="chapter">
      <div class="chapter-header">
        <span class="chapter-num">16</span>
        <div>
          <p class="eyebrow">Estrutura</p>
          <h2 class="chapter-title">Organização do funil comercial</h2>
        </div>
      </div>
      <table>
        <thead><tr><th>Etapa do funil</th><th>O que significa</th></tr></thead>
        <tbody>
          <tr><td><strong>Novo lead</strong></td><td>Entrou pelo anúncio e ainda não foi contatado</td></tr>
          <tr><td><strong>Primeiro contato</strong></td><td>Mensagem/ligação enviada, sem resposta ainda</td></tr>
          <tr><td><strong>Em atendimento</strong></td><td>Respondeu e a conversa está acontecendo</td></tr>
          <tr><td><strong>Qualificado</strong></td><td>Perfil, problema e intenção confirmados</td></tr>
          <tr><td><strong>Proposta / negociação</strong></td><td>Recebeu condições e está avaliando</td></tr>
          <tr><td><strong>Follow-up</strong></td><td>Sem decisão ainda, dentro da cadência</td></tr>
          <tr><td><strong>Contrato</strong></td><td>Assinado e pago</td></tr>
          <tr><td><strong>Perdido</strong></td><td>Recusou, contratou outro ou não possui perfil</td></tr>
        </tbody>
      </table>
    </section>

    <!-- CAP 17 -->
    <section id="indicadores" class="chapter">
      <div class="chapter-header">
        <span class="chapter-num">17</span>
        <div>
          <p class="eyebrow">Gestão</p>
          <h2 class="chapter-title">Indicadores comerciais</h2>
        </div>
      </div>
      <table>
        <thead><tr><th>Indicador</th><th>O que mede</th><th>Como calcular / exemplo</th></tr></thead>
        <tbody>
          <tr><td><strong>Total de leads</strong></td><td>Volume gerado pelo tráfego</td><td>Contagem no período</td></tr>
          <tr><td><strong>Speed to lead</strong></td><td>Velocidade da 1ª resposta</td><td>Média entre entrada e 1º contato · meta ≤ 5 min</td></tr>
          <tr><td><strong>Contact rate</strong></td><td>Quantos você conseguiu falar</td><td>Leads que responderam ÷ leads trabalhados</td></tr>
          <tr><td><strong>MQL</strong></td><td>Interesse e tema compatíveis</td><td>Contagem de leads dentro do perfil da campanha</td></tr>
          <tr><td><strong>SQL</strong></td><td>Qualificados pelo comercial</td><td>Contagem de leads com perfil + intenção confirmados</td></tr>
          <tr><td><strong>Taxa de qualificação</strong></td><td>Qualidade do tráfego + triagem</td><td>SQL ÷ leads recebidos · 40/200 = 20%</td></tr>
          <tr><td><strong>Taxa de proposta</strong></td><td>Capacidade de avançar</td><td>Propostas ÷ SQL · 25/40 = 62,5%</td></tr>
          <tr><td><strong>Taxa de fechamento</strong></td><td>Capacidade de fechar</td><td>Contratos ÷ SQL · 10/40 = 25%</td></tr>
          <tr><td><strong>Conversão lead → contrato</strong></td><td>Eficiência total</td><td>Contratos ÷ leads · 10/200 = 5%</td></tr>
          <tr><td><strong>CPL (custo por lead)</strong></td><td>Eficiência da mídia</td><td>Investimento ÷ leads · R$ 6.000/200 = R$ 30</td></tr>
          <tr><td><strong>CAC</strong></td><td>Custo por contrato</td><td>Investimento ÷ contratos · R$ 6.000/10 = R$ 600</td></tr>
          <tr><td><strong>Follow-up executado</strong></td><td>Disciplina do comercial</td><td>Follow-ups realizados ÷ previstos × 100 · 80/100 = 80%</td></tr>
        </tbody>
      </table>
      <div class="box box-orange">
        <p class="eyebrow">O indicador que quase ninguém mede</p>
        <p><strong>Taxa de follow-up executado.</strong> Antes de culpar o tráfego, o anúncio ou a oferta, responda: os leads foram realmente trabalhados até o fim da cadência? Sem esse número, toda análise comercial é chute.</p>
      </div>
    </section>

    <!-- CAP 18 -->
    <section id="gargalo" class="chapter">
      <div class="chapter-header">
        <span class="chapter-num">18</span>
        <div>
          <p class="eyebrow">Diagnóstico</p>
          <h2 class="chapter-title">Onde está o seu gargalo</h2>
        </div>
      </div>
      <table>
        <thead><tr><th>Problema</th><th>Possível causa</th><th>Ação recomendada</th></tr></thead>
        <tbody>
          <tr><td>Muitos leads, poucas respostas</td><td>Demora no atendimento, abordagem genérica, canal único</td><td>Reduzir o tempo de resposta, personalizar a 1ª mensagem, incluir ligação e áudio</td></tr>
          <tr><td>Muitos respondendo, poucos qualificados</td><td>Segmentação do anúncio ou público fora do perfil</td><td>Revisar criativo/público com o tráfego e endurecer critérios de qualificação</td></tr>
          <tr><td>Muitos qualificados, poucas propostas</td><td>Diagnóstico fraco e falta de condução</td><td>Aplicar o roteiro de qualificação e sempre definir o próximo passo</td></tr>
          <tr><td>Muitas propostas, poucos contratos</td><td>Percepção de valor, objeções não tratadas, follow-up fraco</td><td>Estruturar a apresentação da solução e executar a cadência pós-proposta</td></tr>
          <tr><td>Quase fechando e não fecha</td><td>Falta de direcionamento no fechamento</td><td>Conduzir a ação concreta: contrato, documento, pagamento com data</td></tr>
          <tr><td>Contratos acontecendo, CAC alto</td><td>CPL alto ou baixa conversão comercial</td><td>Melhorar taxa de qualificação e fechamento antes de aumentar verba</td></tr>
        </tbody>
      </table>
    </section>

    <!-- CAP 19 -->
    <section id="erros" class="chapter">
      <div class="chapter-header">
        <span class="chapter-num">19</span>
        <div>
          <p class="eyebrow">Alerta</p>
          <h2 class="chapter-title">Erros comerciais mais comuns</h2>
        </div>
      </div>
      <div class="grid-2">
        <div class="box"><p class="eyebrow">✓ O que fazer</p><ul><li>Responder rápido e com contexto</li><li>Fazer perguntas e ouvir mais do que falar</li><li>Entender o caso antes de falar de preço</li><li>Registrar tudo e definir a próxima ação</li><li>Insistir com inteligência, dentro da cadência</li></ul></div>
        <div class="box box-warn"><p class="eyebrow">✕ Proibido no comercial</p><ul><li>Prometer resultado ou inventar prazo</li><li>Criar falsa urgência ou pressionar de forma agressiva</li><li>Discutir com o lead ou falar mal de concorrentes</li><li>Abandonar o lead após uma tentativa</li><li>Deixar lead sem próxima ação</li></ul></div>
      </div>
    </section>

    <!-- CAP 20 -->
    <section id="script" class="chapter">
      <div class="chapter-header">
        <span class="chapter-num">20</span>
        <div>
          <p class="eyebrow">Roteiro</p>
          <h2 class="chapter-title">Script comercial base</h2>
        </div>
      </div>
      <table>
        <thead><tr><th>Etapa</th><th>Objetivo</th><th>Como fazer</th></tr></thead>
        <tbody>
          <tr><td><strong>1. Abertura</strong></td><td>Iniciar com contexto</td><td>Nome + origem + problema + pergunta aberta curta</td></tr>
          <tr><td><strong>2. Investigação</strong></td><td>Entender o problema</td><td>“O que aconteceu?” · “Quando?” · “O que você já tentou?”</td></tr>
          <tr><td><strong>3. Qualificação</strong></td><td>Identificar oportunidade</td><td>Impacto, urgência, perfil, intenção e quem decide</td></tr>
          <tr><td><strong>4. Solução</strong></td><td>Apresentar o serviço</td><td>Entendimento + caminho + segurança + próximo passo (sem aula jurídica)</td></tr>
          <tr><td><strong>5. Objeções</strong></td><td>Remover o que impede</td><td>Ouvir → entender → validar → responder → conduzir</td></tr>
          <tr><td><strong>6. Fechamento</strong></td><td>Conduzir à ação</td><td>“Faz sentido avançarmos?” + contrato/documentos/pagamento com data</td></tr>
          <tr><td><strong>7. Follow-up</strong></td><td>Continuar a negociação</td><td>Cadência com objetivo, canal e abordagem diferentes por contato</td></tr>
        </tbody>
      </table>
    </section>

    <!-- CAP 21 -->
    <section id="checklist" class="chapter">
      <div class="chapter-header">
        <span class="chapter-num">21</span>
        <div>
          <p class="eyebrow">Aplicação</p>
          <h2 class="chapter-title">Checklist do comercial</h2>
        </div>
      </div>
      <div class="grid-2">
        <div class="box">
          <p class="eyebrow">Antes de encerrar o atendimento, confira:</p>
          <ul>
            <li>Respondi rapidamente?</li>
            <li>Entendi o problema do lead?</li>
            <li>Fiz perguntas em vez de só responder?</li>
            <li>Qualifiquei o lead (perfil, urgência, intenção)?</li>
            <li>Apresentei a solução de forma simples?</li>
            <li>Identifiquei e tratei objeções?</li>
            <li>Conduzi para um próximo passo concreto?</li>
            <li>Registrei o lead e atualizei a etapa no funil?</li>
          </ul>
        </div>
        <div class="box">
          <p class="eyebrow">Checklist diário do closer:</p>
          <ul>
            <li>Conferir todos os leads novos e responder em até 5 min</li>
            <li>Fazer as ligações previstas do dia</li>
            <li>Executar os follow-ups programados</li>
            <li>Trabalhar leads quentes imediatamente</li>
            <li>Acompanhar propostas e resolver pendências de fechamento</li>
            <li>Atualizar status e encerrar corretamente perdidos/desqualificados</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- CAP 22 -->
    <section id="bolso" class="chapter">
      <div class="chapter-header">
        <span class="chapter-num">22</span>
        <div>
          <p class="eyebrow">Resumo</p>
          <h2 class="chapter-title">Playbook de bolso</h2>
        </div>
      </div>
      <div class="grid-3">
        <div class="box"><strong>1. Responda rápido:</strong> Até 5 minutos, com contexto.</div>
        <div class="box"><strong>2. Entenda o problema:</strong> Pergunte antes de falar.</div>
        <div class="box"><strong>3. Qualifique:</strong> Perfil, urgência e intenção.</div>
        <div class="box"><strong>4. Conduza:</strong> Sempre defina o próximo passo.</div>
        <div class="box"><strong>5. Não abandone:</strong> Follow-up até o fim da cadência.</div>
      </div>
      <div class="quote">
        “O lead que não fechou hoje não significa necessariamente um lead perdido. Muitas oportunidades são perdidas porque o comercial parou de conversar antes do momento certo.”
      </div>
      <div class="box">
        <p class="eyebrow">Filosofia do closer</p>
        <p>Não pense “como faço esse lead comprar?”. Pense “o que preciso descobrir para saber se esse lead deve avançar?”. Isso muda a postura: de persuasivo demais para consultivo, investigativo e condutor.</p>
      </div>
    </section>
  </div>
</body>
</html>`;

export default function ProcessualModule() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a]">
      {/* Barra superior de navegação */}
      <header className="h-16 border-b border-white/10 bg-black/50 backdrop-blur-md flex items-center px-6 shrink-0 z-50">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-bold tracking-wider uppercase"
        >
          <ArrowLeft size={16} />
          Voltar ao Hub Central
        </button>
        <div className="mx-auto font-display text-white font-bold tracking-widest text-sm bg-white/5 px-4 py-1 rounded-full border border-white/10">
          Módulo 02 — Treinamentos, Playbook e Aulas
        </div>
      </header>

      {/* Container do Playbook usando Iframe para preservar 100% o CSS do HTML enviado */}
      <div className="flex-1 w-full bg-[#0f141c]">
        <iframe 
          srcDoc={playbookHtml} 
          className="w-full h-full border-none" 
          title="Treinamentos e Playbook"
        />
      </div>
    </div>
  );
}
