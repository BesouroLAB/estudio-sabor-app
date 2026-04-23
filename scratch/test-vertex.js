require('dotenv').config({ path: '.env.local' });
const { VertexAI } = require('@google-cloud/vertexai');

async function testVertex() {
  const projectId = process.env.GCP_PROJECT_ID;
  const location = 'us-central1';

  console.log(`🔍 Testing Vertex AI...`);
  console.log(`Project: ${projectId}`);
  console.log(`Key Path: ${process.env.GOOGLE_APPLICATION_CREDENTIALS}`);

  try {
    const vertexAI = new VertexAI({ project: projectId, location: location });
    const model = vertexAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    console.log("🚀 Sending request to Vertex AI...");
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: "Diga 'Olá do Vertex AI' se você estiver funcionando corretamente." }] }],
    });

    const response = await result.response;
    console.log("✅ Success! Response:");
    console.log(response.candidates[0].content.parts[0].text);
  } catch (error) {
    console.error("❌ Vertex AI Test Failed:");
    console.error(error);
  }
}

testVertex();
