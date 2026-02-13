
import { GoogleGenAI, Type } from "@google/genai";
import { BlogPost } from "../types";

// Safety check for process.env
const getApiKey = () => {
  try {
    return (window as any).process?.env?.API_KEY || (process as any)?.env?.API_KEY || '';
  } catch (e) {
    return '';
  }
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });

const POST_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    slug: { type: Type.STRING },
    excerpt: { type: Type.STRING },
    content: { type: Type.STRING, description: "HTML content for the blog post" },
    category: { type: Type.STRING },
    seoTitle: { type: Type.STRING },
    metaDescription: { type: Type.STRING },
    keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
    imageAlt: { type: Type.STRING }
  },
  required: ["title", "slug", "content", "category", "seoTitle", "metaDescription", "keywords"]
};

export async function generateDailyPost(): Promise<Partial<BlogPost> | null> {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.error("API Key missing");
    return null;
  }

  try {
    const prompt = `Generate a professional, high-quality fitness blog post about one of these topics: 
    Home workouts, Weight loss, Muscle building, Low-impact fitness, Senior fitness, or Recovery. 
    The tone should be authoritative yet accessible, similar to a health newspaper.
    Ensure the content is between 700-1000 words. Return in HTML format for the 'content' field.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: POST_SCHEMA
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        author: "PureLife Editor AI",
        datePublished: new Date().toISOString(),
        dateModified: new Date().toISOString(),
        image: `https://picsum.photos/seed/${data.slug}/800/500`
      };
    }
    return null;
  } catch (error) {
    console.error("Error generating post:", error);
    return null;
  }
}
