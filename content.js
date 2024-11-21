// Function to show a reminder
function showReminder() {
  alert("You've spent a lot of time on this site. Consider taking a break!");
}

// Retrieve custom sites and thresholds from Chrome storage
chrome.storage.local.get(["customSites", "timeSpent", "customThresholds"], (result) => {
  const customSites = result.customSites || [];
  const timeSpentOnSite = result.timeSpent && result.timeSpent[window.location.hostname] || 0;
  const threshold = result.customThresholds && result.customThresholds[window.location.hostname] || 600; // Default to 600 seconds if no custom threshold

  // Show reminder if time exceeds threshold
  if (timeSpentOnSite >= threshold && timeSpentOnSite % threshold === 0) {
      showReminder();
  }
});
