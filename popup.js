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