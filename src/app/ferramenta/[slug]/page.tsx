import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getToolBySlug, TOOLS_REGISTRY } from "@/constants/tools-registry";
import { motion } from "framer-motion"; // Note: Since it's a server component by default, we'll use a client-wrapped version or keep it simple.
import Link from "next/link";
import { Shield, Zap, Flame, Camera } from "lucide-react";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return Object.keys(TOOLS_REGISTRY).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tool = getToolBySlug(params.slug);
  if (!tool) return {};

  return {
    title: tool.seoTitle,
    description: tool.seoDescription,
    openGraph: {
      title: tool.seoTitle,
      description: tool.seoDescription,
      type: "website",
    },
  };
}

export default function ToolLandingPage({ params }: Props) {
  const tool = getToolBySlug(params.slug);

  if (!tool) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-bg-main text-text-primary selection:bg-pepper-red/10">
      {/* Editorial Navigation */}
      <nav className="border-b border-border-subtle py-6 px-8 flex justify-between items-center backdrop-blur-md sticky top-0 z-50 bg-white/70">
        <Link href="/" className="text-xl font-bold tracking-tighter hover:opacity-80 transition-opacity">
          ESTÚDIO<span className="text-pepper-red">SABOR</span>
        </Link>
        <Link 
          href={`/?foodType=${encodeURIComponent(tool.foodType)}&visualStyle=${encodeURIComponent(tool.visualStyle)}`}
          className="bg-pepper-red text-white px-6 py-2 rounded-full font-bold hover:bg-pepper-red/90 transition-all duration-300 shadow-lg shadow-pepper-red/20"
        >
          Acessar App
        </Link>
      </nav>

      <main className="max-w-6xl mx-auto px-8 pt-20 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Hero Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pepper-red/10 border border-pepper-red/20 text-pepper-red text-sm font-bold uppercase tracking-wider">
              <Zap className="w-4 h-4" />
              <span>Ferramenta de IA Especializada</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight tracking-tight text-text-primary">
              {tool.title}
            </h1>
            
            <p className="text-xl text-text-secondary leading-relaxed max-w-lg">
              {tool.description} Use o poder da Inteligência Artificial Criativa para dar um salto de qualidade nas fotos do seu negócio.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href={`/?foodType=${encodeURIComponent(tool.foodType)}&visualStyle=${encodeURIComponent(tool.visualStyle)}`}
                className="bg-gradient-to-r from-pepper-red to-pepper-orange hover:scale-[1.02] text-white px-8 py-4 rounded-2xl font-bold text-lg text-center transition-all shadow-xl shadow-pepper-red/25 flex items-center justify-center gap-2"
              >
                COMEÇAR AGORA GRÁTIS
                <Zap className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Visual Showcase (Mockup placeholder) */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-tr from-pepper-red/10 to-pepper-orange/10 rounded-[2rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative aspect-square rounded-[2rem] bg-white border border-border-default shadow-2xl flex items-center justify-center overflow-hidden">
                <Camera className="w-20 h-20 text-bg-elevated" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                    <div className="space-y-1">
                        <p className="text-white/70 font-bold text-xs tracking-widest uppercase">Preset Ativado</p>
                        <p className="text-2xl font-bold text-white">{tool.visualStyle}</p>
                    </div>
                </div>
            </div>
          </div>
        </div>

        {/* Features Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32">
          {[
            { icon: <Flame className="w-6 h-6" />, title: "One-Click Expert", desc: "Configurações técnicas automáticas de ISO, abertura e iluminação." },
            { icon: <Shield className="w-6 h-6" />, title: "Segurança de Dados", desc: "Suas fotos são processadas e armazenadas em ambiente seguro e privado." },
            { icon: <Zap className="w-6 h-6" />, title: "Alta Velocidade", desc: "Resultados profissionais prontos para uso em menos de 15 segundos." }
          ].map((feat, i) => (
            <div key={i} className="p-8 rounded-3xl bg-white border border-border-subtle hover:border-pepper-red/30 transition-all group shadow-sm hover:shadow-md">
              <div className="p-3 rounded-2xl bg-bg-elevated w-fit mb-6 group-hover:bg-pepper-red/10 group-hover:text-pepper-red transition-colors">
                {feat.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-text-primary">{feat.title}</h3>
              <p className="text-text-secondary leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-subtle py-12 px-8 text-center text-text-muted text-sm bg-bg-surface">
        <p>&copy; 2026 Estúdio Sabor AI - One Click Expert para Gastronomia.</p>
      </footer>
    </div>
  );
}
}
