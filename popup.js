// Function to populate time tracker with data
function updateTimeDisplay(timeSpent) {
    const trackerDiv = document.getElementById("time-tracker");
    
    // Clear the existing tracker content
    trackerDiv.innerHTML = ""; 

    // Check if timeSpent is empty before displaying message
    if (Object.keys(timeSpent).length === 0) {
        trackerDiv.innerHTML = "<p>No time tracked yet.</p>";
    } else {
        // Display the time spent on each site
        Object.keys(timeSpent).forEach(site => {
            const siteDiv = document.createElement("div");
            siteDiv.className = "site-time";
            siteDiv.textContent = `${site}: ${timeSpent[site]} minutes`;

            // Create a delete button for the site
            const deleteBtn = document.createElement("button");
            deleteBtn.className = "delete-btn"; // Add a class for styling
            deleteBtn.textContent = "X"; // Set "X" as button text
            deleteBtn.addEventListener("click", () => {
                deleteSite(site);
            });

            siteDiv.appendChild(deleteBtn);
            trackerDiv.appendChild(siteDiv);
        });
    }
}

// Fetch time spent from storage and update the display when the popup opens
chrome.storage.local.get("timeSpent", (data) => {
    updateTimeDisplay(data.timeSpent || {});
});

// Reset time spent when the reset button is clicked
document.getElementById("reset-btn").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "resetTime" }, (response) => {
        if (response.status === "reset") {
            // After reset, fetch the time again to display updated tracker
            chrome.storage.local.get("timeSpent", (data) => {
                updateTimeDisplay(data.timeSpent || {});
            });
        }
    });
});

// Add a custom site and threshold when the add site button is clicked
document.getElementById("add-site-btn").addEventListener("click", () => {
    const newSite = document.getElementById("new-site").value;
    const threshold = parseInt(document.getElementById("time-threshold").value) * 60; // Convert to seconds

    if (newSite && threshold) {
        chrome.storage.local.get(["customSites", "customThresholds", "timeSpent"], (data) => {
            const customSites = data.customSites || [];
            const customThresholds = data.customThresholds || {};
            const timeSpent = data.timeSpent || {};

            // Add site and threshold to the lists
            customSites.push(newSite);
            customThresholds[newSite] = threshold;

            // Initialize timeSpent for the new site (if not already tracked)
            if (!timeSpent[newSite]) {
                timeSpent[newSite] = 0; // Initialize with 0 minutes
            }

            // Store updated custom sites, thresholds, and timeSpent
            chrome.storage.local.set({
                customSites,
                customThresholds,
                timeSpent
            }, () => {
                alert("Custom site added!");

                // After adding, immediately update the time tracker display with new data
                updateTimeDisplay(timeSpent); // Pass updated timeSpent
            });
        });
    }
});

// Delete a site from the tracker
function deleteSite(site) {
    chrome.storage.local.get(["customSites", "customThresholds", "timeSpent"], (data) => {
        const customSites = data.customSites || [];
        const customThresholds = data.customThresholds || {};
        const timeSpent = data.timeSpent || {};

        // Remove site from customSites, customThresholds, and timeSpent
        const index = customSites.indexOf(site);
        if (index > -1) {
            customSites.splice(index, 1); // Remove from customSites
            delete customThresholds[site]; // Remove from customThresholds
            delete timeSpent[site]; // Remove from timeSpent
        }

        // Store the updated values
        chrome.storage.local.set({
            customSites,
            customThresholds,
            timeSpent
        }, () => {
            alert(`${site} deleted!`);

            // After deletion, update the time tracker display
            updateTimeDisplay(timeSpent);
        });
    });
}
