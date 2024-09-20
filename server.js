const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.use(express.static('public'));

async function getProcessedFlashcards(inputText) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/completions',
      {
        model: 'gpt-4o', 
        prompt: `Here is a long text with questions and answers. Extract and format the questions and answers: ${inputText}`,
        max_tokens: 500,
        temperature: 0.5,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const processedText = response.data.choices[0].text.trim();
    return processedText.split('\n').filter(line => line.trim() !== '');
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
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
