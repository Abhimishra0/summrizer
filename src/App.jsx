import { useState } from "react";
import "./App.css";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import logo from "./assets/logo.png"; // Adjust the path to your logo

function App() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [generatingSummary, setGeneratingSummary] = useState(false);

  async function generateSummary(e) {
    e.preventDefault();

    const wordCount = text.trim().split(/\s+/).length;
    if (wordCount < 100) {
      setSummary("Text too short to summarize. Please enter at least 100 words.");
      return;
    }

    setGeneratingSummary(true);
    setSummary("Loading your summary... \n It might take up to 10 seconds");
    
    try {
      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyDRqNDHIjSZ_5CY2cLThkSo76PXVVY8EKg",
        method: "post",
        data: {
          contents: [{ parts: [{ text: text }] }],
        },
      });

      setSummary(
        response["data"]["candidates"][0]["content"]["parts"][0]["text"]
      );
    } catch (error) {
      console.log(error);
      setSummary("Sorry - Something went wrong. Please try again!");
    }

    setGeneratingSummary(false);
  }

  return (
    <>
      <nav className="bg-green-800 p-4 flex justify-between items-center">
        <div className="text-white font-bold text-xl">Cyber Chatter</div>
        <ul className="flex justify-center space-x-4">
          <li><button className="text-white">Home</button></li>
          <li><button className="text-white">About</button></li>
          <li><button className="text-white">Logout</button></li>
        </ul>
        <img src={logo} alt="Logo" className="h-10 w-10 rounded-full" />
      </nav>

      <div className="bg-white h-screen p-3">
        <form
          onSubmit={generateSummary}
          className="w-full md:w-2/3 m-auto text-center rounded bg-gray-50 py-2"
        >
          <a href="https://github.com/Vishesh-Pandey/chat-ai" target="_blank" rel="noopener noreferrer">
            <h1 className="text-3xl text-center">Summarizer</h1>
          </a>
          <textarea
            required
            className="border rounded w-11/12 my-2 min-h-fit p-3"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to summarize"
          ></textarea>
          <button
            type="submit"
            className="bg-blue-300 p-3 rounded-md hover:bg-blue-400 transition-all duration-300"
            disabled={generatingSummary}
          >
            Generate Summary
          </button>
        </form>
        <div className="w-full md:w-2/3 m-auto text-center rounded bg-gray-50 my-1">
          <ReactMarkdown className="p-3">{summary}</ReactMarkdown>
        </div>
      </div>
    </>
  );
}

export default App;
