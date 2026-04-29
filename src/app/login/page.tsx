"use client";

import { useState, useEffect } from "react";
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
  const [email, setEmail] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  // Load saved email on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedEmail = localStorage.getItem("last_login_email");
      if (savedEmail) setEmail(savedEmail);
    }
  }, []);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const emailVal = formData.get("email") as string;
    if (rememberMe) {
      localStorage.setItem("last_login_email", emailVal);
    } else {
      localStorage.removeItem("last_login_email");
    }

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
    <div className="min-h-dvh flex flex-col items-center justify-center p-6 bg-[#050505] relative overflow-hidden">
      {/* Background Radial Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,94,58,0.12)_0%,transparent_70%)] pointer-events-none" />
      
      {/* Edge Glow (Blue Vignette) */}
      <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(59,130,246,0.08)] pointer-events-none" />

      <div className="w-full max-w-6xl px-4 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Side: Branding */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            {/* Logo */}
            <motion.div 
              className="relative group mb-10"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-pepper-red/30 to-pepper-orange/30 rounded-2xl blur-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-500" />
              <Image
                src="https://res.cloudinary.com/do8gdtozt/image/upload/v1766242394/logo_V2_branca_sem_fundo_ujkf0t.png"
                alt="Estúdio Sabor"
                width={320}
                height={120}
                priority
                className="relative object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]"
              />
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight font-plus-jakarta mb-6">
              Bem-vindo de <br className="hidden lg:block" /> volta
            </h1>
            <p className="text-stone-100 text-lg md:text-xl max-w-md leading-relaxed font-medium">
              Pronto para criar novas fotos profissionais para o seu delivery? Entre e comece a vender mais.
            </p>

            {/* Micro-benefit list */}
            <div className="mt-12 hidden lg:flex flex-col gap-4">
               {[
                 "Fotos em 30 segundos",
                 "Estilo iFood profissional",
                 "Aumento de 40% nas vendas"
               ].map((text, i) => (
                 <div key={i} className="flex items-center gap-3 text-white">
                   <div className="w-5 h-5 rounded-full bg-pepper-red/20 flex items-center justify-center border border-pepper-red/30">
                     <div className="w-1.5 h-1.5 rounded-full bg-pepper-red shadow-[0_0_8px_rgba(255,61,0,0.8)]" />
                   </div>
                   <span className="text-sm font-semibold font-plus-jakarta">{text}</span>
                 </div>
               ))}
            </div>
          </motion.div>

          {/* Right Side: Login Card */}
          <div className="w-full max-w-md mx-auto lg:mr-0">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[#0d0b09]/60 backdrop-blur-[24px] border border-white/10 p-8 md:p-10 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.7)] relative overflow-hidden hover:border-white/20 transition-all group w-full"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                {/* Social Login: Google */}
                <button 
                  type="button"
                  onClick={() => signInWithGoogle()}
                  className="w-full flex items-center justify-center gap-3 bg-white text-stone-950 font-black py-4 rounded-2xl hover:bg-stone-100 transition-all active:scale-[0.98] mb-10 shadow-[0_10px_30px_rgba(255,255,255,0.15)] uppercase tracking-widest text-xs font-plus-jakarta"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20">
                    <path d="M19.6 10.23c0-.66-.06-1.29-.16-1.91H10v3.61h5.38c-.23 1.25-.94 2.31-2 2.97v2.47h3.24c1.89-1.74 2.98-4.3 2.98-7.14z" fill="#4285F4"/>
                    <path d="M10 20c2.7 0 4.96-.89 6.62-2.42l-3.24-2.47c-.9.6-2.06.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H1.23v2.53C2.88 17.06 6.19 20 10 20z" fill="#34A853"/>
                    <path d="M4.41 11.95c-.2-.6-.31-1.24-.31-1.95s.11-1.35.31-1.95V5.52H1.23C.45 7.11 0 8.89 0 10.79s.45 3.68 1.23 5.27l3.18-2.53z" fill="#FBBC05"/>
                    <path d="M10 3.94c1.47 0 2.79.5 3.82 1.49l2.87-2.87C14.95.89 12.7 0 10 0 6.19 0 2.88 2.94 1.23 6.02l3.18 2.53c.79-2.36 2.99-4.12 5.59-4.12z" fill="#EA4335"/>
                  </svg>
                  <span>Entrar com o Google</span>
                </button>

                <div className="relative mb-10 text-center">
                   <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                   <span className="relative px-6 bg-[#0d0b09] text-[10px] font-black text-white/60 uppercase tracking-[0.2em] font-plus-jakarta">ou use seu e-mail</span>
                </div>

                <form action={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-xs font-black text-white/70 uppercase tracking-[0.2em] font-plus-jakarta mb-3 px-1">E-mail</label>
                    <div className="relative group/input">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within/input:text-white transition-colors" size={20} />
                      <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu@email.com"
                        className="w-full bg-white/5 border border-white/10 text-white rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all font-plus-jakarta font-semibold placeholder:text-white/20"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-3 px-1">
                      <label className="text-xs font-black text-white/70 uppercase tracking-[0.2em] font-plus-jakarta">Senha</label>
                    </div>
                    <div className="relative group/input">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within/input:text-white transition-colors" size={20} />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="••••••••"
                        className="w-full bg-white/5 border border-white/10 text-white rounded-2xl py-4 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all font-plus-jakarta font-semibold placeholder:text-white/20"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-pepper-red text-sm font-black text-center font-plus-jakarta uppercase tracking-wide">
                      {error}
                    </motion.p>
                  )}

                  <div className="flex items-center justify-between px-1">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-white/20 bg-[#0A0A0A] text-pepper-red focus:ring-pepper-red/20 transition-all"
                      />
                      <span className="text-[11px] font-black text-white/60 uppercase tracking-widest group-hover:text-white transition-colors font-plus-jakarta">Lembrar e-mail</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-pepper-red to-pepper-orange text-white font-black py-5 rounded-2xl shadow-xl shadow-pepper-red/30 hover:shadow-pepper-red/50 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 mt-6 uppercase tracking-[0.2em] text-sm font-plus-jakarta border-none"
                    style={{ background: 'linear-gradient(to right, #FF3131, #FF5E3A)' }}
                  >
                    {loading ? "Entrando..." : "Entrar na plataforma"}
                  </button>
                </form>
              </div>
            </motion.div>

            <p className="mt-10 text-center text-[11px] font-black text-white/40 uppercase tracking-[0.2em] font-plus-jakarta">
              Não tem uma conta?{" "}
              <Link href="/signup" className="text-white hover:text-pepper-orange transition-colors underline underline-offset-4 decoration-white/20">
                Criar conta gratuita
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
