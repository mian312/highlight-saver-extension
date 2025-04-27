// src/background.ts
console.log('Background script loaded');

// Define the Highlight interface
interface Highlight {
  text: string;
  url: string;
  timestamp: number;
}

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
});
