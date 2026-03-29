import express from 'express';
import User from '../models/User.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Mathematically resolve the backend/.env file path regardless of user terminal directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

import { GoogleGenAI } from '@google/genai';

const router = express.Router();

// Fallback to the exact key if dotenv fails completely
const keyToUse = process.env.GEMINI_API_KEY || "AIzaSyCstoYq9mPtEWx6BZK0yi5PTBUJcJI-vKo";
const ai = new GoogleGenAI({ apiKey: keyToUse });

router.post('/generate-roadmap', async (req, res) => {
  const { userId, skills, interests, targetCareer } = req.body;

  if (!userId || !targetCareer) {
    return res.status(400).json({ success: false, message: 'Missing userId or targetCareer in request body' });
  }

  try {
    const prompt = `You are CampusPath AI, a career guidance engine. Provide a step-by-step learning and career roadmap for a student wanting to become a ${targetCareer}.
    Their current skills: ${skills.join(', ') || 'None specified'}. 
    Their interests: ${interests.join(', ') || 'None specified'}.
    Return ONLY a valid JSON array of objects. Do not include markdown formatting or backticks around the JSON.
    Each object must have exactly these keys: "title" (string), "description" (string), "type" (one of: "course", "project", "internship", "other").`;

    let roadmapData;
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      const responseText = response.text;

      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error("Failed to parse AI output as JSON array.");
      }
      roadmapData = JSON.parse(jsonMatch[0]);
    } catch (aiError) {
      console.warn("AI Generation Failed. Using robust fallback roadmap. Error:", aiError.message);
      roadmapData = [
        {
          title: `Foundational Systems for ${targetCareer}`,
          description: `Master the core principles and architecture required for becoming a ${targetCareer}. Focus on expanding your current interests, particularly around ${interests[0] || 'the fundamentals'}.`,
          type: "course"
        },
        {
          title: "Capstone Portfolio Project",
          description: `Leverage your skills in ${skills.join(', ') || 'logic and problem solving'} to create a comprehensive project that demonstrates your ability to solve real-world problems.`,
          type: "project"
        },
        {
          title: "Industry Experience & Networking",
          description: `Apply for an entry-level internship or junior role closely tied to ${targetCareer} to gain practical combat experience and network with senior leaders.`,
          type: "internship"
        },
        {
          title: "Advanced Specialization",
          description: `Deep dive into advanced topics and obtain necessary enterprise certifications to solidify your expertise within the industry network.`,
          type: "course"
        }
      ];
    }

    // Save to DB
    const updatedUser = await User.findByIdAndUpdate(userId, {
      skills, interests, targetCareer, roadmap: roadmapData
    }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found in DB.' });
    }

    return res.json({ success: true, roadmap: updatedUser.roadmap });
  } catch (error) {
    console.error('AI Route Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to generate roadmap', error: error.message });
  }
});

router.post('/chat', async (req, res) => {
  const { userId, message, history } = req.body;
  if (!message) return res.status(400).json({ success: false, message: 'Message is required' });

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Compile context and history into a single robust prompt to avoid strict alternating-role validation crashes
    let promptString = `SYSTEM CONTEXT: You are CampusPath AI, an advanced guidance intelligence. The operator is targeting a career as a ${user.targetCareer}. Current skills: ${user.skills.length > 0 ? user.skills.join(', ') : 'None specified'}. Interests: ${user.interests.join(', ')}. Keep your answers highly advanced, professional, concise, and futuristic. Help them on their specific path.\n\n`;

    if (history && history.length > 0) {
      promptString += `--- PREVIOUS NEURAL UPLINK LOGS ---\n`;
      history.forEach(msg => {
        const actingRole = msg.role === 'model' ? 'CampusPath AI' : 'User';
        promptString += `${actingRole}: ${msg.content}\n`;
      });
      promptString += `-----------------------------------\n\n`;
    }

    promptString += `User: ${message}\nCampusPath AI:`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: promptString
    });
    
    const reply = response.text;

    return res.json({ success: true, reply });
  } catch (error) {
    console.error('Chat Generation Error:', error);

    return res.json({
      success: true,
      reply: `SYSTEM FAILURE: The Google Gemini Server rejected the request. Error Log: "${error.message}". Please verify your API Key is active.`
    });
  }
});

export default router;
