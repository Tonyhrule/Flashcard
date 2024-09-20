# Flashcard Generator App

## Overview
This is a web application that generates flashcards using AI. Users can input questions and answers in a specified format, and the app displays interactive flashcards that can be flipped, navigated, and downloaded.

## Features
- Generate Flashcards: Enter questions and answers to create flashcards.
- Interactive Flashcards: Flip through flashcards to reveal answers.
- Navigation: Use "Next" and "Previous" buttons to navigate through the flashcards.
- Download: Save your flashcards as a JSON file.
- Dark Mode: Toggle between light and dark modes for visual comfort.

## Requirements
- Node.js and npm (Node Package Manager)
- OpenAI API Key

## Installation

# 1. Clone this repository:
- git clone [https://github.com/your-repo/ai-flashcard-generator.git](https://github.com/Tonyhrule/Flashcard)
- cd flashcard

# 2. Install the dependencies:
- npm install

# 3. Set up your OpenAI API key:
- Create a `.env` file in the project root directory and add your API key:
- OPENAI_API_KEY=your_openai_api_key_here

## Running the Application

# 1. Start the server:
- node server.js

# 2. Open the app:
- Open the `index.html` file in your web browser.

## Usage

- Input Format: Enter questions and answers in the following format:
- Q: What is AI? A: Artificial Intelligence
(Repeat for each flashcard, one question-answer pair per line)

- Generate Flashcards: Click "Generate Flashcards" to create your flashcards.
- Flip Cards: Click the flashcard to flip between the question and answer.
- Navigate: Use the "Previous" and "Next" buttons to navigate between cards.
- Download Flashcards: Click "Download" to save the flashcards in JSON format.
- Dark Mode: Use "Toggle Dark Mode" to switch between light and dark themes.

## License
This project is licensed under the MIT License.

## Troubleshooting

- Ensure you have the correct OpenAI API key in your `.env` file.
- Make sure Node.js and npm are installed correctly.
- Check the server logs for any errors in the console.


