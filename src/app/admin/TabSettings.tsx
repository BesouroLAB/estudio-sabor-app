"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Save, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
import { SystemSetting } from "./types";

interface SettingsTabProps {
  settings: SystemSetting[];
  fetchSettings: () => Promise<void>;
}

export function SettingsTab({ settings, fetchSettings }: SettingsTabProps) {
  const [updating, setUpdating] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleUpdate(key: string, value: any) {
    setUpdating(key);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });

      if (res.ok) {
        setMessage({ type: "success", text: `Configuração "${key}" atualizada!` });
        await fetchSettings();
      } else {
        const err = await res.json();
        throw new Error(err.error || "Erro ao atualizar");
      }
    } catch (e: any) {
      setMessage({ type: "error", text: e.message });
    } finally {
      setUpdating(null);
      setTimeout(() => setMessage(null), 3000);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#3E3E3E] tracking-tight">Configurações Globais</h2>
          <p className="text-xs text-[#A6A6A6] font-bold uppercase tracking-widest mt-1">Variáveis de Ambiente & Lógica de Negócio</p>
        </div>
        <button
          onClick={() => fetchSettings()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-[#EAEAEC] text-xs font-bold text-[#717171] hover:text-[#EA1D2C] hover:border-[#EA1D2C]/30 transition-all shadow-sm"
        >
          <RefreshCw size={14} />
          Atualizar Dados
        </button>
      </div>

      {message && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className={`p-4 rounded-xl flex items-center gap-3 border shadow-sm ${
            message.type === "success" 
              ? "bg-emerald-50 border-emerald-500/20 text-emerald-600" 
              : "bg-red-50 border-red-500/20 text-[#EA1D2C]"
          }`}
        >
          {message.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span className="text-sm font-bold tracking-tight">{message.text}</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {settings.map((setting) => (
          <div
            key={setting.key}
            className="p-6 rounded-xl bg-white border border-[#EAEAEC] hover:border-[#EA1D2C]/20 transition-all group shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#EA1D2C] bg-red-50 px-2.5 py-1 rounded-md border border-red-100">
                {setting.key}
              </span>
              <button
                onClick={() => {
                  const input = document.getElementById(`input-${setting.key}`) as HTMLInputElement;
                  let val: any = input.value;
                  if (val === "true") val = true;
                  else if (val === "false") val = false;
                  else if (!isNaN(Number(val)) && val.trim() !== "") val = Number(val);
                  
                  handleUpdate(setting.key, val);
                }}
                disabled={updating === setting.key}
                className="p-1.5 rounded-lg bg-[#F7F7F7] border border-[#EAEAEC] text-[#A6A6A6] hover:text-[#EA1D2C] hover:bg-red-50 hover:border-red-100 transition-all disabled:opacity-50"
              >
                {updating === setting.key ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <Save size={14} />
                )}
              </button>
            </div>
            
            <p className="text-xs text-[#717171] mb-4 leading-relaxed font-medium line-clamp-2 h-8">
              {setting.description}
            </p>

            <div className="relative">
              <input
                id={`input-${setting.key}`}
                defaultValue={typeof setting.value === "object" ? JSON.stringify(setting.value) : String(setting.value)}
                className="w-full bg-[#F7F7F7] border border-[#EAEAEC] rounded-lg px-4 py-3 text-sm text-[#3E3E3E] outline-none focus:ring-1 focus:ring-[#EA1D2C]/30 focus:bg-white transition-all font-mono"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 rounded-xl bg-red-50 border border-red-100 shadow-sm">
        <div className="flex gap-4">
          <AlertCircle className="text-[#EA1D2C] shrink-0" size={20} />
          <div>
            <h4 className="text-xs font-bold text-[#EA1D2C] mb-1 uppercase tracking-widest">Aviso de Segurança</h4>
            <p className="text-[11px] text-[#717171] leading-relaxed font-medium">
              Alterações nestas chaves impactam o comportamento global da aplicação (Custo de API, Cotas, Moeda). Use true/false para booleanos e certifique-se de que os valores numéricos estão corretos.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
