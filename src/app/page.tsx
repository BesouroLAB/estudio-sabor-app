"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { 
  Flame, 
  ArrowRight, 
  Zap, 
  Sparkles, 
  ShieldCheck, 
  Star,
  CheckCircle2,
  Camera,
  Layers,
  ChevronRight,
  HelpCircle,
  MessageCircle,
  CreditCard,
  Rocket,
  ChefHat,
  Play,
  Target,
  Box,
  Maximize
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

// --- Components ---

function SectionReveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const NAV_LINKS = [
  { name: "Funcionalidades", href: "#funcionalidades" },
  { name: "Galeria", href: "#resultado-real" },
  { name: "Preços", href: "#precos" },
  { name: "FAQ", href: "#faq" },
];

const SHOWCASE_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=800&auto=format&fit=crop",
    title: "Hambúrguer Gourmet",
    category: "Food Styling"
  },
  {
    url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop",
    title: "Salada Tropical",
    category: "iFood Premium"
  },
  {
    url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop",
    title: "Pizza Artesanal",
    category: "Social Media"
  },
  {
    url: "https://images.unsplash.com/photo-1563379091339-03b21ec4a4f8?q=80&w=800&auto=format&fit=crop",
    title: "Sushi Omakase",
    category: "Capa iFood"
  }
];

