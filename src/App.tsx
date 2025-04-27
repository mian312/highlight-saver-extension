import { useState, useEffect } from 'react';
import './App.css';

interface Highlight {
  text: string;
  url: string;
  timestamp: number;
}

function App() {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
                  <div className="highlight-actions">
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