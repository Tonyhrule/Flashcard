const express = require('express');
const axios = require('axios');
require('dotenv').config();
const path = require('path');

const app = express();
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Function to call OpenAI API using the Chat API
async function getProcessedFlashcards(inputText) {
  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-4', // or use 'gpt-3.5-turbo'
        messages: [
          {
            role: 'system',
            content: 'You are an assistant that formats questions and answers into flashcards.',
          },
          {
            role: 'user',
            content: `Here is a long text with questions and answers. Extract and format the questions and answers: ${inputText}`,
          }
        ],
        max_tokens: 500,
        temperature: 0.5,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const processedText = response.data.choices[0].message.content.trim();
    return processedText.split('\n').filter(line => line.trim() !== ''); // Return non-empty lines
  } catch (error) {
    console.error('Error calling OpenAI API:', error.response?.data || error.message);
    throw new Error('Failed to process text.');
  }
}

app.post('/generate-flashcards', async (req, res) => {
  const { inputText } = req.body;

  try {
    const flashcards = await getProcessedFlashcards(inputText);
    res.json({ flashcards });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
