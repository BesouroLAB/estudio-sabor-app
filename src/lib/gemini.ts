import { GoogleGenAI } from "@google/genai";

const PRIMARY_KEY = process.env.GEMINI_API_KEY || "";
const FALLBACK_KEY = process.env.GEMINI_FALLBACK_KEY || "";

let primaryInstance: GoogleGenAI | null = null;
let fallbackInstance: GoogleGenAI | null = null;

function getAI(useFallback = false): GoogleGenAI {
  if (useFallback) {
    if (!fallbackInstance) fallbackInstance = new GoogleGenAI({ apiKey: FALLBACK_KEY });
    return fallbackInstance;
  }
  if (!primaryInstance) primaryInstance = new GoogleGenAI({ apiKey: PRIMARY_KEY });
  return primaryInstance;
}

export async function withFallback<T>(operation: (ai: GoogleGenAI) => Promise<T>): Promise<T> {
  try {
    return await operation(getAI(false));
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : JSON.stringify(err);
    const isQuota = errMsg.includes("429");
    if (isQuota && FALLBACK_KEY) {
      console.warn("⚠️ Primary quota exceeded. Switching to fallback key...");
      return await operation(getAI(true));
    }
    throw err;
  }
}

// ================================================================
// PHOTOGRAPHIC REALISM DIRECTIVE — Ported from legacy app
// ================================================================
export const PHOTOGRAPHIC_REALISM_DIRECTIVE = `
**PHOTOGRAPHIC REALISM (MANDATORY — APPLIES TO EVERY GENERATION):**

DE-AI PROCESSING (HIGH PRIORITY): 
- ACTIVELY REMOVE the "AI look" (over-saturation, plastic/rubbery textures, and mathematically perfect lighting).
- DESATURATE colors slightly to match real-world pigment behavior. 
- REDUCE CONTRAST to avoid the "HDR/CGI" look; shadows should have natural detail, not crushed blacks.
- DESTROY PERFECTION: Add micro-flaws like dust specks, seasoning scatter, uneven sauce drips, and organic plating. 

CAMERA PHYSICS:
- Natural sensor grain is MANDATORY (not digital noise).
- Subtle chromatic aberration and lens falloff (vignette) must be present.
- Sharpness must be "optical", not digital. NO over-sharpening artifacts.

SURFACE AUTHENTICITY:
- Wood: pores, micro-scratches, uneven grain.
- Food: moisture variation (not universal shine), texture diversity.
- Liquid: surface tension, bubbles (if carbonated), realistic viscosity.

ABSOLUTE PROHIBITIONS:
1. ❌ NO "AI SHIMMER" or random sparkles/glows.
2. ❌ NO steam, smoke, or vapor. 
3. ❌ NO plastic/waxy appearance. 
4. ❌ NO perfect symmetry.
5. ❌ NO impossible reflections.

The result must look like a RAW photo developed with a neutral profile, not a digital rendering.
`;
