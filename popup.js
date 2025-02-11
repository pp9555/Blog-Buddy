chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'setTitle') {
      const noteText = document.getElementById('noteText');
      const existingText = noteText.value;
      noteText.value = request.title + '\n\n' + existingText; 
    } else if (request.action === 'addSelectedText') {
      const noteText = document.getElementById('noteText');
      const existingText = noteText.value;
      noteText.value = existingText + request.selectedText + '\n';
    }
  });
  
  
  document.addEventListener('DOMContentLoaded', function() {
    // Load existing notes when the popup is opened
    try {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        const currentTab = tabs[0];
        const currentUrl = currentTab.url;      
        chrome.storage.sync.get([currentUrl + '_notes', 'notePrefix'], function(result) {
          const notePrefix = result.notePrefix || '';
          const existingNotes = result[currentUrl + '_notes'] || ''; 
          
          document.getElementById('noteText').value = existingNotes;
  
          // Prepend notePrefix to the textarea if it's empty and notePrefix exists
          if (document.getElementById('noteText').value === '' && notePrefix) {
            document.getElementById('noteText').value = notePrefix;
          } 
        });
      });
    } catch (error) {
      console.error('Error loading notes:', error);
      displayErrorMessage(error.message);
    }
  
    // Save note button functionality
    document.getElementById('saveNote').addEventListener('click', function() {
      saveNote();
    });
  
    function saveNote() {
      try {
        const noteText = document.getElementById('noteText').value;
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          const currentUrl = tabs[0].url;
  
          chrome.storage.sync.get(currentUrl + '_notes', function(data) {
            let existingNotes = data[currentUrl + '_notes'] || '';
  
            // If there are existing notes, prepend a new line before the new note
            const updatedNotes = existingNotes ? existingNotes + '\n\n' + noteText : noteText;
  
            chrome.storage.sync.set({ [currentUrl + '_notes']: updatedNotes }, function() {
              console.log('Note saved for ' + currentUrl);
            });
          });
        });
      } catch (error) {
        console.error('Error saving note:', error);
        displayErrorMessage(error.message);
      }
    }  
  
    const clearNoteButton = document.getElementById('clearNote');
    clearNoteButton.addEventListener('click', function() {
      try {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          const currentTab = tabs[0];
          const currentUrl = currentTab.url;       
          chrome.storage.sync.remove(currentUrl + '_notes', function() {
            console.log('Note cleared for ' + currentUrl);
            document.getElementById('noteText').value = ''; 
          });
        });
      } catch (error) {
        console.error('Error clearing note:', error);
        displayErrorMessage(error.message);
      }
    });
  
  });
  
  function displayErrorMessage(message) {
    const errorMessageDiv = document.getElementById('errorMessage');
    if (!errorMessageDiv) {
      const errorDiv = document.createElement('div');
      errorDiv.id = 'errorMessage';
      errorDiv.textContent = message;
      errorDiv.style.color = 'red';
      document.body.appendChild(errorDiv);
    }
    document.getElementById('errorMessage').innerHTML = message;
  }
  
  // Keyboard shortcut functionality (Ctrl+S)
  chrome.commands.onCommand.addListener(function(command) {
    if (command === 'save-note') {
      // Simulate a click on the save button
      saveNote(); 
    }
  });
  
  
  