// background.js

const DISTRACTING_SITES = ["facebook.com", "youtube.com", "instagram.com"];
let timeSpent = {};

// Initialize timeSpent for all sites
DISTRACTING_SITES.forEach(site => {
    timeSpent[site] = 0;
});

// Listen for tab updates to detect when a user is on a distracting site
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url) {
        const domain = extractDomain(tab.url);
        if (DISTRACTING_SITES.includes(domain)) {
            startTracking(domain);
        } else {
            stopTracking();
        }
    }
});

// Extract domain from a URL
function extractDomain(url) {
    const urlObj = new URL(url);
    return urlObj.hostname.replace("www.", "");
}

// Start tracking time for a given domain
let activeDomain = null;
function startTracking(domain) {
    if (activeDomain) return; // Already tracking

    activeDomain = domain;
    chrome.alarms.create("trackTime", { delayInMinutes: 1, periodInMinutes: 1 });
}

// Stop tracking time
function stopTracking() {
    activeDomain = null;
    chrome.alarms.clear("trackTime");
}

// Update time spent when the alarm triggers
chrome.alarms.onAlarm.addListener(alarm => {
    if (alarm.name === "trackTime" && activeDomain) {
        timeSpent[activeDomain]++;
        chrome.storage.local.set({ timeSpent });
    }
});

// Reset time spent for all sites
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "resetTime") {
        DISTRACTING_SITES.forEach(site => {
            timeSpent[site] = 0;
        });
        chrome.storage.local.set({ timeSpent }, () => {
            sendResponse({ status: "reset" });
        });
    }
    return true;
});