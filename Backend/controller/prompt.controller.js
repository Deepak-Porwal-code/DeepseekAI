import { GoogleGenAI } from "@google/genai";
import { Prompt } from "../model/prompt.model.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

export const sendPrompt = async (req, res) => {
  const { content } = req.body;
  const userId = req.userId; 

  if (!content || content.trim() === "") {
    return res.status(400).json({ errors: "Prompt content is required" });
  }

  try {
    await Prompt.create({ userId , role: "user", content });

const structuredPrompt = `
You are a friendly and knowledgeable assistant.
Explain the following topic clearly and naturally, as if you are teaching someone who wants to learn.
Use simple language and provide examples where useful.
Avoid just listing facts; instead, write full paragraphs like a helpful tutor.

Topic: ${content}
`;  

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: structuredPrompt,
    });

    const aicontent = response.text;

 
    await Prompt.create({
      role: "assistant",
      content: aicontent,
      userId
    });

 
    return res.status(200).json({
      prompt: content,
      reply: aicontent,
      response: aicontent, 
    });
  } catch (error) {
    console.error("Error in prompt:", error);
    return res
      .status(500)
      .json({ error: "Something went wrong with the AI response" });
  }
};
