import React, { useState, useEffect } from 'react';
import './App.css';
import ReactMarkdown from 'react-markdown';
import BIG_AI_Logo from './BIG_AI_Logo111.png'

const { 
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
 } = require("@google/generative-ai");

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState('');

  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  const safetySetting = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    }
  ];

  const handleSearch = async () => {
    const parts = [
      {text: "input: "},
      {text: `output: ${process.env.REACT_APP_PROMPT}`},
      {text: `input: ${searchQuery}`},
      {text: "output: "},
    ];

    try {
      const result = await model.generateContent({
        contents: [{ role: "user", parts }],
        generationConfig,
        // safetySetting
      });

      setSearchResult(result.response.text());
    } catch (error) {
      console.error("Error generating content:", error);
      setSearchResult("An error occurred while generating content.");
    }
  };

  return (
    <div className="app">
      <header>
        <nav>
          <button className="sign-in-button">Sign in</button>
        </nav>
      </header>
      
      <main>
        <img 
          src={BIG_AI_Logo} 
          alt="BIG_AI_Logo" 
          // className="logo"
        />
        <div className="search-container">
          <input 
            type="text" 
            className="search-input" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="search-buttons">
            <button onClick={handleSearch}>Generate Business Idea</button>
          </div>
        </div>
        {searchResult && (
          <div className="generated-result">
            <h2>BIG AI's Response:</h2>
            <p><ReactMarkdown>{searchResult}</ReactMarkdown></p>
          </div>
        )}
      </main>
      
      <footer>
        <div className="footer-left">
          <a href="#">BIG AI can make mistakes. Please double-check responses.</a>
        </div>
        <div className="footer-right">
          <a href="#">Business Idea Generator (BIG AI) is powered by Google's Gemini</a>
        </div>
      </footer>
    </div>
  );
}

export default App;