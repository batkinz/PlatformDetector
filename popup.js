// POPUP SCRIPT

import { findCookies } from "./src/utils/tabHelper.js";

/**
 *
 * @param {*} event
 */
async function manualTest() {
  const tab = await getActiveTab();
  const cookies = await findCookies(tab.id);

  const msg = document.getElementById("msg-div");
  msg.innerHTML = "";
  msg.innerHTML += "Domain: " + JSON.stringify(tab?.url) + "<br />";

  if (cookies.length === 0) {
    msg.innerHTML += "<b>No competitor cookies found.</b>";
  }

  cookies.forEach(([service, cookieList]) => {
    const serviceDiv = document.createElement("div");
    serviceDiv.innerHTML = `<strong>${service}</strong>`;

    const cookieDetails = document.createElement("details");
    const summary = document.createElement("summary");
    summary.textContent = "Show Cookies";
    cookieDetails.appendChild(summary);

    cookieList.forEach((cookie) => {
      const cookieInfo = document.createElement("pre");
      cookieInfo.textContent = JSON.stringify(cookie, null, 2);
      cookieDetails.appendChild(cookieInfo);
    });

    serviceDiv.appendChild(cookieDetails);
    msg.appendChild(serviceDiv);
  });
}

/**
 * Returns the domain name from the URL from the current active tab
 * @returns string
 */
async function getActiveTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0];
}

/**
 * Initialize popup
 */
function initializePopup() {
  manualTest();
  console.log("Popup initialized.");
}

// Initialize popup
window.addEventListener("load", initializePopup);
