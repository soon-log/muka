
import { GoogleGenAI, Type } from "@google/genai";
import { Song } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const searchMusic = async (query: string): Promise<Song[]> => {
  if (!query) return [];

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Search for music related to: "${query}". Return a list of 5 popular songs.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              artist: { type: Type.STRING },
            },
            required: ["id", "title", "artist"]
          }
        }
      }
    });

    const results = JSON.parse(response.text);
    return results.map((item: any) => ({
      ...item,
      albumCover: `https://picsum.photos/seed/${encodeURIComponent(item.title)}/400/400`
    }));
  } catch (error) {
    console.error("Music search failed", error);
    // Fallback mock data if API fails or isn't set up
    return [
      { id: '1', title: 'Banana Pancakes', artist: 'Jack Johnson', albumCover: 'https://picsum.photos/seed/banana/400/400' },
      { id: '2', title: 'Sunday Morning', artist: 'Maroon 5', albumCover: 'https://picsum.photos/seed/sunday/400/400' },
      { id: '3', title: 'Better Together', artist: 'Jack Johnson', albumCover: 'https://picsum.photos/seed/together/400/400' },
      { id: '4', title: 'Super Shy', artist: 'NewJeans', albumCover: 'https://picsum.photos/seed/shy/400/400' },
    ];
  }
};
