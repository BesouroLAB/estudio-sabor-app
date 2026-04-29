"use client";

import { useState } from "react";
import { User, Store, LinkIcon, Shield, Bell, Save, Camera } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="flex-1 bg-[#F7F7F7] min-h-screen select-none overflow-y-auto">
      <div className="max-w-3xl mx-auto px-6 py-8 pb-24 md:pb-8 space-y-8">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#3E3E3E] tracking-tight">Configurações</h1>
            <p className="text-sm text-[#717171] mt-1">Gerencie seu perfil e os dados do seu delivery.</p>
          </div>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#EA1D2C] text-white text-sm font-bold rounded-lg hover:bg-[#d1192a] transition-all shadow-sm active:scale-95 disabled:opacity-60"
          >
            {loading
              ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <Save size={16} />
            }
            Salvar Alterações
          </button>
        </div>

        {/* Profile Section */}
        <Section icon={<User size={16} className="text-[#EA1D2C]" />} title="Perfil Pessoal">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar */}
            <div className="relative group shrink-0">
              <div className="w-20 h-20 rounded-full bg-[#F7F7F7] border-2 border-dashed border-[#DDDDE0] flex items-center justify-center overflow-hidden">
                <User size={28} className="text-[#A6A6A6]" />
              </div>
              <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#EA1D2C] text-white flex items-center justify-center shadow-md border-2 border-white hover:scale-110 transition-transform">
                <Camera size={13} />
              </button>
            </div>

            {/* Fields */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <InputField label="Nome Completo" placeholder="Seu nome" defaultValue="Tiago Fernandes" />
              <InputField label="E-mail de Acesso" placeholder="seu@email.com" defaultValue="tiago@estudiosabor.com.br" disabled />
              <InputField label="WhatsApp" placeholder="(11) 99999-9999" defaultValue="(16) 99343-2211" />
            </div>
          </div>
        </Section>

        {/* Restaurant Section */}
        <Section icon={<Store size={16} className="text-[#EA1D2C]" />} title="Dados do Restaurante">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputField label="Nome do Estabelecimento" placeholder="Ex: Pizzaria do Sabor" defaultValue="Pizzaria do Sabor" />
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#717171] uppercase tracking-wider">Tipo de Culinária</label>
              <select className="w-full bg-white border border-[#DDDDE0] rounded-lg px-4 py-2.5 text-sm text-[#3E3E3E] outline-none focus:border-[#EA1D2C]/50 transition-all appearance-none cursor-pointer">
                <option>Pizzaria</option>
                <option>Hamburgueria</option>
                <option>Sushi / Japonesa</option>
                <option>Comida Brasileira</option>
                <option>Doceria / Cafeteria</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <InputField label="Link do Cardápio (iFood / Próprio)" placeholder="https://www.ifood.com.br/delivery/..." icon={<LinkIcon size={14} />} />
            </div>
          </div>
        </Section>

        {/* Preferences Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Section icon={<Bell size={16} className="text-[#EA1D2C]" />} title="Notificações">
            <div className="space-y-3">
              <ToggleItem label="Alertas de novas promoções" defaultActive />
              <ToggleItem label="Lembretes de missões" defaultActive />
              <ToggleItem label="Novidades e releases" />
            </div>
          </Section>

          <Section icon={<Shield size={16} className="text-[#EA1D2C]" />} title="Segurança">
            <div className="space-y-3">
              <Link href="#" className="block text-sm text-[#EA1D2C] font-semibold hover:underline">
                Alterar senha de acesso
              </Link>
              <Link href="#" className="block text-sm text-[#EA1D2C] font-semibold hover:underline">
                Gerenciar sessões ativas
              </Link>
              <p className="text-xs text-[#A6A6A6]">Última sessão: hoje às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </Section>
        </div>

        {/* Danger Zone */}
        <div className="bg-white border border-red-100 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-[#3E3E3E] text-sm">Zona de Perigo</h4>
            <p className="text-xs text-[#717171] mt-0.5">Ao excluir sua conta, todos os dados e créditos são removidos permanentemente.</p>
          </div>
          <button className="text-red-500 text-sm font-bold border border-red-200 px-4 py-2 rounded-lg hover:bg-red-50 transition-all shrink-0">
            Excluir Conta
          </button>
        </div>

      </div>
    </div>
  );
}

// --- Sub-components ---

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white border border-[#EAEAEC] rounded-xl p-6 space-y-5">
      <div className="flex items-center gap-2 border-b border-[#F3F1F0] pb-4">
        {icon}
        <h2 className="font-bold text-sm text-[#3E3E3E] uppercase tracking-wider">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function InputField({ label, placeholder, defaultValue, disabled, icon }: {
  label: string;
  placeholder?: string;
  defaultValue?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-bold text-[#717171] uppercase tracking-wider">{label}</label>
      <div className="relative flex items-center">
        {icon && <div className="absolute left-3.5 text-[#A6A6A6]">{icon}</div>}
        <input
          type="text"
          defaultValue={defaultValue}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "w-full bg-white border border-[#DDDDE0] rounded-lg py-2.5 text-sm text-[#3E3E3E] outline-none focus:border-[#EA1D2C]/50 transition-all",
            icon ? "pl-10 pr-4" : "px-4",
            disabled && "bg-[#F7F7F7] text-[#A6A6A6] cursor-not-allowed"
          )}
        />
      </div>
    </div>
  );
}

function ToggleItem({ label, defaultActive }: { label: string; defaultActive?: boolean }) {
  const [active, setActive] = useState(defaultActive ?? false);
  return (
    <div className="flex items-center justify-between py-0.5">
      <span className="text-sm text-[#3E3E3E]">{label}</span>
      <button
        onClick={() => setActive(!active)}
        className={cn(
          "w-10 h-5 rounded-full relative transition-colors",
          active ? "bg-[#EA1D2C]" : "bg-[#DDDDE0]"
        )}
        role="switch"
        aria-checked={active}
      >
        <div className={cn(
          "absolute top-[2px] w-4 h-4 rounded-full bg-white shadow-sm transition-all",
          active ? "right-[2px]" : "left-[2px]"
        )} />
      </button>
    </div>
  );
}
