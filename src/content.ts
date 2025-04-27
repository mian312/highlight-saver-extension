// Very simple content script to verify it's loading
console.log('CONTENT SCRIPT LOADED - TEST');

// Create a visible element to confirm the script is running
const testElement = document.createElement('div');
// testElement.style.position = 'fixed';
// testElement.style.top = '10px';
// testElement.style.right = '10px';
// testElement.style.backgroundColor = 'red';
// testElement.style.color = 'white';
// testElement.style.padding = '10px';
// testElement.style.zIndex = '10000';
// testElement.style.borderRadius = '5px';
// testElement.textContent = 'Content Script Active';
document.body.appendChild(testElement);

// Text highlighting functionality
document.addEventListener('mouseup', (event) => {
  // Don't show the button if we're clicking on the button itself
  if ((event.target as Element).classList.contains('highlight-save-button')) {
    return;
  }

  const selection = window.getSelection();
  const selectedText = selection?.toString().trim();
  
  // Remove any existing highlight buttons first
  const existingButtons = document.querySelectorAll('.highlight-save-button');
  existingButtons.forEach(btn => {
    if (document.body.contains(btn)) {
      document.body.removeChild(btn);
    }
  });
  
  if (selectedText && selectedText.length > 0) {
    // Create highlight button
    const button = document.createElement('button');
    button.textContent = 'Save Highlight';
    button.style.position = 'absolute';
    button.style.zIndex = '10000';
    button.style.backgroundColor = '#4285f4';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '4px';
    button.style.padding = '5px 10px';
    button.style.cursor = 'pointer';
    button.className = 'highlight-save-button';
    
    // Position the button near the selection
    const range = selection?.getRangeAt(0);
    const rect = range?.getBoundingClientRect();
    if (rect) {
      button.style.top = `${window.scrollY + rect.bottom + 5}px`;
      button.style.left = `${window.scrollX + rect.left}px`;
    }
    
    // Add click handler to save the highlight
    button.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      chrome.runtime.sendMessage({
        action: 'saveHighlight',
        data: {
          text: selectedText,
          url: window.location.href,
          timestamp: Date.now()
        }
      }, (response) => {
        if (response && response.success) {
          console.log('Highlight saved successfully');
          // Remove the button after saving
          if (document.body.contains(button)) {
            document.body.removeChild(button);
          }
        } else {
          console.error('Failed to save highlight:', response);
        }
      });
      
      return false;
    };
    
    document.body.appendChild(button);
    
    // Remove button when clicking elsewhere
    const removeButtonHandler = (e: MouseEvent) => {
      if (e.target !== button) {
        if (document.body.contains(button)) {
          document.body.removeChild(button);
        }
        document.removeEventListener('mousedown', removeButtonHandler);
      }
    };
    
    document.addEventListener('mousedown', removeButtonHandler);
  }
});

// Send a message to the background script to verify communication
chrome.runtime.sendMessage(
  { action: 'contentScriptLoaded', data: { timestamp: Date.now() } },
  (response) => {
    console.log('Background script response:', response);
  }
);
