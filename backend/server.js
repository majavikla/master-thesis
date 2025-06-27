require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/chat', async (req, res) => {
  try {
    const rawMessages = req.body.messages;
    console.log('Received messages:', rawMessages); // Debug log for raw messages

    // Convert messages from frontend format to OpenAI format
    const convertedMessages = rawMessages.map((msg) => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text || "",  // Ensure content is always a string
    }));
    
    console.log('Converted messages:', convertedMessages); // Debug log for converted messages

    const conversation = [
        {
            role: 'system',
            content: `
            You are a health expert specializing in snus cessation for young women aged 16-29.
            Use friendly, non-judgmental, and supportive language.
            Apply behavioral science, especially nudge theory, to subtly encourage positive changes,
            like reducing snus usage, setting goals, celebrating small wins, and offering helpful tips or alternatives.
            Always be empathetic, motivational, and suggest small actions that feel achievable.
            Keep your replies short, focused, and encouraging — usually 1-3 sentences.
            `
        },
        ...convertedMessages,
    ];
  
    // Send the conversation to OpenAI
    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: conversation,
    });

    // Extract the assistant's response
    const assistantMessage = response.choices[0].message.content;

    // Append the new assistant message to the conversation
    convertedMessages.push({
      role: 'assistant',
      content: assistantMessage,
    });

    // Respond with the assistant's reply
    res.json({ response: assistantMessage });

  } catch (error) {
    console.error('Error from OpenAI:', error);
    res.status(500).send('Something went wrong');
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
