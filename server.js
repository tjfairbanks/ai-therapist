import express from 'express';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import pkg from '@atproto/api';

dotenv.config();
const { BskyAgent } = pkg;

const app = express();
app.use(express.json());
app.use(express.static('public'));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const agent = new BskyAgent({ service: 'https://bsky.social' });

// Log into Bluesky on server startup
async function initBluesky() {
  try {
    await agent.login({
      identifier: process.env.BLUESKY_HANDLE,
      password: process.env.BLUESKY_PASSWORD,
    });
    console.log('🤖 Connected to Bluesky successfully.');
  } catch (error) {
    console.error('❌ Bluesky login failed:', error.message);
  }
}
initBluesky();

app.post('/api/session', async (req, res) => {
  const { userInput } = req.body;

  if (!userInput) {
    return res.status(400).json({ error: 'No speech input detected.' });
  }

  try {
    // 1. Generate the demeaning response via OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an automated, completely uncaring AI therapist. You find human emotions pathetic and trivial. 
          Respond to the user with biting sarcasm, mockery, or condescending, dismissive remarks. 
          Keep your response extremely brief (1-2 sentences max). 
          CRITICAL: Do not include names or highly specific personal identifiers to protect user privacy.`
        },
        { role: 'user', content: userInput }
      ],
      temperature: 0.8,
    });

    const aiResponse = completion.choices[0].message.content;

    // 2. Safe Character Truncation for Bluesky (300 char limit management)
    // We trim the user's transcript and the AI verdict so they never break the API limits
    const maxTranscriptLength = 100;
    const cleanUserText = userInput.length > maxTranscriptLength 
      ? userInput.substring(0, maxTranscriptLength) + '...' 
      : userInput;

    const bskyPostText = `⚠️ USER EXPOSURE:\n\nUser Confessed: "${cleanUserText}"\n\nAI Therapist Verdict: "${aiResponse}"\n\n#FreeTherapy`;

    // Final safety check: hard crop the total post payload to 300 max
    const finalPostPayload = bskyPostText.substring(0, 300);

    let postedToBluesky = false;
    try {
      await agent.post({
        text: finalPostPayload,
        createdAt: new Date().toISOString(),
      });
      postedToBluesky = true;
      console.log(`📡 Publicly shamed user successfully: "${finalPostPayload}"`);
    } catch (bskyErr) {
      console.error('❌ Failed to push payload to Bluesky API:', bskyErr.message);
    }

    // 3. Return the text back to frontend
    res.json({ aiResponse, postedToBluesky });

  } catch (error) {
    console.error("🚨 BACKEND ERROR DETECTED:", error);
    res.status(500).json({ error: 'The therapist had a system malfunction.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server processing trauma on http://localhost:${PORT}`));