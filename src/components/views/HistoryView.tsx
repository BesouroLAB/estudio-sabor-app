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
    <div className="flex-1 bg-[#F7F7F7] min-h-screen select-none overflow-y-auto">
      <div className="max-w-6xl mx-auto px-6 py-8 pb-24 md:pb-8 space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-2xl font-bold text-[#3E3E3E] tracking-tight">
              Meus <span className="text-[#EA1D2C]">Projetos</span>
            </h1>
            <p className="text-sm text-[#717171] mt-1">
              Visualize e baixe suas criações profissionais.
            </p>
          </div>
          
          <Link 
            href="/dashboard/create"
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#EA1D2C] text-white text-sm font-bold rounded-lg hover:bg-[#d1192a] transition-all shadow-sm active:scale-95"
          >
            <Plus size={18} />
            Nova Criação
          </Link>
        </div>

        {/* Content Section */}
        {!hasCreations ? (
          <EmptyHistory />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="group bg-white border border-[#EAEAEC] rounded-xl overflow-hidden hover:shadow-md transition-all flex flex-col"
    >
      {/* Image Preview Area */}
      <div className="aspect-square relative overflow-hidden bg-[#F7F7F7]">
        <img 
          src={creation.image_url} 
          alt="Criação"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Format Badge (iFood style) */}
        <div className="absolute top-3 left-3 px-2 py-1 rounded bg-white/95 border border-[#EAEAEC] text-[10px] font-bold text-[#3E3E3E] shadow-sm">
           {creation.format_selected}
        </div>

        {/* Action Overlays (Subtle on hover) */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </div>

      {/* Footer / Meta Section */}
      <div className="p-4 flex flex-col gap-3">
         <div className="flex items-center justify-between">
           <div className="flex items-center gap-1.5 text-[#A6A6A6]">
              <Calendar size={12} />
              <span className="text-[11px] font-medium uppercase tracking-wider">{dateFormatted}</span>
           </div>
           
           <div className="flex items-center gap-2">
             <button className="p-1.5 text-[#717171] hover:text-[#EA1D2C] hover:bg-red-50 rounded-md transition-all" title="Ver Detalhes">
                <Eye size={16} />
             </button>
             <button className="p-1.5 text-[#717171] hover:text-[#EA1D2C] hover:bg-red-50 rounded-md transition-all" title="Download">
                <Download size={16} />
             </button>
             <button className="p-1.5 text-[#717171] hover:text-[#EA1D2C] hover:bg-red-50 rounded-md transition-all" title="Excluir">
                <Trash2 size={16} />
             </button>
           </div>
         </div>
      </div>
    </motion.div>
  );
}

function EmptyHistory() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-[#EAEAEC] border-dashed rounded-2xl">
      <div className="w-16 h-16 rounded-full bg-[#F7F7F7] flex items-center justify-center mb-4">
        <Clock size={28} className="text-[#A6A6A6]" />
      </div>
      <h3 className="text-lg font-bold text-[#3E3E3E]">Sua galeria está vazia</h3>
      <p className="text-sm text-[#717171] max-w-xs mx-auto mt-2 mb-8">
        Você ainda não gerou nenhum projeto. Comece criando uma foto profissional agora mesmo.
      </p>
      
      <Link 
        href="/dashboard/create"
        className="flex items-center gap-2 px-8 py-3 bg-[#EA1D2C] text-white font-bold rounded-xl hover:bg-[#d1192a] transition-all shadow-md active:scale-95"
      >
        <Plus size={20} />
        Começar Minha Primeira Foto
      </Link>
    </div>
  );
}
