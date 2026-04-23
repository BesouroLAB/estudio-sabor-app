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
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-text-primary">Configurações do Sistema</h2>
          <p className="text-sm text-text-muted">Gerencie variáveis globais e comportamentos da plataforma</p>
        </div>
        <button
          onClick={() => fetchSettings()}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-surface border border-border-default text-xs font-bold text-text-muted hover:text-text-primary transition-all"
        >
          <RefreshCw size={14} />
          Atualizar
        </button>
      </div>

      {message && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className={`p-4 rounded-xl flex items-center gap-3 border ${
            message.type === "success" 
              ? "bg-green-500/10 border-green-500/20 text-green-400" 
              : "bg-pepper-red/10 border-pepper-red/20 text-pepper-red"
          }`}
        >
          {message.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span className="text-sm font-medium">{message.text}</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {settings.map((setting) => (
          <div
            key={setting.key}
            className="p-5 rounded-2xl bg-bg-surface border border-border-subtle hover:border-border-default transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-pepper-orange bg-pepper-orange/10 px-2 py-0.5 rounded">
                {setting.key}
              </span>
              <button
                onClick={() => {
                  const input = document.getElementById(`input-${setting.key}`) as HTMLInputElement;
                  let val: any = input.value;
                  // Basic type inference
                  if (val === "true") val = true;
                  else if (val === "false") val = false;
                  else if (!isNaN(Number(val)) && val.trim() !== "") val = Number(val);
                  
                  handleUpdate(setting.key, val);
                }}
                disabled={updating === setting.key}
                className="opacity-0 group-hover:opacity-100 p-2 rounded-lg bg-bg-elevated border border-border-default text-text-muted hover:text-pepper-red transition-all disabled:opacity-50"
              >
                {updating === setting.key ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <Save size={14} />
                )}
              </button>
            </div>
            
            <p className="text-xs text-text-muted mb-4 line-clamp-2 h-8">
              {setting.description}
            </p>

            <div className="relative">
              <input
                id={`input-${setting.key}`}
                defaultValue={typeof setting.value === "object" ? JSON.stringify(setting.value) : String(setting.value)}
                className="w-full bg-bg-base border border-border-default rounded-xl p-3 text-sm text-text-primary outline-none focus:ring-1 focus:ring-pepper-orange/50 transition-all font-mono"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 rounded-2xl bg-pepper-red/5 border border-pepper-red/10">
        <div className="flex gap-3">
          <AlertCircle className="text-pepper-red shrink-0" size={20} />
          <div>
            <h4 className="text-sm font-bold text-pepper-red mb-1">Cuidado Administrativo</h4>
            <p className="text-xs text-text-muted leading-relaxed">
              Alterar estas configurações afeta todos os usuários em tempo real. Certifique-se de usar os formatos corretos (true/false para booleanos, números para custos e links válidos).
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
