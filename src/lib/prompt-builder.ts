import { PHOTOGRAPHIC_REALISM_DIRECTIVE } from "./gemini";

// ================================================================
// PROMPT BUILDER — Ported from legacy App.tsx generateFinalPrompt
// Maps the simplified SaaS UI selections to real photography keywords
// ================================================================

interface PromptConfig {
  foodType: string;
  visualStyle: string;
}

// Food type → complete photography keyword set (from food_presets.ts & food_options.ts)
const FOOD_PRESETS: Record<string, {
  camera: string;
  lighting: string;
  angle: string;
  dof: string;
  aspectRatio: string;
  keywords: string[];
  negativeKeywords: string[];
}> = {
  pizza: {
    camera: "Sony A7 IV + 35mm f/2.8",
    lighting: "Luz Contínua Quente (Ambiente de Restaurante)",
    angle: "Flat Lay 90° (Vista de Cima)",
    dof: "Foco Natural",
    aspectRatio: "1:1",
    keywords: ["pizza photography", "cheese stretch", "crust detail", "melted edges", "pizza toppings sharp", "balanced colors", "texture", "warm continuous light", "tungsten mood", "cozy restaurant atmosphere", "flat lay", "overhead shot", "top down"],
    negativeKeywords: ["burned cheese", "plastic look", "cheese glare", "floating slice", "too orange", "unbalanced warm tones"],
  },
  hamburger: {
    camera: "Canon EOS R3 + 50mm f/1.4",
    lighting: "Golden Hour (Luz Quente Suave)",
    angle: "Nível do Olhar 0° (Visão Frontal)",
    dof: "Fundo Desfocado",
    aspectRatio: "1:1",
    keywords: ["burger photography", "melting cheese", "crisp lettuce", "juicy interior", "layered structure", "golden hour", "warm tones", "eye-level food shot", "hero food angle", "shallow depth of field", "creamy bokeh"],
    negativeKeywords: ["soggy bun", "flattened layers", "plastic texture", "cool tones"],
  },
  "sushi": {
    camera: "Ricoh GR IIIx + 40mm f/2.8",
    lighting: "Low-Key (Luz Dramática e Contraste)",
    angle: "Ângulo 45° (Visão da Mesa)",
    dof: "Fundo Desfocado",
    aspectRatio: "4:3",
    keywords: ["japanese food photography", "sashimi gloss", "rice grain detail", "negative space", "minimalism", "clean composition", "low key", "high contrast", "dramatic food photo", "45-degree food shot", "shallow depth of field"],
    negativeKeywords: ["plastic sushi look", "bright scene", "flat lighting"],
  },
  sobremesa: {
    camera: "Hasselblad X2D 100C + 90mm f/2.5",
    lighting: "Luz Lateral Difusa (Janela)",
    angle: "Close-up/Macro (Detalhe)",
    dof: "Fundo Desfocado",
    aspectRatio: "1:1",
    keywords: ["dessert photography", "soft tones", "pastel colors", "macro detail", "texture accent", "creamy highlights", "soft shadows", "close up", "extreme detail", "soft side light", "natural light", "diffused light"],
    negativeKeywords: ["harsh shadows", "digital look", "plastic look", "waxy", "overglazed"],
  },
  salada: {
    camera: "Canon EOS R5 + 50mm f/2.8",
    lighting: "Luz de Estúdio Branca (Catálogo)",
    angle: "Flat Lay 90° (Vista de Cima)",
    dof: "Tudo Nítido",
    aspectRatio: "1:1",
    keywords: ["salad photography", "vibrant greens", "fresh texture", "natural sheen", "ingredient detail", "studio white light", "clean lighting", "flat lay", "overhead shot", "deep depth of field", "sharp everywhere"],
    negativeKeywords: ["wilted leaves", "oversaturation", "blurry", "dramatic"],
  },
  cafe: {
    camera: "Fujifilm X-H2S + 35mm f/1.4",
    lighting: "Luz Lateral Difusa (Janela)",
    angle: "Ângulo 45° (Visão da Mesa)",
    dof: "Fundo Desfocado",
    aspectRatio: "3:4",
    keywords: ["coffee photography", "film look", "soft tones", "coffee crema detail", "cozy atmosphere", "warm glow", "soft side light", "natural light", "45-degree food shot", "shallow depth of field", "creamy bokeh"],
    negativeKeywords: ["harsh colors", "digital look", "oversharpened", "harsh shadows"],
  },
  lanche: {
    camera: "Canon EOS R3 + 50mm f/1.4",
    lighting: "Golden Hour (Luz Quente Suave)",
    angle: "Nível do Olhar 0° (Visão Frontal)",
    dof: "Fundo Desfocado",
    aspectRatio: "1:1",
    keywords: ["sandwich photography", "melting cheese", "crisp lettuce", "juicy interior", "layered structure", "golden hour", "warm tones", "eye-level food shot", "hero food angle", "shallow depth of field"],
    negativeKeywords: ["soggy bun", "flattened layers", "plastic texture"],
  },
  "prato-feito": {
    camera: "Canon EOS R6 II + 50mm f/1.8",
    lighting: "Luz Lateral Difusa (Janela)",
    angle: "Ângulo 45° (Visão da Mesa)",
    dof: "Foco Natural",
    aspectRatio: "4:3",
    keywords: ["brazilian food photography", "rustic food detail", "rich stew texture", "cultural plating", "warm tones", "low light", "soft side light", "natural light", "45-degree food shot", "balanced focus", "natural storytelling"],
    negativeKeywords: ["harsh shadows", "artificial lighting", "color cast", "oversaturation"],
  },
};

