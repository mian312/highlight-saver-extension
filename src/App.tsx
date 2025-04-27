import { useState, useEffect } from 'react';
import './App.css';

interface Highlight {
  text: string;
  url: string;
  timestamp: number;
  summary?: string;
}

function App() {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSummarizing, setIsSummarizing] = useState<number | null>(null);

  useEffect(() => {
    console.log('App component mounted, fetching highlights...');
    
    try {
      chrome.storage.local.get({ highlights: [] }, (data: { highlights: Highlight[] }) => {
        if (chrome.runtime.lastError) {
          console.error('Error retrieving highlights:', chrome.runtime.lastError);
          return;
        }
        
        console.log('Retrieved highlights from storage:', data.highlights);
        setHighlights(data.highlights || []);
        setIsLoading(false);
      });
    } catch (error) {
      console.error('Exception in useEffect:', error);
      setIsLoading(false);
    }
  }, []);

  const deleteHighlight = (timestamp: number) => {
    chrome.storage.local.get({ highlights: [] }, (data: { highlights: Highlight[] }) => {
      const updatedHighlights = data.highlights.filter(
        (highlight) => highlight.timestamp !== timestamp
      );
      chrome.storage.local.set({ highlights: updatedHighlights });
      setHighlights(updatedHighlights);
    });
  };

  const summarizeHighlight = (timestamp: number) => {
    setIsSummarizing(timestamp);
    
    const highlight = highlights.find(h => h.timestamp === timestamp);
    if (!highlight) return;
    
    chrome.runtime.sendMessage({
      action: 'summarizeHighlight',
      data: { text: highlight.text }
    }, (response) => {
      if (response && response.success) {
        const updatedHighlights = highlights.map(h => {
          if (h.timestamp === timestamp) {
            return { ...h, summary: response.summary };
          }
          return h;
        });
        
        chrome.storage.local.set({ highlights: updatedHighlights });
        setHighlights(updatedHighlights);
      } else {
        console.error('Failed to summarize:', response);
      }
      setIsSummarizing(null);
    });
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const extractDomain = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return url;
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your highlights...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Highlight Saver</h1>
        <span className="highlight-count">
          {highlights.length} {highlights.length === 1 ? 'highlight' : 'highlights'} saved
        </span>
      </header>

      <main className="main-content">
        {highlights.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h2>No highlights saved yet</h2>
            <p>Highlight text on any webpage to get started</p>
          </div>
        ) : (
          <div className="highlights-list">
            {highlights
              .sort((a, b) => b.timestamp - a.timestamp)
              .map((highlight) => (
                <div key={highlight.timestamp} className="highlight-card">
                  <div className="highlight-meta">
                    <span className="highlight-date">{formatDate(highlight.timestamp)}</span>
                    <a 
                      href={highlight.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="highlight-source"
                    >
                      {extractDomain(highlight.url)}
                    </a>
                  </div>
                  <blockquote className="highlight-text">{highlight.text}</blockquote>
                  
                  {highlight.summary && (
                    <div className="highlight-summary">
                      <h4>Summary:</h4>
                      <p>{highlight.summary}</p>
                    </div>
                  )}
                  
                  <div className="highlight-actions">
                    {isSummarizing === highlight.timestamp ? (
                      <button className="summarize-button loading" disabled>
                        Summarizing...
                      </button>
                    ) : (
                      <button 
                        className="summarize-button"
                        onClick={() => summarizeHighlight(highlight.timestamp)}
                        disabled={!!highlight.summary}
                      >
                        {highlight.summary ? 'Summarized' : 'Summarize'}
                      </button>
                    )}
                    <button 
                      className="delete-button"
                      onClick={() => deleteHighlight(highlight.timestamp)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            }
          </div>
        )}
      </main>
      <footer className="app-footer">
        Made with ❤️ to enhance your reading experience
      </footer>
    </div>
  );
}

export default App;
