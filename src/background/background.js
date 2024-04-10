// Imports
import { getActiveTab, registerTabListener } from "../utils/tabHelper.js";

// BACKGROUND SCRIPT

// The defaults to use when no map has been defined
const defaultCookieMap = {};

/**
 * Register a message listener which will listen to chrome.runtime.sendMessage triggers
 */
const registerMessageListener = function () {
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    if (request.msg == "getCookiesForDomain") {
      const domain = request.arguments[0];
      if (domain) {
        getCookiesForDomain(domain).then((cookies) => {
          console.log("cookies: " + cookies);
          checkForKnownPlatforms(cookies).then((knownPlatforms) => {
            console.log("Known Platforms: " + knownPlatforms);
            sendResponse({ cookies: cookies, knownPlatforms: knownPlatforms });
          });
        });
      }
    } else if (request.msg == "getCookieMap") {
      getCookieMap().then((cookieMap) => {
        sendResponse({ cookieMap: cookieMap });
      });
    } else if (request.msg == "getDefaultCookieMap") {
      const dcm = getDefaultCookieMap();
      sendResponse({ defaultCookieMap: defaultCookieMap });
    }
    return true;
  });
};

/**
 * Check for known Platforms in the cookieMap
 * @param {*} cookies
 * @returns
 */
const checkForKnownPlatforms = async function (cookies) {
  let platformName = null;
  const platforms = [];
  const cookieMap = await getCookieMap();
  const cookieMapKeys = Object.keys(cookieMap);

  for (var i = 0; i < cookies.length; i++) {
    for (var j = 0; j < cookieMapKeys.length; j++) {
      platformName = cookieMapKeys[j];
      platformCookies = cookieMap[platformName];
      for (var k = 0; k < platformCookies.length; k++) {
        platformCookieRegEx = new RegExp(platformCookies[k]);
        //console.log("Testing for: " + platformCookies[k], platformCookieRegEx);
        if (cookies[i].match(platformCookieRegEx)) {
          platforms.push(platformName);
          break;
        }
      }
    }
  }

  return platforms;
};

/**
 * Returns list of known cookies for a specific domain
 * @param {*} target_domain
 */
const getCookiesForDomain = async function (target_domain) {
  console.log("getting cookies for domain: " + target_domain);
  const cookies = await chrome.cookies.getAll({ domain: target_domain });
  const cookieNames = cookies.map((c) => {
    return c.name;
  });

  return cookieNames;
};

const getDefaultCookieMap = function () {
  return defaultCookieMap;
};

const getCookieMap = async function () {
  let cookieMap = getDefaultCookieMap();
  const data = await chrome.storage.sync.get(["cookieMap"]);
  if (data && data["cookieMap"]) {
    cookieMap = JSON.parse(data["cookieMap"]);
  }
  //console.log(cookieMap);
  return cookieMap;
};

/**
 * Init
 */
const initializeBackgroundScript = async function () {
  console.log("INIT!");
  registerMessageListener();
  registerTabListener();
  //
};

// Initialize background
initializeBackgroundScript();
