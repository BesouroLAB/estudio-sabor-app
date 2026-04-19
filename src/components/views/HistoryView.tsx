"use client";

import { motion } from "framer-motion";
import { 
  Download, 
  Share2, 
  Trash2, 
  Eye, 
  Calendar,
  Image as ImageIcon,
  Plus
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
    <div className="flex-1 px-[var(--space-page)] py-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-bold text-3xl text-text-primary tracking-tight">
              Meus <span className="text-pepper-orange">Projetos</span>
            </h1>
            <p className="text-text-muted mt-1">
              Sua galeria de fotos e artes profissionais geradas com IA.
            </p>
          </div>
          
          <Link 
            href="/dashboard/create"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-pepper-red to-pepper-orange text-white font-bold rounded-xl shadow-lg shadow-pepper-red/20 hover:scale-[1.02] transition-all"
          >
            <Plus size={18} />
            Nova Criação
          </Link>
        </div>

        {/* Content */}
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
  const dateFormatted = format(new Date(creation.created_at), "dd 'de' MMMM", {
    locale: ptBR,
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className="group relative flex flex-col bg-bg-surface border border-border-default rounded-2xl overflow-hidden hover:border-pepper-orange/30 transition-all shadow-lg hover:shadow-[0_20px_50px_rgba(227,27,19,0.06)]"
    >
      {/* Image Preview */}
      <div className="aspect-square relative overflow-hidden bg-bg-elevated">
        <img 
          src={creation.image_url} 
          alt="Criação"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Formatting Badge */}
        <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-md border border-white text-[9px] font-black uppercase tracking-widest text-pepper-red shadow-sm">
           {creation.format_selected}
        </div>

        {/* Hover Actions */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
           <button className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform shadow-xl">
              <Eye size={18} />
           </button>
           <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 flex items-center justify-center hover:scale-110 transition-transform shadow-xl">
              <Download size={18} />
           </button>
        </div>
      </div>

      {/* Footer Details */}
      <div className="p-4 space-y-2">
         <div className="flex items-center justify-between">
           <div className="flex items-center gap-1.5 text-text-muted">
              <Calendar size={12} />
              <span className="text-[10px] font-medium uppercase tracking-wider">{dateFormatted}</span>
           </div>
           <button className="text-text-muted hover:text-red-500 transition-colors">
              <Trash2 size={14} />
           </button>
         </div>
      </div>
    </motion.div>
  );
}

function EmptyHistory() {
  return (
    <div className="space-y-12 py-12">
      <div className="flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-bg-elevated border border-border-default flex items-center justify-center text-text-muted/40">
          <ImageIcon size={32} />
        </div>
        <div className="space-y-2">
          <h3 className="font-display font-bold text-2xl text-text-primary">Sua galeria está vazia</h3>
          <p className="text-text-muted max-w-sm mx-auto">
            Você ainda não gerou nenhum Kit. Veja o que você pode criar em segundos:
          </p>
        </div>
      </div>

      {/* Inspirational Examples */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500 hover:opacity-100 cursor-default">
         <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-border-default shadow-lg overflow-hidden relative group">
            <img src="https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=400&h=600&auto=format&fit=crop" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
              <span className="text-[10px] text-white/70 font-bold uppercase">Exemplo Stories</span>
              <p className="text-white font-bold">Hambúrguer Gourmet</p>
            </div>
         </div>
         <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-border-default shadow-lg overflow-hidden relative">
            <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&h=600&auto=format&fit=crop" className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
              <span className="text-[10px] text-white/70 font-bold uppercase">Exemplo iFood</span>
              <p className="text-white font-bold">Salada Tropical</p>
            </div>
         </div>
         <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-border-default shadow-lg overflow-hidden relative">
            <img src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=400&h=600&auto=format&fit=crop" className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
              <span className="text-[10px] text-white/70 font-bold uppercase">Exemplo WhatsApp</span>
              <p className="text-white font-bold">Churrasco Prime</p>
            </div>
         </div>
      </div>

      <div className="flex justify-center pt-8">
        <Link 
          href="/dashboard/create"
          className="px-8 py-4 bg-gradient-to-r from-pepper-red to-pepper-orange text-white font-black rounded-xl shadow-xl shadow-pepper-red/20 hover:scale-105 transition-all active:scale-95"
        >
          COMEÇAR PRIMEIRA CRIAÇÃO
        </Link>
      </div>
    </div>
  );
}
