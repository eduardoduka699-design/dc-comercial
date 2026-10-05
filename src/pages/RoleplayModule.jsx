import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Phone, Video, MoreVertical, Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RoleplayModule() {
  const navigate = useNavigate();
  const [role, setRole] = useState('sdr'); // sdr, closer, bdr
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const roleConfig = {
    sdr: {
      name: 'Simulador: Lead (Recepção)',
      context: 'Você é um lead de Lei Seca que chegou pelo anúncio. O SDR vai tentar te qualificar. Dê respostas curtas, seja um pouco desconfiado e pergunte o preço cedo.',
      firstMessage: 'Oi, vi o anúncio no Insta sobre recurso de lei seca. Como funciona e qual o valor?'
    },
    closer: {
      name: 'Simulador: Lead Qualificado',
      context: 'Você já passou pelo SDR. Agora o Closer vai apresentar a solução e tentar fechar. Dê objeções sobre dinheiro e tempo.',
      firstMessage: 'Oi, a recepção me passou pra você. Disseram que você vai analisar meu caso da multa. O que precisa?'
    },
    bdr: {
      name: 'Simulador: Prospect Frio',
      context: 'Você foi abordado no LinkedIn/Cold Call. O BDR está tentando marcar uma reunião. Seja ocupado e sem tempo.',
      firstMessage: 'Quem está falando? Não lembro de ter pedido contato.'
    }
  };

  useEffect(() => {
    // Reset messages when role changes
    setMessages([
      { sender: 'ai', text: roleConfig[role].firstMessage, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }
    ]);
  }, [role]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newUserMsg = { sender: 'user', text: inputValue, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setIsTyping(true);

    // Mock AI Response based on Roleplay rules
    setTimeout(() => {
      let aiReply = '';
      const input = newUserMsg.text.toLowerCase();

      if (role === 'sdr') {
        if (input.includes('valor') || input.includes('preço') || input.includes('custa')) {
          aiReply = 'Mas antes de eu explicar, me diz logo uma média de valor. Só pra eu saber se cabe no bolso.';
        } else if (input.includes('entender') || input.includes('aconteceu')) {
          aiReply = 'Eu soprei o bafômetro e deu positivo. Quero saber se dá pra cancelar essa multa de quase 3 mil.';
        } else {
          aiReply = 'Entendi... E quanto tempo demora esse processo todo?';
        }
      } else if (role === 'closer') {
        if (input.includes('contrato') || input.includes('assinar')) {
          aiReply = 'Eu vi os valores aqui. Achei um pouco puxado pra pagar à vista. Vocês parcelam no boleto?';
        } else if (input.includes('garantia') || input.includes('certeza')) {
          aiReply = 'Mas vocês garantem que eu não vou perder a carteira? Não quero pagar pra depois perder igual.';
        } else {
          aiReply = 'Certo, eu entendi a estratégia. Mas vou ter que dar uma pensada e ver com minha esposa antes de fechar.';
        }
      } else {
        aiReply = 'Olha, tô numa reunião agora. Me manda um PDF no WhatsApp que depois eu dou uma olhada.';
      }

      setMessages(prev => [...prev, { sender: 'ai', text: aiReply, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex flex-col">
      

      <main className="flex-1 w-full max-w-6xl mx-auto p-4 md:p-8 flex gap-6 overflow-hidden h-[calc(100vh-64px)]">
        
        {/* Painel de Configuração (Esquerda) */}
        <div className="w-80 bg-[#151515] border border-white/10 rounded-2xl p-6 flex flex-col hidden md:flex shrink-0">
          <h2 className="text-xl font-display font-bold mb-6">Setup do Treino</h2>
          
          <div className="space-y-4 flex-1">
            <div>
              <label className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2 block">Papel que você vai treinar</label>
              <div className="space-y-2">
                <button onClick={() => setRole('sdr')} className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${role === 'sdr' ? 'border-brand-blue bg-brand-blue/10 text-white' : 'border-white/10 text-white/50 hover:bg-white/5'}`}>
                  <div className="font-bold">SDR (Triagem)</div>
                  <div className="text-[10px] mt-1">Treine o primeiro contato e qualificação.</div>
                </button>
                <button onClick={() => setRole('closer')} className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${role === 'closer' ? 'border-brand-blue bg-brand-blue/10 text-white' : 'border-white/10 text-white/50 hover:bg-white/5'}`}>
                  <div className="font-bold">Closer (Fechamento)</div>
                  <div className="text-[10px] mt-1">Treine apresentação e contorno de objeções.</div>
                </button>
                <button onClick={() => setRole('bdr')} className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${role === 'bdr' ? 'border-brand-blue bg-brand-blue/10 text-white' : 'border-white/10 text-white/50 hover:bg-white/5'}`}>
                  <div className="font-bold">BDR (Prospecção)</div>
                  <div className="text-[10px] mt-1">Treine cold call e geração de interesse.</div>
                </button>
              </div>
            </div>

            <div className="mt-8 bg-black/50 p-4 rounded-xl border border-white/5">
              <div className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Instrução da IA</div>
              <p className="text-sm text-white/80">{roleConfig[role].context}</p>
            </div>
          </div>
          
          <div className="text-xs text-white/30 text-center">
            A IA analisará seu desempenho ao final da simulação.
          </div>
        </div>

        {/* WhatsApp Mock UI (Direita) */}
        <div className="flex-1 bg-[#0b1014] border border-white/10 rounded-2xl flex flex-col overflow-hidden relative shadow-2xl">
          {/* Fundo do WhatsApp */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url(https://web.whatsapp.com/img/bg-chat-tile-dark_a4be512e7195b6b733d9110b408f075d.png)' }}></div>

          {/* Header do Chat */}
          <div className="h-16 bg-[#202c33] flex items-center justify-between px-4 z-10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-blue rounded-full flex items-center justify-center font-bold">
                IA
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">{roleConfig[role].name}</h3>
                <p className="text-xs text-[#10b981]">{isTyping ? 'digitando...' : 'online'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-[#aebac1]">
              <Video size={20} className="cursor-pointer" />
              <Phone size={20} className="cursor-pointer" />
              <MoreVertical size={20} className="cursor-pointer" />
            </div>
          </div>

          {/* Mensagens */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4 z-10">
            <div className="flex justify-center mb-6">
              <span className="bg-[#182229] text-[#8696a0] text-xs px-3 py-1 rounded-lg">HOJE</span>
            </div>
            
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] md:max-w-[60%] rounded-lg p-2.5 px-3 relative shadow-sm ${msg.sender === 'user' ? 'bg-[#005c4b] text-white rounded-tr-none' : 'bg-[#202c33] text-white rounded-tl-none'}`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  <div className="flex justify-end items-center gap-1 mt-1 -mb-1">
                    <span className="text-[10px] text-white/60">{msg.time}</span>
                    {msg.sender === 'user' && <CheckCircleIcon />}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input do Chat */}
          <div className="bg-[#202c33] p-3 px-4 z-10 flex items-center gap-3 shrink-0">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Digite sua resposta aqui para treinar..."
              className="flex-1 bg-[#2a3942] text-white rounded-lg py-2.5 px-4 text-sm focus:outline-none placeholder:text-[#8696a0]"
            />
            <button 
              onClick={handleSend}
              className={`p-2.5 rounded-full flex items-center justify-center transition-colors ${inputValue.trim() ? 'bg-[#00a884] text-white' : 'bg-transparent text-[#8696a0]'}`}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

const CheckCircleIcon = () => (
  <svg viewBox="0 0 16 15" width="16" height="15" fill="none">
    <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" fill="#53bdeb"/>
  </svg>
);