// Visual style → environment / lighting override prompts
const STYLE_ENVIRONMENTS: Record<string, {
  sceneDescription: string;
  lightingOverride: string;
  extraKeywords: string[];
}> = {
  rustico: {
    sceneDescription: "uma mesa de madeira rústica envelhecida, com textura de tábua natural, guardanapo de linho e luz quente de janela lateral. Atmosfera caseira e aconchegante de restaurante familiar.",
    lightingOverride: "Golden Hour (Luz Quente Suave)",
    extraKeywords: ["rustic wood table", "warm ambient light", "cozy restaurant", "natural textures", "linen napkin"],
  },
  "premium-escuro": {
    sceneDescription: "uma superfície de ardósia preta ou mármore escuro, com iluminação lateral dramática criando sombras profundas e highlights intensos. Ambiente de restaurante fine-dining.",
    lightingOverride: "Low-Key (Luz Dramática e Contraste)",
    extraKeywords: ["dark slate surface", "dramatic side lighting", "fine dining", "moody atmosphere", "high contrast", "dark background"],
  },
  clean: {
    sceneDescription: "uma mesa de mármore branco ou superfície minimalista clara, com iluminação uniforme e clean. Ambiente moderno, leve e arejado.",
    lightingOverride: "Luz de Estúdio Branca (Catálogo)",
    extraKeywords: ["white marble surface", "clean lighting", "minimalist", "bright airy", "modern aesthetic", "neutral tones"],
  },
  gourmet: {
    sceneDescription: "uma bancada de mármore carrara com veios elegantes, talheres de prata e detalhes sofisticados. Iluminação de estúdio com softbox para um look editorial de revista gastronômica.",
    lightingOverride: "Luz Lateral Difusa (Janela)",
    extraKeywords: ["carrara marble", "silver cutlery", "editorial food photography", "magazine quality", "sophisticated plating", "elegant props"],
  },
};

