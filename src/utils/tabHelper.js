// The defaults to use when no map has been defined
const defaultCookieMap = {};

export async function getCookieMap() {
  const data = await chrome.storage.sync.get(["cookieMap"]);
  if (data && data["cookieMap"]) {
    const cookieMap = JSON.parse(data["cookieMap"]);
    return Object.entries(cookieMap).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: value.map((v) => new RegExp(v)),
      }),
      {}
    );
  }

  return defaultCookieMap;
}

export async function findCookies(tabId) {
  const tab = await chrome.tabs.get(tabId);
  if (tab?.url == null || !tab.url.startsWith("http")) return;

  const tabUrl = new URL(tab.url);
  const hostElements = tabUrl.hostname.split(".");
  const rootDomain = `.${hostElements.at(-2)}.${hostElements.at(-1)}`;

  const cookies = await chrome.cookies.getAll({ domain: rootDomain });
  const cookieMap = await getCookieMap();

  const matchedCookies = {};
  cookies.forEach((cookie) => {
    for (const [platform, regexes] of Object.entries(cookieMap)) {
      regexes.forEach((regex) => {
        if (regex.test(cookie.name)) {
          if (!matchedCookies[platform]) {
            matchedCookies[platform] = [];
          }
          matchedCookies[platform].push(cookie);
        }
      });
    }
  });

  const matchedCookieEntries = Object.entries(matchedCookies);

  chrome.action.setBadgeText({ tabId: tabId, text: "" });

  if (matchedCookieEntries.length > 0) {
    chrome.action.setBadgeText({
      tabId: tabId,
      text: matchedCookieEntries.length.toString(),
    });
    chrome.action.setBadgeTextColor({ color: "#FF0000" });
  }

  return matchedCookieEntries;
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
