import { GoogleGenAI } from "@google/genai";
import { VertexAI } from "@google-cloud/vertexai";

const PRIMARY_KEY = process.env.GEMINI_API_KEY || "";
const FALLBACK_KEY = process.env.GEMINI_FALLBACK_KEY || "";
const GCP_PROJECT_ID = process.env.GCP_PROJECT_ID || "";
const GCP_LOCATION = "us-central1";

function getAI(useFallback = false) {
  const apiKey = useFallback ? FALLBACK_KEY : PRIMARY_KEY;
  return new GoogleGenAI({ apiKey });
}

export function getVertexAI(): VertexAI | null {
  if (!GCP_PROJECT_ID) return null;
  return new VertexAI({
    project: GCP_PROJECT_ID,
    location: GCP_LOCATION,
  });
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

export interface UnifiedAIResponse {
  text: () => string;
  usageMetadata?: any;
  candidates?: any[];
  [key: string]: any;
}

export async function generateContentUnified(modelName: string, prompt: string, imageBase64?: string, mimeType?: string, aspectRatio?: string): Promise<UnifiedAIResponse> {
  const vertex = getVertexAI();
  
  if (vertex) {
    try {
      console.log(`🚀 Using Vertex AI for ${modelName}`);
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
          // @ts-ignore
          aspectRatio: aspectRatio,
          responseModalities: ["image", "text"],
        }
      });
      
      return {
        ...result.response,
        // Force bypass SDK type inconsistencies
        text: () => {
          const resp = result.response as any;
          return typeof resp.text === 'function' ? resp.text() : (resp.text || "");
        },
        candidates: result.response.candidates,
        usageMetadata: result.response.usageMetadata
      };
    } catch (vertexError) {
      console.error("⚠️ Vertex AI failed, falling back to Google AI SDK:", vertexError);
    }
  }

  // Fallback to Google AI SDK (@google/genai style)
  return await withFallback(async (ai) => {
    const parts: any[] = [{ text: prompt }];
    if (imageBase64 && mimeType) {
      parts.unshift({
        inlineData: {
          data: imageBase64,
          mimeType: mimeType,
        },
      });
    }

    const result = await ai.models.generateContent({
      model: modelName,
      contents: [{ role: 'user', parts }],
      config: {
        // @ts-ignore
        aspectRatio: aspectRatio,
        responseModalities: ["image", "text"],
      }
    });

    return {
      ...result,
      text: () => result.text || "",
      candidates: result.candidates,
      usageMetadata: result.usageMetadata
    };
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
