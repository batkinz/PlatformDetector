// Imports
import { findCookies } from "../utils/findCookies.js";
import { registerTabListener } from "../utils/tabHelper.js";

// BACKGROUND SCRIPT

// The defaults to use when no map has been defined
const defaultCookieMap = {};

/**
 * Register a message listener which will listen to chrome.runtime.sendMessage triggers
 */
function registerMessageListener() {
  chrome.runtime.onMessage.addListener(
    async function onMessage(request, _, sendResponse) {
      if (request.msg === "getCookiesForTab") {
        const tabId = request.arguments[0];
        if (tabId == null) return;

        const cookies = await findCookies(tabId);

        console.log("cookies: " + cookies);
        const knownPlatforms = await checkForKnownPlatforms(cookies);

        console.log("Known Platforms: " + knownPlatforms);
        sendResponse({ cookies: cookies, knownPlatforms: knownPlatforms });
      } else if (request.msg === "getCookieMap") {
        getCookieMap().then((cookieMap) => {
          sendResponse({ cookieMap: cookieMap });
        });
      } else if (request.msg === "getDefaultCookieMap") {
        sendResponse({ defaultCookieMap: defaultCookieMap });
      }
    }
  );
}

/**
 * Check for known Platforms in the cookieMap
 * @param {*} cookies
 * @returns
 */
async function checkForKnownPlatforms(cookies) {
  const platforms = [];
  const cookieMap = await getCookieMap();
  const cookieMapKeys = Object.keys(cookieMap);

  cookies.forEach((cookie) => {
    cookieMapKeys.some((platformName) => {
      const platformCookies = cookieMap[platformName];
      return platformCookies.some((platformCookie) => {
        const platformCookieRegEx = new RegExp(platformCookie);
        if (cookie.match(platformCookieRegEx)) {
          platforms.push(platformName);
          return true; // Break the loop
        }
        return false;
      });
    });
  });

  return platforms;
}

async function getCookieMap() {
  const data = await chrome.storage.sync.get(["cookieMap"]);
  if (data && data["cookieMap"]) {
    return JSON.parse(data["cookieMap"]);
  }

  return defaultCookieMap;
}

/**
 * Init
 */
(function initializeBackgroundScript() {
  console.log("INIT!");
  registerMessageListener();
  registerTabListener();
})();