export default function LandingPage() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  return (
    <div className="min-h-screen bg-bg-main selection:bg-pepper-red/10 selection:text-pepper-red overflow-x-hidden font-body bg-grain">
      
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-[100] flex justify-center p-6 pointer-events-none">
        <motion.div 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "circOut" }}
          className={`flex items-center justify-between w-full max-w-7xl px-8 py-4 ${isScrolled ? 'bg-white/80 backdrop-blur-2xl shadow-glow' : 'bg-white/40 backdrop-blur-md'} border border-white/20 rounded-[2.5rem] pointer-events-auto transition-all duration-500`}
        >
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 flex items-center justify-center transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
               <Image 
                 src="https://res.cloudinary.com/do8gdtozt/image/upload/v1761782366/pimenta_sem__fundo_qur83u.png" 
                 alt="Logo" 
                 width={40} 
                 height={40} 
                 className="w-full h-full object-contain drop-shadow-[0_4px_12px_rgba(239,68,68,0.4)] group-hover:drop-shadow-[0_8px_20px_rgba(239,68,68,0.6)]"
               />
            </div>
            <span className="text-xl font-display font-black text-pepper-black tracking-tight">Estúdio<span className="text-pepper-red">&</span>Sabor</span>
          </div>
          
          <div className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map(link => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-xs font-black uppercase tracking-widest text-text-secondary hover:text-pepper-red transition-all hover:tracking-[0.2em]"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="hidden sm:block text-xs font-black uppercase tracking-widest text-pepper-black hover:text-pepper-red transition-colors mr-2"
            >
              Login
            </Link>
            <Link 
              href="/dashboard" 
              className="bg-pepper-black text-white text-[10px] font-black uppercase tracking-[0.15em] px-6 py-3.5 rounded-2xl hover:bg-pepper-red transition-all active:scale-95 shadow-xl shadow-black/10 flex items-center gap-2 group"
            >
              Começar Agora
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-56 md:pb-32 px-6 overflow-hidden">
        {/* Ambient Background Lights */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 pointer-events-none">
           <div className="absolute top-[-10%] left-[5%] w-[40%] aspect-square bg-pepper-red/10 blur-[120px] rounded-full animate-pulse" />
           <div className="absolute bottom-[20%] right-[5%] w-[35%] aspect-square bg-pepper-orange/10 blur-[100px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-pepper-red/10 text-pepper-red text-[10px] font-black uppercase tracking-[0.2em] mb-8 shadow-sm">
                 <div className="w-1.5 h-1.5 bg-pepper-red rounded-full animate-ping" />
                 SOTA 2026: Marketing IA de Elite
              </div>
              <h1 className="text-6xl md:text-[5.5rem] font-display font-black text-pepper-black leading-[0.95] mb-10 tracking-tighter">
                Sua Agência de <br/>
                <span className="text-gradient-pepper">Delivery</span> no Bolso.
              </h1>
              <p className="text-xl text-text-secondary leading-relaxed mb-12 max-w-xl font-medium">
                Transforme fotos simples de celular em cliques profissionais para iFood em 30 segundos. 
                <span className="text-pepper-black font-bold"> Food Styling com IA</span> que ativa o desejo de compra instantâneo.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 items-center">
                <Link 
                  href="/dashboard"
                  className="w-full sm:w-auto flex items-center justify-center gap-3 bg-pepper-black text-white font-black px-12 py-6 rounded-[24px] text-xl hover:bg-pepper-red transition-all active:scale-[0.98] group relative shadow-2xl shadow-black/20"
                >
                  <span className="relative z-10">Testar Agora Grátis</span>
                  <Rocket size={24} className="relative z-10 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <div className="flex items-center gap-4 py-2">
                   <div className="flex -space-x-3">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-bg-elevated overflow-hidden">
                           <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                        </div>
                      ))}
                   </div>
                   <div>
                      <div className="flex items-center gap-1 mb-0.5">
                         {[1,2,3,4,5].map(i => <Star key={i} size={14} className="fill-pepper-orange text-pepper-orange" />)}
                      </div>
                      <p className="text-[10px] font-black text-text-muted uppercase tracking-widest leading-none">Usado por 400+ Restaurantes</p>
                   </div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: 20 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative perspective-1000"
          >
            {/* Main Showcase Device */}
            <div className="relative z-10 rounded-[3rem] md:rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border-[8px] md:border-[12px] border-white backdrop-blur-xl aspect-[4/5] md:aspect-square bg-slate-100 group ring-1 ring-black/5 overflow-hidden">
               {/* "After" Image */}
               <Image 
                 src="https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=2071&auto=format&fit=crop" 
                 alt="Depois: Foto Profissional"
                 fill
                 className="object-cover group-hover:scale-105 transition-transform duration-[2s]"
                 priority
               />
               
               {/* Wipe Effect */}
               <motion.div 
                 className="absolute inset-0 z-20 border-r-[3px] md:border-r-4 border-white shadow-2xl overflow-hidden"
                 initial={{ width: "100%" }}
                 animate={{ width: "45%" }}
                 transition={{ 
                   duration: 4, 
                   delay: 2, 
                   repeat: Infinity, 
                   repeatType: "reverse", 
                   repeatDelay: 2,
                   ease: "easeInOut"
                 }}
               >
                 <div className="absolute inset-0 w-[220%] h-full">
                    <Image 
                       src="https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1965&auto=format&fit=crop" 
                       alt="Antes: Foto de Celular"
                       fill
                       className="object-cover grayscale-[0.3] brightness-90"
                    />
                 </div>
                 <div className="absolute top-4 left-4 md:top-8 md:left-8 bg-black/80 backdrop-blur-md px-3 py-1.5 md:px-5 md:py-2 rounded-full text-[8px] md:text-[10px] font-black text-white uppercase tracking-[0.2em] shadow-xl border border-white/10">
                    Antes (Celular)
                 </div>
               </motion.div>

               <div className="absolute top-4 right-4 md:top-8 md:right-8 z-30 bg-pepper-red/90 backdrop-blur-md px-3 py-1.5 md:px-5 md:py-2 rounded-full text-[8px] md:text-[10px] font-black text-white uppercase tracking-[0.2em] shadow-xl border border-white/20">
                  Depois (Estúdio Sabor)
               </div>

               <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 via-transparent to-transparent z-30 pointer-events-none" />
               <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10 z-40">
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-white/10 backdrop-blur-2xl px-4 py-3 md:px-6 md:py-4 rounded-[2rem] flex items-center justify-between border border-white/20 shadow-2xl overflow-hidden"
                  >
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                           <CheckCircle2 size={18} className="text-green-500" />
                        </div>
                        <div>
                           <p className="text-[8px] md:text-[10px] font-black text-white/60 uppercase tracking-widest">Performance iFood</p>
                           <p className="text-xs md:text-sm font-black text-white uppercase tracking-tight">Vendas +35% de conversão</p>
                        </div>
                     </div>
                     <div className="hidden sm:flex w-8 h-8 md:w-10 md:h-10 rounded-2xl bg-white text-pepper-red items-center justify-center shadow-lg group-hover:bg-pepper-red group-hover:text-white transition-all">
                        <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                     </div>
                  </motion.div>
               </div>
            </div>
            
            {/* Background Glows */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-pepper-red/20 blur-[100px] rounded-full -z-10 animate-pulse" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-pepper-orange/20 blur-[100px] rounded-full -z-10" />
          </motion.div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-20 border-y border-border-subtle bg-white/30 backdrop-blur-sm overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
           <p className="text-center text-[11px] font-black text-text-muted uppercase tracking-[0.4em] mb-12">Otimizado para o ecossistema de delivery</p>
           <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
              <span className="font-display font-black text-3xl tracking-tighter">iFood</span>
              <span className="font-display font-black text-3xl tracking-tighter italic">Uber<span className="text-pepper-red">Eats</span></span>
              <span className="font-display font-black text-3xl tracking-tighter">Rappi</span>
              <span className="font-display font-black text-3xl tracking-tighter">Instagram</span>
              <span className="font-display font-black text-3xl tracking-tighter">WhatsApp</span>
           </div>
        </div>
      </section>

      {/* "Resultado Real" Section */}
      <section id="resultado-real" className="py-32 px-6 bg-white overflow-hidden">
         <SectionReveal className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-20">
               <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pepper-orange/10 text-pepper-orange text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                     <Sparkles size={12} />
                     Galeria SOTA
                  </div>
                  <h2 className="text-5xl md:text-6xl font-display font-black text-pepper-black leading-tight tracking-tighter">
                     O <span className="text-pepper-red italic">Resultado Real</span> que o seu cliente deseja ver.
                  </h2>
               </div>
               <p className="text-lg text-text-secondary max-w-xs pb-2 font-medium">
                  A Inteligência Artificial treinada especificamente para o paladar brasileiro.
               </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
               {SHOWCASE_IMAGES.map((img, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ y: -10 }}
                    className="group relative aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-bg-elevated border border-border-default shadow-xl"
                  >
                     <Image 
                       src={img.url} 
                       alt={img.title} 
                       fill 
                       className="object-cover transition-transform duration-700 group-hover:scale-110"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                     <div className="absolute bottom-8 left-8 right-8 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">{img.category}</p>
                        <p className="text-xl font-display font-bold text-white leading-tight">{img.title}</p>
                     </div>
                  </motion.div>
               ))}
            </div>
         </SectionReveal>
      </section>

      {/* Zero-Click Strategy Section */}
      <section className="py-32 px-6 bg-pepper-black relative overflow-hidden">
        <div className="absolute inset-0 bg-grain opacity-20" />
        <div className="max-w-7xl mx-auto relative z-10">
          <SectionReveal className="text-center mb-24">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-pepper-red text-[10px] font-black uppercase tracking-[0.2em] mb-6">
              <Zap size={14} className="fill-current" />
              O Futuro do Marketing de Delivery
            </div>
            <h2 className="text-5xl md:text-7xl font-display font-black text-white mb-8 tracking-tighter">
              Método <span className="text-pepper-red italic underline decoration-white/20 underline-offset-8">Zero-Click</span>
            </h2>
            <p className="text-xl text-white/50 max-w-3xl mx-auto font-medium">
              Eliminamos a complexidade. Você traz o prato, nós trazemos a agência inteira em 3 passos automáticos.
            </p>
          </SectionReveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Objetivo Criativo",
                desc: "Defina se o seu foco é vender no iFood, engajar no Instagram ou fechar pedidos no WhatsApp. A IA adapta o tom de voz e o visual instantaneamente.",
                icon: <Target className="text-pepper-red" size={32} />
              },
              {
                step: "02",
                title: "Ambiente Imersivo",
                desc: "Escolha entre centenas de estúdios virtuais projetados por especialistas em neuromarketing gastronômico. Luz, sombras e texturas hiper-reais.",
                icon: <Box className="text-pepper-red" size={32} />
              },
              {
                step: "03",
                title: "Formato Inteligente",
                desc: "Exportação automática com as dimensões e pesos ideais para cada plataforma. Sem cortes errados ou perda de qualidade.",
                icon: <Maximize className="text-pepper-red" size={32} />
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="relative p-12 rounded-[3rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
              >
                <div className="absolute top-8 right-12 text-7xl font-display font-black text-white/5 group-hover:text-pepper-red/10 transition-colors">
                  {item.step}
                </div>
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/10">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-display font-black text-white mb-4">{item.title}</h3>
                <p className="text-white/40 leading-relaxed font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="precos" className="py-32 px-6 relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <SectionReveal className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pepper-red/5 text-pepper-red text-[10px] font-black uppercase tracking-[0.2em] mb-4">
              <CreditCard size={12} />
              Preços Transparentes
            </div>
            <h2 className="text-5xl md:text-6xl font-display font-black text-pepper-black mb-6 tracking-tighter">Investimento que se <span className="text-pepper-red italic text-gradient-pepper">paga</span>.</h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto font-medium">Pague apenas pelo que usar. Sem contratos abusivos ou mensalidades.</p>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
            {[
              { 
                name: "Degustação", 
                price: "Grátis", 
                credits: "30 Créditos", 
                desc: "Para sentir o poder da IA.",
                featured: false,
                cta: "Começar Grátis",
                link: "/dashboard"
              },
              { 
                name: "Profissional", 
                price: "R$ 47", 
                credits: "150 Créditos", 
                desc: "O plano favorito dos restaurantes em crescimento.",
                featured: true,
                cta: "Garantir Vantagem",
                link: "/dashboard?tab=credits"
              },
              { 
                name: "Expert", 
                price: "R$ 97", 
                credits: "400 Créditos", 
                desc: "Para quem quer dominar o iFood da sua região.",
                featured: false,
                cta: "Comprar Agora",
                link: "/dashboard?tab=credits"
              }
            ].map((plan, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -10 }}
                className={`relative p-12 rounded-[3.5rem] border-2 transition-all duration-500 ${plan.featured ? 'border-pepper-red shadow-2xl scale-110 z-10 bg-white' : 'border-border-default shadow-sm bg-bg-elevated/30 hover:bg-white'} group flex flex-col justify-between h-[600px]`}
              >
                {plan.featured && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-pepper-red text-white text-[10px] font-black px-8 py-2 rounded-full uppercase tracking-widest shadow-xl ring-4 ring-white">
                    Recomendado
                  </div>
                )}
                <div>
                   <h3 className="text-2xl font-display font-black text-pepper-black mb-2">{plan.name}</h3>
                   <div className="flex items-baseline gap-1 mb-8">
                     <span className="text-5xl font-display font-black text-pepper-black">{plan.price}</span>
                     {plan.price !== "Grátis" && <span className="text-text-muted text-sm font-bold">/único</span>}
                   </div>
                   
                   <div className="p-6 rounded-3xl bg-bg-elevated mb-10 border border-border-default">
                     <div className="flex items-center gap-2 text-pepper-red font-black text-xl mb-1">
                       <Zap size={20} className="fill-current" />
                       {plan.credits}
                     </div>
                     <p className="text-sm text-text-secondary font-medium">{plan.desc}</p>
                   </div>

                   <ul className="space-y-4">
                     {["Geração de Fotos SOTA", "Copywriting Persuasivo", "Otimização iFood", "Suporte VIP"].map((item, idx) => (
                       <li key={idx} className="flex items-center gap-3 text-sm text-text-secondary font-bold">
                         <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center">
                            <CheckCircle2 size={14} className="text-green-500" />
                         </div>
                         {item}
                       </li>
                     ))}
                   </ul>
                </div>

                <Link 
                  href={plan.link}
                  className={`w-full flex items-center justify-center py-5 rounded-2xl font-display font-black text-sm uppercase tracking-widest transition-all ${plan.featured ? 'bg-pepper-red text-white hover:bg-pepper-black shadow-xl shadow-pepper-red/20' : 'bg-pepper-black text-white hover:bg-pepper-red shadow-lg'}`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-32 px-6 bg-bg-elevated/30">
        <div className="max-w-4xl mx-auto">
          <SectionReveal className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pepper-red/5 text-pepper-red text-[10px] font-black uppercase tracking-[0.2em] mb-4">
              <HelpCircle size={12} />
              Perguntas Frequentes
            </div>
            <h2 className="text-5xl font-display font-black text-pepper-black tracking-tighter">Dúvidas Comuns</h2>
          </SectionReveal>

          <div className="space-y-6">
            {[
              {
                q: "Preciso de uma câmera profissional ou estúdio?",
                a: "De forma alguma. O Estúdio & Sabor foi criado para transformar fotos simples tiradas com qualquer celular em peças publicitárias de alta qualidade. Nossa IA cuida de toda a ambientação, luz e pós-produção."
              },
              {
                q: "Como recebo meus créditos após a compra?",
                a: "A liberação é instantânea. Assim que o pagamento via Mercado Pago é confirmado, o saldo é atualizado automaticamente na sua conta e você já pode começar a gerar suas artes."
              },
              {
                q: "As fotos geradas são aceitas pelo iFood?",
                a: "Sim, elas são otimizadas especificamente para o iFood. Seguimos os padrões de nitidez, contraste e proporção que o algoritmo do iFood prioriza, o que ajuda a aumentar sua taxa de conversão."
              },
              {
                q: "Existe fidelidade ou mensalidade?",
                a: "Não. Nosso modelo é baseado em créditos. Você compra o pacote que melhor atende sua necessidade e usa quando quiser. Sem sustos na fatura e sem contratos de longo prazo."
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-[2rem] border border-border-default shadow-sm hover:shadow-md transition-all"
              >
                <h4 className="text-lg font-display font-bold text-pepper-black mb-3 flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-pepper-red rounded-full" />
                  {item.q}
                </h4>
                <p className="text-text-secondary font-medium leading-relaxed pl-4.5">{item.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-32 px-6 relative overflow-hidden bg-bg-main">
         <div className="max-w-6xl mx-auto rounded-[5rem] bg-pepper-black p-12 md:p-28 text-center relative overflow-hidden shadow-3xl group border border-white/10">
            <div className="absolute inset-0 bg-gradient-to-br from-pepper-red/20 via-transparent to-pepper-orange/10 opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
            
            <div className="relative z-10">
               <motion.div
                 initial={{ opacity: 0, scale: 0.9 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-white/80 text-[11px] font-black uppercase tracking-[0.3em] mb-10 shadow-2xl"
               >
                 <Rocket size={16} className="text-pepper-red animate-bounce" />
                 Seu restaurante merece o topo do iFood
               </motion.div>

               <h2 className="text-5xl md:text-[6.5rem] font-display font-black text-white mb-10 tracking-tighter leading-[0.9]">
                 Pronto para <br className="hidden md:block" /> 
                 <span className="text-pepper-red italic">mudar de liga</span>?
               </h2>
               
               <p className="text-xl text-white/50 mb-14 max-w-2xl mx-auto leading-relaxed font-medium">
                 Cadastre-se hoje e ganhe <span className="text-white font-bold">30 créditos grátis</span> para transformar seu cardápio instantaneamente. Sem cartão de crédito.
               </p>

               <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                 <Link 
                   href="/dashboard"
                   className="w-full sm:w-auto inline-flex items-center justify-center gap-4 bg-white text-pepper-black font-display font-black px-14 py-7 rounded-[32px] text-2xl hover:bg-pepper-red hover:text-white transition-all active:scale-95 group shadow-3xl shadow-white/10"
                 >
                   Começar Grátis
                   <ChevronRight size={28} className="group-hover:translate-x-2 transition-transform" />
                 </Link>
                 
                 <div className="flex items-center gap-5 text-white/40 text-sm font-black border-l border-white/10 pl-8 h-16">
                    <div className="flex -space-x-3">
                       {[7,8,9].map(i => <div key={i} className="w-10 h-10 rounded-full border-2 border-pepper-black bg-white/10" />)}
                    </div>
                    <span className="uppercase tracking-widest">+400 Chefs Ativos</span>
                 </div>
               </div>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-border-subtle px-6 bg-white">
         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
            <div className="md:col-span-2 space-y-8">
               <div className="flex items-center gap-3">
                  <Image 
                    src="https://res.cloudinary.com/do8gdtozt/image/upload/v1761782366/pimenta_sem__fundo_qur83u.png" 
                    alt="Logo" 
                    width={32} 
                    height={32} 
                    className="object-contain drop-shadow-[0_2px_8px_rgba(239,68,68,0.3)]"
                  />
                  <span className="text-2xl font-display font-black text-pepper-black tracking-tight">Estúdio<span className="text-pepper-red">&</span>Sabor</span>
               </div>
               <p className="text-text-secondary max-w-sm font-medium leading-relaxed">
                  A agência de marketing definitiva para delivery, movida por Inteligência Artificial. Transformamos sua operação em uma máquina de vendas profissional.
               </p>
               <div className="flex items-center gap-4">
                  <a href="#" className="w-10 h-10 rounded-xl bg-bg-elevated flex items-center justify-center text-text-muted hover:text-pepper-red transition-colors"><MessageCircle size={20} /></a>
                  <a href="#" className="w-10 h-10 rounded-xl bg-bg-elevated flex items-center justify-center text-text-muted hover:text-pepper-red transition-colors"><Flame size={20} /></a>
               </div>
            </div>
            
            <div className="space-y-6">
               <h4 className="text-xs font-black uppercase tracking-widest text-pepper-black">Plataforma</h4>
               <ul className="space-y-4">
                  <li><a href="#funcionalidades" className="text-sm font-bold text-text-muted hover:text-pepper-red transition-colors">Funcionalidades</a></li>
                  <li><a href="#resultado-real" className="text-sm font-bold text-text-muted hover:text-pepper-red transition-colors">Galeria SOTA</a></li>
                  <li><a href="#precos" className="text-sm font-bold text-text-muted hover:text-pepper-red transition-colors">Preços</a></li>
               </ul>
            </div>

            <div className="space-y-6">
               <h4 className="text-xs font-black uppercase tracking-widest text-pepper-black">Empresa</h4>
               <ul className="space-y-4">
                  <li><Link href="/login" className="text-sm font-bold text-text-muted hover:text-pepper-red transition-colors">Área do Cliente</Link></li>
                  <li><Link href="/admin" className="text-sm font-bold text-text-muted hover:text-pepper-red transition-colors">Painel Admin</Link></li>
                  <li><a href="https://wa.me/5516988031505" className="text-sm font-bold text-text-muted hover:text-pepper-red transition-colors">Suporte Direto</a></li>
               </ul>
            </div>
         </div>
         <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-border-subtle flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">© 2026 Estúdio & Sabor. Todos os direitos reservados.</p>
            <div className="flex gap-8">
               <a href="#" className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] hover:text-pepper-black transition-colors">Privacidade</a>
               <a href="#" className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] hover:text-pepper-black transition-colors">Termos</a>
            </div>
         </div>
      </footer>

      {/* Floating WhatsApp */}
      <motion.a 
        href="https://wa.me/5516988031505" 
        target="_blank" 
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, type: "spring" }}
        className="fixed bottom-8 right-8 z-[100] bg-[#25D366] text-white p-5 rounded-[2rem] shadow-3xl hover:scale-110 transition-all active:scale-95 group border-4 border-white"
      >
        <MessageCircle size={32} className="fill-current" />
        <span className="absolute right-full mr-6 bg-white text-pepper-black text-[10px] font-black py-3 px-6 rounded-2xl shadow-3xl opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 whitespace-nowrap pointer-events-none border border-border-default uppercase tracking-widest">
           Fale com um Especialista
        </span>
      </motion.a>
    </div>
  );
}
