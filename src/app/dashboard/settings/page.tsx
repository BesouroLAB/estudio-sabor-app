"use client";

import { motion } from "framer-motion";
import { 
  User, 
  Store, 
  MapPin, 
  Link as LinkIcon, 
  Smartphone,
  Shield,
  Bell,
  Save,
  Camera
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex-1 px-[var(--space-page)] py-8 overflow-y-auto">
      <div className="max-w-3xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex items-center justify-between">
           <div>
             <h1 className="font-display font-bold text-3xl text-text-primary tracking-tight">
               Configurações
             </h1>
             <p className="text-text-muted text-sm mt-1">Gerencie seu perfil e dados do seu delivery.</p>
           </div>
           
           <button 
             onClick={() => {
                setLoading(true);
                setTimeout(() => setLoading(false), 1500);
             }}
             className="flex items-center gap-2 px-6 py-2.5 bg-pepper-orange text-white font-bold rounded-xl hover:bg-pepper-red transition-all shadow-lg shadow-pepper-orange/10 disabled:opacity-50"
             disabled={loading}
           >
             {loading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
             Salvar Alterações
           </button>
        </div>

        {/* Sections */}
        <div className="space-y-6">
           
           {/* Perfil */}
           <section className="bg-bg-surface border border-border-default rounded-3xl p-6 space-y-6 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
              <div className="flex items-center gap-2 border-b border-border-subtle pb-4">
                 <User size={18} className="text-pepper-orange" />
                 <h2 className="font-display font-bold text-lg text-text-primary uppercase tracking-wider">Perfil Pessoal</h2>
              </div>
              
              <div className="flex flex-col md:flex-row gap-8 items-start">
                 <div className="relative group">
                    <div className="w-24 h-24 rounded-full bg-bg-elevated border-2 border-dashed border-border-default flex items-center justify-center overflow-hidden">
                       <User size={32} className="text-text-muted/40" />
                    </div>
                    <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-pepper-orange text-white flex items-center justify-center shadow-lg border-4 border-bg-surface hover:scale-110 transition-transform">
                       <Camera size={14} />
                    </button>
                 </div>
                 
                 <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    <InputField label="Nome Completo" placeholder="Tiago ... " value="Tiago Alvim" />
                    <InputField label="E-mail de Acesso" placeholder="seu@email.com" value="tiago@estudiosabor.com.br" disabled />
                    <InputField label="Celular (WhatsApp)" placeholder="(11) 99999-9999" value="(16) 99343-2211" />
                 </div>
              </div>
           </section>

           {/* Delivery Data */}
           <section className="bg-bg-surface border border-border-default rounded-3xl p-6 space-y-6 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
              <div className="flex items-center gap-2 border-b border-border-subtle pb-4">
                 <Store size={18} className="text-pepper-orange" />
                 <h2 className="font-display font-bold text-lg text-text-primary uppercase tracking-wider">Dados do Restaurante</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <InputField label="Nome do Estabelecimento" placeholder="Ex: Burger King" value="Pizzaria do Sabor" />
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-1">Tipo de Culinária</label>
                    <select className="w-full bg-bg-elevated border border-border-default rounded-xl px-4 py-3 text-sm text-text-primary outline-none focus:border-pepper-orange/50 transition-all appearance-none shadow-sm focus:shadow-md">
                       <option>Pizzaria</option>
                       <option>Hamburgueria</option>
                       <option>Sushi / Japonesa</option>
                       <option>Comida Brasileira</option>
                       <option>Doceria / Cafeteria</option>
                    </select>
                 </div>
                 <div className="md:col-span-2">
                    <InputField label="Link do Cardápio (iFood/Próprio)" placeholder="https://www.ifood.com.br/delivery/..." icon={<LinkIcon size={14} />} />
                 </div>
              </div>
           </section>

           {/* App Preferences */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <section className="bg-bg-surface border border-border-default rounded-3xl p-6 space-y-4 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
                 <div className="flex items-center gap-2 mb-2">
                    <Bell size={18} className="text-pepper-orange" />
                    <h3 className="font-display font-medium text-text-primary">Notificações</h3>
                 </div>
                 <ToggleItem label="Alertas de novas promoções" active />
                 <ToggleItem label="Lembretes de missões" active />
              </section>

              <section className="bg-bg-surface border border-border-default rounded-3xl p-6 space-y-4 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
                 <div className="flex items-center gap-2 mb-2">
                    <Shield size={18} className="text-pepper-orange" />
                    <h3 className="font-display font-medium text-text-primary">Segurança</h3>
                 </div>
                 <Link href="#" className="text-xs text-pepper-orange font-bold hover:underline block">Alterar senha de acesso</Link>
                 <Link href="#" className="text-xs text-pepper-orange font-bold hover:underline block">Gerenciar sessões ativas</Link>
              </section>
           </div>

        </div>

      </div>
    </div>
  );
}

function InputField({ label, placeholder, value, disabled, icon }: any) {
   return (
      <div className="space-y-2">
         <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-1">
            {label}
         </label>
         <div className="relative flex items-center">
            {icon && <div className="absolute left-4 text-text-muted">{icon}</div>}
            <input 
               type="text" 
               defaultValue={value} 
               placeholder={placeholder}
               disabled={disabled}
               className={cn(
                  "w-full bg-bg-elevated border border-border-default rounded-xl py-3 text-sm text-text-primary outline-none focus:border-pepper-orange/50 transition-all shadow-sm focus:shadow-md",
                  icon ? "pl-11 pr-4" : "px-4",
                  disabled && "opacity-50 cursor-not-allowed"
               )}
            />
         </div>
      </div>
   );
}

function ToggleItem({ label, active }: { label: string, active?: boolean }) {
   return (
      <div className="flex items-center justify-between py-1">
         <span className="text-xs text-text-muted">{label}</span>
         <div className={cn(
            "w-10 h-5 rounded-full relative transition-colors cursor-pointer",
            active ? "bg-pepper-orange" : "bg-bg-elevated border border-border-default"
         )}>
            <div className={cn(
               "absolute top-[2px] w-3 h-3 rounded-full transition-all shadow-sm",
               active ? "right-1 bg-white" : "left-1 bg-text-muted"
            )} />
         </div>
      </div>
   );
}
