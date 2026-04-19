"use client";

import { motion } from "framer-motion";
import { 
  LayoutTemplate, 
  Truck, 
  Calendar, 
  Users, 
  ArrowRight,
  Sparkles,
  Play
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
    color: "from-blue-500/20 to-cyan-500/20",
    accent: "text-blue-500",
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
    color: "from-pepper-red/20 to-pepper-orange/20",
    accent: "text-pepper-orange",
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
    color: "from-green-500/20 to-emerald-500/20",
    accent: "text-green-600",
    suggestedCopy: "Saudade do nosso tempero? Preparamos um presente exclusivo para você voltar a saborear nosso prato chefe! 🎁✨"
  }
];

export default function TemplatesPage() {
  return (
    <div className="flex-1 px-[var(--space-page)] py-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex flex-col gap-2">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pepper-orange/5 border border-pepper-orange/10 w-fit">
              <Sparkles size={14} className="text-pepper-orange" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-pepper-orange">Marketing Proativo</span>
           </div>
           <h1 className="font-display font-bold text-3xl text-text-primary tracking-tight">
              Templates & <span className="text-pepper-orange">Promoções</span>
           </h1>
           <p className="text-text-muted max-w-2xl">
              Não gaste tempo pensando no que postar. Escolha um template estratégico e o seu Diretor de Marketing cuidará do design e dos textos.
           </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {templates.map((template, idx) => (
             <TemplateCard key={template.id} template={template} index={idx} />
           ))}
        </div>

        {/* Suggestion Section */}
        <div className="p-8 rounded-3xl border border-dashed border-border-default flex flex-col items-center text-center space-y-4 bg-bg-surface/30">
           <div className="w-12 h-12 rounded-full bg-bg-elevated flex items-center justify-center text-text-muted">
              <PlusCircleIcon size={24} />
           </div>
           <div>
              <h3 className="font-display font-bold text-lg text-text-primary">Sentiu falta de algum formato?</h3>
              <p className="text-sm text-text-muted mt-1">
                 Estamos treinando a IA para lidar com novos tipos de promoções toda semana.
              </p>
           </div>
           <button className="text-pepper-orange text-sm font-bold hover:underline">
              Sugerir novo template
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
      transition={{ delay: index * 0.1 }}
      className="group flex flex-col h-full bg-bg-surface border border-border-default rounded-3xl overflow-hidden hover:border-pepper-orange/30 transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]"
    >
      {/* Visual Area */}
      <div className="relative h-56 w-full overflow-hidden">
         <img 
           src={template.imageUrl} 
           alt={template.title}
           className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
         />
         <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-transparent" />
         
         <div className="absolute top-4 left-4">
            <span className="px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md border border-white text-[10px] font-black uppercase tracking-wider text-pepper-red shadow-sm">
               {template.format}
            </span>
         </div>

         <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-12 h-12 rounded-full bg-pepper-orange text-white flex items-center justify-center shadow-xl shadow-pepper-orange/40 scale-75 group-hover:scale-100 transition-transform duration-300">
               <Play size={20} fill="currentColor" />
            </div>
         </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
         <div className="flex-1 space-y-2">
            <span className={cn("text-[10px] font-bold uppercase tracking-widest", template.accent)}>
               {template.category}
            </span>
            <h3 className="font-display font-bold text-xl text-text-primary group-hover:text-pepper-orange transition-colors">
               {template.title}
            </h3>
            <p className="text-sm text-text-muted leading-relaxed">
               {template.description}
            </p>
         </div>

         {/* CTA */}
         <Link 
            href={`/dashboard/create?template=${template.id}`}
            className="mt-6 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-bg-elevated hover:bg-pepper-red hover:text-white text-text-primary font-bold text-sm transition-all border border-border-default hover:border-pepper-red"
         >
            Usar Este Template
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
         </Link>
      </div>
    </motion.div>
  );
}

function PlusCircleIcon({ size }: { size: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v8" />
      <path d="M8 12h8" />
    </svg>
  );
}
