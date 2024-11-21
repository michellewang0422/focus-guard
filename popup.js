// Populate the time tracker with data
function updateTimeDisplay(timeSpent) {
    const trackerDiv = document.getElementById("time-tracker");
    trackerDiv.innerHTML = ""; // Clear existing content

    Object.keys(timeSpent).forEach(site => {
        const siteDiv = document.createElement("div");
        siteDiv.className = "site-time";
        siteDiv.textContent = `${site}: ${timeSpent[site]} minutes`;
        trackerDiv.appendChild(siteDiv);

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

// Fetch time spent from storage and update display
chrome.storage.local.get("timeSpent", (data) => {
    updateTimeDisplay(data.timeSpent || {});
});

// Reset time spent for all sites to 0
document.getElementById("reset-btn").addEventListener("click", () => {
    chrome.storage.local.get("timeSpent", (data) => {
        const timeSpent = data.timeSpent || {};
        Object.keys(timeSpent).forEach(site => {
            timeSpent[site] = 0; // Reset time for each site
        });

        // Update storage with reset time
        chrome.storage.local.set({ timeSpent }, () => {
            updateTimeDisplay(timeSpent);
        });
    });
});

// Add a new site to the list
document.getElementById("add-site-btn").addEventListener("click", () => {
    const newSite = document.getElementById("new-site").value.trim();
    const timeThreshold = document.getElementById("time-threshold").value.trim();

    if (newSite && timeThreshold && !isNaN(timeThreshold)) {
        chrome.storage.local.get("timeSpent", (data) => {
            const timeSpent = data.timeSpent || {};
            if (!timeSpent[newSite]) {
                // Initialize time spent for the new site
                timeSpent[newSite] = 0;

                // Update storage with the new site
                chrome.storage.local.set({ timeSpent }, () => {
                    updateTimeDisplay(timeSpent);
                    // Optionally, clear input fields after adding the site
                    document.getElementById("new-site").value = "";
                    document.getElementById("time-threshold").value = "";
                });
            } else {
                alert("This site is already being tracked.");
            }
        });
    } else {
        alert("Please enter a valid site URL and time threshold.");
    }
});

// Delete a specific site
function deleteSite(site) {
    chrome.storage.local.get("timeSpent", (data) => {
        const timeSpent = data.timeSpent || {};
        delete timeSpent[site]; // Remove the site from the list

        // Update storage and re-render the display
        chrome.storage.local.set({ timeSpent }, () => {
            updateTimeDisplay(timeSpent);
        });
    });
}



/*
// Populate the time tracker with data
function updateTimeDisplay(timeSpent) {
    const trackerDiv = document.getElementById("time-tracker");
    trackerDiv.innerHTML = ""; // Clear existing content

    Object.keys(timeSpent).forEach(site => {
        const siteDiv = document.createElement("div");
        siteDiv.className = "site-time";
        siteDiv.textContent = `${site}: ${timeSpent[site]} minutes`;
        trackerDiv.appendChild(siteDiv);

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

// Fetch time spent from storage and update display
chrome.storage.local.get("timeSpent", (data) => {
    updateTimeDisplay(data.timeSpent || {});
});

// Reset time spent when button is clicked
document.getElementById("reset-btn").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "resetTime" }, (response) => {
        if (response.status === "reset") {
            updateTimeDisplay({});
        }
    });
});
*/