export interface ToolDefinition {
  slug: string;
  title: string;
  description: string;
  foodType: string;
  visualStyle: string;
  seoTitle: string;
  seoDescription: string;
  heroImage?: string;
}

export const TOOLS_REGISTRY: Record<string, ToolDefinition> = {
  "ia-para-fotos-de-sushi-premium": {
    slug: "ia-para-fotos-de-sushi-premium",
    title: "IA para Fotos de Sushi Premium",
    description: "Crie fotos cinematográficas de sushis e combinados com iluminação de estúdio profissional em segundos.",
    foodType: "Sushi & Oriental",
    visualStyle: "Gourmet Editorial (High Contrast)",
    seoTitle: "Gerador de Fotos de Sushi com IA | Estúdio Sabor",
    seoDescription: "Transforme suas fotos de sushi em peças publicitárias de luxo. Use nossa IA especializada em culinária japonesa.",
  },
  "ia-fotos-hamburguer-artesanal": {
    slug: "ia-fotos-hamburguer-artesanal",
    title: "IA para Hambúrguer Artesanal",
    description: "Realce a suculência e as texturas do seu burger com presets otimizados para delivery e redes sociais.",
    foodType: "Burger & Sanduíches",
    visualStyle: "Vibrant & Juicy (Social Media)",
    seoTitle: "IA para Fotos de Hambúrguer | Estúdio Sabor",
    seoDescription: "Crie fotos de hambúrguer que dão fome. Presets de iluminação e texturas otimizados para hamburguerias.",
  },
  "ia-fotos-pizzaria-italiana": {
    slug: "ia-fotos-pizzaria-italiana",
    title: "IA para Fotos de Pizzaria",
    description: "Destaque o queijo derretido e a borda crocante com nossa inteligência artificial para pizzarias.",
    foodType: "Pizza",
    visualStyle: "Warm & Cozy (Rustic)",
    seoTitle: "Gerador de Fotos de Pizza com IA | Estúdio Sabor",
    seoDescription: "Fotos rústicas e autênticas para sua pizzaria. Transforme cliques de celular em fotos de cardápio profissional.",
  },
  "gerador-fotos-doces-confeitaria": {
    slug: "gerador-fotos-doces-confeitaria",
    title: "Gerador de Fotos para Confeitaria",
    description: "Presets suaves e cores pastéis para valorizar bolos, doces e sobremesas finas.",
    foodType: "Sobremesas & Doces",
    visualStyle: "Soft & Airy (Dreamy)",
    seoTitle: "IA para Confeitaria e Doces | Estúdio Sabor",
    seoDescription: "Fotos delicadas e profissionais para sua doceria. Aumente o desejo pelos seus doces com um clique.",
  }
};

export const getToolBySlug = (slug: string) => TOOLS_REGISTRY[slug] || null;
