import { GoogleGenAI } from "@google/genai";
import { VertexAI } from "@google-cloud/vertexai";

const PRIMARY_KEY = process.env.GEMINI_API_KEY || "";
const FALLBACK_KEY = process.env.GEMINI_FALLBACK_KEY || "";
const GCP_PROJECT_ID = process.env.GCP_PROJECT_ID || "";
const GCP_LOCATION = "us-central1"; // Default location for Vertex AI

let primaryInstance: GoogleGenAI | null = null;
let fallbackInstance: GoogleGenAI | null = null;
let vertexInstance: VertexAI | null = null;

function getAI(useFallback = false): GoogleGenAI {
  if (useFallback) {
    if (!fallbackInstance) fallbackInstance = new GoogleGenAI({ apiKey: FALLBACK_KEY });
    return fallbackInstance;
  }
  if (!primaryInstance) primaryInstance = new GoogleGenAI({ apiKey: PRIMARY_KEY });
  return primaryInstance;
}

export function getVertexAI(): VertexAI | null {
  if (!GCP_PROJECT_ID) return null;
  if (!vertexInstance) {
    vertexInstance = new VertexAI({
      project: GCP_PROJECT_ID,
      location: GCP_LOCATION,
    });
  }
  return vertexInstance;
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

/**
 * Unified generation helper that prioritizes Vertex AI (burning GCP credits)
 * and falls back to standard Google AI SDK (API Keys).
 */
export async function generateContentUnified(modelName: string, prompt: string, imageBase64?: string, mimeType?: string, aspectRatio?: string) {
  const vertex = getVertexAI();
  
  if (vertex) {
    try {
      console.log(`🚀 Using Vertex AI for ${modelName} (Project: ${GCP_PROJECT_ID})`);
      const model = vertex.getGenerativeModel({ model: modelName });
      
      const parts: any[] = [{ text: prompt }];
      if (imageBase64 && mimeType) {
        parts.unshift({
          inlineData: {
            data: imageBase64,
            mimeType: mimeType,
          },
        });
      }

      const result = await model.generateContent({
        contents: [{ role: 'user', parts }],
        generationConfig: {
          // @ts-ignore - Some models support aspectRatio in config
          aspectRatio: aspectRatio,
          responseModalities: ["image", "text"],
        }
      });
      
      return result.response;
    } catch (vertexError) {
      console.error("⚠️ Vertex AI failed, falling back to Google AI SDK:", vertexError);
    }
  }

  // Fallback to Google AI SDK
  return await withFallback(async (ai) => {
    const model = ai.getGenerativeModel({ model: modelName });
    const parts: any[] = [{ text: prompt }];
    if (imageBase64 && mimeType) {
      parts.unshift({
        inlineData: {
          data: imageBase64,
          mimeType: mimeType,
        },
      });
    }

    const result = await model.generateContent({
      contents: [{ role: 'user', parts }],
      generationConfig: {
        // @ts-ignore
        aspectRatio: aspectRatio,
        responseModalities: ["image", "text"],
      }
    });
    return result.response;
  });
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
