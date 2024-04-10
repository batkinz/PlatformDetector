const getActiveTab = async function () {
  let answer = null;
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tabs) {
    answer = tabs[0];
  }

  return answer;
};

const windowFocusListener = async function () {
  console.log("window changed.");
};

const tabFocusListener = async function () {
  console.log("tab changed.");
};

const tabUpdateListener = async function () {
  console.log("tab updated.");
};

const registerTabListener = async function () {
  console.log("Registering Win/Tab Listeners.");
  if (!chrome.windows.onFocusChanged.hasListener(windowFocusListener)) {
    chrome.windows.onFocusChanged.addListener(windowFocusListener);
  }
  if (!chrome.tabs.onActivated.hasListener(tabFocusListener)) {
    chrome.tabs.onActivated.addListener(tabFocusListener);
  }
  if (!chrome.tabs.onUpdated.hasListener(tabUpdateListener)) {
    chrome.tabs.onUpdated.addListener(tabUpdateListener);
  }
};

export { getActiveTab, registerTabListener };
