export async function findCookies(tabId) {
  const tab = await chrome.tabs.get(tabId);
  if (tab?.url == null) return;

  const tabUrl = new URL(tab.url);
  const hostElements = tabUrl.hostname.split(".");
  const rootDomain = `.${hostElements.at(-2)}.${hostElements.at(-1)}`;

  const cookies = await chrome.cookies.getAll({ domain: rootDomain });
  console.log("cookies", cookies);

  chrome.action.setBadgeText({ tabId: tabId, text: "" });

  if (cookies.length > 0) {
    chrome.action.setBadgeText({
      tabId: tabId,
      text: cookies.length.toString(),
    });
    chrome.action.setBadgeTextColor({ color: "#FF0000" });
  }

  return cookies;
}

async function tabFocusListener(e) {
  await findCookies(e.tabId);
}

async function tabUpdateListener(tabId) {
  await findCookies(tabId);
}

export async function registerTabListener() {
  console.log("Registering Win/Tab Listeners.");
  if (!chrome.tabs.onActivated.hasListener(tabFocusListener)) {
    chrome.tabs.onActivated.addListener(tabFocusListener);
  }
  if (!chrome.tabs.onUpdated.hasListener(tabUpdateListener)) {
    chrome.tabs.onUpdated.addListener(tabUpdateListener);
  }
}
