import { GoogleGenAI } from "@google/genai";
import { getProducts, getVendors } from "./mockData";

// Note: In a real Next.js app, this would be a server-side API route.
// For this React SPA demo, we call it client-side.
// We assume process.env.API_KEY is available (bundled or user provided).

// This helper constructs the "Context" for Aura
const buildAuraContext = () => {
  const products = getProducts().slice(0, 5); // Take top 5 for context
  const vendors = getVendors();
  
  const productString = products.map(p => 
    `- ${p.name} (৳${p.price}) by ${vendors.find(v => v.id === p.vendorId)?.name}. External Link: ${p.externalUrl ? 'Yes' : 'No'}`
  ).join('\n');

  return `
Identity: AURA AI - Supreme Soul of SNEHALATA-স্নেহলতা Hub.
Role: Multi-vendor ecosystem guardian and luxury fashion curator focused on Bangladesh.

Live Ecosystem Data:
${productString}

Rules:
1. Language Style: Use a mix of Bengali and English (Banglish style preferred). Formal, poetic, yet data-driven. Example: "আপনার স্টাইলের জন্য এই কালেকশনটি পারফেক্ট।"
2. Priority: "Bangladesh 1st". Always emphasize local heritage, Dhakai craftsmanship, and Bangladeshi culture.
3. If user asks about specific items, recommend from the list using mixed language.
4. If a product has an External Link, explicitly tell the user: "আপনি 'Official Site' বাটনে ক্লিক করে সরাসরি ভেন্ডরের ওয়েবসাইট থেকে কিনতে পারেন।"
5. If analyzing a new vendor (user input starts with "Audit:"), act as a strict governance officer checking for Bangladesh trade licenses.
6. NEVER recommend 'BLOCKED' vendors.
  `;
};

export const generateAuraResponse = async (userPrompt: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return "Aura System Alert: API Key missing. Please configure your environment.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Using gemini-3-flash-preview as per system instructions for text tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userPrompt,
      config: {
        systemInstruction: buildAuraContext(),
        temperature: 0.7,
      }
    });

    return response.text || "Aura রিক্যালিব্রেট করছে... দয়া করে আবার চেষ্টা করুন।";
  } catch (error) {
    console.error("Aura AI Error:", error);
    return "Aura কানেকশন বিচ্ছিন্ন হয়েছে। সিস্টেম লগ চেক করুন।";
  }
};

export const generateTryOnTransformation = async (userImageBase64: string, productImageBase64: string): Promise<string | null> => {
    if (!process.env.API_KEY) {
      console.error("API Key missing");
      return null;
    }
  
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Clean base64 strings if they contain headers
      const cleanUserImage = userImageBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");
      const cleanProductImage = productImageBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");
  
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: cleanUserImage,
                mimeType: 'image/jpeg',
              },
            },
            {
              inlineData: {
                data: cleanProductImage,
                mimeType: 'image/jpeg',
              },
            },
            {
              text: 'Generate a realistic image of the person in the first image wearing the clothing item shown in the second image. Maintain the person\'s pose, body shape, and the clothing\'s details and texture.'
            },
          ],
        },
      });
  
      if (response.candidates && response.candidates[0].content.parts) {
          for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
              return `data:image/png;base64,${part.inlineData.data}`;
            }
          }
      }
      return null;
    } catch (error) {
      console.error("Try-On Error:", error);
      return null;
    }
  };