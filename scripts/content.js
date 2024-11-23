// Set a key to store time spent on this website
const SITE_KEY = window.location.hostname;

// Function to show a reminder
function showReminder() {
  alert("You've met your time limit on this site!");
}

// Retrieve time spent from Chrome storage
chrome.storage.local.get([SITE_KEY], (result) => {
  let timeSpent = result[SITE_KEY] || 0;

  // Increment time every second
  setInterval(() => {
    timeSpent++;
    
    // Save updated time in storage
    chrome.storage.local.set({ [SITE_KEY]: timeSpent });

    // Show reminder if time exceeds 10 minutes (600 seconds)
    if (timeSpent % 15 === 0) {
      showReminder();
    }
  }, 1000);
});