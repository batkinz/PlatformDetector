// BACKGROUND SCRIPT

// Map a known platform to a list of cookie names it can be identified by
const cookieMap = {
  "Queue-it": ["QueueitAccepted"],
  Zendesk: ["_zendesk_session"],
  "Cloudflare Bot Management": ["__cf_bm"],
  "Akamai Bot Manager": ["ak_bmsc"],
  "Queue-Fair": ["Queue-Fair"],
  "Cloudflare Waiting Room": ["__cfwaitingroom"],
};

const initializeBackgroundScript = function () {
  console.log("INIT!");
  registerMessageListener();
};

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
          const knownPlatforms = checkForKnownPlatforms(cookies);
          console.log("Known Platforms: " + knownPlatforms);
          sendResponse({ cookies: cookies, knownPlatforms: knownPlatforms });
        });
      }
    }
    return true;
  });
};

/**
 * Check for known Platforms in the cookieMap
 * @param {*} cookies
 * @returns
 */
const checkForKnownPlatforms = function (cookies) {
  let platformName = null;
  const platforms = [];
  const cookieMapKeys = Object.keys(cookieMap);

  for (var i = 0; i < cookies.length; i++) {
    for (var j = 0; j < cookieMapKeys.length; j++) {
      platformName = cookieMapKeys[j];
      platformCookies = cookieMap[platformName];
      for (var k = 0; k < platformCookies.length; k++) {
        // @TODO: This is an exact match - improve it by preg match
        if (platformCookies[k] == cookies[i]) {
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

// Initialize background
initializeBackgroundScript();
