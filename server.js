const express = require('express');
const axios = require('axios');
require('dotenv').config();
const path = require('path');

const app = express();
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

function splitInputText(inputText, maxLength) {
  const parts = inputText.match(new RegExp(`.{1,${maxLength}}`, 'g'));
  return parts || [inputText];
}

async function getProcessedFlashcards(inputText) {
  try {
    const inputChunks = splitInputText(inputText, 1500); // Shorter chunks

    let flashcards = [];

    for (let chunk of inputChunks) {
      const response = await axios.post(
        OPENAI_API_URL,
        {
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are an assistant that formats text into clear question and answer flashcards. Each question is paired with a corresponding answer. No other labels like "Flashcard" should be included. Just use plain "Question" and "Answer."',
            },
            {
              role: 'user',
              content: `Here is a long text with questions and answers. Extract and format the questions and answers: ${chunk}`,
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

      // Log the raw response for debugging
      console.log('Raw API Response:', response.data.choices[0].message.content);

      const processedText = response.data.choices[0].message.content.trim();
      const lines = processedText.split('\n').filter(line => line.trim() !== '');

      if (lines.length < 2) {
        console.warn('Skipping chunk due to insufficient data.');
        continue;
      }

      // Group questions and answers and validate pairs
      for (let i = 0; i < lines.length; i++) {
        const question = lines[i].startsWith('Question:') ? lines[i].replace('Question:', '').trim() : null;
        const answer = lines[i + 1] && lines[i + 1].startsWith('Answer:') ? lines[i + 1].replace('Answer:', '').trim() : null;

        if (question && answer) {
          flashcards.push({ question, answer });
          i++; // Skip the next line since it's already processed
        } else if (question && !answer) {
          console.warn(`Skipping unmatched question: ${question}`);
        } else if (answer && !question) {
          console.warn(`Skipping unmatched answer: ${answer}`);
        }
      }
    }

    if (flashcards.length === 0) {
      throw new Error('No flashcards could be generated.');
    }

    return flashcards;
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
    console.error('Error generating flashcards:', error.message);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
