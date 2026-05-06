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
    <div className="flex-1 bg-[#F7F7F7] min-h-screen overflow-y-auto">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-12">
        
        {/* Header Section */}
        <div className="relative overflow-hidden bg-white border border-[#EAEAEC] rounded-3xl p-8 shadow-sm">
           {/* Decorative elements */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-[#EA1D2C] opacity-[0.02] rounded-full translate-x-1/2 -translate-y-1/2" />
           <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500 opacity-[0.02] rounded-full -translate-x-1/4 translate-y-1/4" />

           <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-4 max-w-2xl">
                 <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-100">
                    <Sparkles size={14} className="text-[#EA1D2C]" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#EA1D2C]">Marketing Inteligente</span>
                 </div>
                 <h1 className="text-3xl md:text-4xl font-bold text-[#3E3E3E] tracking-tight">
                    Templates & <span className="text-[#EA1D2C]">Promoções</span>
                 </h1>
                 <p className="text-[#717171] leading-relaxed">
                    Escolha estratégias validadas para o seu delivery. Nossos modelos de IA criam o design e a legenda ideal para cada momento do seu negócio.
                 </p>
              </div>
              
              <div className="hidden lg:flex items-center gap-3 p-4 bg-[#F7F7F7] rounded-2xl border border-[#EAEAEC]">
                 <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#EA1D2C] shadow-sm">
                    <LayoutTemplate size={20} />
                 </div>
                 <div>
                    <p className="text-xs font-bold text-[#3E3E3E]">Novos Templates</p>
                    <p className="text-[10px] font-bold text-[#A6A6A6] uppercase tracking-widest">Toda semana</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Templates Grid */}
        <div className="space-y-6">
           <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#3E3E3E] uppercase tracking-wider flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-[#EA1D2C]" />
                 Templates Sugeridos
              </h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template, idx) => (
                <TemplateCard key={template.id} template={template} index={idx} />
              ))}
           </div>
        </div>

        {/* Suggestion & Feedback */}
        <div className="bg-white border border-dashed border-[#DDDDE0] rounded-3xl p-10 flex flex-col items-center text-center space-y-6">
           <div className="w-14 h-14 rounded-2xl bg-[#F7F7F7] border border-[#EAEAEC] flex items-center justify-center text-[#A6A6A6]">
              <Plus size={28} />
           </div>
           <div className="max-w-md">
              <h3 className="text-xl font-bold text-[#3E3E3E] tracking-tight">Sentiu falta de algo?</h3>
              <p className="text-sm text-[#717171] mt-2 leading-relaxed">
                 Estamos constantemente treinando nossa IA para dominar novos formatos de promoções e campanhas sazonais.
              </p>
           </div>
           <button className="px-6 py-2.5 rounded-xl bg-white border border-[#EAEAEC] text-[#EA1D2C] text-sm font-bold hover:bg-red-50 hover:border-[#EA1D2C]/30 transition-all shadow-sm active:scale-95">
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="group flex flex-col bg-white border border-[#EAEAEC] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-[#EA1D2C]/20 transition-all duration-300"
    >
      {/* Visual Area */}
      <div className="relative h-60 w-full overflow-hidden">
         <img 
           src={template.imageUrl} 
           alt={template.title}
           className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
         />
         <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
         
         {/* Format Badge */}
         <div className="absolute top-4 left-4">
            <span className="px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-white text-[10px] font-bold uppercase tracking-wider text-[#3E3E3E] shadow-lg">
               {template.format}
            </span>
         </div>

         {/* Category Badge */}
         <div className="absolute bottom-4 left-4">
            <span className={cn(
               "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border shadow-lg",
               template.bg, template.accent, template.border
            )}>
               {template.category}
            </span>
         </div>

         {/* Hover Play Overlay */}
         <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <motion.div 
               whileHover={{ scale: 1.1 }}
               className="w-14 h-14 rounded-full bg-white text-[#EA1D2C] flex items-center justify-center shadow-2xl"
            >
               <Play size={24} fill="currentColor" className="ml-1" />
            </motion.div>
         </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
         <div className="flex-1 space-y-3">
            <h3 className="text-xl font-bold text-[#3E3E3E] group-hover:text-[#EA1D2C] transition-colors tracking-tight">
               {template.title}
            </h3>
            <p className="text-sm text-[#717171] leading-relaxed line-clamp-2">
               {template.description}
            </p>
            
            {/* Suggested Copy Hint */}
            <div className="mt-4 p-3 bg-[#F7F7F7] rounded-xl border border-[#EAEAEC]">
               <p className="text-[10px] font-bold text-[#A6A6A6] uppercase tracking-widest mb-1 flex items-center gap-1">
                  <Icon size={10} /> Sugestão de Copy
               </p>
               <p className="text-[11px] text-[#3E3E3E] font-medium line-clamp-2 italic">
                  "{template.suggestedCopy}"
               </p>
            </div>
         </div>

         {/* CTA */}
         <Link 
            href={`/estudio/criar?template=${template.id}`}
            className="mt-8 flex items-center justify-center gap-3 w-full h-12 rounded-xl bg-white border border-[#EAEAEC] text-[#3E3E3E] font-bold text-sm hover:bg-[#EA1D2C] hover:text-white hover:border-[#EA1D2C] transition-all group/btn shadow-sm"
         >
            Usar Este Template
            <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
         </Link>
      </div>
    </motion.div>
  );
}
