"use client";

import { motion } from "framer-motion";
import { 
  Download, 
  Trash2, 
  Eye, 
  Calendar,
  Image as ImageIcon,
  Plus,
  Clock,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Creation {
  id: string;
  image_url: string;
  created_at: string;
  format_selected: string;
  copywriting_texts?: any;
}

interface HistoryViewProps {
  creations: Creation[];
}

export function HistoryView({ creations }: HistoryViewProps) {
  const hasCreations = creations.length > 0;

  return (
    <div className="flex-1 bg-brand-dark min-h-screen select-none overflow-y-auto">
      <div className="max-w-7xl mx-auto px-6 py-12 pb-24 md:pb-12 space-y-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight font-display">
              Minhas <span className="bg-clip-text text-transparent bg-brand-gradient">Criações</span>
            </h1>
            <p className="text-white/40 font-medium mt-2">
              Visualize e baixe suas fotos e legendas profissionais.
            </p>
          </div>
          
          <Link 
            href="/estudio"
            className="flex items-center justify-center gap-3 px-8 py-4 bg-brand-gradient text-white text-sm font-bold rounded-2xl hover:opacity-90 transition-all shadow-xl active:scale-95"
          >
            <Plus size={20} />
            Nova Criação
          </Link>
        </div>

        {/* Content Section */}
        {!hasCreations ? (
          <EmptyHistory />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {creations.map((creation, idx) => (
              <CreationCard key={creation.id} creation={creation} index={idx} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

function CreationCard({ creation, index }: { creation: Creation, index: number }) {
  const dateFormatted = format(new Date(creation.created_at), "dd 'de' MMM", {
    locale: ptBR,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group bg-brand-surface border border-white/5 rounded-[32px] overflow-hidden hover:border-brand-orange/20 transition-all flex flex-col shadow-2xl"
    >
      {/* Image Preview Area */}
      <div className="aspect-square relative overflow-hidden bg-brand-dark/40">
        <img 
          src={creation.image_url} 
          alt="Criação"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Format Badge */}
        <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-brand-dark/80 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white uppercase tracking-widest shadow-2xl">
           {creation.format_selected}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
      </div>

      {/* Footer / Meta Section */}
      <div className="p-6 flex flex-col gap-4 relative z-10">
         <div className="flex items-center justify-between">
           <div className="flex items-center gap-2 text-white/30">
              <Calendar size={14} className="text-brand-orange/40" />
              <span className="text-[11px] font-bold uppercase tracking-widest">{dateFormatted}</span>
           </div>
           
           <div className="flex items-center gap-1">
             <button className="p-2.5 text-white/40 hover:text-white hover:bg-white/5 rounded-xl transition-all" title="Ver Detalhes">
                <Eye size={18} />
             </button>
             <button className="p-2.5 text-white/40 hover:text-brand-orange hover:bg-brand-orange/10 rounded-xl transition-all" title="Download">
                <Download size={18} />
             </button>
             <button className="p-2.5 text-white/40 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all" title="Excluir">
                <Trash2 size={18} />
             </button>
           </div>
         </div>
      </div>
    </motion.div>
  );
}

function EmptyHistory() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center bg-brand-surface border border-white/5 border-dashed rounded-[40px] shadow-inner">
      <div className="w-20 h-20 rounded-3xl bg-brand-dark border border-white/5 flex items-center justify-center mb-8 shadow-2xl">
        <Clock size={32} className="text-white/10" />
      </div>
      <h3 className="text-2xl font-bold text-white font-display">Sua galeria está vazia</h3>
      <p className="text-sm text-white/40 max-w-xs mx-auto mt-3 mb-10 font-medium leading-relaxed">
        Você ainda não gerou nenhum projeto profissional. Comece agora e transforme seu cardápio!
      </p>
      
      <Link 
        href="/estudio"
        className="flex items-center gap-3 px-10 py-4 bg-brand-gradient text-white font-bold rounded-2xl hover:opacity-90 transition-all shadow-xl active:scale-95"
      >
        <Plus size={22} />
        Começar Minha Primeira Foto
      </Link>
    </div>
  );
}
