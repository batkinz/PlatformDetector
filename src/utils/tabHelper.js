import { findCookies } from "./findCookies";

const getActiveTab = async function () {
  let answer = null;
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tabs) {
    answer = tabs[0];
  }

  return answer;
};

async function tabFocusListener(e) {
  await findCookies(e.tabId);
}

async function tabUpdateListener(tabId) {
  await findCookies(tabId);
}

const registerTabListener = async function () {
  console.log("Registering Win/Tab Listeners.");
  if (!chrome.tabs.onActivated.hasListener(tabFocusListener)) {
    chrome.tabs.onActivated.addListener(tabFocusListener);
  }
  if (!chrome.tabs.onUpdated.hasListener(tabUpdateListener)) {
    chrome.tabs.onUpdated.addListener(tabUpdateListener);
  }
};

export { getActiveTab, registerTabListener };
