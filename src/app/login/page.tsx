"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  Mail,
  ShieldCheck,
  Zap,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { login, signInWithGoogle } from "./actions";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const result = await login(formData);
    if (result?.error) {
      setError(
        result.error === "Invalid login credentials"
          ? "E-mail ou senha incorretos. Verifique seus dados."
          : result.error
      );
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center p-6 bg-bg-main bg-grain relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-pepper-orange/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-pepper-red/10 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo Area */}
        <div className="flex flex-col items-center mb-10 group cursor-pointer">
          <motion.div 
            className="relative group"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="absolute -inset-2 bg-gradient-to-r from-pepper-red/20 to-pepper-orange/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Image
              src="https://vgrfjwwbqflfjfvfsbjd.supabase.co/storage/v1/object/public/creations/LogoHorizontal.png"
              alt="Estúdio & Sabor"
              width={240}
              height={60}
              className="relative drop-shadow-sm group-hover:drop-shadow-md transition-all"
              priority
            />
          </motion.div>
          <p className="text-sm font-medium mt-1 uppercase tracking-[0.3em] bg-clip-text text-transparent bg-gradient-to-r from-pepper-red to-pepper-orange font-display font-black">
            Bem-vindo de volta
          </p>
        </div>

        {/* Login Card */}
        <motion.div 
          whileHover={{ y: -4 }}
          transition={{ duration: 0.3 }}
          className="bg-white/80 backdrop-blur-xl border border-black/[0.05] p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative overflow-hidden hover:border-pepper-orange/30 hover:shadow-pepper-orange/5 transition-all group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-pepper-red/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10">
            {/* Social Login: Google */}
            <button 
              type="button"
              onClick={() => signInWithGoogle()}
              className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 font-bold py-3.5 rounded-xl hover:bg-slate-100 transition-all active:scale-[0.98] mb-8 shadow-lg"
            >
              <svg width="20" height="20" viewBox="0 0 20 20">
                <path d="M19.6 10.23c0-.66-.06-1.29-.16-1.91H10v3.61h5.38c-.23 1.25-.94 2.31-2 2.97v2.47h3.24c1.89-1.74 2.98-4.3 2.98-7.14z" fill="#4285F4"/>
                <path d="M10 20c2.7 0 4.96-.89 6.62-2.42l-3.24-2.47c-.9.6-2.06.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H1.23v2.53C2.88 17.06 6.19 20 10 20z" fill="#34A853"/>
                <path d="M4.41 11.95c-.2-.6-.31-1.24-.31-1.95s.11-1.35.31-1.95V5.52H1.23C.45 7.11 0 8.89 0 10.79s.45 3.68 1.23 5.27l3.18-2.53z" fill="#FBBC05"/>
                <path d="M10 3.94c1.47 0 2.79.5 3.82 1.49l2.87-2.87C14.95.89 12.7 0 10 0 6.19 0 2.88 2.94 1.23 6.02l3.18 2.53c.79-2.36 2.99-4.12 5.59-4.12z" fill="#EA4335"/>
              </svg>
              <span className="text-sm">Entrar com o Google</span>
            </button>

            <div className="relative mb-8 text-center">
               <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-black/[0.05]"></div></div>
               <span className="relative px-4 bg-white text-[10px] font-black text-text-muted uppercase tracking-widest">Ou use seu e-mail</span>
            </div>

            <form action={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-pepper-black/60 uppercase tracking-[0.2em] mb-2 px-1">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-pepper-black/20" size={18} />
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="seu@email.com"
                    className="w-full bg-white border border-black/[0.05] text-pepper-black text-sm rounded-2xl p-4 pl-12 outline-none focus:ring-2 focus:ring-pepper-orange/20 focus:border-pepper-orange transition-all placeholder:text-pepper-black/10 shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-pepper-black/60 uppercase tracking-[0.2em] mb-2 px-1">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-pepper-black/20" size={18} />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    className="w-full bg-white border border-black/[0.05] text-pepper-black text-sm rounded-2xl p-4 pl-12 pr-12 outline-none focus:ring-2 focus:ring-pepper-orange/20 focus:border-pepper-orange transition-all placeholder:text-pepper-black/10 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-pepper-black/20 hover:text-pepper-orange transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-pepper-red text-[10px] font-bold text-center uppercase tracking-wide">
                  {error}
                </motion.p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-pepper-red to-pepper-orange text-white font-black py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30 disabled:scale-100 shadow-[0_10px_20px_rgba(220, 38, 38, 0.3)] flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Entrar na Conta"}
              </button>
            </form>
          </div>
        </motion.div>

        {/* Signup Link */}
        <div className="mt-8 text-center space-y-6">
          <p className="text-text-secondary text-sm font-medium">
            Não tem uma conta? <Link href="/signup" className="text-pepper-red font-bold hover:text-pepper-orange transition-colors">Criar conta grátis</Link>
          </p>
          
          <div className="flex items-center justify-center gap-2 text-pepper-black/20">
            <ShieldCheck size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Acesso seguro via Supabase</span>
          </div>

          <div className="text-center px-6">
            <p className="text-[10px] text-pepper-black/20 font-bold uppercase tracking-widest leading-relaxed">
              Sistema de Inteligência Artificial Generativa para Gastronomia.
              <br />
              © 2026 Estúdio & Sabor. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );

}

const Sparkles = ({ className, size }: { className?: string; size?: number }) => (
  <svg 
    className={className} 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    <path d="M5 3v4"/><path d="M3 5h4"/><path d="M21 17v4"/><path d="M19 19h4"/>
  </svg>
);
