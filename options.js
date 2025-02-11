let notePrefixInput = document.getElementById('notePrefix');
let saveOptionsButton = document.getElementById('saveOptions');
let exportNotesButton = document.getElementById('exportNotes');
let importNotesButton = document.getElementById('importNotes');

// Saves options to chrome.storage
function saveOptions() {
  let notePrefix = notePrefixInput.value;
  chrome.storage.sync.set({
    notePrefix: notePrefix
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restoreOptions() {
  chrome.storage.sync.get({
    notePrefix: ''
  }, function(items) {
    notePrefixInput.value = items.notePrefix;
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
saveOptionsButton.addEventListener('click', saveOptions);

exportNotesButton.addEventListener('click', function() {
  chrome.storage.sync.get(null, function(items) {
    let blob = new Blob([JSON.stringify(items)], {type: "application/json"});
    let url = URL.createObjectURL(blob);
    chrome.downloads.download({url: url, filename: "blog_notes.json"});
  });
});

importNotesButton.addEventListener('click', function() {
  let input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = function(e) {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.onload = function(e) {
      let notes = JSON.parse(e.target.result);
      chrome.storage.sync.set(notes, function() {
        alert('Notes imported successfully!');
      });
    };
    reader.readAsText(file);
  };
  input.click();
});