"use client";

import { motion } from "framer-motion";
import { 
  LayoutTemplate, 
  Truck, 
  Calendar, 
  Users, 
  ArrowRight,
  Sparkles,
  Play,
  Plus
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const templates = [
  {
    id: "frete-gratis",
    title: "Quarta-Feira do Frete Grátis",
    description: "Atraia pedidos no meio da semana com um cupom irresistível.",
    category: "Engajamento",
    format: "Reels / Story (9:16)",
    icon: Truck,
    imageUrl: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=600&auto=format&fit=crop",
    accent: "text-blue-500",
    bg: "bg-blue-50",
    border: "border-blue-100",
    suggestedCopy: "Meio de semana combina com o que? COMIDA BOA E FRETE GRÁTIS! 🛵💨 Use o cupom 'QUARTA0' e aproveite."
  },
  {
    id: "fim-de-semana",
    title: "Fim de Semana Prime",
    description: "O template perfeito para o horário nobre do seu delivery.",
    category: "Vendas",
    format: "Capa + Story",
    icon: Calendar,
    imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600&auto=format&fit=crop",
    accent: "text-[#EA1D2C]",
    bg: "bg-red-50",
    border: "border-red-100",
    suggestedCopy: "Você trabalhou a semana toda, você merece o melhor. Nosso Especial Prime está saindo agora do forno! 🔥😋"
  },
  {
    id: "resgate-clientes",
    title: "Resgate Clientes Frios",
    description: "Sempre uma boa desculpa para aquele 'Oi sumido' pro cliente.",
    category: "Retenção",
    format: "WhatsApp (1:1)",
    icon: Users,
    imageUrl: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=600&auto=format&fit=crop",
    accent: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    suggestedCopy: "Saudade do nosso tempero? Preparamos um presente exclusivo para você voltar a saborear nosso prato chefe! 🎁✨"
  }
];

export default function TemplatesPage() {
  return (
    <div className="flex-1 bg-brand-dark min-h-screen overflow-y-auto select-none">
      <div className="max-w-7xl mx-auto px-6 py-12 pb-24 md:pb-12 space-y-12">
        
        {/* Header Section */}
        <div className="relative overflow-hidden bg-brand-surface border border-white/5 rounded-[40px] p-10 shadow-2xl group">
           {/* Decorative elements */}
           <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/5 blur-[100px] -mr-32 -mt-32 group-hover:bg-brand-orange/10 transition-colors duration-700" />
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-yellow/5 blur-[80px] -ml-20 -mb-20 group-hover:bg-brand-yellow/10 transition-colors duration-700" />

           <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
              <div className="space-y-6 max-w-2xl">
                 <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                    <Sparkles size={16} className="text-brand-yellow animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">Marketing de Alta Performance</span>
                 </div>
                 <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight font-display leading-[1.1]">
                    Templates & <span className="bg-clip-text text-transparent bg-brand-gradient">Estratégias</span>
                 </h1>
                 <p className="text-white/40 text-lg font-medium leading-relaxed">
                    Escolha estratégias validadas para o seu delivery. Nossos modelos de IA criam o design e a legenda ideal para cada momento do seu negócio.
                 </p>
              </div>
              
              <div className="hidden xl:flex items-center gap-4 p-6 bg-brand-dark/50 rounded-3xl border border-white/5 backdrop-blur-xl shadow-inner">
                 <div className="w-14 h-14 rounded-2xl bg-brand-gradient flex items-center justify-center text-white shadow-xl">
                    <LayoutTemplate size={28} />
                 </div>
                 <div>
                    <p className="text-sm font-bold text-white font-display">Novos Templates</p>
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mt-1">Toda semana</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Templates Grid */}
        <div className="space-y-8">
           <div className="flex items-center gap-4 ml-1">
              <div className="w-1.5 h-6 bg-brand-gradient rounded-full" />
              <h2 className="text-sm font-bold text-white uppercase tracking-[0.2em] font-display">
                 Modelos em Destaque
              </h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {templates.map((template, idx) => (
                <TemplateCard key={template.id} template={template} index={idx} />
              ))}
           </div>
        </div>

        {/* Suggestion & Feedback */}
        <div className="bg-brand-surface border border-dashed border-white/10 rounded-[40px] p-16 flex flex-col items-center text-center space-y-8 shadow-2xl relative overflow-hidden group">
           <div className="absolute inset-0 bg-brand-orange/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
           <div className="w-20 h-20 rounded-3xl bg-brand-dark border border-white/5 flex items-center justify-center text-white/10 shadow-2xl group-hover:text-brand-orange/40 transition-colors duration-500 relative z-10">
              <Plus size={40} />
           </div>
           <div className="max-w-md relative z-10">
              <h3 className="text-2xl font-bold text-white tracking-tight font-display">Sentiu falta de algo?</h3>
              <p className="text-sm text-white/40 mt-3 font-medium leading-relaxed">
                 Estamos constantemente treinando nossa IA para dominar novos formatos de promoções e campanhas sazonais.
              </p>
           </div>
           <button className="px-10 py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-widest hover:bg-brand-orange hover:border-brand-orange transition-all shadow-xl active:scale-95 relative z-10">
              Sugerir novo formato
           </button>
        </div>
      </div>
    </div>
  );
}

function TemplateCard({ template, index }: { template: typeof templates[0], index: number }) {
  const Icon = template.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="group flex flex-col bg-brand-surface border border-white/5 rounded-[40px] overflow-hidden shadow-2xl hover:border-brand-orange/20 transition-all duration-500"
    >
      {/* Visual Area */}
      <div className="relative h-72 w-full overflow-hidden">
         <img 
           src={template.imageUrl} 
           alt={template.title}
           className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
         />
         <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/20 to-transparent opacity-80" />
         
         {/* Format Badge */}
         <div className="absolute top-6 left-6">
            <span className="px-4 py-2 rounded-xl bg-brand-dark/80 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white shadow-2xl">
               {template.format}
            </span>
         </div>

         {/* Category Badge */}
         <div className="absolute bottom-6 left-6">
            <span className={cn(
               "px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border shadow-2xl backdrop-blur-md",
               "bg-brand-orange/10 text-brand-orange border-brand-orange/20"
            )}>
               {template.category}
            </span>
         </div>

         {/* Hover Play Overlay */}
         <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <motion.div 
               whileHover={{ scale: 1.1 }}
               className="w-16 h-16 rounded-full bg-white text-brand-dark flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.3)]"
            >
               <Play size={28} fill="currentColor" className="ml-1" />
            </motion.div>
         </div>
      </div>

      {/* Content */}
      <div className="p-8 flex flex-col flex-1 relative z-10">
         <div className="flex-1 space-y-4">
            <h3 className="text-2xl font-bold text-white group-hover:text-brand-orange transition-colors tracking-tight font-display leading-tight">
               {template.title}
            </h3>
            <p className="text-sm text-white/40 leading-relaxed line-clamp-2 font-medium">
               {template.description}
            </p>
            
            {/* Suggested Copy Hint */}
            <div className="mt-6 p-5 bg-brand-dark/40 rounded-2xl border border-white/5 relative overflow-hidden group/copy">
               <div className="absolute top-0 right-0 w-20 h-20 bg-white/[0.02] -mr-10 -mt-10 blur-xl group-hover/copy:bg-brand-orange/5 transition-colors" />
               <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mb-2 flex items-center gap-2 relative z-10">
                  <Icon size={12} className="text-brand-orange/40" /> Sugestão de Copy
               </p>
               <p className="text-xs text-white/70 font-medium line-clamp-3 italic leading-relaxed relative z-10">
                  "{template.suggestedCopy}"
               </p>
            </div>
         </div>

         {/* CTA */}
         <Link 
            href={`/estudio?template=${template.id}`}
            className="mt-10 flex items-center justify-center gap-3 w-full h-14 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-widest hover:bg-brand-gradient hover:border-transparent hover:scale-[1.02] transition-all group/btn shadow-xl active:scale-95"
         >
            Usar Este Template
            <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
         </Link>
      </div>
    </motion.div>
  );
}
