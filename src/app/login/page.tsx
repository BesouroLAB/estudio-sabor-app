"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  Check,
  Mail,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { login } from "./actions";

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
    <div className="min-h-dvh flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_#1a1410_0%,_#0d0b09_100%)]">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pepper-red blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pepper-orange blur-[120px] rounded-full" />
        {/* Pepper Image Background Decoration */}
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
            src="https://res.cloudinary.com/do8gdtozt/image/upload/v1766242394/logo_V2_branca_sem_fundo_ujkf0t.png"
            alt="Estúdio Sabor Logo"
            width={192}
            height={80}
            className="w-48 h-auto mb-4 drop-shadow-[0_0_20px_rgba(255,94,58,0.4)]"
            priority
            unoptimized
          />
          <p className="text-sm font-medium mt-1 uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-pepper-red to-pepper-orange">
            Plataforma de IA para Gastronomia
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-[#1a1410]/50 backdrop-blur-xl border border-white/[0.06] p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          <form action={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label
                htmlFor="login-email"
                className="block text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-2 px-1"
              >
                E-mail
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
                  <Mail className="w-5 h-5 opacity-40" />
                </span>
                <input
                  id="login-email"
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
                htmlFor="login-password"
                className="block text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-2 px-1"
              >
                Senha
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
                  <Lock className="w-5 h-5 opacity-40" />
                </span>
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  minLength={6}
                  autoFocus
                  className={`w-full bg-[#0d0b09] border ${error ? "border-pepper-red" : "border-white/[0.06]"} text-text-primary text-sm rounded-xl p-4 pl-12 pr-12 focus:ring-2 focus:ring-pepper-orange focus:border-transparent outline-none transition-all placeholder:text-text-muted/20`}
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

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between mt-4 px-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                    />
                    <div className="w-5 h-5 rounded-md border border-white/[0.06] bg-[#0d0b09]/50 peer-checked:bg-pepper-orange peer-checked:border-pepper-orange transition-all flex items-center justify-center">
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider group-hover:text-text-primary transition-colors">
                    Lembrar de mim
                  </span>
                </label>
              </div>

              {/* Error */}
              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-pepper-red text-[10px] font-bold mt-2 uppercase tracking-wide animate-pulse px-1"
                >
                  {error}
                </motion.p>
              )}
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
                  <span>Entrar na Plataforma</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Signup Link */}
        <div className="mt-6 text-center">
          <p className="text-text-secondary text-sm">
            Não tem conta?{" "}
            <Link
              href="/signup"
              className="text-pepper-orange hover:text-pepper-red transition-colors font-semibold"
            >
              Criar conta grátis
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
