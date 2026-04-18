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
  // 1. Resolve the Base Preset (from 20 options)
  const foodPreset = FOOD_PRESETS.find(p => p.id === config.foodType) || FOOD_PRESETS.find(p => p.id === "brasileira")!;
  const { preset } = foodPreset;

  // 2. Resolve Visual Style Environment
  const styleEnv = STYLE_ENVIRONMENTS[config.visualStyle] || STYLE_ENVIRONMENTS["rustico"];

  // 3. Resolve Technical Photography Tokens
  const camera = CAMERAS.find(c => c.name === preset.cameraName) || CAMERAS[0];
  
  // Use Style-specific lighting if available, else fallback to Preset lighting
  const resolvedLightingName = styleEnv.lightingName || preset.lightingName;
  const lighting = LIGHTING_STYLES.find(l => l.name === resolvedLightingName) || LIGHTING_STYLES.find(l => l.name === preset.lightingName) || LIGHTING_STYLES[0];
  
  const angle = ANGLES.find(a => a.name === preset.angle) || ANGLES[0];
  const dof = DEPTHS_OF_FIELD.find(d => d.name === preset.depthOfFieldName) || DEPTHS_OF_FIELD[0];

  // 4. Combine Keywords
  const allKeywords = [
    "professional food photography", "ultra realistic", "high detail",
    "appetizing", "gourmet aesthetic", "subtle imperfections",
    "natural textures", "slight film grain", "culinary accuracy",
    "culturally authentic plating", "realistic plating", "authentic food styling",
    ...camera.keywords,
    ...lighting.keywords,
    ...angle.keywords,
    ...dof.keywords,
    ...styleEnv.extraKeywords,
  ].join(", ");

  const allNegativeKeywords = [
    "blurry", "disfigured", "deformed", "cartoon", "3d render",
    "illustration", "painting", "ugly", "bad quality", "bad proportions",
    "unrealistic", "plastic look", "waxy", "soggy", "unnatural gloss",
    "fake cgi smoke", "cartoonish steam", "illogical composition",
    "unrealistic plating", "floating food", "mixed cuisines",
    ...camera.negative_keywords,
    ...lighting.negative_keywords,
    ...angle.negative_keywords,
    ...dof.negative_keywords,
  ].join(", ");

  return `TASK: Professional Food Photography — Background Replacement & Environment Swap.

**REQUESTED ENVIRONMENT:** "${styleEnv.sceneDescription}"
**REQUESTED CAMERA:** ${camera.name}
**REQUESTED LIGHTING:** ${lighting.name}
**REQUESTED ANGLE:** ${angle.name}
**TECHNICAL STYLE KEYWORDS:** ${allKeywords}

**CRITICAL RULES FOR RECOMPOSITION:**
1. **SUBJECT PRESERVATION:** The main food object MUST be preserved visually — its core ingredients, shape, textures, and style MUST remain intact.
2. **STRICT ANGLE COMPLIANCE (MANDATORY):** Render from the EXACT camera angle: "${angle.name}". If the original was shot from a different angle, logically rotate the camera perspective to perfectly match.
3. **ENVIRONMENT CREATION:** Produce the exact environment: "${styleEnv.sceneDescription}". Background, table, plates, and props must match this description perfectly.
4. **STRICT LIGHTING COMPLIANCE:** Apply "${lighting.name}". Shadows and highlights MUST match this setup, overriding the original light.
5. **NO "BEAUTIFYING":** Keep the food's authentic appearance — crumbs, irregular textures, organic imperfections. Do not make it look like perfectly symmetrical plastic.

${PHOTOGRAPHIC_REALISM_DIRECTIVE}

**PROMPT NEGATIVO (O QUE EVITAR):**
${allNegativeKeywords}

**EXECUTION:**
Render this food in the new environment using ONLY the EXACT specified camera angle (${angle.name}) and lighting (${lighting.name}). Failure to adopt the specified angle is unacceptable.`;
}

export function buildCopywritingPrompt(foodType: string, visualStyle: string): string {
  const foodPreset = FOOD_PRESETS.find(p => p.id === foodType) || FOOD_PRESETS[0];
  const foodLabel = foodPreset.name;

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
  const foodPreset = FOOD_PRESETS.find(p => p.id === foodType);
  return foodPreset?.preset.aspectRatio || "1:1";
}
