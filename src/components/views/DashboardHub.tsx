"use client";

import { motion } from "framer-motion";
import { Sparkles, Target, Plus, ImageIcon, Type, ArrowRight, LayoutTemplate } from "lucide-react";

interface DashboardHubProps {
  onStartKit: () => void;
  onOpenStore: () => void;
  creditsRemaining: number;
  userName?: string;
}

// Histórico Minimalista
const recentMinimal = [
  { id: 1, title: 'Smash Burger Oferta', time: 'Há 2 horas' },
  { id: 2, title: 'Combo Margherita', time: 'Ontem' },
  { id: 3, title: 'Stories Café da Manhã', time: '12 de Maio' },
];

export function DashboardHub({ onStartKit, onOpenStore, creditsRemaining, userName }: DashboardHubProps) {
  return (
    <div className="flex flex-col h-full p-8 lg:p-12 gap-8 overflow-y-auto select-none bg-bg-main relative">
      
      {/* Welcome */}
      <header className="flex-none max-w-4xl">
        <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">Bom dia, Chef.</h1>
        <p className="text-sm text-text-secondary mt-1">O que vamos servir para seus clientes hoje?</p>
      </header>

      {/* Featured Guide / Mission - The core focus */}
      <section className="flex-none max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden shadow-xl shadow-pepper-red/10 border border-pepper-red/5 bg-pepper-red"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center">
            <div className="p-8 md:p-10 flex-1 relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-widest leading-none backdrop-blur-md">
                  <Target size={12} /> Sugestão da IA
                </span>
                <span className="text-[10px] font-bold text-white/60 tracking-widest uppercase">+50 Créditos</span>
              </div>
              
              <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight mb-3">
                O Canivete Suíço do seu <span className="bg-white text-pepper-red px-2 py-0.5 rounded-lg">Delivery.</span>
              </h2>
              <p className="text-sm text-white/80 mb-8 max-w-lg leading-relaxed">
                Transforme fotos simples de celular nas <strong>Fotos de Cardápio iFood</strong> que mais vendem na sua região. IA, design e estratégia em um só lugar.
              </p>
              
              <button 
                onClick={onStartKit}
                className="flex items-center gap-2 bg-white text-pepper-red px-8 py-4 rounded-xl font-bold shadow-lg shadow-black/5 hover:scale-[1.02] active:scale-95 transition-transform"
              >
                <Sparkles size={18} />
                GERAR KIT IFOOD AGORA
              </button>
            </div>

            {/* Visual Flair right side */}
            <div className="hidden md:block w-72 h-full absolute right-0 top-0 bg-gradient-to-l from-white/10 to-transparent pointer-events-none flex items-center justify-center">
              <div className="w-48 h-48 rounded-full border-4 border-white/10 border-dashed animate-[spin_20s_linear_infinite]" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Capabilities / Quick Actions - What it can do */}
      <section className="flex-none max-w-4xl">
        <h3 className="text-sm font-bold text-text-muted uppercase tracking-widest mb-4">Acesso Rápido</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div 
            onClick={onStartKit}
            className="group cursor-pointer bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all hover:bg-bg-elevated"
          >
            <div className="w-10 h-10 rounded-xl bg-pepper-red/10 text-pepper-red flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <LayoutTemplate size={20} />
            </div>
            <h4 className="font-bold text-text-primary text-sm mb-1">Kit Mágico Completo</h4>
            <p className="text-xs text-text-secondary">Fotos e legendas combinadas para redes sociais.</p>
          </div>

          <div className="group cursor-pointer bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all hover:bg-bg-elevated opacity-70 hover:opacity-100">
            <div className="w-10 h-10 rounded-xl bg-bg-elevated text-text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ImageIcon size={20} />
            </div>
            <h4 className="font-bold text-text-primary text-sm mb-1">Somente Foto Premium</h4>
            <p className="text-xs text-text-secondary">Gere apenas imagens isoladas (Em breve).</p>
          </div>

          <div className="group cursor-pointer bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all hover:bg-bg-elevated opacity-70 hover:opacity-100">
            <div className="w-10 h-10 rounded-xl bg-bg-elevated text-text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Type size={20} />
            </div>
            <h4 className="font-bold text-text-primary text-sm mb-1">Copywriter IA</h4>
            <p className="text-xs text-text-secondary">Crie apenas os textos para fotos que já tem.</p>
          </div>

        </div>
      </section>

      {/* Very Clean History */}
      <section className="flex-1 max-w-4xl min-h-0 flex flex-col pt-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-text-muted uppercase tracking-widest">Atividade Recente</h3>
          <button className="text-[10px] uppercase font-bold text-pepper-red flex items-center gap-1 hover:text-pepper-orange transition-colors">
            Ver Tudo <ArrowRight size={12} />
          </button>
        </div>
        
        <div className="flex flex-col gap-2 overflow-y-auto scrollbar-hide">
          {recentMinimal.map(item => (
            <div key={item.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-bg-elevated transition-colors group cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-bg-elevated text-text-muted flex items-center justify-center">
                  <LayoutTemplate size={14} />
                </div>
                <span className="text-sm font-semibold text-text-primary">{item.title}</span>
              </div>
              <span className="text-xs text-text-muted">{item.time}</span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
