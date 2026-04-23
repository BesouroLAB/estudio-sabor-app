"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Lock,
  Eye,
  EyeOff,
  Mail,
  Sparkles,
  User,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { signup, signInWithGoogle } from "../login/actions";

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const result = await signup(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setSuccess(true);
    }
  }

  if (success) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center p-6 bg-bg-main bg-grain relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-pepper-orange/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-pepper-red/10 blur-[120px] rounded-full" />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md text-center relative z-10"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#22c55e] to-[#16a34a] flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Mail size={28} className="text-white" />
          </div>
          <h1 className="font-display text-2xl font-black text-pepper-black mb-2 uppercase tracking-tight">
            Verifique seu e-mail
          </h1>
          <p className="text-pepper-black/60 text-sm mb-8 font-medium">
            Enviamos um link de confirmação para o seu e-mail. Clique nele para
            ativar sua conta e começar a usar o Estúdio & Sabor.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-pepper-orange hover:text-pepper-red transition-all font-black text-xs uppercase tracking-widest px-6 py-3 bg-white border border-black/[0.05] rounded-xl shadow-sm hover:shadow-md active:scale-95"
          >
            ← Voltar para o Login
          </Link>
        </motion.div>
      </div>
    );
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
          <p className="text-sm font-medium mt-1 uppercase tracking-[0.3em] bg-clip-text text-transparent bg-gradient-to-r from-pepper-red to-pepper-orange font-display font-black text-center">
            Crie sua conta gratuita
          </p>
        </div>

        {/* Free trial badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center mb-6"
        >
          <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-pepper-orange/10 border border-pepper-orange/20">
            <Sparkles size={14} className="text-pepper-orange" />
            <span className="text-pepper-orange text-[10px] font-black uppercase tracking-widest">
              1 geração grátis inclusa
            </span>
          </div>
        </motion.div>

        {/* Signup Card */}
        <motion.div 
          className="bg-white/80 backdrop-blur-xl border border-black/[0.05] p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative overflow-hidden"
        >
          <div className="relative z-10">
            {/* Social Login: Google */}
            <button 
              type="button"
              onClick={() => signInWithGoogle()}
              className="w-full flex items-center justify-center gap-3 bg-white text-pepper-black font-black py-4 rounded-xl hover:bg-slate-50 transition-all active:scale-[0.98] mb-8 shadow-sm border border-black/[0.05] uppercase tracking-widest text-xs"
            >
              <svg width="20" height="20" viewBox="0 0 20 20">
                <path d="M19.6 10.23c0-.66-.06-1.29-.16-1.91H10v3.61h5.38c-.23 1.25-.94 2.31-2 2.97v2.47h3.24c1.89-1.74 2.98-4.3 2.98-7.14z" fill="#4285F4"/>
                <path d="M10 20c2.7 0 4.96-.89 6.62-2.42l-3.24-2.47c-.9.6-2.06.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H1.23v2.53C2.88 17.06 6.19 20 10 20z" fill="#34A853"/>
                <path d="M4.41 11.95c-.2-.6-.31-1.24-.31-1.95s.11-1.35.31-1.95V5.52H1.23C.45 7.11 0 8.89 0 10.79s.45 3.68 1.23 5.27l3.18-2.53z" fill="#FBBC05"/>
                <path d="M10 3.94c1.47 0 2.79.5 3.82 1.49l2.87-2.87C14.95.89 12.7 0 10 0 6.19 0 2.88 2.94 1.23 6.02l3.18 2.53c.79-2.36 2.99-4.12 5.59-4.12z" fill="#EA4335"/>
              </svg>
              <span>Entrar com o Google</span>
            </button>

            <div className="relative mb-8 text-center">
               <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-black/[0.05]"></div></div>
               <span className="relative px-4 bg-white/0 text-[10px] font-black text-pepper-black/40 uppercase tracking-widest">Ou crie com seu e-mail</span>
            </div>

            <form action={handleSubmit} className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-pepper-red/5 border border-pepper-red/10 rounded-xl px-4 py-3 text-center"
                >
                  <p className="text-pepper-red text-[10px] font-bold uppercase tracking-wide">
                    {error}
                  </p>
                </motion.div>
              )}

              <div>
                <label className="block text-[10px] font-black text-pepper-black/60 uppercase tracking-[0.2em] mb-2 px-1">Seu Nome</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-pepper-black/20" size={18} />
                  <input
                    name="name"
                    type="text"
                    required
                    placeholder="Como devemos te chamar?"
                    className="w-full bg-white border border-black/[0.05] text-pepper-black text-sm rounded-2xl p-4 pl-12 outline-none focus:ring-2 focus:ring-pepper-orange/20 focus:border-pepper-orange transition-all placeholder:text-pepper-black/10 shadow-sm"
                  />
                </div>
              </div>

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

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-pepper-red to-pepper-orange text-white font-black py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30 disabled:scale-100 shadow-[0_10px_20px_rgba(230,57,70,0.2)] flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Criar Minha Conta"}
              </button>
            </form>
          </div>
        </motion.div>

        <p className="mt-8 text-center text-xs font-bold text-pepper-black/40 uppercase tracking-widest">
          Já tem uma conta?{" "}
          <Link
            href="/login"
            className="text-pepper-orange hover:text-pepper-red transition-colors"
          >
            Fazer Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