export function buildEnhancementPrompt(config: PromptConfig): string {
  const preset = FOOD_PRESETS[config.foodType] || FOOD_PRESETS["prato-feito"];
  const style = STYLE_ENVIRONMENTS[config.visualStyle] || STYLE_ENVIRONMENTS["rustico"];

  const allKeywords = [
    "professional food photography", "ultra realistic", "high detail",
    "appetizing", "gourmet aesthetic", "subtle imperfections",
    "natural textures", "slight film grain", "culinary accuracy",
    "culturally authentic plating", "realistic plating", "authentic food styling",
    ...preset.keywords,
    ...style.extraKeywords,
  ].join(", ");

  const allNegativeKeywords = [
    "blurry", "disfigured", "deformed", "cartoon", "3d render",
    "illustration", "painting", "ugly", "bad quality", "bad proportions",
    "unrealistic", "plastic look", "waxy", "soggy", "unnatural gloss",
    "fake cgi smoke", "cartoonish steam", "illogical composition",
    "unrealistic plating", "floating food", "mixed cuisines",
    ...preset.negativeKeywords,
  ].join(", ");

  return `TASK: Professional Food Photography — Background Replacement & Environment Swap.

**REQUESTED ENVIRONMENT:** "${style.sceneDescription}"
**REQUESTED CAMERA:** ${preset.camera}
**REQUESTED LIGHTING:** ${style.lightingOverride}
**REQUESTED ANGLE:** ${preset.angle}
**TECHNICAL STYLE KEYWORDS:** ${allKeywords}

**CRITICAL RULES FOR RECOMPOSITION:**
1. **SUBJECT PRESERVATION:** The main food object MUST be preserved visually — its core ingredients, shape, textures, and style MUST remain intact.
2. **STRICT ANGLE COMPLIANCE (MANDATORY):** Render from the EXACT camera angle: "${preset.angle}". If the original was shot from a different angle, logically rotate the camera perspective to perfectly match.
3. **ENVIRONMENT CREATION:** Produce the exact environment: "${style.sceneDescription}". Background, table, plates, and props must match this description perfectly.
4. **STRICT LIGHTING COMPLIANCE:** Apply "${style.lightingOverride}". Shadows and highlights MUST match this setup, overriding the original light.
5. **NO "BEAUTIFYING":** Keep the food's authentic appearance — crumbs, irregular textures, organic imperfections. Do not make it look like perfectly symmetrical plastic.

${PHOTOGRAPHIC_REALISM_DIRECTIVE}

**PROMPT NEGATIVO (O QUE EVITAR):**
${allNegativeKeywords}

**EXECUTION:**
Render this food in the new environment using ONLY the EXACT specified camera angle (${preset.angle}) and lighting (${style.lightingOverride}). Failure to adopt the specified angle is unacceptable.`;
}

export function buildCopywritingPrompt(foodType: string, visualStyle: string): string {
  const foodLabel = {
    pizza: "Pizza", hamburger: "Hambúrguer", sushi: "Sushi/Comida Japonesa",
    sobremesa: "Sobremesa", salada: "Salada/Prato Fit", cafe: "Café/Bebida",
    lanche: "Lanche/Wrap", "prato-feito": "Prato Feito/Comida Brasileira",
  }[foodType] || foodType;

  return `Você é um copywriter especialista em marketing de delivery (iFood, Rappi, Uber Eats).

TAREFA: Gere EXATAMENTE 3 textos curtos de descrição/promoção para um prato de "${foodLabel}" com estilo visual "${visualStyle}" para usar no cardápio do iFood.

FORMATO DE SAÍDA (JSON estrito, sem markdown):
[
  {"id": "persuasivo", "label": "Persuasivo", "text": "..."},
  {"id": "descritivo", "label": "Descritivo", "text": "..."},
  {"id": "urgencia", "label": "Urgência", "text": "..."}
]

REGRAS:
1. Persuasivo: Use emojis, apelo emocional, gatilhos ("imagine o aroma…"). Max 280 chars.
2. Descritivo: Profissional, factual. Ingredientes, tempo de preparo, porções. Max 250 chars.
3. Urgência: FOMO ("só hoje", "últimas unidades"), emojis de velocidade. Max 200 chars.
4. Linguagem: PT-BR coloquial de delivery.
5. NÃO mencione preço.
6. RETORNE APENAS O JSON, sem explicação.`;
}

export function getAspectRatioForFood(foodType: string): string {
  return FOOD_PRESETS[foodType]?.aspectRatio || "1:1";
}
