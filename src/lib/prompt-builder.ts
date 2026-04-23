import { PHOTOGRAPHIC_REALISM_DIRECTIVE } from "./gemini";
import { 
  FOOD_PRESETS, 
  CAMERAS, 
  LIGHTING_STYLES, 
  ANGLES, 
  DEPTHS_OF_FIELD,
  FoodPreset
} from "@/constants/photography";

// ================================================================
// PROMPT BUILDER — Refactored for 'One-Click' Expert Logic
// Resolves simplified UI selections into high-fidelity tech tokens
// ================================================================

interface PromptConfig {
  foodType: string;
  visualStyle: string;
}

// Visual style → environment / lighting override prompts
// This maps to the 4 vibes in the UI
const STYLE_ENVIRONMENTS: Record<string, {
  sceneDescription: string;
  lightingName: string; // Maps to LIGHTING_STYLES
  extraKeywords: string[];
}> = {
  rustico: {
    sceneDescription: "uma mesa de madeira rústica envelhecida, com textura de tábua natural, guardanapo de linho e luz quente de janela lateral. Atmosfera caseira e aconchegante de restaurante familiar.",
    lightingName: "Golden Hour (Luz Quente Suave)",
    extraKeywords: ["rustic wood table", "warm ambient light", "cozy restaurant", "natural textures", "linen napkin"],
  },
  "premium-escuro": {
    sceneDescription: "uma superfície de ardósia preta ou mármore escuro, com iluminação lateral dramática criando sombras profundas e highlights intensos. Ambiente de restaurante fine-dining.",
    lightingName: "Low-Key (Luz Dramática)",
    extraKeywords: ["dark slate surface", "dramatic side lighting", "fine dining", "moody atmosphere", "high contrast", "dark background"],
  },
  clean: {
    sceneDescription: "uma mesa de mármore branco ou superfície minimalista clara, com iluminação uniforme e clean. Ambiente moderno, leve e arejado.",
    lightingName: "Luz de Estúdio Branca (Catálogo)",
    extraKeywords: ["white marble surface", "clean lighting", "minimalist", "bright airy", "modern aesthetic", "neutral tones"],
  },
  gourmet: {
    sceneDescription: "uma bancada de mármore carrara com veios elegantes, talheres de prata e detalhes sofisticados. Iluminação de estúdio com softbox para um look editorial de revista gastronômica.",
    lightingName: "Luz Lateral Difusa (Janela)",
    extraKeywords: ["carrara marble", "silver cutlery", "editorial food photography", "magazine quality", "sophisticated plating", "elegant props"],
  },
};

