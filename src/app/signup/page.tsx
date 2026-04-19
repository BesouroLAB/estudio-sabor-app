"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  Mail,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { signup } from "../login/actions";

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
      <div className="min-h-dvh flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_#1a1410_0%,_#0d0b09_100%)]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pepper-red blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pepper-orange blur-[120px] rounded-full" />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md text-center relative z-10"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#22c55e] to-[#16a34a] flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Mail size={28} className="text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold text-text-primary mb-2">
            Verifique seu e-mail
          </h1>
          <p className="text-text-secondary text-sm mb-6">
            Enviamos um link de confirmação para o seu e-mail. Clique nele para
            ativar sua conta e começar a usar o Estúdio & Sabor.
          </p>
          <Link
            href="/login"
            className="text-pepper-orange hover:text-pepper-red transition-colors font-medium text-sm"
          >
            ← Voltar para o Login
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_#1a1410_0%,_#0d0b09_100%)]">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-pepper-orange blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-pepper-red blur-[120px] rounded-full" />
        <Image
          src="https://res.cloudinary.com/do8gdtozt/image/upload/v1761782366/pimenta_sem__fundo_qur83u.png"
          alt=""
          width={600}
          height={600}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 blur-sm mix-blend-screen scale-150"
          priority={false}
          unoptimized
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo Area */}
        <div className="flex flex-col items-center mb-10">
          <Image
            src="https://res.cloudinary.com/do8gdtozt/image/upload/v1761865865/logo_estudio_sabor_horizontal-upscale-scale-6_00x_nmbn9t.png"
            alt="Estúdio Sabor Logo"
            width={240}
            height={60}
            className="w-56 h-auto mb-4 drop-shadow-[0_0_20px_rgba(255,94,58,0.2)] invert brightness-200"
            priority
            unoptimized
          />
          <p className="text-sm font-medium mt-1 uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-pepper-red to-pepper-orange">
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

        {/* Signup Form Card */}
        <div className="bg-[#1a1410]/50 backdrop-blur-xl border border-white/[0.06] p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          <form action={handleSubmit} className="space-y-6">
            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-pepper-red/10 border border-pepper-red/20 rounded-xl px-4 py-3"
              >
                <p className="text-pepper-red text-[10px] font-bold uppercase tracking-wide">
                  {error}
                </p>
              </motion.div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="signup-email"
                className="block text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-2 px-1"
              >
                E-mail
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
                  <Mail className="w-5 h-5 opacity-40" />
                </span>
                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  required
                  placeholder="seu@email.com"
                  className="w-full bg-[#0d0b09]/50 border border-white/[0.06] text-text-primary text-sm rounded-xl p-4 pl-12 outline-none focus:ring-2 focus:ring-pepper-orange focus:border-transparent transition-all placeholder:text-text-muted/30"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="signup-password"
                className="block text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-2 px-1"
              >
                Senha
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
                  <Lock className="w-5 h-5 opacity-40" />
                </span>
                <input
                  id="signup-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Mínimo 6 caracteres"
                  minLength={6}
                  className="w-full bg-[#0d0b09] border border-white/[0.06] text-text-primary text-sm rounded-xl p-4 pl-12 pr-12 focus:ring-2 focus:ring-pepper-orange focus:border-transparent outline-none transition-all placeholder:text-text-muted/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-pepper-orange transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pepper-red to-pepper-orange text-white font-black py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30 disabled:scale-100 shadow-[0_10px_20px_rgba(255,94,58,0.3)] flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Criar Conta Grátis</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-text-secondary text-sm">
            Já tem uma conta?{" "}
            <Link
              href="/login"
              className="text-pepper-orange hover:text-pepper-red transition-colors font-semibold"
            >
              Fazer login
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center px-6">
          <p className="text-[10px] text-text-muted/40 font-bold uppercase tracking-widest leading-relaxed">
            Sistema de Inteligência Artificial Generativa para Gastronomia.
            <br />
            © 2025 Estúdio & Sabor. Todos os direitos reservados.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
