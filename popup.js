// POPUP SCRIPT

/**
 *
 * @param {*} event
 */
async function manualTest(event) {
  const domain = await getActiveTabDomain();
  const msg = document.getElementById("msg-div");
  const response = await chrome.runtime.sendMessage({
    msg: "getCookiesForDomain",
    arguments: [domain],
  });
  const domainCookies = response["cookies"];
  const knownPlatforms = response["knownPlatforms"];
  msg.innerHTML = "";
  msg.innerHTML += "Domain: " + JSON.stringify(domain) + "<br />";
  msg.innerHTML += "Cookies: " + JSON.stringify(domainCookies) + "<br />";
  msg.innerHTML +=
    "Known Platforms: " + JSON.stringify(knownPlatforms) + "<br />";
}

/**
 * Returns the domain name from the URL from the current active tab
 * @returns string
 */
async function getActiveTabDomain() {
  let url = null;
  let domain = null;
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const activeTab = tabs[0];
  if (activeTab) {
    url = activeTab.url;
    if (url) {
      const m = url.match(
        /https?:\/\/((www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.([a-z]{2,6}){1})/i
      );
      if (m) {
        domain = m[1];
      }
    }
  }

  return domain;
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