export function buildEnhancementPrompt(config: PromptConfig): string {
  // 1. Resolve the Base Preset
  const foodPreset = FOOD_PRESETS.find(p => p.id === config.foodType) || FOOD_PRESETS.find(p => p.id === "brasileira")!;
  const { preset } = foodPreset;

  // 2. Resolve Visual Style Environment
  const styleEnv = STYLE_ENVIRONMENTS[config.visualStyle] || STYLE_ENVIRONMENTS["rustico"];

  // 3. Resolve Technical Photography Tokens
  const camera = CAMERAS.find(c => c.name === preset.cameraName) || CAMERAS[0];
  const resolvedLightingName = styleEnv.lightingName || preset.lightingName;
  const lighting = LIGHTING_STYLES.find(l => l.name === resolvedLightingName) || LIGHTING_STYLES.find(l => l.name === preset.lightingName) || LIGHTING_STYLES[0];
  const angle = ANGLES.find(a => a.name === preset.angle) || ANGLES[0];
  const dof = DEPTHS_OF_FIELD.find(d => d.name === preset.depthOfFieldName) || DEPTHS_OF_FIELD[0];

  // 4. Mapeamento da Matriz de Prompting (AI-SUITE SOTA)
  
  const layer1_Subject = `[SUJEITO DETALHADO E ESTADO DO ALIMENTO]: MANTENHA A GEOMETRIA E A VERDADE INALIENÁVEL DO PRODUTO original ("${foodPreset.name}"). Isole perfeitamente o alimento da imagem fornecida, mantendo suas irregularidades, texturas orgânicas, crostas, brilho de gordura natural, queijos derretidos de forma caótica e imperfeições estruturais. A comida real física do cliente NÃO pode ser substituída por uma versão irreal idealizada.`;
  
  const layer2_Lighting = `[CONFIGURAÇÃO DE ESTÚDIO E FÍSICA DA ILUMINAÇÃO]: ${lighting.name}. Aplique iluminação de estúdio profissional rigorosa. ${lighting.keywords.join(", ")}. Garanta reflexos especulares sutis e contidos nas superfícies úmidas (molhos, carnes, caldos) e mapeamento de sombras denso e preciso.`;
  
  const layer3_Composition = `[COMPOSIÇÃO CÊNICA, FUNDO E ÂNGULO]: Perspectiva rigorosa em ${angle.name}, profundidade de campo ${dof.name} simulando lente fotográfica luminosa (ex: f/2.8 ou f/4). O alimento repousa exclusivamente sobre: ${styleEnv.sceneDescription}. ${styleEnv.extraKeywords.join(", ")}. SUBSTITUA INTEGRALMENTE e apague completamente a pia, bancada suja, azulejos, azulejo esverdeado, chapa ou embalagens originais amadoras por este novo fundo de estúdio de altíssimo padrão.`;
  
  const layer4_Rendering = `[ATRIBUTOS DE QUALIDADE FOTOGRÁFICA E RENDERIZAÇÃO]: Fotorrealismo absoluto, ultra-detalhado, resolução 8K, iluminação volumétrica, estilo comercial de publicidade de alimentos de alto orçamento, correção de cores profissional (color grading avançado). Câmera emulada: ${camera.name}, ${camera.keywords.join(", ")}.`;
  
  const layer5_Negative = `[PROMPTS NEGATIVOS / CONDIÇÃO CRÍTICA]: REMOVA ATIVAMENTE: mãos humanas, dedos desproporcionais, talheres flutuantes no ar, ingredientes extras espalhados aleatoriamente que não estão no prato original, textos em qualquer idioma, logomarcas inventadas, marcas d'água, texturas embaçadas, distorções geométricas severas, aspecto de plástico, brilho cgi irreal, fundos caseiros, mesa de fórmica suja, ambiente original amador da foto fonte.`;

  return `TASK: IMAGE-TO-IMAGE PROFESSIONAL FOOD PHOTOGRAPHY INPAINTING & RECOMPOSITION.

Atue como um Restaurador Digital e Diretor de Arte de Gastronomia de Elite. Sua tarefa é aplicar o workflow híbrido: extrair cirurgicamente o alimento principal da foto amadora do cliente e recriar o ambiente fotográfico ao redor dele em nível de publicidade comercial (iFood premium).

${layer1_Subject}

${layer2_Lighting}

${layer3_Composition}

${layer4_Rendering}

${layer5_Negative}

DIRETRIZ DE REALISMO ABSOLUTO (ANTI UNCANNY VALLEY):
${PHOTOGRAPHIC_REALISM_DIRECTIVE}`;
}

export function buildCopywritingPrompt(foodType: string, visualStyle: string): string {
  const foodPreset = FOOD_PRESETS.find(p => p.id === foodType) || FOOD_PRESETS[0];
  const foodLabel = foodPreset.name;

  return `Você é um Diretor de Arte e Copywriter Senior especialista em Neuromarketing Gastronômico para Delivery (iFood, Instagram).

TAREFA: Gere 3 textos estratégicos para vender este prato de "${foodLabel}" com estilo visual "${visualStyle}".

FORMATO DE SAÍDA (JSON estrito, SEM markdown, SEM explicações):
{
  "legenda": "...",
  "story": "...",
  "emocional": "..."
}

REGRAS DE CONTEÚDO:
1. "legenda" (Legenda Curta para Instagram/iFood): Foco em apetite appeal, emojis estratégicos, hashtags discretas. Max 220 chars.
2. "story" (Texto para Story - Direto e Urgência): Curto, impactante, call-to-action forte ("Clique no link", "Peça agora"), emojis de movimento/fome. Max 180 chars.
3. "emocional" (Descritivo Emocional): Foco no cheiro, na textura, na experiência sensorial, palavras que dão água na boca (crocante, suculento, derretendo). Max 350 chars.

Linguagem: PT-BR coloquial, "trincheira" (fala direto com o cliente faminto). 
NÃO mencione preço ou promoções genéricas. Foque na QUALIDADE do produto "${foodLabel}".`;
}

export function getAspectRatioForFood(foodType: string): string {
  const foodPreset = FOOD_PRESETS.find(p => p.id === foodType);
  return foodPreset?.preset.aspectRatio || "1:1";
}
