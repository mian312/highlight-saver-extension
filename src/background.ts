// src/background.ts
console.log('Background script loaded');

// Define the Highlight interface
interface Highlight {
  text: string;
  url: string;
  timestamp: number;
  summary?: string;
}

// Import OpenAI for Groq API compatibility
import OpenAI from "openai";

// Initialize the OpenAI client with Groq API settings
const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: process.env.GROQ_API_URL || "https://api.groq.com/openai/v1"
});

chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
  
  // Initialize storage with empty highlights array if not already set
  chrome.storage.local.get({ highlights: [] }, (data: { highlights: Highlight[] }) => {
    if (!data.highlights || !data.highlights.length) {
      chrome.storage.local.set({ highlights: [] }, () => {
        console.log('Initialized highlights storage');
      });
    } else {
      console.log('Highlights storage already initialized:', data.highlights);
    }
  });
});

// Function to summarize text using Groq API
async function summarizeText(text: string): Promise<string> {
  try {
    const response = await client.chat.completions.create({
      model: process.env.GROQ_MODEL || "llama3-70b-8192",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that summarizes text concisely in 1-2 sentences."
        },
        {
          role: "user",
          content: `Please summarize the following text in 1-2 sentences:\n\n${text}`
        }
      ],
      temperature: 0.3,
      max_tokens: 100
    });
    
    return response.choices[0].message.content || "Unable to generate summary.";
  } catch (error) {
    console.error('Error summarizing text:', error);
    return "Error generating summary. Please try again.";
  }
}

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Received message:', message, 'from:', sender);
  
  if (message.action === 'contentScriptLoaded') {
    console.log('Content script loaded message received!');
    sendResponse({ success: true, message: 'Background script received your message!' });
    return true;
  }
  
  if (message.action === 'saveHighlight') {
    const highlight = message.data as Highlight;
    
    chrome.storage.local.get({ highlights: [] }, (data: { highlights: Highlight[] }) => {
      const highlights = data.highlights || [];
      highlights.push(highlight);
      
      chrome.storage.local.set({ highlights }, () => {
        console.log('Highlight saved successfully!');
        sendResponse({ success: true });
      });
    });
    
    // Return true to indicate we'll respond asynchronously
    return true;
  }
  
  if (message.action === 'summarizeHighlight') {
    // Handle summarization request
    const { text } = message.data;
    
    // Use async/await with Promise to handle the asynchronous API call
    (async () => {
      try {
        const summary = await summarizeText(text);
        sendResponse({ success: true, summary });
      } catch (error) {
        console.error('Error in summarization:', error);
        sendResponse({ success: false, error: String(error) });
      }
    })();
    
    // Return true to indicate we'll respond asynchronously
    return true;
  }
});
