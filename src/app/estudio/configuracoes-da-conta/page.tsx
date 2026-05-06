"use client";

import { User, Store, LinkIcon, Shield, Bell, Save, Camera, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());
  const [isMock, setIsMock] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setIsMock(false);
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        setUserData({ ...user, ...profile });
      } else {
        setIsMock(true);
        setUserData({
          full_name: "Visitante",
          email: "visitante@estudiosabor.com.br",
          restaurant_name: "Seu Restaurante",
          logo_url: ""
        });
      }
    }
    loadUser();
  }, []);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isMock) {
      alert("Como visitante, suas alterações não serão salvas permanentemente.");
      return;
    }
    
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    // Pegar dados do form
    const updates = {
      full_name: formData.get("full_name") as string,
      phone: formData.get("phone") as string,
      establishment_name: formData.get("restaurant_name") as string,
      cuisine_type: formData.get("cuisine_type") as string,
      menu_link: formData.get("menu_link") as string,
      logo_url: formData.get("logo_url") as string,
      updated_at: new Date().toISOString()
    };

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase.from("profiles").update(updates).eq("id", user.id);
      if (error) {
        alert("Erro ao salvar configurações.");
        console.error(error);
      } else {
        setUserData((prev: any) => ({ ...prev, ...updates }));
        setLastUpdate(Date.now());
        alert("Configurações salvas com sucesso!");
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex-1 bg-brand-dark min-h-screen select-none overflow-y-auto">
      <form key={`${userData?.id || 'loading'}_${lastUpdate}`} onSubmit={handleSave} className="max-w-3xl mx-auto px-6 py-12 pb-24 md:pb-12 space-y-10">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight font-display bg-clip-text text-transparent bg-brand-gradient">Configurações</h1>
            <p className="text-white/40 font-medium mt-2">Gerencie seu perfil e os dados do seu delivery.</p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-3 px-8 py-4 bg-brand-gradient text-white text-sm font-bold rounded-2xl hover:opacity-90 transition-all shadow-xl active:scale-95 disabled:opacity-60"
          >
            {loading
              ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <Save size={18} />
            }
            Salvar Alterações
          </button>
        </div>

        {/* Profile Section */}
        <Section icon={<User size={18} className="text-brand-orange" />} title="Perfil Pessoal">
          <div className="flex flex-col md:flex-row gap-10 items-start">
            {/* Avatar */}
            <div className="relative group shrink-0">
              <div className="w-24 h-24 rounded-3xl bg-brand-dark border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden group-hover:border-brand-orange/40 transition-colors">
                {userData?.logo_url ? (
                  <img src={userData.logo_url} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <User size={32} className="text-white/20" />
                )}
              </div>
              <button 
                type="button" 
                onClick={() => {
                  const url = prompt("Insira a URL do logo do seu estabelecimento:", userData?.logo_url || "");
                  if (url !== null) {
                    setUserData((prev: any) => ({ ...prev, logo_url: url }));
                  }
                }}
                className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-brand-orange text-white flex items-center justify-center shadow-2xl border-2 border-brand-surface hover:scale-110 transition-transform active:scale-90"
              >
                <Camera size={18} />
              </button>
              <input type="hidden" name="logo_url" value={userData?.logo_url || ""} />
            </div>

            {/* Fields */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <InputField name="full_name" label="Nome Completo" placeholder="Seu nome" defaultValue={userData?.full_name || ""} />
              <InputField name="email" label="E-mail de Acesso" placeholder="seu@email.com" defaultValue={userData?.email || ""} disabled />
              <InputField name="phone" label="WhatsApp" placeholder="(11) 99999-9999" defaultValue={userData?.phone || ""} />
            </div>
          </div>
        </Section>

        {/* Restaurant Section */}
        <Section icon={<Store size={18} className="text-brand-orange" />} title="Dados do Restaurante">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField name="restaurant_name" label="Nome do Estabelecimento" placeholder="Ex: Pizzaria do Sabor" defaultValue={userData?.establishment_name || ""} />
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest ml-1">Tipo de Culinária</label>
              <div className="relative">
                <select 
                  name="cuisine_type" 
                  defaultValue={userData?.cuisine_type || ""}
                  className="w-full bg-brand-dark/50 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:border-brand-orange/50 transition-all appearance-none cursor-pointer font-medium"
                >
                  <option value="" disabled className="bg-brand-surface">Selecione...</option>
                  <option value="pizzaria" className="bg-brand-surface">Pizzaria</option>
                  <option value="hamburgueria" className="bg-brand-surface">Hamburgueria</option>
                  <option value="sushi" className="bg-brand-surface">Sushi / Japonesa</option>
                  <option value="brasileira" className="bg-brand-surface">Comida Brasileira</option>
                  <option value="doceria" className="bg-brand-surface">Doceria / Cafeteria</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                  <ArrowRight size={16} className="rotate-90" />
                </div>
              </div>
            </div>
            <div className="md:col-span-2">
              <InputField name="menu_link" label="Link do Cardápio (iFood / Próprio)" placeholder="https://www.ifood.com.br/delivery/..." defaultValue={userData?.menu_link || ""} icon={<LinkIcon size={16} />} />
            </div>
          </div>
        </Section>

        {/* Preferences Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Section icon={<Bell size={18} className="text-brand-orange" />} title="Notificações">
            <div className="space-y-5 py-2">
              <ToggleItem label="Alertas de novas promoções" defaultActive />
              <ToggleItem label="Lembretes de missões" defaultActive />
              <ToggleItem label="Novidades e releases" />
            </div>
          </Section>

          <Section icon={<Shield size={18} className="text-brand-orange" />} title="Segurança">
            <div className="space-y-5 py-2">
              <Link href="#" className="flex items-center justify-between group">
                <span className="text-sm text-white/80 font-medium group-hover:text-white transition-colors">Alterar senha de acesso</span>
                <ArrowRight size={14} className="text-white/20 group-hover:text-brand-orange transition-all group-hover:translate-x-1" />
              </Link>
              <Link href="#" className="flex items-center justify-between group">
                <span className="text-sm text-white/80 font-medium group-hover:text-white transition-colors">Gerenciar sessões ativas</span>
                <ArrowRight size={14} className="text-white/20 group-hover:text-brand-orange transition-all group-hover:translate-x-1" />
              </Link>
              <div className="pt-2 border-t border-white/5">
                <p className="text-[10px] text-white/20 uppercase font-bold tracking-widest">Última sessão</p>
                <p className="text-xs text-white/40 mt-1 font-medium">Hoje às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
          </Section>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-500/5 border border-red-500/10 rounded-[32px] p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h4 className="font-bold text-red-500 text-lg font-display">Zona de Perigo</h4>
            <p className="text-sm text-white/40 mt-1 font-medium">Ao excluir sua conta, todos os dados e créditos são removidos permanentemente.</p>
          </div>
          <button type="button" className="text-red-500 text-xs font-bold uppercase tracking-widest border border-red-500/20 px-6 py-4 rounded-2xl hover:bg-red-500 hover:text-white transition-all shrink-0 active:scale-95">
            Excluir Conta
          </button>
        </div>

      </form>
    </div>
  );
}

// --- Sub-components ---

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section className="bg-brand-surface border border-white/5 rounded-[32px] p-8 space-y-8 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/5 blur-[60px] -mr-16 -mt-16 group-hover:bg-brand-orange/10 transition-colors" />
      <div className="flex items-center gap-3 border-b border-white/5 pb-6 relative z-10">
        <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange border border-brand-orange/20">
          {icon}
        </div>
        <h2 className="font-bold text-sm text-white uppercase tracking-widest font-display">{title}</h2>
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </section>
  );
}

function InputField({ label, placeholder, defaultValue, disabled, icon, name }: {
  label: string;
  placeholder?: string;
  defaultValue?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  name?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative flex items-center group/input">
        {icon && <div className="absolute left-5 text-white/20 group-focus-within/input:text-brand-orange transition-colors">{icon}</div>}
        <input
          type="text"
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "w-full bg-brand-dark/50 border border-white/10 rounded-2xl py-4 text-sm text-white outline-none focus:border-brand-orange/50 transition-all font-medium placeholder:text-white/10",
            icon ? "pl-14 pr-6" : "px-6",
            disabled && "opacity-50 grayscale cursor-not-allowed bg-brand-dark/20"
          )}
        />
      </div>
    </div>
  );
}

function ToggleItem({ label, defaultActive }: { label: string; defaultActive?: boolean }) {
  const [active, setActive] = useState(defaultActive ?? false);
  return (
    <div className="flex items-center justify-between group">
      <span className="text-sm text-white/70 font-medium group-hover:text-white transition-colors">{label}</span>
      <button
        type="button"
        onClick={() => setActive(!active)}
        className={cn(
          "w-12 h-6 rounded-full relative transition-all duration-300",
          active ? "bg-brand-gradient" : "bg-white/5 border border-white/10"
        )}
        role="switch"
        aria-checked={active}
      >
        <div className={cn(
          "absolute top-1 w-4 h-4 rounded-full bg-white shadow-xl transition-all duration-300",
          active ? "right-1" : "left-1"
        )} />
      </button>
    </div>
  );
}
