// POPUP SCRIPT

import { findCookies } from "./src/utils/tabHelper.js";

/**
 *
 * @param {*} event
 */
async function manualTest() {
  const tab = await getActiveTab();

  const cookies = await findCookies(tab.id);

  debugger;

  const msg = document.getElementById("msg-div");
  msg.innerHTML = "";
  msg.innerHTML += "Domain: " + JSON.stringify(tab?.url) + "<br />";
  msg.innerHTML += "Cookies: " + JSON.stringify(cookies) + "<br />";
  // msg.innerHTML +=
  //   "Known Platforms: " + JSON.stringify(knownPlatforms) + "<br />";
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
const initializePopup = function () {
  const btn = document.getElementById("btn_find_cookies");
  btn.addEventListener("click", manualTest);
  console.log("Popup initialized.");
};

// Initialize popup
window.addEventListener("load", initializePopup);
