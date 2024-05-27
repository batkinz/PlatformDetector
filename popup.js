// POPUP SCRIPT

/**
 *
 * @param {*} event
 */
async function manualTest() {
  const tabId = await getActiveTabId();

  debugger;

  const response = await chrome.runtime.sendMessage({
    msg: "getCookiesForTab",
    arguments: [tabId],
  });

  const domainCookies = response["cookies"];
  const knownPlatforms = response["knownPlatforms"];

  const msg = document.getElementById("msg-div");
  msg.innerHTML = "";
  msg.innerHTML += "Domain: " + JSON.stringify(tabId) + "<br />";
  msg.innerHTML += "Cookies: " + JSON.stringify(domainCookies) + "<br />";
  msg.innerHTML +=
    "Known Platforms: " + JSON.stringify(knownPlatforms) + "<br />";
}

/**
 * Returns the domain name from the URL from the current active tab
 * @returns string
 */
async function getActiveTabId() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const activeTab = tabs[0];
  return activeTab?.id;
}

/**
 * Initialize popup
 */
const initializePopup = function () {
  const btn = document.getElementById("btn_find_cookies");
  btn.addEventListener("click", manualTest);
  console.log("Popup initialized.");
};

// Initialize popup
window.addEventListener("load", initializePopup);
