console.log('content script loaded');

// Send the title to the popup when the page loads
chrome.runtime.sendMessage({ action: 'setTitle', title: document.title });

// Add an event listener for mouseup to detect text selection
document.addEventListener('mouseup', function() {
  // Get the selected text
  const selectedText = window.getSelection().toString();

  // If there is selected text, send it to the popup
  if (selectedText) {
    chrome.runtime.sendMessage({ 
      action: 'addSelectedText', 
      selectedText: selectedText 
    });
  }
});
