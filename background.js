/**
 * Register a message listener which will listen to chrome.runtime.sendMessage triggers
 */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(request);
  if (request.msg == "getCookiesForDomain") {
    getCookiesForDomain(...request.arguments);
  }
});

/**
 * Returns list of known cookies for a specific domain
 * @param {*} target_domain
 */
const getCookiesForDomain = async function (target_domain) {
  console.log("getting cookies for domain: " + target_domain);

  await chrome.cookies.getAll({ domain: target_domain }, (cookies) => {
    //console.log("domain cookies: " + cookies);
    const cookieNames = cookies.map((c) => {
      return c.name;
    });

    console.log("domain cookie names: " + cookieNames);
  });
};
