// Options page script

/**
 * Save configuration options
 * @param {*} event
 */
async function saveOptions() {
  console.log("saving...");
  const txtArea = document.getElementById("cookie-map-textarea");
  let cookieMap;
  let cookieMapStr = txtArea.value;
  try {
    cookieMap = JSON.parse(cookieMapStr);
  } catch {
    alert("Your JSON sucks!");
    return false;
  }
  cookieMapStr = JSON.stringify(cookieMap);
  await chrome.storage.sync.set({ cookieMap: cookieMapStr });
  console.log("Cookie map saved.", cookieMap);
  alert("Saved.");
}

/**
 * Initialize options
 */
async function initializeOptions() {
  const btn = document.getElementById("save-button");
  btn.addEventListener("click", saveOptions);

  // Send message to background
  const cookieMap = await chrome.storage.sync.get("cookieMap");
  const cookieMapStr = JSON.stringify(
    JSON.parse(cookieMap["cookieMap"]),
    null,
    2
  );
  const txtArea = document.getElementById("cookie-map-textarea");
  txtArea.value = cookieMapStr;
  //
  console.log("Options initialized.");
}

// Initialize popup
window.addEventListener("load", initializeOptions);
